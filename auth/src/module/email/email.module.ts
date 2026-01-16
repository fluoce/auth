import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { UserModule } from 'src/core/user/user.module';
import { RefreshTokenModule } from 'src/core/refresh-token/refresh-token.module';

@Module({
  imports: [UserModule, RefreshTokenModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
