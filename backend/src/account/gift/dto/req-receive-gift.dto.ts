import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';

export class ReqReceiveGift {
  @ApiProperty({ example: MockGiftModel.signature })
  @IsString()
  @Length(132)
  signature: string;
}
