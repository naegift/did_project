import { Test, TestingModule } from '@nestjs/testing';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';

describe('GiftController', () => {
  let controller: GiftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftController],
      providers: [GiftService],
    }).compile();

    controller = module.get<GiftController>(GiftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
