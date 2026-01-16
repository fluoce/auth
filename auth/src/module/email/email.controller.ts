import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto, VerifyDto } from 'src/types/email.types';
import { ResponseDataType } from 'src/types/response.type';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async email(@Body() data: EmailDto): Promise<ResponseDataType> {
    return await this.emailService.email(data);
  }

  @Post('verify')
  async verify(@Body() data: VerifyDto): Promise<ResponseDataType> {
    return await this.emailService.verify(data);
  }
}
