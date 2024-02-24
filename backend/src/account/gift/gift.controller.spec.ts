import { Test, TestingModule } from '@nestjs/testing';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { GiftModel } from 'src/__base-code__/entity/gift.entity';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';

describe('GiftController', () => {
  let controller: GiftController;
  let service: GiftService;
  let gift: GiftModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftController],
      providers: providers,
    }).compile();

    controller = module.get<GiftController>(GiftController);
    service = module.get<GiftService>(GiftService);
    gift = new MockGiftModel().gift;
  });

  describe('Get State', () => {
    it('Use | getState', async () => {
      service.getState = jest.fn();
      await controller.getState(gift.id);
      expect(service.getState).toHaveBeenCalled();
    });
  });
});
