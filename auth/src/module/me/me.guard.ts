import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MeGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access token missing');
    }

    const authAccessToken = authHeader.slice(7).trim();
    if (!authAccessToken) {
      throw new UnauthorizedException('Access token missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(authAccessToken, {
        algorithms: ['RS256'],
        issuer: process.env.JWT_ISSUER,
      });

      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid or expired access token');
      }

      (req as any).userId = payload.sub;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
