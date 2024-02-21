import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';
import { ReqPostProduct } from './dto/req-post-product.dto';
import { ResGetProduct } from './dto/res-get-product.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ResPostProduct } from './dto/res-post-product.dto';
import { stateCode } from 'src/__base-code__/enum/state.enum';
import { ResGetState } from './dto/res-get-state.dto';

describe('ProductService', () => {
  let service: ProductService;
  let product: ProductModel;
  const contract: string = new MockProductModel().contract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: providers,
    }).compile();

    service = module.get<ProductService>(ProductService);
    product = new MockProductModel().product;
  });

  describe('Get Product', () => {
    it('Return | ResGetProduct', async () => {
      const resGetProduct: ResGetProduct = {
        id: product.id,
        title: product.title,
        content: product.content,
        image: product.image,
        price: product.price,
        seller: product.seller,
      };

      const result = await service.getProduct(product.id);
      const keys = Object.keys(result);
      const required = Object.keys(resGetProduct);
      expect(keys).toEqual(expect.arrayContaining(required));
    });

    it('Error | Cannot find product.', async () => {
      const result = service.getProduct(-1);
      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('Post Product', () => {
    it('Return | ResPostProduct', async () => {
      const reqPostProduct: ReqPostProduct = {
        title: product.title,
        content: product.content,
        image: product.image,
        price: product.price,
        seller: product.seller,
      };
      const resPostProduct: ResPostProduct = { id: product.id };

      const result = await service.postProduct(reqPostProduct);
      const keys = Object.keys(result);
      const required = Object.keys(resPostProduct);
      expect(keys).toEqual(expect.arrayContaining(required));
    });
  });

  describe('Get State', () => {
    it('Return | ResGetState', async () => {
      const resGetState: ResGetState = { state: stateCode[0] };

      const result = await service.getState(contract);
      const keys = Object.keys(result);
      const required = Object.keys(resGetState);
      expect(keys).toEqual(expect.arrayContaining(required));
    });

    it('Error | Required escrow contract address.', async () => {
      const result = service.getState('Not escrow contract');
      await expect(result).rejects.toThrow(BadRequestException);
    });
  });
});
