import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';

@Injectable()
export class LogoutService {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  async logout(refreshTokenId: string) {
    const result =
      await this.refreshTokenService.revokeRefreshToken(refreshTokenId);

    if (!result) {
      throw new InternalServerErrorException('Failed to logout');
    }

    return {
      message: 'logout success',
    };
  }

  async logoutAll(userId: string) {
    const result = await this.refreshTokenService.deleteAllRefreshToken(userId);

    if (!result) {
      throw new InternalServerErrorException('Failed to logout');
    }

    return {
      message: 'logout success',
    };
  }
}
