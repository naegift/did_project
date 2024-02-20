import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { DataService } from 'src/common/data/data.service';
import { Repository } from 'typeorm';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(ProductModel)
    private readonly productRepo: Repository<ProductModel>,
    private readonly dataService: DataService,
  ) {}

  async getProducts(page: number) {
    const take = 3;
    const skip = take * (page - 1);
    const findAndCount = await this.productRepo.findAndCount({
      order: { id: 'desc' },
      take,
      skip,
    });

    const {
      array: products,
      arrayCount: productsCount,
      nextPage,
    } = this.dataService.pagination(findAndCount, take, skip, page);

    return { products, productsCount, nextPage };
  }
}
