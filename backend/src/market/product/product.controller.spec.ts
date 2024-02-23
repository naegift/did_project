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

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  let product: ProductModel;
  let gift: GiftModel;
  const contract: string = new MockProductModel().contract;
  const signature: string = new MockProductModel().signature;

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
        image: product.image,
        price: product.price,
        signature,
      };

      service.postProduct = jest.fn();
      await controller.postProduct(reqPostProduct);
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

  describe('Pay Product', () => {
    it('Use | payProduct', async () => {
      const reqPayProduct: ReqPayProduct = {
        buyer: gift.buyer,
        receiver: gift.receiver,
      };
      service.payProduct = jest.fn();
      await controller.payProduct(product.id, reqPayProduct);
      expect(service.payProduct).toHaveBeenCalled();
    });
  });

  describe('Get State', () => {
    it('Use | getState', async () => {
      service.getState = jest.fn();
      await controller.getState(product.id, contract);
      expect(service.getState).toHaveBeenCalled();
    });
  });
});
