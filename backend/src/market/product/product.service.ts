import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReqPostProduct } from './dto/req-post-product.dto';
import { ResGetProduct } from './dto/res-get-product.dto';
import { ResPostProduct } from './dto/res-post-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { Repository } from 'typeorm';
import { ResGetState } from './dto/res-get-state.dto';
import { ethers } from 'ethers';
import { escrowABI } from './abi/escrow';
import { stateCode } from 'src/__base-code__/enum/state.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductModel)
    private readonly productRepo: Repository<ProductModel>,
  ) {}

  async postProduct(reqPostProduct: ReqPostProduct): Promise<ResPostProduct> {
    const { title, content, image, price, signature } = reqPostProduct;
    const data = JSON.stringify({ title, content, image, price });

    const seller = ethers.utils.verifyMessage(data, signature);

    const product = await this.productRepo.save({ ...reqPostProduct, seller });

    return { id: product.id };
  }

  async getProduct(id: number): Promise<ResGetProduct> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Cannot find product.');

    return { ...product };
  }

  async getState(contract: string): Promise<ResGetState> {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NETWORK_RPC || 'https://rpc.sepolia.org',
    );
    const escrow = new ethers.Contract(contract, escrowABI, provider);

    try {
      const code = Number(await escrow.getBalanceOfContract());
      return { state: stateCode[code] };
    } catch {
      throw new BadRequestException('Required escrow contract address.');
    }
  }
}
