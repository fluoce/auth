import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto, EmailVerifyDto } from 'src/types/email.types';
import { ResponseDataType } from 'src/types/response.type';
import { RedisService } from 'src/lib/redis/redis.service';
import { rateLimitByEmail } from 'src/func/rate-limit';
import type { Response } from 'express';
import type { AuthRequestInterface } from 'src/types/request.types';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
  ) {}

  @Post()
  async email(@Body() data: EmailDto): Promise<ResponseDataType> {
    await rateLimitByEmail(this.redisService, data.email);
    return await this.emailService.email(data);
  }

  @Post('verify')
  async verify(
    @Req() req: AuthRequestInterface,
    @Body() data: EmailVerifyDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDataType> {
    return await this.emailService.verify(data, res, req?.authRt);
  }
}
