import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReqPostProduct } from './dto/req-post-product.dto';
import { plainToInstance } from 'class-transformer';
import { ResGetProduct } from './dto/res-get-product.dto';
import { ResPostProduct } from './dto/res-post-product.dto';
import { notFound } from 'src/__base-code__/error/not-found';
import { ReqPayProduct } from './dto/req-pay-product.dto';
import { ResPayProduct } from './dto/res-pay-product.dto';
import { notAcceptable } from 'src/__base-code__/error/not-acceptable';
import { ResVerifiedProducts } from './dto/res-verified-products.dto';

@ApiTags('Market | Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: '상품 등록' })
  @ApiCreatedResponse({ type: ResPostProduct })
  async postProduct(
    @Body() reqPostProduct: ReqPostProduct,
  ): Promise<ResPostProduct> {
    const result = await this.productService.postProduct(reqPostProduct);
    return plainToInstance(ResPostProduct, result);
  }

  @Get(':id')
  @ApiOperation({ summary: '상품 정보 조회' })
  @ApiOkResponse({ type: ResGetProduct })
  @ApiNotFoundResponse(notFound('Cannot find product.'))
  async getProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResGetProduct> {
    const result = await this.productService.getProduct(id);
    return plainToInstance(ResGetProduct, result);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: '선물하기' })
  @ApiNotAcceptableResponse(notAcceptable('Not enough values or gas.'))
  async payProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() reqPayProduct: ReqPayProduct,
  ): Promise<ResPayProduct> {
    const result = await this.productService.payProduct(id, reqPayProduct);
    return plainToInstance(ResPayProduct, result);
  }

  @Get(':id/verified')
  @ApiOperation({ summary: '상품의 사용된 선물 목록' })
  @ApiOkResponse({ type: ResVerifiedProducts })
  async verifiedProducts(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<ResVerifiedProducts> {
    const result = await this.productService.verifiedProducts(id, page);
    return plainToInstance(ResVerifiedProducts, result);
  }
}
