import { Injectable, NotFoundException } from '@nestjs/common';
import { ResGetState } from './dto/res-get-state.dto';
import { ethers } from 'ethers';
import { ESCROW_ABI } from 'src/__base-code__/abi/escrow.abi';
import { stateCode } from 'src/__base-code__/enum/state.enum';
import { GiftModel } from 'src/__base-code__/entity/gift.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(GiftModel)
    private readonly giftRepo: Repository<GiftModel>,
  ) {}
  async getGift(id: number): Promise<GiftModel> {
    const gift = await this.giftRepo.findOne({ where: { id } });
    if (!gift) throw new NotFoundException('Cannot find gift.');

    return gift;
  }
  async getState(id: number): Promise<ResGetState> {
    const gift = await this.getGift(id);
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NETWORK_RPC || MockGiftModel.network,
    );
    const escrow = new ethers.Contract(gift.contract, ESCROW_ABI, provider);

    const code = Number(await escrow.escrowStatus());
    return { state: stateCode[code] };
  }
}
