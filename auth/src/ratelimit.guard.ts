import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { rateLimitByIp } from './func/rate-limit';
import { RedisService } from './lib/redis/redis.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
    constructor(private readonly redisService: RedisService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const ip = req.ip;
        await rateLimitByIp(this.redisService, ip);
        return true;
    }
}
