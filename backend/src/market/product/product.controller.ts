import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
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

@ApiTags('Market | Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(201)
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
  @HttpCode(201)
  @ApiOperation({ summary: '선물하기' })
  @ApiCreatedResponse({ type: ResPayProduct })
  @ApiNotAcceptableResponse(notAcceptable('Not enough values or gas.'))
  async payProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() reqPayProduct: ReqPayProduct,
  ): Promise<ResPayProduct> {
    const result = await this.productService.payProduct(id, reqPayProduct);
    return plainToInstance(ResPayProduct, result);
  }
}
