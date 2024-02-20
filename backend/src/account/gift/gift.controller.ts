import { Controller } from '@nestjs/common';
import { GiftService } from './gift.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Account | Gift')
@Controller('gift')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}
}
