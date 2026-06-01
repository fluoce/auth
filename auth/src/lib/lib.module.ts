import { Module, Global } from '@nestjs/common';
import { UlidService } from './ulid/ulid.service';
import { JwtModule } from './jwt/jwt.module';
import { HashService } from './hash/hash.service';
import { PrismaModule } from './prisma/prisma.module';
import { ResendService } from './resend/resend.service';
import { RedisModule } from './redis/redis.module';
import { TwilioService } from './twilio/twilio.service';

@Global()
@Module({
  imports: [JwtModule, PrismaModule, RedisModule],
  providers: [UlidService, HashService, ResendService, TwilioService],
  exports: [UlidService, HashService, JwtModule, ResendService, TwilioService],
})
export class LibModule {}
