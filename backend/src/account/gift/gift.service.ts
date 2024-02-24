import { Injectable, NotFoundException } from '@nestjs/common';
import { ResGetState } from './dto/res-get-state.dto';
import { ethers } from 'ethers';
import { ESCROW_ABI } from 'src/__base-code__/abi/escrow.abi';
import { stateCode } from 'src/__base-code__/enum/state.enum';
import { GiftModel } from 'src/__base-code__/entity/gift.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';
import { ResGetGifts } from './dto/res-get-gifts.dto';
import { DataService } from 'src/common/data/data.service';

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(GiftModel)
    private readonly giftRepo: Repository<GiftModel>,
    private readonly dataService: DataService,
  ) {}
  async getGift(id: number): Promise<GiftModel> {
    const gift = await this.giftRepo.findOne({ where: { id } });
    if (!gift) throw new NotFoundException('Cannot find gift.');

    return gift;
  }

  async getGifts(receiver: string, page: number): Promise<ResGetGifts> {
    const take = 3;
    const skip = take * (page - 1);
    const findAndCount = await this.giftRepo.findAndCount({
      where: { receiver },
      order: { id: 'desc' },
      take,
      skip,
    });

    const newArray = await Promise.all(
      findAndCount[0].map(async (gift) => {
        const product = await gift.product;
        const newGift = {
          id: gift.id,
          contract: gift.contract,
          buyer: gift.buyer,
          receiver: gift.receiver,
          state: gift.state,

          productID: product.id,
          image: product.image,
          title: product.title,
          content: product.content,
          seller: product.seller,
          price: product.price,
        };
        return newGift;
      }),
    );
    const newFindAndCount: [any[], number] = [newArray, findAndCount[1]];

    const {
      array: gifts,
      arrayCount: giftsCount,
      nextPage,
    } = this.dataService.pagination(newFindAndCount, take, skip, page);

    return { gifts, giftsCount, nextPage };
  }

  async getState(id: number): Promise<ResGetState> {
    const gift = await this.getGift(id);
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NETWORK_RPC || MockGiftModel.network,
    );
    const escrow = new ethers.Contract(gift.contract, ESCROW_ABI, provider);

    const code = Number(await escrow.escrowStatus());
    await this.giftRepo.update(id, { state: stateCode[code] });

    return { state: stateCode[code] };
  }
}
