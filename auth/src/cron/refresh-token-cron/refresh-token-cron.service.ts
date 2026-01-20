import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class RefreshTokenCronService {
  private readonly logger = new Logger(RefreshTokenCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Run every day at 03:00
  @Cron('0 3 * * *', { timeZone: 'Asia/Kolkata' })
  async cleanup() {
    try {
      // Delete expired refresh tokens (where expiresAt is in the past)
      const expired = await this.prisma.refreshToken.deleteMany({
        where: {
          expiresAt: { lt: new Date() },
        },
      });

      // Delete revoked refresh tokens (where revoked is true)
      const revoked = await this.prisma.refreshToken.deleteMany({
        where: {
          revoked: true,
        },
      });

      this.logger.log(
        `Cleanup done → expired=${expired.count}, revoked=${revoked.count}`,
      );
    } catch (error) {
      this.logger.error('Refresh token cleanup failed', error);
    }
  }
}
