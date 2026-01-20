import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LibModule } from './lib/lib.module';
import { EmailModule } from './module/email/email.module';
import { GoogleModule } from './module/google/google.module';
import { UserModule } from './core/user/user.module';
import { RefreshTokenModule } from './core/refresh-token/refresh-token.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RefreshModule } from './module/refresh/refresh.module';
import { LogoutModule } from './module/logout/logout.module';
import { MeModule } from './module/me/me.module';
import { ExchangeModule } from './module/exchange/exchange.module';
import { GithubModule } from './module/github/github.module';
import { RefreshTokenCronModule } from './cron/refresh-token-cron/refresh-token.module';
import { APP_GUARD } from '@nestjs/core';
import { RateLimitGuard } from './ratelimit.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    LibModule,
    UserModule,
    EmailModule,
    RefreshTokenModule,
    GoogleModule,
    RefreshModule,
    LogoutModule,
    MeModule,
    ExchangeModule,
    GithubModule,
    RefreshTokenCronModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule { }
