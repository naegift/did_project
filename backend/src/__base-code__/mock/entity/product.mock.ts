import { ProductModel } from 'src/__base-code__/entity/product.entity';

export class MockProductModel {
  static swaggerProduct: ProductModel = {
    id: 0,
    title: 'title',
    content: 'content',
    image: 'http://example.com',
    price: `${10 ** 16}`,
    seller: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89d',
    market: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89e',
    gifts: Promise.resolve([]),
  };

  constructor() {}

  contract: string = '0xDD4C2588B1E3a5b4D4e7531cF39CCD4aB3375832';

  product: ProductModel = {
    id: 0,
    title: 'title',
    content: 'content',
    image: 'http://example.com',
    price: `${10 ** 16}`,
    seller: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89d',
    market: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89e',
    gifts: Promise.resolve([]),
  };

  otherProduct: ProductModel = {
    id: 1,
    title: 'other title',
    content: 'other content',
    image: 'http://example.com',
    price: `${10 ** 16}`,
    seller: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89d',
    market: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89e',
    gifts: Promise.resolve([]),
  };

  products: ProductModel[] = [this.product, this.otherProduct];

  findOne({ where: { id } }) {
    const result = this.products.find((product) => product.id === id);
    return result;
  }

  findAndCount() {
    return [[this.product], 1];
  }

  save() {
    return this.product;
  }
}
