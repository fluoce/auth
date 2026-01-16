import { Test, TestingModule } from '@nestjs/testing';
import { SendTokenService } from './exchange.service';

describe('SendTokenService', () => {
  let service: SendTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendTokenService],
    }).compile();

    service = module.get<SendTokenService>(SendTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
