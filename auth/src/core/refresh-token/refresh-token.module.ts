import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenCronService } from 'src/cron/refresh-token-cron/refresh-token-cron.service';

@Module({
  providers: [RefreshTokenService, RefreshTokenCronService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
