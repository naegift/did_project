import { ApiProperty } from '@nestjs/swagger';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';

const gifts = new MockGiftModel().gifts;

export class ResGetGifts {
  @ApiProperty({ example: gifts })
  gifts: any[];

  @ApiProperty({ example: 1 })
  totalPages: number;
}
