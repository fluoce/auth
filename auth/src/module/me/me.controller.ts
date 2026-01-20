import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { MeGuard } from './me.guard';
import { MeService } from './me.service';
import type { Request } from 'express';

@UseGuards(MeGuard)
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  async me(@Req() req: Request) {
    const userId = (req as any).userId;
    return await this.meService.me(userId);
  }
}
