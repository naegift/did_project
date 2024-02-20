import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqPostProduct } from './dto/req-post-product.dto';
import { plainToInstance } from 'class-transformer';
import { ResGetProduct } from './dto/res-get-product.dto';
import { ResPostProduct } from './dto/res-post-product.dto';

@ApiTags('Market | Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get Product' })
  async getProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResGetProduct> {
    const result = await this.productService.getProduct(id);
    return plainToInstance(ResGetProduct, result);
  }

  @Post()
  @ApiOperation({ summary: 'Post Product' })
  async postProduct(
    @Body() reqPostProduct: ReqPostProduct,
  ): Promise<ResPostProduct> {
    const result = await this.productService.postProduct(reqPostProduct);
    return plainToInstance(ResPostProduct, result);
  }
}
