import { Module } from '@nestjs/common';
import { LogoutController } from './logout.controller';
import { LogoutService } from './logout.service';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';

@Module({
  controllers: [LogoutController],
  providers: [LogoutService, RefreshTokenService],
})
export class LogoutModule {}
