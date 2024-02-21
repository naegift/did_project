import { Test, TestingModule } from '@nestjs/testing';
import { MarketService } from './market.service';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { ResGetProducts } from './dto/res-get-products.dto';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';

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
        productsCount: products.length,
        nextPage: false,
      };

      const result = await service.getProducts(1);
      const keys = Object.keys(result);
      const required = Object.keys(resGetProducts);
      expect(keys).toEqual(expect.arrayContaining(required));
    });
  });
});
