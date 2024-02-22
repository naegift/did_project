import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ResGetSellerProducts } from './dto/res-get-seller-products.dto';

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
  ): Promise<ResGetSellerProducts> {
    const result = await this.storeService.getSellerProducts(seller, page);
    return plainToInstance(ResGetSellerProducts, result);
  }
}
