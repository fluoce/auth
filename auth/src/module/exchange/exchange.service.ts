import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/lib/redis/redis.service';
import { CodeDataType } from 'src/types/code.types';

@Injectable()
export class ExchangeService {
  constructor(private readonly redisService: RedisService) {}

  async exchange(code: string) {
    const tokens: CodeDataType | null = await this.redisService.getDel(
      `code:${code}`,
    );

    if (!tokens) {
      throw new NotFoundException('tokens not found');
    }

    return {
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
    };
  }
}
