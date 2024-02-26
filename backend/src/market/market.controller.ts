import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { MarketService } from './market.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResGetProducts } from './dto/res-get-products.dto';
import { plainToInstance } from 'class-transformer';
import { FindOptionsOrderValue } from 'typeorm';

@ApiTags('Market')
@Controller('')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  @ApiOkResponse({ type: ResGetProducts })
  @ApiOperation({ summary: '모든 상품 목록' })
  async getProducts(
    @Query('page', ParseIntPipe) page: number,
    @Query('order') order: FindOptionsOrderValue,
  ): Promise<ResGetProducts> {
    const result = await this.marketService.getProducts(page, order);
    return plainToInstance(ResGetProducts, result);
  }
}
