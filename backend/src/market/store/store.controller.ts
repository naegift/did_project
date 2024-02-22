import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ResGetProducts } from '../dto/res-get-products.dto';

@ApiTags('Market | Store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiOperation({ summary: '판매자가 등록한 상품 목록' })
  @ApiOkResponse({ type: ResGetProducts })
  async getProducts(
    @Query('seller') seller: string,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<ResGetProducts> {
    const result = await this.storeService.getProducts(seller, page);
    return plainToInstance(ResGetProducts, result);
  }
}
