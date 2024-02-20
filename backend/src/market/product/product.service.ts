import { BadRequestException, Injectable } from '@nestjs/common';
import { ReqPostProduct } from './dto/req-post-product.dto';
import { ResGetProduct } from './dto/res-get-product.dto';
import { ResPostProduct } from './dto/res-post-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductModel)
    private readonly productRepo: Repository<ProductModel>,
  ) {}

  async getProduct(id: number): Promise<ResGetProduct> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new BadRequestException('Cannot find product.');

    return { ...product };
  }

  async postProduct(reqPostProduct: ReqPostProduct): Promise<ResPostProduct> {
    const product = await this.productRepo.save({ ...reqPostProduct });

    return { id: product.id };
  }
}
