import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { GithubService } from './github.service';
import { CodeDto } from 'src/types/code.types';
import type { Response } from 'express';
import type { AuthRequestInterface } from 'src/types/request.types';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Post()
  async github(
    @Req() req: AuthRequestInterface,
    @Body() data: CodeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.githubService.github(data.code, res, req?.authRt);
  }
}
