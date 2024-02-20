import { GiftService } from 'src/account/gift/gift.service';
import { ImageService } from 'src/common/image/image.service';
import { MarketService } from 'src/market/market.service';
import { ProductService } from 'src/market/product/product.service';
import { StoreService } from 'src/market/store/store.service';

export const providers = [
  GiftService,
  ImageService,
  MarketService,
  ProductService,
  StoreService,
];
