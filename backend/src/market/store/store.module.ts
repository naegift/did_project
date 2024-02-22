import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { DataModule } from 'src/common/data/data.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductModel]), DataModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
