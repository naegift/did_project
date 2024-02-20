import { Controller } from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Common | Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
}
