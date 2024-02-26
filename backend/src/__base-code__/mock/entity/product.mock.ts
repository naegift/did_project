import { ProductModel } from 'src/__base-code__/entity/product.entity';

export class MockProductModel {
  static swaggerProduct: ProductModel = {
    id: 0,
    title: 'title',
    content: 'content',
    image: 'http://example.com',
    price: `${10 ** 16}`,
    seller: '0xeF3010D076f62A91A774016E5eBAf58A1BFe1bD6',
  };

  constructor() {}

  static contract: string = '0x48C3c64484d95Ed3fb854922460BEf9fb05d4487';
  static signature: string =
    '0x3c528e3419941d3f7e6c293c7e900959de1d40a75d0241d54fcdfe836a0579831cad5c4ec69727fe985d95ecb5bf6185e1fdfba0e152a8fbea11457eccb3063d1b';

  product: ProductModel = {
    id: 0,
    title: 'title',
    content: 'content',
    image: 'http://example.com',
    price: `${10 ** 16}`,
    seller: '0xeF3010D076f62A91A774016E5eBAf58A1BFe1bD6',
  };

  otherProduct: ProductModel = {
    id: 1,
    title: 'other title',
    content: 'other content',
    image: 'http://example.com',
    price: `${10 ** 16}`,
    seller: '0xeF3010D076f62A91A774016E5eBAf58A1BFe1bD6',
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
