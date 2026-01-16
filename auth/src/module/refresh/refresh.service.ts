import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';
import { UserService } from 'src/core/user/user.service';
import { ResponseDataType } from 'src/types/response.type';

@Injectable()
export class RefreshService {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async refresh(refreshTokenId: string): Promise<ResponseDataType> {
    const result =
      await this.refreshTokenService.rotateRefreshToken(refreshTokenId);

    if (!result || !result.refreshToken) {
      throw new InternalServerErrorException('Failed to rotate refresh token');
    }

    const { refreshToken, session } = result;

    const user = session.user;

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
      user,
    };
  }
}
