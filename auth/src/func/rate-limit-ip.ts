import { HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from 'src/lib/redis/redis.service';

export async function rateLimitByIp(
  redis: RedisService,
  ip: string | undefined,
  seconds = 2,
) {
  if (!ip) return;

  const key = `rl:ip:${ip}`;

  const allowed = await redis.setIfNotExists(key, seconds);

  if (!allowed) {
    throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
  }
}
