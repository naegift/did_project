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
  signature: string =
    '0x3c528e3419941d3f7e6c293c7e900959de1d40a75d0241d54fcdfe836a0579831cad5c4ec69727fe985d95ecb5bf6185e1fdfba0e152a8fbea11457eccb3063d1b';

  product: ProductModel = {
    id: 0,
    title: 'title',
    content: 'content',
    image: 'http://example.com',
    price: `${10 ** 16}`,
    seller: '0x0b6411C390c28D7e7c9D5147d6c7c52f6B89cD8E',
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
