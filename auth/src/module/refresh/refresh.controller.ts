import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './refresh.guard';
import { RefreshService } from './refresh.service';
import { rateLimitByRefreshTokenId } from 'src/func/rate-limit';
import { RedisService } from 'src/lib/redis/redis.service';
import { RefreshTokenGraceData } from 'src/types/refreshToken.types';
import { SkipRateLimit } from 'src/skip.ratelimit.decorator';
import type { Response } from 'express';

@UseGuards(RefreshTokenGuard)
@SkipRateLimit()
@Controller('refresh')
export class RefreshController {
  constructor(
    private readonly refreshService: RefreshService,
    private readonly redisService: RedisService,
  ) {}

  @Post()
  async refresh(@Req() req: Request) {
    const refreshTokenData = (req as any)
      .refreshTokenData as RefreshTokenGraceData;
    await rateLimitByRefreshTokenId(
      this.redisService,
      refreshTokenData.refreshTokenId,
    );
    return await this.refreshService.refresh(refreshTokenData);
  }

  @Post('me/session')
  async refreshForMeSession(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenData = (req as any)
      .refreshTokenData as RefreshTokenGraceData;
    await rateLimitByRefreshTokenId(
      this.redisService,
      refreshTokenData.refreshTokenId,
    );
    return await this.refreshService.refreshForMeSession(res, refreshTokenData);
  }
}
