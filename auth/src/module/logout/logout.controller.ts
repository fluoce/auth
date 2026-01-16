import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LogoutService } from './logout.service';
import { RefreshTokenGuard } from '../refresh/refresh.guard';

@UseGuards(RefreshTokenGuard)
@Controller('logout')
export class LogoutController {
  constructor(private readonly logoutService: LogoutService) {}

  @Post()
  async logout(@Req() req: Request) {
    const refreshTokenId = (req as any).refreshTokenId;
    return await this.logoutService.logout(refreshTokenId);
  }
}
