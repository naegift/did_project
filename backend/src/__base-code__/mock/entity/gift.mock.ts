import { GiftModel } from 'src/__base-code__/entity/gift.entity';
import { MockProductModel } from './product.mock';
import { State } from 'src/__base-code__/enum/state.enum';

const product = new MockProductModel().product;

export class MockGiftModel {
  static swaggerGift: GiftModel = {
    id: 1,
    buyer: '0x0b6411C390c28D7e7c9D5147d6c7c52f6B89cD8E',
    receiver: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89d',
    contract: '0xDD4C2588B1E3a5b4D4e7531cF39CCD4aB3375832',
    state: State.DEPLOYED,
    product: Promise.resolve(product),
  };

  constructor() {}

  static proxyAddress: string = '0x85B05Eb0eA7A8E090F6AEE10eaf8DA2ceB5A8deE';
  static escrowAddress: string = '0xd94976511bcb8f5167ba13b9a3a942b7d6d6b495';
  static signature: string =
    '0x545420f6a302e5ecd10ce5aeac3ff51fd10a9bb6609a5c3c2f439a68bd14e6ec5615fbe282bebcf35dde189a1ea0bfb662c2849129b1a923ab542fe7e92a835c1b';
  static uuid: string = '605638df-4c1e-4eb1-b081-8c74a0e8924d';

  gift: GiftModel = {
    id: 1,
    buyer: '0x0b6411C390c28D7e7c9D5147d6c7c52f6B89cD8E',
    receiver: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89d',
    contract: '0xDD4C2588B1E3a5b4D4e7531cF39CCD4aB3375832',
    state: State.ACTIVE,
    product: Promise.resolve(product),
  };

  otherGift: GiftModel = {
    id: 2,
    buyer: '0x0b6411C390c28D7e7c9D5147d6c7c52f6B89cD8E',
    receiver: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89d',
    contract: '0xDD4C2588B1E3a5b4D4e7531cF39CCD4aB3375832',
    state: State.ACTIVE,
    product: Promise.resolve(product),
  };

  gifts: GiftModel[] = [this.gift, this.otherGift];

  create() {
    return this.gift;
  }

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
