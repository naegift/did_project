import { Test, TestingModule } from '@nestjs/testing';
import { MarketController } from './market.controller';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { MarketService } from './market.service';
import { Order } from 'src/__base-code__/enum/order.enum';

describe('MarketController', () => {
  let controller: MarketController;
  let service: MarketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketController],
      providers: providers,
    }).compile();

    controller = module.get<MarketController>(MarketController);
    service = module.get<MarketService>(MarketService);
  });

  describe('Get Products', () => {
    it('Use | getProducts', async () => {
      service.getProducts = jest.fn();
      await controller.getProducts(1, Order.DESC);
      expect(service.getProducts).toHaveBeenCalled();
    });
  });
});
