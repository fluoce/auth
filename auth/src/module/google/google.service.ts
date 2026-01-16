import { Injectable } from '@nestjs/common';
import { ServiceUnavailableException } from '@nestjs/common/exceptions';
import { GoogleCodeDto } from 'src/types/google.types';
import { ResponseDataType } from 'src/types/response.type';
import { googleOauth2Client } from 'src/config/google';
import { UserService } from 'src/core/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';
import { generateCode } from 'src/func/generate-code';
import { RedisService } from 'src/lib/redis/redis.service';

@Injectable()
export class GoogleService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly redisService: RedisService,
  ) {}

  async google(data: GoogleCodeDto): Promise<ResponseDataType> {
    try {
      const { tokens } = await googleOauth2Client.getToken(data.code);

      googleOauth2Client.setCredentials(tokens);

      const ticket = await googleOauth2Client.verifyIdToken({
        idToken: tokens.id_token as string,
        audience: process.env.GOOGLE_AUTH_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new ServiceUnavailableException(
          'Failed to register with Google. Please try again later.',
        );
      }

      const user = await this.userService.upsert({
        name: payload?.name as string,
        email: payload?.email as string,
        photo: payload.picture as string,
      });

      if (!user) {
        throw new ServiceUnavailableException(
          'Failed to register with Google. Please try again later.',
        );
      }

      const jwtPayload = {
        sub: user.id,
        email: user.email,
      };

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(jwtPayload),
        this.refreshTokenService.createRefreshToken(user.id),
      ]);

      if (!accessToken || !refreshToken) {
        throw new ServiceUnavailableException(
          'Failed to create session, please try again later',
        );
      }

      const code = generateCode();

      const redisSetSuccess = await this.redisService.set(
        `code:${code}`,
        {
          accessToken,
          refreshToken,
        },
        120,
      );

      if (!redisSetSuccess) {
        throw new ServiceUnavailableException(
          'Failed to create session, please try again later',
        );
      }

      return {
        message: 'google login success',
        code,
      };
    } catch (error) {
      throw new ServiceUnavailableException(
        'Failed to register with Google. Please try again later.',
      );
    }
  }
}
