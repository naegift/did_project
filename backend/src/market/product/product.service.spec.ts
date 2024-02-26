import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';
import { ReqPostProduct } from './dto/req-post-product.dto';
import { ResGetProduct } from './dto/res-get-product.dto';
import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { ResPostProduct } from './dto/res-post-product.dto';
import { ReqPayProduct } from './dto/req-pay-product.dto';
import { GiftModel } from 'src/__base-code__/entity/gift.entity';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';
import { ResPayProduct } from './dto/res-pay-product.dto';
import { DataService } from 'src/common/data/data.service';
import { Readable } from 'typeorm/platform/PlatformTools';

describe('ProductService', () => {
  let service: ProductService;
  let dataService: DataService;
  let product: ProductModel;
  let gift: GiftModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: providers,
    }).compile();

    service = module.get<ProductService>(ProductService);
    dataService = module.get<DataService>(DataService);
    product = new MockProductModel().product;
    gift = new MockGiftModel().gift;
  });

  describe('Post Product', () => {
    const emptyFile = {
      fieldname: '',
      originalname: '',
      encoding: '',
      mimetype: '',
      size: 1,
      stream: new Readable(),
      destination: '',
      filename: '',
      path: '',
      buffer: Buffer.alloc(1),
    };

    it('Return | ResPostProduct', async () => {
      const reqPostProduct: ReqPostProduct = {
        title: product.title,
        content: product.content,
        price: product.price,
        signature: MockProductModel.signature,
      };
      const resPostProduct: ResPostProduct = { id: product.id };

      const result = await service.postProduct(reqPostProduct, emptyFile);
      const keys = Object.keys(result);
      const required = Object.keys(resPostProduct);
      expect(keys).toEqual(expect.arrayContaining(required));
    });
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

  describe('Pay Product', () => {
    it('Return | ResPayProduct', async () => {
      const reqPayProduct: ReqPayProduct = {
        buyer: gift.buyer,
        receiver: gift.receiver,
        uuid: MockGiftModel.uuid,
      };
      const resPayProduct: ResPayProduct = { giftID: gift.id };

      const result = await service.payProduct(product.id, reqPayProduct);
      const keys = Object.keys(result);
      const required = Object.keys(resPayProduct);
      expect(keys).toEqual(expect.arrayContaining(required));
    });

    it('Error | Not enough values or gas.', async () => {
      const reqPayProduct: ReqPayProduct = {
        buyer: gift.buyer,
        receiver: gift.receiver,
        uuid: '',
      };
      const result = service.payProduct(product.id, reqPayProduct);
      await expect(result).rejects.toThrow(NotAcceptableException);
    });
  });
});
