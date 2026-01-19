import { Controller, Post, Body, Req } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto, VerifyDto } from 'src/types/email.types';
import { ResponseDataType } from 'src/types/response.type';
import type { Request } from 'express';
import { rateLimitByIp } from 'src/func/rate-limit-ip';
import { RedisService } from 'src/lib/redis/redis.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService, private readonly redisService: RedisService) { }

  @Post()
  async email(@Req() req: Request, @Body() data: EmailDto): Promise<ResponseDataType> {

    const ip = req.ip

    await rateLimitByIp(
      this.redisService,
      ip,
      'email-login',
    );

    return await this.emailService.email(data);
  }

  @Post('verify')
  async verify(@Req() req: Request, @Body() data: VerifyDto): Promise<ResponseDataType> {

    const ip = req.ip

    await rateLimitByIp(
      this.redisService,
      ip,
      'email-verify',
    );

    return await this.emailService.verify(data);
  }
}
