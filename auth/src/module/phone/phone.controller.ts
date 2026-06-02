import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { rateLimitByPhone } from 'src/func/rate-limit';
import { PhoneDto, PhoneVerifyDto } from 'src/types/phone.types';
import { ResponseDataType } from 'src/types/response.type';
import { PhoneService } from './phone.service';
import { RedisService } from 'src/lib/redis/redis.service';
import type { Response } from 'express';
import type { AuthRequestInterface } from 'src/types/request.types';

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
  async verify(
    @Req() req: AuthRequestInterface,
    @Body() data: PhoneVerifyDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDataType> {
    return await this.phoneService.verify(data, res, req?.authRt);
  }
}
