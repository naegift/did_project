import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { ProductService } from './product.service';
import { ReqPostProduct } from './dto/req-post-product.dto';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { ReqPayProduct } from './dto/req-pay-product.dto';
import { GiftModel } from 'src/__base-code__/entity/gift.entity';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';
import { Readable } from 'typeorm/platform/PlatformTools';
import { ReqPutProduct } from './dto/req-put-product.dto';
import { ReqDeleteProduct } from './dto/req-delete-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  let product: ProductModel;
  let gift: GiftModel;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: providers,
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
    product = new MockProductModel().product;
    gift = new MockGiftModel().gift;
  });

  describe('Post Product', () => {
    it('Use | postProduct', async () => {
      const reqPostProduct: ReqPostProduct = {
        title: product.title,
        content: product.content,
        price: product.price,
        signature: MockProductModel.signature,
      };

      service.postProduct = jest.fn();
      await controller.postProduct(reqPostProduct, emptyFile);
      expect(service.postProduct).toHaveBeenCalled();
    });
  });

  describe('Get Product', () => {
    it('Use | getProduct', async () => {
      service.getProduct = jest.fn();
      await controller.getProduct(product.id);
      expect(service.getProduct).toHaveBeenCalled();
    });
  });

  describe('Put Product', () => {
    it('Use | putProduct', async () => {
      const reqPutProduct: ReqPutProduct = {
        title: product.title,
        content: product.content,
        price: product.price,
        signature: MockProductModel.signature,
      };

      service.putProduct = jest.fn();
      await controller.putProduct(product.id, reqPutProduct, emptyFile);
      expect(service.putProduct).toHaveBeenCalled();
    });
  });

  describe('Delete Product', () => {
    const reqDeleteProduct: ReqDeleteProduct = {
      signature: MockProductModel.signature,
    };

    it('Use | deleteProduct', async () => {
      service.deleteProduct = jest.fn();
      await controller.deleteProduct(product.id, reqDeleteProduct);
      expect(service.deleteProduct).toHaveBeenCalled();
    });
  });

  describe('Pay Product', () => {
    it('Use | payProduct', async () => {
      const reqPayProduct: ReqPayProduct = {
        buyer: gift.buyer,
        receiver: gift.receiver,
        uuid: MockGiftModel.uuid,
      };
      service.payProduct = jest.fn();
      await controller.payProduct(product.id, reqPayProduct);
      expect(service.payProduct).toHaveBeenCalled();
    });
  });
});
