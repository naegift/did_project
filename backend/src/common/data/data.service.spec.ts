import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';

describe('DataService', () => {
  let service: DataService;
  let products: ProductModel[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: providers,
    }).compile();

    service = module.get<DataService>(DataService);
    products = new MockProductModel().products;
  });

  describe('Pagination', () => {
    it('Return | {array: [], arrayCount: number, nextPage: number | boolean}', () => {
      const findAndCount: [ProductModel[], number] = [
        products,
        products.length,
      ];
      const [take, skip, page] = [1, 0, 1];

      const result = service.pagination(findAndCount, skip, take, page);
      const { array, arrayCount, nextPage } = result;

      expect(array).toStrictEqual(findAndCount[0]);
      expect(arrayCount).toEqual(findAndCount[1]);
      expect(nextPage).toEqual(skip + take < arrayCount && page + 1);
      expect(skip + (take + 1) < arrayCount && page + 1).toBeFalsy();
    });
  });
});
