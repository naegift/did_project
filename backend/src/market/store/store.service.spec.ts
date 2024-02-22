import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { ResGetSellerProducts } from './dto/res-get-seller-products.dto';

describe('StoreService', () => {
  let service: StoreService;
  let product: ProductModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: providers,
    }).compile();

    service = module.get<StoreService>(StoreService);
    product = new MockProductModel().product;
  });

  describe('Get Seller Products', () => {
    it('Return | ResGetSellerProducts', async () => {
      const resGetSellerProducts: ResGetSellerProducts = {
        products: [product],
        productsCount: 1,
        nextPage: false,
      };

      const result = await service.getSellerProducts(product.seller, 1);
      const keys = Object.keys(result);
      const required = Object.keys(resGetSellerProducts);
      expect(keys).toEqual(expect.arrayContaining(required));
    });
  });
});
