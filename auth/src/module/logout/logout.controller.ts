import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LogoutService } from './logout.service';
import { RefreshTokenGuard } from '../refresh/refresh.guard';
import { RefreshTokenGraceData } from 'src/types/refreshToken.types';

@UseGuards(RefreshTokenGuard)
@Controller('logout')
export class LogoutController {
  constructor(private readonly logoutService: LogoutService) {}

  @Post()
  async logout(@Req() req: Request) {
    const refreshTokenData = (req as any)
      .refreshTokenData as RefreshTokenGraceData;
    return await this.logoutService.logout(refreshTokenData.refreshTokenId);
  }

  @Post('all')
  async logoutAll(@Req() req: Request) {
    const refreshTokenData = (req as any)
      .refreshTokenData as RefreshTokenGraceData;
    return await this.logoutService.logoutAll(refreshTokenData.user.id);
  }
}
