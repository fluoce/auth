import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { ResponseDataType } from 'src/types/response.type';
import { GoogleService } from './google.service';
import { CodeDto } from 'src/types/code.types';
import type { Response } from 'express';
import type { AuthRequestInterface } from 'src/types/request.types';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post()
  async google(
    @Req() req: AuthRequestInterface,
    @Body() data: CodeDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDataType> {
    return await this.googleService.google(data, res, req?.authRt);
  }
}
