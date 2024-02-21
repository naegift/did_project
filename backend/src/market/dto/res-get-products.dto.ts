import { ApiProperty } from '@nestjs/swagger';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';

const products = new MockProductModel().products;

export class ResGetProducts {
  @ApiProperty({ example: products })
  products: ProductModel[];

  @ApiProperty({ example: products.length })
  productsCount: number;

  @ApiProperty({ example: false })
  nextPage: number | boolean;
}
