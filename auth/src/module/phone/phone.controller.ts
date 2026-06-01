import { Body, Controller, Post } from '@nestjs/common';
import { rateLimitByPhone } from 'src/func/rate-limit';
import { PhoneDto, PhoneVerifyDto } from 'src/types/phone.types';
import { ResponseDataType } from 'src/types/response.type';
import { PhoneService } from './phone.service';
import { RedisService } from 'src/lib/redis/redis.service';

@Controller('phone')
export class PhoneController {
  constructor(
    private readonly phoneService: PhoneService,
    private readonly redisService: RedisService,
  ) {}

  @Post()
  async phone(@Body() data: PhoneDto): Promise<ResponseDataType> {
    await rateLimitByPhone(this.redisService, data.phone);
    return await this.phoneService.phone(data);
  }

  @Post('verify')
  async verify(@Body() data: PhoneVerifyDto): Promise<ResponseDataType> {
    return await this.phoneService.verify(data);
  }
}
