import { Injectable } from '@nestjs/common';
import { ResUploadImage } from './dto/res-upload-image.dto';

@Injectable()
export class ImageService {
  uploadImage(file: Express.Multer.File): ResUploadImage {
    return {
      link: `${process.env.HOST}/public/image/${file.filename}`,
    };
  }
}
