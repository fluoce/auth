import { HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from 'src/lib/redis/redis.service';

export async function rateLimitByIp(
  redis: RedisService,
  ip: string | undefined | null,
  seconds = 1,
) {
  if (!ip) return;

  const key = `rl:ip:${ip}`;

  const allowed = await redis.setIfNotExists(key, seconds);

  if (!allowed) {
    throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
  }
}

export async function rateLimitByEmail(
  redis: RedisService,
  email: string,
  seconds = 5,
) {
  if (!email) return;

  const key = `rl:email:${email}`;

  const allowed = await redis.setIfNotExists(key, seconds);

  if (!allowed) {
    throw new HttpException(
      'Too many requests for OTP',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  const windowKey = `rl:email:window:${email}`;

  const count = await redis.incr(windowKey);

  if (count == 1) {
    await redis.expire(windowKey, 30);
  }

  if (Number(count) > 3) {
    throw new HttpException(
      'You can only request 2 OTPs in 30 seconds, Please try again after 30 seconds or later',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}

export async function rateLimitByRefreshTokenId(
  redis: RedisService,
  refreshTokenId: string,
  seconds = 5,
) {
  if (!refreshTokenId) return;

  const key = `rl:refreshTokenId:${refreshTokenId}`;

  const allowed = await redis.setIfNotExists(key, seconds);

  if (!allowed) {
    throw new HttpException(
      'Please wait before refreshing again',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  const windowKey = `rl:refreshTokenId:window:${refreshTokenId}`;

  const count = await redis.incr(windowKey);

  if (count == 1) {
    await redis.expire(windowKey, 60);
  }

  if (Number(count) > 2) {
    throw new HttpException(
      'Too many refresh attempts, Please try again after a minute',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}

export async function rateLimitByUserId(redis: RedisService, userId: string) {
  if (!userId) return;

  const windowKey = `rl:userId:window:${userId}`;

  const count = await redis.incr(windowKey);

  if (count == 1) {
    await redis.expire(windowKey, 30);
  }

  if (Number(count) > 15) {
    throw new HttpException(
      'You have exceeded the request limit for your account. Please wait 30 seconds before trying again.',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
