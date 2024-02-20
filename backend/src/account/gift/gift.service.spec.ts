import { Test, TestingModule } from '@nestjs/testing';
import { GiftService } from './gift.service';

describe('GiftService', () => {
  let service: GiftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GiftService],
    }).compile();

    service = module.get<GiftService>(GiftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
