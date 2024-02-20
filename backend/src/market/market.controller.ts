import { Controller } from '@nestjs/common';
import { MarketService } from './market.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Market')
@Controller('')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}
}
