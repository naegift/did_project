import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransactionModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 42 })
  wallet_address: string;

  @Column('text')
  message: string;

  @Column({ length: 132 })
  signature: string;

  @Column({ default: 'pending', length: 255 })
  status: string;
}
