import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductModel {
  @PrimaryGeneratedColumn()
  id: number;

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
