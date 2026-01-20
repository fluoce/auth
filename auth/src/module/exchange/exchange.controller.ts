import { Controller, Post, Body } from '@nestjs/common';
import { CodeDto } from 'src/types/code.types';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) { }

  @Post()
  async exchange(@Body() data: CodeDto) {
    return await this.exchangeService.exchange(data.code);
  }
}
