import { Module, Global } from '@nestjs/common';
import { UlidService } from './ulid/ulid.service';
import { JwtModule } from './jwt/jwt.module';
import { HashService } from './hash/hash.service';
import { PrismaModule } from './prisma/prisma.module';
import { ResendService } from './resend/resend.service';
import { RedisModule } from './redis/redis.module';
import { TwilioService } from './twilio/twilio.service';
import { AuthCookieService } from './auth-cookie/auth-cookie.service';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';

@Global()
@Module({
  imports: [JwtModule, PrismaModule, RedisModule],
  providers: [
    UlidService,
    HashService,
    ResendService,
    TwilioService,
    RefreshTokenService,
    AuthCookieService,
  ],
  exports: [
    UlidService,
    HashService,
    JwtModule,
    ResendService,
    TwilioService,
    AuthCookieService,
  ],
})
export class LibModule {}
