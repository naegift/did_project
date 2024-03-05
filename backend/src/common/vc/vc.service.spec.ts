import { Test, TestingModule } from '@nestjs/testing';
import { VcService } from './vc.service';

describe('VcService', () => {
  let service: VcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VcService],
    }).compile();

    service = module.get<VcService>(VcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
