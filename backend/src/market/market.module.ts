import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { DataModule } from 'src/common/data/data.module';

@Module({
  imports: [
    ProductModule,
    StoreModule,
    DataModule,
    TypeOrmModule.forFeature([ProductModel]),
  ],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
