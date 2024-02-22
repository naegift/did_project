import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { ResGetProducts } from '../dto/res-get-products.dto';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';
import { ProductModel } from 'src/__base-code__/entity/product.entity';

describe('StoreService', () => {
  let service: StoreService;
  let product: ProductModel;
  let products: ProductModel[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: providers,
    }).compile();

    service = module.get<StoreService>(StoreService);
    product = new MockProductModel().product;
    products = new MockProductModel().products;
  });

  describe('Get Products', () => {
    it('Return | ResGetProducts', async () => {
      const resGetProducts: ResGetProducts = {
        products,
        productsCount: products.length,
        nextPage: false,
      };

      const result = await service.getProducts(product.seller, 1);
      const keys = Object.keys(result);
      const required = Object.keys(resGetProducts);
      expect(keys).toEqual(expect.arrayContaining(required));
    });
  });
});
