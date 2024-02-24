import { Test, TestingModule } from '@nestjs/testing';
import { GiftService } from './gift.service';
import { ResGetState } from './dto/res-get-state.dto';
import { stateCode } from 'src/__base-code__/enum/state.enum';
import { NotFoundException } from '@nestjs/common';
import { GiftModel } from 'src/__base-code__/entity/gift.entity';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';
import { providers } from 'src/__base-code__/mock/providers/providers';

describe('GiftService', () => {
  let service: GiftService;
  let gift: GiftModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: providers,
    }).compile();

    service = module.get<GiftService>(GiftService);
    gift = new MockGiftModel().gift;
  });

  describe('Get State', () => {
    it('Return | ResGetState', async () => {
      const resGetState: ResGetState = { state: stateCode[0] };

      const result = await service.getState(gift.id);
      const keys = Object.keys(result);
      const required = Object.keys(resGetState);
      expect(keys).toEqual(expect.arrayContaining(required));
    });

    it('Error | Required escrow contract address.', async () => {
      const result = service.getState(0);
      await expect(result).rejects.toThrow(NotFoundException);
    });
  });
});
