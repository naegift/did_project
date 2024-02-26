import { Test, TestingModule } from '@nestjs/testing';
import { VcController } from './vc.controller';

describe('VcController', () => {
  let controller: VcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VcController],
    }).compile();

    controller = module.get<VcController>(VcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
