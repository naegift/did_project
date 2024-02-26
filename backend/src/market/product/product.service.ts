import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ReqPostProduct } from './dto/req-post-product.dto';
import { ResGetProduct } from './dto/res-get-product.dto';
import { ResPostProduct } from './dto/res-post-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductModel } from 'src/__base-code__/entity/product.entity';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { ReqPayProduct } from './dto/req-pay-product.dto';
import { ResPayProduct } from './dto/res-pay-product.dto';
import { FACTORY_ABI } from 'src/__base-code__/abi/factory.abi';
import { GiftModel } from 'src/__base-code__/entity/gift.entity';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';
import { ImageService } from 'src/common/image/image.service';
import { ReqPutProduct } from './dto/req-put-product.dto';
import { ResPutProduct } from './dto/res-put-product.dto';
import { ReqDeleteProduct } from './dto/req-delete-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductModel)
    private readonly productRepo: Repository<ProductModel>,
    @InjectRepository(GiftModel)
    private readonly giftRepo: Repository<GiftModel>,
    private readonly imageService: ImageService,
  ) {}

  async postProduct(
    reqPostProduct: ReqPostProduct,
    file: Express.Multer.File,
  ): Promise<ResPostProduct> {
    const { title, content, price, signature } = reqPostProduct;
    const data = JSON.stringify({ title, content, price });

    const { link } = this.imageService.uploadImage(file);
    const seller = ethers.utils.verifyMessage(data, signature);

    const product = await this.productRepo.save({
      ...reqPostProduct,
      image: link,
      seller,
    });

    return { id: product.id };
  }

  async getProduct(id: number): Promise<ResGetProduct> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Cannot find product.');

    return product;
  }

  async putProduct(
    id: number,
    reqPutProduct: ReqPutProduct,
    file: Express.Multer.File,
  ): Promise<ResPutProduct> {
    const product = await this.getProduct(id);
    const { title, content, price, signature } = reqPutProduct;
    const data = JSON.stringify({ title, content, price });

    const seller = ethers.utils.verifyMessage(data, signature);
    if (seller !== product.seller) {
      throw new UnauthorizedException('Cannot update other sellers product.');
    }
    const { link } = this.imageService.uploadImage(file);

    await this.productRepo.save({
      ...reqPutProduct,
      image: link,
      seller,
    });

    return { id: product.id };
  }

  async deleteProduct(id: number, reqDeleteProduct: ReqDeleteProduct) {
    const product = await this.getProduct(id);
    const { signature } = reqDeleteProduct;
    const seller = ethers.utils.verifyMessage('{}', signature);
    if (seller !== product.seller) {
      throw new UnauthorizedException('Cannot delete other sellers product.');
    }

    await this.productRepo.delete(id);
  }

  async payProduct(
    id: number,
    reqPayProduct: ReqPayProduct,
  ): Promise<ResPayProduct> {
    try {
      const { uuid } = reqPayProduct;
      let newGift: GiftModel;

      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NETWORK_RPC || MockGiftModel.network,
      );
      const contract = new ethers.Contract(
        process.env.PROXY_CONTRACT || MockGiftModel.proxyAddress,
        FACTORY_ABI,
        provider,
      );

      contract.on('EscrowCreated', async (escrowAddress, escrowUUID) => {
        if (uuid === escrowUUID) {
          const product = await this.getProduct(id);
          newGift = await this.giftRepo.save({
            ...reqPayProduct,
            ...product,
            id: null,
            contract: escrowAddress,
          });
        }
      });

      if (!process.env.PROXY_CONTRACT) {
        contract.emit(
          'EscrowCreated',
          MockGiftModel.proxyAddress,
          MockGiftModel.uuid,
        );
      }

      const loopIdx = Number(!process.env.PROXY_CONTRACT) * 19;
      for (let i = loopIdx; i < 20; i++) {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        if (newGift?.id) {
          break;
        }
      }
      return { giftID: newGift.id };
    } catch (e) {
      throw new NotAcceptableException('Not enough values or gas.');
    }
  }
}
