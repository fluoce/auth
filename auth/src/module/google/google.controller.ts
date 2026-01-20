import { Controller, Post, Body } from '@nestjs/common';
import { ResponseDataType } from 'src/types/response.type';
import { GoogleService } from './google.service';
import { CodeDto } from 'src/types/code.types';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) { }

  @Post()
  async google(@Body() data: CodeDto): Promise<ResponseDataType> {
    return await this.googleService.google(data);
  }
}
