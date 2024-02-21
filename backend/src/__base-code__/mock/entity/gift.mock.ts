import { GiftModel } from 'src/__base-code__/entity/gift.entity';
import { MockProductModel } from './product.mock';

const product = new MockProductModel().product;

export class MockGiftModel {
  static swaggerGift: GiftModel = {
    id: 0,
    buyer: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89e',
    receiver: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89f',
    contract: '0xDD4C2588B1E3a5b4D4e7531cF39CCD4aB3375832',
    product: Promise.resolve(product),
  };

  constructor() {}

  gift: GiftModel = {
    id: 0,
    buyer: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89e',
    receiver: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89f',
    contract: '0xDD4C2588B1E3a5b4D4e7531cF39CCD4aB3375832',
    product: Promise.resolve(product),
  };

  otherGift: GiftModel = {
    id: 1,
    buyer: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89e',
    receiver: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89f',
    contract: '0xDD4C2588B1E3a5b4D4e7531cF39CCD4aB3375832',
    product: Promise.resolve(product),
  };

  gifts: GiftModel[] = [this.gift, this.otherGift];

  findOne({ where: { id } }) {
    const result = this.gifts.find((gift) => gift.id === id);
    return result;
  }

  findAndCount() {
    return [[this.gift], 1];
  }

  save() {
    return this.gift;
  }
}
