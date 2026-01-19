import { Controller, Post, Body, Req } from '@nestjs/common';
import { GithubService } from './github.service';
import { CodeDto } from 'src/types/code.types';
import type { Request } from "express"
import { RedisService } from 'src/lib/redis/redis.service';
import { rateLimitByIp } from 'src/func/rate-limit-ip';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService, private readonly redisService: RedisService) { }

  @Post()
  async github(@Req() req: Request, @Body() data: CodeDto) {

    const ip = req.ip

    await rateLimitByIp(
      this.redisService,
      ip,
      'github-login',
    );

    return await this.githubService.github(data.code);
  }
}
