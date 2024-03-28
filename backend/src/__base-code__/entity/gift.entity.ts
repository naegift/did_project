import { Column, Entity, UpdateDateColumn } from 'typeorm';
import { ProductModel } from './product.entity';
import { State } from '../enum/state.enum';

@Entity()
export class GiftModel extends ProductModel {
  @Column()
  uuid: string;

  @Column()
  buyer: string;

  @Column()
  receiver: string;

  @Column()
  state: State;

  @UpdateDateColumn()
  updatedAt: Date;
}
