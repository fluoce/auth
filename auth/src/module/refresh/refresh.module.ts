import { Module } from '@nestjs/common';
import { RefreshController } from './refresh.controller';
import { UserService } from 'src/core/user/user.service';
import { RefreshService } from './refresh.service';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';

@Module({
  controllers: [RefreshController],
  providers: [RefreshService, UserService, RefreshTokenService],
})
export class RefreshModule { }
