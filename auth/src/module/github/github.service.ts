import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResponseDataType } from 'src/types/response.type';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/core/user/user.service';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';
import { JwtService } from '@nestjs/jwt';
import { generateCode } from 'src/func/generate-code';
import { RedisService } from 'src/lib/redis/redis.service';
import type { Response } from 'express';
import { cookieOption } from 'src/func/cookie-option';
import { AuthCookieService } from 'src/lib/auth-cookie/auth-cookie.service';
import { exCodeKey } from 'src/constant/redis-key';

@Injectable()
export class GithubService {
  constructor(
    private readonly http: HttpService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly authCookie: AuthCookieService,
  ) {}

  async github(
    code: string,
    res: Response,
    authRt?: string,
  ): Promise<ResponseDataType> {
    try {
      const githubResponse = await firstValueFrom(
        this.http.post(
          'https://github.com/login/oauth/access_token',
          {
            client_id: process.env.GITHUB_AUTH_CLIENT_ID,
            client_secret: process.env.GITHUB_AUTH_SECRET_KEY,
            code,
          },
          {
            headers: {
              Accept: 'application/json',
            },
          },
        ),
      );

      const githubAccessToken = githubResponse.data?.access_token;

      if (!githubAccessToken) {
        throw new UnauthorizedException('Invalid GitHub code');
      }

      const githubProfileResponse = await firstValueFrom(
        this.http.get('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${githubAccessToken}`,
          },
        }),
      );

      if (!githubProfileResponse) {
        throw new ServiceUnavailableException(
          'Failed to register with Github. Please try again later.',
        );
      }

      const githubProfile = githubProfileResponse.data;

      const user = await this.userService.upsert({
        name: githubProfile?.name as string,
        email: githubProfile?.email as string,
        photo: githubProfile.avatar_url as string,
      });

      if (!user) {
        throw new ServiceUnavailableException(
          'Failed to register with Github. Please try again later.',
        );
      }

      const jwtPayload = {
        sub: user.id,
        email: user?.email,
        phone: user?.phone,
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

      const exchangeCode = generateCode();

      const redisSetSuccess = await this.redisService.set(
        exCodeKey(exchangeCode),
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

      await this.authCookie.setIfNotAuthRt(res, authRt, user.id);

      return {
        message: 'github login success',
        code: exchangeCode,
      };
    } catch (error) {
      throw new ServiceUnavailableException(
        'Failed to register with Github. Please try again later.',
      );
    }
  }
}
