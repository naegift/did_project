import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { GiftService } from './gift.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReqReceiveGift } from './dto/req-receive-gift.dto';
import { ReqUseGift } from './dto/req-use-gift.dto';
import { ReqConfirmGift } from './dto/req-confirm-gift.dto';
import { ResGetState } from './dto/res-get-state.dto';
import { badRequest } from 'src/__base-code__/error/bad-request';
import { plainToInstance } from 'class-transformer';
import { ResGetGifts } from './dto/res-get-gifts.dto';

@ApiTags('Account | Gift')
@Controller('gift')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @Get()
  @ApiOperation({ summary: '받은 선물목록' })
  async getGifts(
    @Query('buyer') buyer: string,
    @Query('receiver') receiver: string,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<ResGetGifts> {
    const result = await this.giftService.getGifts(buyer, receiver, page);
    return plainToInstance(ResGetGifts, result);
  }

  @Get(':id/state')
  @ApiOperation({ summary: '선물 상태' })
  @ApiOkResponse({ type: ResGetState })
  @ApiBadRequestResponse(badRequest('Required escrow contract address.'))
  async getState(@Param('id', ParseIntPipe) id: number): Promise<ResGetState> {
    const result = await this.giftService.getState(id);
    return plainToInstance(ResGetState, result);
  }

  @Patch(':id/receive')
  @ApiOperation({ summary: '[작업중] 선물받기' })
  async receiveGift(
    @Param('id', ParseIntPipe) id: number,
    @Body() reqReceiveGift: ReqReceiveGift,
  ) {}

  @Patch(':id/use')
  @ApiOperation({ summary: '[작업중] 선물 사용하기' })
  async useGift(
    @Param('id', ParseIntPipe) id: number,
    @Body() reqUseGift: ReqUseGift,
  ) {}

  @Patch(':id/confirm')
  @ApiOperation({
    summary: '[작업중] 선물 수령확인',
  })
  async confirmGift(
    @Param('id', ParseIntPipe) id: number,
    @Body() reqConfirmGift: ReqConfirmGift,
  ) {}
}
