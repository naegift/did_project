import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { MarketService } from './market.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResGetProducts } from './dto/res-get-products.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Market')
@Controller('')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  @ApiOkResponse({ type: ResGetProducts })
  @ApiOperation({ summary: '모든 상품 목록' })
  async getProducts(
    @Query('page', ParseIntPipe) page: number,
  ): Promise<ResGetProducts> {
    const result = await this.marketService.getProducts(page);
    return plainToInstance(ResGetProducts, result);
  }
}
