import { ApiProperty } from '@nestjs/swagger';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';

export class ResFulfilledGifts {
  @ApiProperty({ example: [MockGiftModel.swaggerGift] })
  gifts: any[];

  @ApiProperty({ example: 1 })
  totalPages: number;
}
