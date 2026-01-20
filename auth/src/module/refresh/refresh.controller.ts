import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './refresh.guard';
import { RefreshService } from './refresh.service';
import { rateLimitByRefreshTokenId } from 'src/func/rate-limit';
import { RedisService } from 'src/lib/redis/redis.service';

@UseGuards(RefreshTokenGuard)
@Controller('refresh')
export class RefreshController {
  constructor(private readonly refreshService: RefreshService, private readonly redisService: RedisService) { }

  @Post()
  async refresh(@Req() req: Request) {
    const refreshTokenId = (req as any).refreshTokenId;
    await rateLimitByRefreshTokenId(
      this.redisService,
      refreshTokenId
    );
    return await this.refreshService.refresh(refreshTokenId);
  }
}
