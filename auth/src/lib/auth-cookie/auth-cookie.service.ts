import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';
import { cookieOption } from 'src/func/cookie-option';

@Injectable()
export class AuthCookieService {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  setCookie(
    res: Response,
    cookieName: string,
    cookieToken: string,
    age?: number,
  ) {
    res.cookie(cookieName, cookieToken, cookieOption(age));
  }

  clearCookie(res: Response, cookieName: string) {
    res.clearCookie(cookieName);
  }

  setAuthRt(res: Response, cookieToken: string) {
    res.cookie('auth_rt', cookieToken, cookieOption());
  }

  async setIfNotAuthRt(
    res: Response,
    authRt: string | null | undefined,
    userId: string,
  ) {
    if (authRt) {
      const session =
        await this.refreshTokenService.validateRefreshToken(authRt);

      if (session && session?.userId == userId) {
        return;
      }
    }

    const refreshToken =
      await this.refreshTokenService.createRefreshToken(userId);

    if (!refreshToken) {
      return;
    }

    this.setAuthRt(res, refreshToken);
  }
}
