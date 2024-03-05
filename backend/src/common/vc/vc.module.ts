import { Module } from '@nestjs/common';
import { VcService } from './vc.service';
import { VcController } from './vc.controller';

@Module({
  controllers: [VcController],
  providers: [VcService],
})
export class VcModule {}
