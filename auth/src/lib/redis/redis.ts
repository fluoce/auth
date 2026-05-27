import { Logger, Provider } from '@nestjs/common';
import { Redis } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    const logger = new Logger('Redis');

    const redisUrl = process.env.REDIS_URL;

    const maxRetries = 10;
    const retryDelay = 60 * 1000;

    function retryStrategy(times: number) {
      if (times > maxRetries) {
        return null;
      }
      logger.log('Redis retry');
      return retryDelay;
    }

    const redis = redisUrl
      ? new Redis(redisUrl, {
          retryStrategy,
        })
      : new Redis({
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: Number(process.env.REDIS_PORT || 6379),
          password: process.env.REDIS_PASSWORD || undefined,
          db: Number(process.env.REDIS_DB || 0),
          retryStrategy,
        });

    redis.on('error', (err) => {
      logger.warn(`Redis unavailable: ${err?.message}`);
    });

    redis.on('connect', () => {
      logger.log('Redis connected');
    });

    redis.connect().catch(() => {
      logger.warn('Redis connection failed. Continuing without Redis.');
    });

    return redis;
  },
};
