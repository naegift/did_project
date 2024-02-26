import {
  Controller,
  Get,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MarketService } from './market.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResGetProducts } from './dto/res-get-products.dto';
import { plainToInstance } from 'class-transformer';
import { Order } from 'src/__base-code__/enum/order.enum';

@ApiTags('Market')
@Controller('')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  @ApiOkResponse({ type: ResGetProducts })
  @ApiOperation({ summary: '모든 상품 목록' })
  async getProducts(
    @Query('page', ParseIntPipe) page: number,
    @Query('order', new ParseEnumPipe(Order)) order: Order,
  ): Promise<ResGetProducts> {
    const result = await this.marketService.getProducts(page, order);
    return plainToInstance(ResGetProducts, result);
  }
}
