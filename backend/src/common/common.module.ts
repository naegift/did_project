import { Module } from '@nestjs/common';
import { ImageModule } from './image/image.module';
import { DataModule } from './data/data.module';
import { VcModule } from './vc/vc.module';

@Module({
  controllers: [],
  providers: [],
  imports: [ImageModule, DataModule, VcModule],
})
export class CommonModule {}
