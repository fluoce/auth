import { Module } from '@nestjs/common';
import { RefreshTokenCronService } from './refresh-token-cron.service';
import { PrismaModule } from 'src/lib/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RefreshTokenCronService],
})
export class RefreshTokenCronModule {}
