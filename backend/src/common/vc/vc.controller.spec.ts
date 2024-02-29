import { Test, TestingModule } from '@nestjs/testing';
import { VcController } from './vc.controller';
import { VcService } from './vc.service';

describe('VcController', () => {
  let controller: VcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VcController],
      providers: [VcService],
    }).compile();

    controller = module.get<VcController>(VcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
