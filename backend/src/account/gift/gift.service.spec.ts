import { Test, TestingModule } from '@nestjs/testing';
import { GiftService } from './gift.service';
import { ResGetState } from './dto/res-get-state.dto';
import { stateCode } from 'src/__base-code__/enum/state.enum';
import { NotFoundException } from '@nestjs/common';
import { GiftModel } from 'src/__base-code__/entity/gift.entity';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { DataService } from 'src/common/data/data.service';
import { ResGetGifts } from './dto/res-get-gifts.dto';

describe('GiftService', () => {
  let service: GiftService;
  let dataService: DataService;
  let gift: GiftModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: providers,
    }).compile();

    service = module.get<GiftService>(GiftService);
    dataService = module.get<DataService>(DataService);
    gift = new MockGiftModel().gift;
  });

  describe('Get Gift', () => {
    it('Return | GiftModel', async () => {
      const result = await service.getGift(gift.id);
      const keys = Object.keys(result);
      const required = Object.keys(gift);
      expect(keys).toEqual(expect.arrayContaining(required));
    });

    it('Error | Cannot find gift.', async () => {
      const result = service.getGift(0);
      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('Get Gifts', () => {
    it('Use | pagination', async () => {
      dataService.pagination = jest
        .fn()
        .mockReturnValue({ array: [], totalPages: 1 });
      await service.getGifts(null, gift.receiver, 1, 'desc');
      expect(dataService.pagination).toHaveBeenCalled();
    });

    it('Return | ResGetGifts', async () => {
      const resGetGifts: ResGetGifts = {
        gifts: [],
        totalPages: 1,
      };

      const result = await service.getGifts(gift.buyer, null, 1, 'desc');
      const keys = Object.keys(result);
      const required = Object.keys(resGetGifts);
      expect(keys).toEqual(expect.arrayContaining(required));
    });
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
