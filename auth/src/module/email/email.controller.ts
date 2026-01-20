import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto, VerifyDto } from 'src/types/email.types';
import { ResponseDataType } from 'src/types/response.type';
import { RedisService } from 'src/lib/redis/redis.service';
import { rateLimitByEmail } from 'src/func/rate-limit';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService, private readonly redisService: RedisService) { }

  @Post()
  async email(@Body() data: EmailDto): Promise<ResponseDataType> {
    await rateLimitByEmail(
      this.redisService,
      data.email
    )
    return await this.emailService.email(data);
  }

  @Post('verify')
  async verify(@Body() data: VerifyDto): Promise<ResponseDataType> {
    return await this.emailService.verify(data);
  }
}
