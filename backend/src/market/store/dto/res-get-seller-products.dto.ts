import { ApiProperty } from '@nestjs/swagger';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';

const product = new MockProductModel().product;

export class ResGetSellerProducts {
  @ApiProperty({ example: [product] })
  products: ProductModel[];

  @ApiProperty({ example: 1 })
  totalPages: number;
}
