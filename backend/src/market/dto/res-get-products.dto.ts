import { ProductModel } from 'src/__base-code__/entity/product.entity';

export class ResGetProducts {
  products: ProductModel[];
  productsCount: number;
  nextPage: number | boolean;
}
