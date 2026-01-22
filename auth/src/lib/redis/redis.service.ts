import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis';
import { asyncFunc } from 'src/func/asyncFunc';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) { }

  async set(key: string, value: any, ttl: number): Promise<boolean> {
    const data = await JSON.stringify(value);
    const result = await asyncFunc(
      () => this.redis.set(key, data, 'EX', ttl),
      (error) => {
        this.logger.error('redis set failed', error);
      },
    );
    return result === 'OK';
  }

  async get<T = any>(key: string): Promise<T | null> {
    const value = await asyncFunc(
      () => this.redis.get(key),
      (error) => {
        this.logger.error('redis get failed', error);
      },
    );
    if (!value) return null;
    return await JSON.parse(value);
  }

  async del(key: string) {
    await asyncFunc(
      () => this.redis.del(key),
      (error) => {
        this.logger.error('redis set failed', error);
      },
    );
  }

  async getDel<T = any>(key: string): Promise<T | null> {
    const value = await asyncFunc(
      () => this.redis.getdel(key),
      (error) => {
        this.logger.error('redis getdel failed', error);
      },
    );

    if (!value) return null;
    return JSON.parse(value);
  }

  async exists(key: string): Promise<boolean> {
    const result = await asyncFunc(
      () => this.redis.exists(key),
      (error) => {
        this.logger.error('redis exists check failed', error);
      },
    );
    return result ? true : false;
  }

  async setIfNotExists(key: string, ttl: number): Promise<boolean> {
    const result = await asyncFunc(
      () => this.redis.set(key, '1', 'EX', ttl, 'NX'),
      (error) => {
        this.logger.error('redis set nx failed', error);
      },
    );
    return result === 'OK';
  }

  async incr(key: string): Promise<Number> {
    const result = await asyncFunc(
      () => this.redis.incr(key),
      (error) => {
        this.logger.error('redis incr failed', error);
      }
    )
    return result ? result : 1
  }

  async expire(key: string, ttl: number): Promise<void> {
    await asyncFunc(
      () => this.redis.expire(key, ttl),
      (error) => {
        this.logger.error('redis expire failed', error);
      }
    )
  }
}
