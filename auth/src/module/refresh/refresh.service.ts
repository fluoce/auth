import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';
import { RedisService } from 'src/lib/redis/redis.service';
import { RefreshTokenGraceData } from 'src/types/refreshToken.types';
import { ResponseDataType } from 'src/types/response.type';
import { UserType } from 'src/types/user.types';

@Injectable()
export class RefreshService {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  async refresh(
    refreshTokenData: RefreshTokenGraceData,
  ): Promise<ResponseDataType> {
    let user: UserType | null = null;

    let refreshToken: string | null = null;

    if (refreshTokenData.isGrace) {
      user = refreshTokenData.user;

      refreshToken = await this.redis.get(
        `grace-refresh:${refreshTokenData.refreshTokenId}`,
      );
    } else {
      const result = await this.refreshTokenService.rotateRefreshToken(
        refreshTokenData.refreshTokenId,
        refreshTokenData.tokenHash,
      );

      if (!result || !result.refreshToken || !result.session) {
        throw new InternalServerErrorException(
          'Failed to rotate refresh token',
        );
      }

      await this.redis.set(
        `grace-refresh:${refreshTokenData.refreshTokenId}`,
        result.refreshToken,
        65,
      );

      user = result.session.user;

      refreshToken = result.refreshToken;
    }

    if (!user || !refreshToken) {
      throw new InternalServerErrorException('failed to create new session');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    if (!accessToken) {
      throw new InternalServerErrorException('failed to create new session');
    }

    return {
      message: 'token refresh successfully',
      accessToken,
      refreshToken,
    };
  }
}
