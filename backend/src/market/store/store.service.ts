import { Injectable } from '@nestjs/common';
import { ResGetProducts } from '../dto/res-get-products.dto';
import { DataService } from 'src/common/data/data.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(ProductModel)
    private readonly productRepo: Repository<ProductModel>,
    private readonly dataService: DataService,
  ) {}
  async getProducts(seller: string, page: number): Promise<ResGetProducts> {
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
