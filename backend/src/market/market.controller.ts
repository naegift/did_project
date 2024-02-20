import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { MarketService } from './market.service';
import { ApiTags } from '@nestjs/swagger';
import { ResGetProducts } from './dto/res-get-products.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Market')
@Controller('')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  async getProducts(
    @Query('page', ParseIntPipe) page: number,
  ): Promise<ResGetProducts> {
    const result = await this.marketService.getProducts(page);
    return plainToInstance(ResGetProducts, result);
  }
}
