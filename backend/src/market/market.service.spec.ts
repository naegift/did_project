import { Test, TestingModule } from '@nestjs/testing';
import { MarketService } from './market.service';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { ResGetProducts } from './dto/res-get-products.dto';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';
import { Order } from 'src/__base-code__/enum/order.enum';

describe('MarketService', () => {
  let service: MarketService;
  let products: ProductModel[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: providers,
    }).compile();

    service = module.get<MarketService>(MarketService);
    products = new MockProductModel().products;
  });

  describe('Get Products', () => {
    it('Return | ResGetProducts', async () => {
      const resGetProducts: ResGetProducts = {
        products,
        totalPages: 1,
      };

      const result = await service.getProducts(1, Order.DESC);
      const keys = Object.keys(result);
      const required = Object.keys(resGetProducts);
      expect(keys).toEqual(expect.arrayContaining(required));
    });
  });
});
