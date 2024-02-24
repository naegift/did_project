import { ApiProperty } from '@nestjs/swagger';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';

export class ResVerifiedProducts {
  @ApiProperty({ example: [MockGiftModel.swaggerGift] })
  gifts: any[];

  @ApiProperty({ example: 1 })
  giftsCount: number;

  @ApiProperty({ example: false })
  nextPage: number | boolean;
}
