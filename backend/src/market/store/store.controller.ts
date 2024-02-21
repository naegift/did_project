import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Market | Store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiOperation({ summary: '[작업중] 판매자가 등록한 상품 목록' })
  async getProducts(
    @Query('seller') seller: string,
    @Query('page', ParseIntPipe) page: number,
  ) {}
}
