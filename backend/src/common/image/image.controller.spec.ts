import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './image.controller';
import { providers } from 'src/__base-code__/mock/providers/providers';
import { ImageService } from './image.service';
import { Readable } from 'typeorm/platform/PlatformTools';

describe('ImageController', () => {
  let controller: ImageController;
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
      controllers: [ImageController],
      providers,
    }).compile();

    controller = module.get<ImageController>(ImageController);
    service = module.get<ImageService>(ImageService);
  });

  describe('Upload Image', () => {
    it('Use | uploadImage', async () => {
      service.uploadImage = jest.fn();
      await controller.uploadImage(emptyFile);
      expect(service.uploadImage).toHaveBeenCalled();
    });
  });
});
