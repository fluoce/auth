import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';
import { rateLimitIncomingRefreshToken } from 'src/func/rate-limit';
import { HashService } from 'src/lib/hash/hash.service';
import { RedisService } from 'src/lib/redis/redis.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly refreshTokenService: RefreshTokenService, private readonly redisService: RedisService, private readonly hashService: HashService) { }

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

    const hashAuthToken = await this.hashService.createRefreshTokenHash(authRefreshToken)

    await rateLimitIncomingRefreshToken(
      this.redisService,
      hashAuthToken
    )

    const refreshTokenData =
      await this.refreshTokenService.validateRefreshToken(authRefreshToken);

    if (!refreshTokenData) {
      await this.redisService.set(`rl:incomingRefreshToken:${hashAuthToken}`, 1, 60 * 30)
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshTokenData.revoked || refreshTokenData.expiresAt < new Date()) {
      await this.redisService.set(`rl:incomingRefreshToken:${hashAuthToken}`, 1, 60 * 30)
      throw new UnauthorizedException('Refresh token expired or revoked');
    }

    (req as any).refreshTokenId = refreshTokenData.id;

    return true;
  }
}
