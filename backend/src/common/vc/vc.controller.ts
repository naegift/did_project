import { Controller, Get } from '@nestjs/common';
import { VcService } from './vc.service';

@Controller('vc')
export class VcController {
  constructor(private readonly vcService: VcService) {}

  @Get()
  async getID() {
    return this.vcService.getID();
  }
}
