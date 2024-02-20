import { Module } from '@nestjs/common';
import { ImageModule } from './image/image.module';
import { DataModule } from './data/data.module';

@Module({
  controllers: [],
  providers: [],
  imports: [ImageModule, DataModule],
})
export class CommonModule {}
