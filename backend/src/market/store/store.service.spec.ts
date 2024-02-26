import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { ResGetSellerProducts } from './dto/res-get-seller-products.dto';
import { DataService } from 'src/common/data/data.service';
import { ResFulfilledGifts } from './dto/res-fulfilled-gifts.dto';

describe('StoreService', () => {
  let service: StoreService;
  let dataService: DataService;
  let product: ProductModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: providers,
    }).compile();

    service = module.get<StoreService>(StoreService);
    dataService = module.get<DataService>(DataService);
    product = new MockProductModel().product;
  });

  describe('Get Seller Products', () => {
    it('Use | pagination', async () => {
      dataService.pagination = jest
        .fn()
        .mockReturnValue({ array: [], totalPages: 1 });
      await service.getSellerProducts(product.seller, 1, 'desc');
      expect(dataService.pagination).toHaveBeenCalled();
    });

    it('Return | ResGetSellerProducts', async () => {
      const resGetSellerProducts: ResGetSellerProducts = {
        products: [product],
        totalPages: 1,
      };

      const result = await service.getSellerProducts(product.seller, 1, 'desc');
      const keys = Object.keys(result);
      const required = Object.keys(resGetSellerProducts);
      expect(keys).toEqual(expect.arrayContaining(required));
    });
  });

  describe('Verified Gifts', () => {
    it('Use | pagination', async () => {
      dataService.pagination = jest
        .fn()
        .mockReturnValue({ array: [], totalPages: 1 });
      await service.fulfilledGifts(product.seller, 1, 'desc');
      expect(dataService.pagination).toHaveBeenCalled();
    });

    it('Return | ResFulfilledGifts', async () => {
      const resFulfilledGifts: ResFulfilledGifts = {
        gifts: [],
        totalPages: 1,
      };

      const result = await service.fulfilledGifts(product.seller, 1, 'desc');
      const keys = Object.keys(result);
      const required = Object.keys(resFulfilledGifts);
      expect(keys).toEqual(expect.arrayContaining(required));
    });
  });
});
