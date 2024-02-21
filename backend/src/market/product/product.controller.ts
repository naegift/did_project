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
  ApiBadRequestResponse,
  ApiCreatedResponse,
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
import { ResGetState } from './dto/res-get-state.dto';
import { badRequest } from 'src/__base-code__/error/bad-request';
import { ReqPayProduct } from './dto/req-pay-product.dto';

@ApiTags('Market | Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Post Product' })
  @ApiCreatedResponse({ type: ResPostProduct })
  async postProduct(
    @Body() reqPostProduct: ReqPostProduct,
  ): Promise<ResPostProduct> {
    const result = await this.productService.postProduct(reqPostProduct);
    return plainToInstance(ResPostProduct, result);
  }

  @Get(':id')
  @ApiOkResponse({ type: ResGetProduct })
  @ApiNotFoundResponse(notFound('Cannot find product.'))
  @ApiOperation({ summary: 'Get Product' })
  async getProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResGetProduct> {
    const result = await this.productService.getProduct(id);
    return plainToInstance(ResGetProduct, result);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: '[작업중] Pay Product' })
  async payProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() reqPayProduct: ReqPayProduct,
  ) {}

  @Get(':id/verified')
  @ApiOperation({ summary: '[작업중] Verified Products' })
  async verifiedProducts(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number,
  ) {}

  @Get(':id/state/:contract')
  @ApiOkResponse({ type: ResGetState })
  @ApiBadRequestResponse(badRequest('Required escrow contract address.'))
  @ApiOperation({ summary: 'Get State' })
  async getState(@Param('contract') contract: string): Promise<ResGetState> {
    const result = await this.productService.getState(contract);
    return plainToInstance(ResGetState, result);
  }
}
