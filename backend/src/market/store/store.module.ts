import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { DataModule } from 'src/common/data/data.module';
import { GiftModel } from 'src/__base-code__/entity/gift.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductModel, GiftModel]), DataModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
