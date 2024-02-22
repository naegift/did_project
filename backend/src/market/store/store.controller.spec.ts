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

  describe('Get Products', () => {
    it('Use | getProducts', async () => {
      service.getProducts = jest.fn();
      await controller.getProducts(product.seller, 1);
      expect(service.getProducts).toHaveBeenCalled();
    });
  });
});
