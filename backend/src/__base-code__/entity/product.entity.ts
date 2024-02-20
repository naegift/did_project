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
  price: number;

  @Column()
  seller: string;

  @OneToMany(() => GiftModel, (gift) => gift.product)
  gifts: Promise<GiftModel[]>;
}
