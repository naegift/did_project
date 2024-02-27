import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { VcService } from './vc.service';
import { CreateVcDto } from './dto/create-vc.dto';

@Controller('vc')
export class VcController {
  constructor(private readonly VcService: VcService) {}

  @Get(':id')
  getVc(@Param('id') id: number) {
    console.log('id:', id);
    return this.VcService.findOne(id);
  }

  @Post()
  createVc(@Body() credential: CreateVcDto) {
    console.log(JSON.stringify(credential));
    return this.VcService.create({ credential: JSON.stringify(credential) });
  }

  @Get('verify/:id')
  verify(@Param('id') id: number) {
    const vc = this.VcService.findOne(id);
  }
}
