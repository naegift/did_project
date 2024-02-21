import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from './base.entity';
import { GiftModel } from './gift.entity';

@Entity()
export class ProductModel extends BaseModel {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  image: string;

  @Column()
  price: string;

  @Column()
  seller: string;

  @Column({ default: '0x4c2d2742A153503AF6210c1D9455E9Ff64FFb89d' })
  market: string;

  @OneToMany(() => GiftModel, (gift) => gift.product)
  gifts: Promise<GiftModel[]>;
}
