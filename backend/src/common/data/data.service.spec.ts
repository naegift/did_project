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
    it('Return | {array: [], totalPages: number}', () => {
      const findAndCount: [ProductModel[], number] = [
        products,
        products.length,
      ];
      const take = 3;
      const result = service.pagination(findAndCount, take);
      const { array, totalPages } = result;

      expect(array).toStrictEqual(findAndCount[0]);
      expect(totalPages).toEqual(
        Math.floor((findAndCount[1] && findAndCount[1] - 1) / take) + 1,
      );
    });
  });
});
