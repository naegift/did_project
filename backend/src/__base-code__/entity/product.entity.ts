import { Column, Entity } from 'typeorm';
import { BaseModel } from './base.entity';

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
}
