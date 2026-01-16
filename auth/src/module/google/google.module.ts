import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { UserService } from 'src/core/user/user.service';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';

@Module({
  controllers: [GoogleController],
  providers: [GoogleService, UserService, RefreshTokenService],
})
export class GoogleModule {}
