import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenCronService } from './refresh-token-cron.service';

describe('RefreshTokenCronService', () => {
  let service: RefreshTokenCronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefreshTokenCronService],
    }).compile();

    service = module.get<RefreshTokenCronService>(RefreshTokenCronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
