import { Test, TestingModule } from '@nestjs/testing';
import { SendTokenController } from './exchange.controller';

describe('SendTokenController', () => {
  let controller: SendTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendTokenController],
    }).compile();

    controller = module.get<SendTokenController>(SendTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
