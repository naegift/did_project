import { ApiProperty } from '@nestjs/swagger';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';

export class ResPutProduct {
  @ApiProperty({ example: MockProductModel.swaggerProduct.id })
  id: number;
}
