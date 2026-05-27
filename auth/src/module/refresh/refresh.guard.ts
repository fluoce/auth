import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';
import type { RefreshTokenGraceData } from 'src/types/refreshToken.types';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const authRefreshToken = authHeader.slice(7).trim();

    if (!authRefreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    let isGrace: boolean = false;

    let refreshTokenData =
      await this.refreshTokenService.validateRefreshToken(authRefreshToken);

    if (!refreshTokenData) {
      refreshTokenData =
        await this.refreshTokenService.validateRefreshTokenForGrace(
          authRefreshToken,
        );
      if (refreshTokenData) {
        isGrace = true;
      }
    }

    if (!refreshTokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    (req as any).refreshTokenData = {
      refreshTokenId: refreshTokenData.id,
      isGrace,
      token: authRefreshToken,
      tokenHash: refreshTokenData.tokenHash,
      user: refreshTokenData.user,
    } as RefreshTokenGraceData;

    return true;
  }
}
