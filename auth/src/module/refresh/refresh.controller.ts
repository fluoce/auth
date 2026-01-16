import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './refresh.guard';
import { RefreshService } from './refresh.service';

@UseGuards(RefreshTokenGuard)
@Controller('refresh')
export class RefreshController {
  constructor(private readonly refreshService: RefreshService) {}

  @Post()
  async refresh(@Req() req: Request) {
    const refreshTokenId = (req as any).refreshTokenId;
    return await this.refreshService.refresh(refreshTokenId);
  }
}
