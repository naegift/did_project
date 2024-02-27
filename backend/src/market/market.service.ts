import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { DataService } from 'src/common/data/data.service';
import { Repository } from 'typeorm';
import { ResGetProducts } from './dto/res-get-products.dto';
import { Order } from 'src/__base-code__/enum/order.enum';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(ProductModel)
    private readonly productRepo: Repository<ProductModel>,
    private readonly dataService: DataService,
  ) {}

  async getProducts(page: number, order: Order): Promise<ResGetProducts> {
    const take = 5;
    const skip = take * (page - 1);
    const findAndCount = await this.productRepo.findAndCount({
      order: { id: order },
      take,
      skip,
    });

    const { array: products, totalPages } = this.dataService.pagination(
      findAndCount,
      take,
    );

    return { products, totalPages };
  }
}
