import { Module } from '@nestjs/common';
import { ImageModule } from './image/image.module';

@Module({
  controllers: [],
  providers: [],
  imports: [ImageModule],
})
export class CommonModule {}
