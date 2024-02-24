import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';

const gift = new MockGiftModel().gift;

export class ReqPayProduct {
  @ApiProperty({ example: gift.buyer })
  @IsString()
  @Length(42)
  buyer: string;

  @ApiProperty({ example: gift.receiver })
  @IsString()
  @Length(42)
  receiver: string;

  @ApiProperty({ example: MockGiftModel.uuid })
  @IsString()
  @Length(36)
  uuid: string;
}
