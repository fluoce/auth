import { Controller, Get, Req } from '@nestjs/common';
import type { ResponseDataType } from './types/response.type';

@Controller('app')
export class AppController {
  constructor() {}

  @Get('health')
  async health(): Promise<ResponseDataType> {
    return {
      message: 'All is well',
      timestamp: new Date().toISOString(),
    };
  }
}
