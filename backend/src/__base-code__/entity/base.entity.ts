import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;
}
