import { ProductModel } from 'src/__base-code__/entity/product.entity';

export class MockProductModel {
  static swaggerProduct: ProductModel = {
    id: 0,
    title: 'title',
    content: 'content',
    image: 'http://example.com',
    price: `${10 ** 16}`,
    seller: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89d',
    gifts: Promise.resolve([]),
  };

  constructor() {}

  product: ProductModel = {
    id: 0,
    title: 'title',
    content: 'content',
    image: 'http://example.com',
    price: `${10 ** 16}`,
    seller: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89d',
    gifts: Promise.resolve([]),
  };

  products: ProductModel[] = [this.product];

  findOne({ where: { id } }) {
    const result = this.products.find((product) => product.id === id);
    return result;
  }

  save() {
    return this.product;
  }
}
