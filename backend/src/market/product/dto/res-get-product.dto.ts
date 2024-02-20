import { ApiProperty } from '@nestjs/swagger';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';

export class ResGetProduct {
  @ApiProperty({ example: MockProductModel.swaggerProduct.id })
  id: number;

  @ApiProperty({ example: MockProductModel.swaggerProduct.title })
  title: string;

  @ApiProperty({ example: MockProductModel.swaggerProduct.content })
  content: string;

  @ApiProperty({ example: MockProductModel.swaggerProduct.image })
  image: string;

  @ApiProperty({ example: MockProductModel.swaggerProduct.price })
  price: number;

  @ApiProperty({ example: MockProductModel.swaggerProduct.seller })
  seller: string;
}
