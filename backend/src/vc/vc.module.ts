import { Module } from '@nestjs/common';
import { VcController } from './vc.controller';
import { VcService } from './vc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VcModel } from 'src/__base-code__/entity/vc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VcModel])],
  controllers: [VcController],
  providers: [VcService],
})
export class VcModule {}
