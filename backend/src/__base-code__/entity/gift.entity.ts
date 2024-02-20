import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from './base.entity';
import { ProductModel } from './product.entity';

@Entity()
export class GiftModel extends BaseModel {
  @Column()
  contract: string;

  @Column()
  buyer: string;

  @Column()
  receiver: string;

  @ManyToOne(() => ProductModel, (product) => product.gifts)
  product: Promise<ProductModel>;
}
