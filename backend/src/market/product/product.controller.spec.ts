import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { ProductService } from './product.service';
import { ReqPostProduct } from './dto/req-post-product.dto';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';
import { ProductModel } from 'src/__base-code__/entity/product.entity';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  let product: ProductModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: providers,
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
    product = new MockProductModel().product;
  });

  describe('Get Product', () => {
    it('Use | getProduct', async () => {
      service.getProduct = jest.fn();
      await controller.getProduct(product.id);
      expect(service.getProduct).toHaveBeenCalled();
    });
  });

  describe('Post Product', () => {
    it('Use | postProduct', async () => {
      const reqPostProduct: ReqPostProduct = {
        title: product.title,
        content: product.content,
        image: product.image,
        price: product.price,
        seller: product.seller,
      };

      service.postProduct = jest.fn();
      await controller.postProduct(reqPostProduct);
      expect(service.postProduct).toHaveBeenCalled();
    });
  });
});
