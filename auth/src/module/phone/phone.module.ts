import { Module } from '@nestjs/common';
import { PhoneController } from './phone.controller';
import { PhoneService } from './phone.service';
import { RefreshTokenModule } from 'src/core/refresh-token/refresh-token.module';
import { UserModule } from 'src/core/user/user.module';

@Module({
  imports: [UserModule, RefreshTokenModule],
  controllers: [PhoneController],
  providers: [PhoneService],
})
export class PhoneModule {}
