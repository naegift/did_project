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
    '0x545420f6a302e5ecd10ce5aeac3ff51fd10a9bb6609a5c3c2f439a68bd14e6ec5615fbe282bebcf35dde189a1ea0bfb662c2849129b1a923ab542fe7e92a835c1b';

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
