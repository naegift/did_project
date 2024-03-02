import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransactionModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;

  @Column()
  message: string;

  @Column()
  signature: string;

  @Column({ default: 'pending' })
  status: string;
}
