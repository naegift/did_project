import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from './base.entity';
import { ProductModel } from './product.entity';
import { State } from '../enum/state.enum';

@Entity()
export class GiftModel extends BaseModel {
  @Column()
  contract: string;

  @Column()
  buyer: string;

  @Column()
  receiver: string;

  @Column()
  state: State;

  @ManyToOne(() => ProductModel, (product) => product.gifts)
  product: Promise<ProductModel>;
}
