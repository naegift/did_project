import { Controller, Get } from '@nestjs/common';
import { VcService } from './vc.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('vc')
@ApiTags('TEST | VC')
export class VcController {
  constructor(private readonly vcService: VcService) {}

  @Get()
  @ApiOperation({ summary: 'VC 로직 테스트' })
  async getID() {
    return this.vcService.getID();
  }

  @Get('credentialStatus')
  @ApiOperation({ summary: '테스트 VC의 상태 API' })
  async getCredentialStatus() {
    return false;
  }
}
