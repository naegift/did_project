import { ApiProperty } from '@nestjs/swagger';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';

export class ResPayProduct {
  @ApiProperty({ example: new MockGiftModel().gift.id })
  giftID: number;
}
