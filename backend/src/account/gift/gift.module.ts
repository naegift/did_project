import { Module } from '@nestjs/common';
import { GiftService } from './gift.service';
import { GiftController } from './gift.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftModel } from 'src/__base-code__/entity/gift.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GiftModel])],
  controllers: [GiftController],
  providers: [GiftService],
})
export class GiftModule {}
