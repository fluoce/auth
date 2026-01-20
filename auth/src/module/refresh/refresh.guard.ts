import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly refreshTokenService: RefreshTokenService) { }

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

    const refreshTokenData =
      await this.refreshTokenService.validateRefreshToken(authRefreshToken);

    if (!refreshTokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshTokenData.revoked || refreshTokenData.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired or revoked');
    }

    (req as any).refreshTokenId = refreshTokenData.id;

    return true;
  }
}
