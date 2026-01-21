import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/lib/redis/redis.service';
import { CodeDataType } from 'src/types/code.types';
import { ResponseDataType } from 'src/types/response.type';

@Injectable()
export class ExchangeService {
  constructor(private readonly redisService: RedisService) { }

  async exchange(code: string): Promise<ResponseDataType> {
    const tokens: CodeDataType | null = await this.redisService.getDel(
      `code:${code}`,
    );

    if (!tokens) {
      throw new NotFoundException('tokens not found');
    }

    return {
      message: "token exchange successfully",
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
    };
  }
}
