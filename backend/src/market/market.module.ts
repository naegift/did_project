import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';

@Module({
  controllers: [MarketController],
  providers: [MarketService],
  imports: [ProductModule, StoreModule],
})
export class MarketModule {}
