import { Injectable } from '@nestjs/common';
import { DataService } from 'src/common/data/data.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { FindOptionsOrderValue, Repository } from 'typeorm';
import { ResGetSellerProducts } from './dto/res-get-seller-products.dto';
import { State } from 'src/__base-code__/enum/state.enum';
import { GiftModel } from 'src/__base-code__/entity/gift.entity';
import { ResFulfilledGifts } from './dto/res-fulfilled-gifts.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(ProductModel)
    private readonly productRepo: Repository<ProductModel>,
    @InjectRepository(GiftModel)
    private readonly giftRepo: Repository<GiftModel>,
    private readonly dataService: DataService,
  ) {}
  async getSellerProducts(
    seller: string,
    page: number,
    order: FindOptionsOrderValue,
  ): Promise<ResGetSellerProducts> {
    const take = 3;
    const skip = take * (page - 1);
    const findAndCount = await this.productRepo.findAndCount({
      where: { seller },
      take,
      skip,
      order: { id: order },
    });

    const { array: products, totalPages } = this.dataService.pagination(
      findAndCount,
      take,
    );

    return { products, totalPages };
  }

  async fulfilledGifts(
    seller: string,
    page: number,
    order: FindOptionsOrderValue,
  ): Promise<ResFulfilledGifts> {
    const take = 3;
    const skip = take * (page - 1);
    const findAndCount = await this.giftRepo.findAndCount({
      where: { seller, state: State.FULFILLED },
      take,
      skip,
      order: { updatedAt: order },
    });

    const { array: gifts, totalPages } = this.dataService.pagination(
      findAndCount,
      take,
    );

    return { gifts, totalPages };
  }
}
