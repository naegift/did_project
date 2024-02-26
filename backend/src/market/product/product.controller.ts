import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReqPostProduct } from './dto/req-post-product.dto';
import { plainToInstance } from 'class-transformer';
import { ResGetProduct } from './dto/res-get-product.dto';
import { ResPostProduct } from './dto/res-post-product.dto';
import { notFound } from 'src/__base-code__/error/not-found';
import { ReqPayProduct } from './dto/req-pay-product.dto';
import { ResPayProduct } from './dto/res-pay-product.dto';
import { notAcceptable } from 'src/__base-code__/error/not-acceptable';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReqPutProduct } from './dto/req-put-product.dto';
import { ResPutProduct } from './dto/res-put-product.dto';
import { ReqDeleteProduct } from './dto/req-delete-product.dto';
import { unauthorized } from 'src/__base-code__/error/unauthorized';

@ApiTags('Market | Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '상품 등록' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        price: { type: 'string' },
        signature: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: ResPostProduct })
  async postProduct(
    @Body() reqPostProduct: ReqPostProduct,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResPostProduct> {
    const result = await this.productService.postProduct(reqPostProduct, file);
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

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '상품 수정' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        price: { type: 'string' },
        signature: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ type: ResPutProduct })
  @ApiUnauthorizedResponse(unauthorized('Cannot update other sellers product.'))
  async putProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() reqPutProduct: ReqPutProduct,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResPutProduct> {
    const result = await this.productService.putProduct(
      id,
      reqPutProduct,
      file,
    );
    return plainToInstance(ResPutProduct, result);
  }

  @Delete(':id')
  @ApiOperation({ summary: '상품 삭제' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse(unauthorized('Cannot delete other sellers product.'))
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() reqDeleteProduct: ReqDeleteProduct,
  ) {
    await this.productService.deleteProduct(id, reqDeleteProduct);
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
