import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { rateLimitByIp } from './func/rate-limit';
import { RedisService } from './lib/redis/redis.service';
import { Reflector } from '@nestjs/core';
import { SKIP_RATE_LIMIT_KEY } from './skip.ratelimit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly redisService: RedisService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authRt = req.cookies?.auth_rt;
    if (authRt) {
      (req as any).authRt = authRt;
    }
    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (skip) {
      return true;
    }
    const ip = req.ip;
    await rateLimitByIp(this.redisService, ip);
    return true;
  }
}
