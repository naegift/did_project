import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { MockProductModel } from 'src/__base-code__/mock/entity/product.mock';

export class ReqPostProduct {
  @ApiProperty({ example: MockProductModel.swaggerProduct.title })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: MockProductModel.swaggerProduct.content })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: MockProductModel.swaggerProduct.image })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: MockProductModel.swaggerProduct.price })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({ example: MockProductModel.swaggerProduct.seller })
  @IsString()
  @Length(42)
  seller: string;
}
