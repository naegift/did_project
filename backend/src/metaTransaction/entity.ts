import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;

  @Column()
  message: string;

  @Column()
  signature: string;

  // 기타 필요한 컬럼들...
}
