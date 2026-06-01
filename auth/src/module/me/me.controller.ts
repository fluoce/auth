import { Controller, UseGuards, Get, Req, Post, Body } from '@nestjs/common';
import { MeGuard } from './me.guard';
import { MeService } from './me.service';
import type { Request } from 'express';
import { SkipRateLimit } from 'src/skip.ratelimit.decorator';
import { RedisService } from 'src/lib/redis/redis.service';
import { rateLimitByUserId } from 'src/func/rate-limit';
import { UpdateUserDto } from 'src/types/user.types';

@UseGuards(MeGuard)
@SkipRateLimit()
@Controller('me')
export class MeController {
  constructor(
    private readonly meService: MeService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  async me(@Req() req: Request) {
    const userId = (req as any).userId;
    await rateLimitByUserId(this.redisService, userId);
    return await this.meService.me(userId);
  }

  @Post()
  async update(@Req() req: Request, @Body() data: UpdateUserDto) {
    const userId = (req as any).userId;
    await rateLimitByUserId(this.redisService, userId);
    return await this.meService.update(userId, data);
  }
}
