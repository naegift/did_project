import {
  Controller,
  Get,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ResGetSellerProducts } from './dto/res-get-seller-products.dto';
import { ResFulfilledGifts } from './dto/res-fulfilled-gifts.dto';
import { Order } from 'src/__base-code__/enum/order.enum';

@ApiTags('Market | Store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiOperation({ summary: '판매자가 등록한 상품 목록' })
  @ApiOkResponse({ type: ResGetSellerProducts })
  async getSellerProducts(
    @Query('seller') seller: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('order', new ParseEnumPipe(Order)) order: Order,
  ): Promise<ResGetSellerProducts> {
    const result = await this.storeService.getSellerProducts(
      seller,
      page,
      order,
    );
    return plainToInstance(ResGetSellerProducts, result);
  }

  @Get('verified')
  @ApiOperation({ summary: '판매자의 사용된 선물 목록' })
  @ApiOkResponse({ type: ResFulfilledGifts })
  async fulfilledGifts(
    @Query('seller') seller: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('order', new ParseEnumPipe(Order)) order: Order,
  ): Promise<ResFulfilledGifts> {
    const result = await this.storeService.fulfilledGifts(seller, page, order);
    return plainToInstance(ResFulfilledGifts, result);
  }
}
