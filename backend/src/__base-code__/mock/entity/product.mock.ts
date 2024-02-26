import { ProductModel } from 'src/__base-code__/entity/product.entity';

export class MockProductModel {
  static swaggerProduct: ProductModel = {
    id: 1,
    title: 'title',
    content: 'content',
    image: 'http://example.com',
    price: `${10 ** 16}`,
    seller: '0xeF3010D076f62A91A774016E5eBAf58A1BFe1bD6',
  };

  constructor() {}

  static contract: string = '0x48C3c64484d95Ed3fb854922460BEf9fb05d4487';
  static signature: string =
    '0xde330683ee6feb5240a42ca2a878dcc0736a4a914bc72c2a4a3513d4f9c8867e566fb3fc314d8186208c7df52f1ec350e22634a45ef0a85671f77a4ab339cc031b';
  static deleteSignature: string =
    '0xf2cc59bd6580248253d9e7f512b9e6fd3ed662b4ff49d5eefd36460fb5fe77ae0871d606da5978a86e400d4a86a1a8d982e4196bd64d85b3211b5f9ce06948c11b';

  product: ProductModel = {
    id: 1,
    title: 'title',
    content: 'content',
    image: 'http://example.com',
    price: `${10 ** 15}`,
    seller: '0xeF3010D076f62A91A774016E5eBAf58A1BFe1bD6',
  };

  otherProduct: ProductModel = {
    id: 2,
    title: 'other title',
    content: 'other content',
    image: 'http://example.com',
    price: `${10 ** 15}`,
    seller: '0xeF3010D076f62A91A774016E5eBAf58A1BFe1bD7',
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

  delete() {}
}
