import { IsNotEmpty, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';
import { UserType } from './user.types';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export type RefreshTokenType = {
  id: string;
  userId: string;
  tokenHash: string;
  revoked: boolean;
  graceTokenHash: string | null;
  graceUntil: Date | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type RefreshTokenWithUser = Prisma.RefreshTokenGetPayload<{
  include: { user: true };
}>;

export type RefreshTokenGraceData = {
  tokenHash: string;
  refreshTokenId: string;
  isGrace: boolean;
  token: string;
  user: UserType;
};
