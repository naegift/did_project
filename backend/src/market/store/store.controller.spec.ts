import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';

describe('StoreController', () => {
  let controller: StoreController;
  let service: StoreService;
  let product: ProductModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: providers,
    }).compile();

    controller = module.get<StoreController>(StoreController);
    service = module.get<StoreService>(StoreService);
    product = new MockProductModel().product;
  });

  describe('Get Seller Products', () => {
    it('Use | getSellerProducts', async () => {
      service.getSellerProducts = jest.fn();
      await controller.getSellerProducts(product.seller, 1, 'desc');
      expect(service.getSellerProducts).toHaveBeenCalled();
    });
  });

  describe('Fulfilled Gifts', () => {
    it('Use | fulfilledGifts', async () => {
      service.fulfilledGifts = jest.fn();
      await controller.fulfilledGifts(product.seller, 1, 'desc');
      expect(service.fulfilledGifts).toHaveBeenCalled();
    });
  });
});
