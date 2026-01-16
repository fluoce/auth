import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';

@Injectable()
export class HashService {
  async createRefreshTokenHash(refreshToken: string): Promise<string> {
    return await crypto
      .createHmac('sha256', process.env.REFRESH_TOKEN_SECRET!)
      .update(refreshToken)
      .digest('hex');
  }
}
