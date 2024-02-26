import { Controller } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  // @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiOperation({ summary: '이미지 업로드' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @ApiCreatedResponse({ type: ResUploadImage })
  // uploadImage(@UploadedFile() file: Express.Multer.File): ResUploadImage {
  //   const result = this.imageService.uploadImage(file);
  //   return plainToInstance(ResUploadImage, result);
  // }
}
