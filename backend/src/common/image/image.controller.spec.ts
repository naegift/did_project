import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './image.controller';
import { providers } from 'src/__base-code__/mock/providers/providers';

describe('ImageController', () => {
  let controller: ImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: providers,
    }).compile();

    controller = module.get<ImageController>(ImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
