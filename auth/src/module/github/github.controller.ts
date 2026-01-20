import { Controller, Post, Body } from '@nestjs/common';
import { GithubService } from './github.service';
import { CodeDto } from 'src/types/code.types';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) { }

  @Post()
  async github(@Body() data: CodeDto) {
    return await this.githubService.github(data.code);
  }
}
