import { Controller, Post, Body, Req } from '@nestjs/common';
import { CodeDto } from 'src/types/code.types';
import { ExchangeService } from './exchange.service';
import { rateLimitByIp } from 'src/func/rate-limit-ip';
import { RedisService } from 'src/lib/redis/redis.service';
import type { Request } from "express"

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService, private readonly redisService: RedisService) { }

  @Post()
  async exchange(@Req() req: Request, @Body() data: CodeDto) {

    const ip = req.ip

    await rateLimitByIp(
      this.redisService,
      ip,
      'exchange-code',
    );

    return await this.exchangeService.exchange(data.code);
  }
}
