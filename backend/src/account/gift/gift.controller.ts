import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { GiftService } from './gift.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqReceiveGift } from './dto/req-receive-gift.dto';
import { ReqUseGift } from './dto/req-use-gift.dto';

@ApiTags('Account | Gift')
@Controller('gift')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @Get()
  @ApiOperation({ summary: '[작업중] Get Gifts' })
  async getGifts(
    @Query('receiver') receiver: string,
    @Query('page', ParseIntPipe) page: number,
  ) {}

  @Post(':id/receive')
  @ApiOperation({ summary: '[작업중] Receive Gift' })
  async receiveGift(
    @Param('id', ParseIntPipe) id: number,
    @Body() reqReceiveGift: ReqReceiveGift,
  ) {}

  @Post(':id/use')
  @ApiOperation({ summary: '[작업중] Use Gift' })
  async useGift(
    @Param('id', ParseIntPipe) id: number,
    @Body() reqUseGift: ReqUseGift,
  ) {}

  @Post(':id/confirm')
  @ApiOperation({ summary: '[작업중] 대납 컨트랙트 구현 후 작성' })
  async confirmGift() {}
}
