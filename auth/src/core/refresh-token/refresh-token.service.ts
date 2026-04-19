import { Injectable } from '@nestjs/common';
import { generateRefreshToken } from 'src/func/generate-refresh-token';
import { HashService } from 'src/lib/hash/hash.service';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { RedisService } from 'src/lib/redis/redis.service';
import { UlidService } from 'src/lib/ulid/ulid.service';
import {
  RefreshTokenType,
  RefreshTokenWithUser,
} from 'src/types/refreshToken.types';

@Injectable()
export class RefreshTokenService {
  private static readonly REFRESH_TOKEN_EXPIRY_DAYS = 60;

  constructor(
    private readonly prisma: PrismaService,
    private readonly ulidService: UlidService,
    private readonly hashService: HashService,
    private readonly redisService: RedisService,
  ) {}

  async createRefreshToken(userId: string): Promise<string | null> {
    const refreshToken = generateRefreshToken();

    const tokenHash =
      await this.hashService.createRefreshTokenHash(refreshToken);

    if (!tokenHash) {
      return null;
    }

    const expiresAt = new Date(
      Date.now() +
        RefreshTokenService.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    );

    const session = await this.prisma.refreshToken.create({
      data: {
        id: this.ulidService.generateRefreshTokenId('rt'),
        userId,
        tokenHash,
        expiresAt,
      },
    });

    if (!session) {
      return null;
    }

    return refreshToken;
  }

  async validateRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenType | null> {
    const tokenHash =
      await this.hashService.createRefreshTokenHash(refreshToken);

    const session = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      return null;
    }

    return session;
  }

  async rotateRefreshToken(
    refreshTokenId: string,
  ): Promise<{ refreshToken: string; session: RefreshTokenWithUser } | null> {
    const refreshToken = generateRefreshToken();
    const tokenHash =
      await this.hashService.createRefreshTokenHash(refreshToken);

    if (!tokenHash) {
      return null;
    }

    const expiresAt = new Date(
      Date.now() +
        RefreshTokenService.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    );

    const session = await this.prisma.refreshToken.update({
      where: { id: refreshTokenId },
      data: {
        tokenHash,
        expiresAt,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return null;
    }

    return {
      refreshToken,
      session,
    };
  }

  async revokeRefreshToken(refreshTokenId: string): Promise<boolean> {
    const result = await this.prisma.refreshToken.updateMany({
      where: {
        id: refreshTokenId,
        revoked: false,
      },
      data: {
        revoked: true,
      },
    });

    return result.count == 1;
  }
}
