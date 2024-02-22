import { Injectable } from '@nestjs/common';
import { DataService } from 'src/common/data/data.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { Repository } from 'typeorm';
import { ResGetSellerProducts } from './dto/res-get-seller-products.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(ProductModel)
    private readonly productRepo: Repository<ProductModel>,
    private readonly dataService: DataService,
  ) {}
  async getSellerProducts(
    seller: string,
    page: number,
  ): Promise<ResGetSellerProducts> {
    const take = 3;
    const skip = take * (page - 1);
    const findAndCount = await this.productRepo.findAndCount({
      where: { seller },
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
