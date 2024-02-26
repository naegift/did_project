import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';

export class ReqDeleteProduct {
  @ApiProperty({ example: MockProductModel.signature })
  @IsString()
  @Length(132)
  signature: string;
}
