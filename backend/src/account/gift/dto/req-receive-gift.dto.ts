import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';

export class ReqReceiveGift {
  @ApiProperty({ example: MockGiftModel.signature })
  @IsString()
  @Length(132)
  signature: string;

  @ApiProperty({ example: MockGiftModel.swaggerGift.title })
  @IsString()
  @MinLength(1)
  title: string;
  @ApiProperty({ example: MockGiftModel.swaggerGift.content })
  @IsString()
  @MinLength(1)
  content: string;
  @ApiProperty({ example: MockGiftModel.swaggerGift.price })
  @IsString()
  @MinLength(1)
  price: string;
}
