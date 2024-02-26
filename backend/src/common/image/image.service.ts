import { Injectable } from '@nestjs/common';
import { ResUploadImage } from './dto/res-upload-image.dto';

@Injectable()
export class ImageService {
  async uploadImage(file: Express.Multer.File): Promise<ResUploadImage> {
    return {
      link: `${process.env.HOST}/public/image/${file.filename}`,
    };
  }
}
