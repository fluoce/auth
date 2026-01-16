import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { HttpModule } from '@nestjs/axios';
import { UserService } from 'src/core/user/user.service';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';

@Module({
  imports: [HttpModule],
  controllers: [GithubController],
  providers: [GithubService, UserService, RefreshTokenService],
})
export class GithubModule {}
