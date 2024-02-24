import { ApiProperty } from '@nestjs/swagger';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';

const gift = new MockGiftModel().gift;
const product = new MockProductModel().product;
const gifts = [
  {
    id: gift.id,
    contract: gift.contract,
    buyer: gift.buyer,
    receiver: gift.receiver,
    state: gift.state,

    productID: product.id,
    image: product.image,
    title: product.title,
    content: product.content,
    seller: product.seller,
    price: product.price,
  },
];

export class ResGetGifts {
  @ApiProperty({ example: gifts })
  gifts: any[];

  @ApiProperty({ example: gifts.length })
  giftsCount: number;

  @ApiProperty({ example: false })
  nextPage: number | boolean;
}
