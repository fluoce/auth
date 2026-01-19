import { Controller, Post, Body, Req } from '@nestjs/common';
import { ResponseDataType } from 'src/types/response.type';
import { GoogleService } from './google.service';
import { CodeDto } from 'src/types/code.types';
import { rateLimitByIp } from 'src/func/rate-limit-ip';
import { RedisService } from 'src/lib/redis/redis.service';
import type { Request } from "express"

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService, private readonly redisService: RedisService) { }

  @Post()
  async google(@Req() req: Request, @Body() data: CodeDto): Promise<ResponseDataType> {

    const ip = req.ip

    await rateLimitByIp(
      this.redisService,
      ip,
      'google-login',
    );

    return await this.googleService.google(data);
  }
}
