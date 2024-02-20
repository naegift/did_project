import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { Readable } from 'typeorm/platform/PlatformTools';
import { ResUploadImage } from './dto/res-upload-image.dto';

describe('ImageService', () => {
  let service: ImageService;
  const emptyFile = {
    fieldname: '',
    originalname: '',
    encoding: '',
    mimetype: '',
    size: 1,
    stream: new Readable(),
    destination: '',
    filename: '',
    path: '',
    buffer: Buffer.alloc(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: providers,
    }).compile();

    service = module.get<ImageService>(ImageService);
  });

  describe('Upload Image', () => {
    const resUploadImage: ResUploadImage = { link: '' };
    let result = {};

    it('Return | ResUploadImage', async () => {
      result = await service.uploadImage(emptyFile);
      const keys = Object.keys(result);
      const required = Object.keys(resUploadImage);
      expect(keys).toEqual(expect.arrayContaining(required));
    });
  });
});
