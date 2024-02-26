import { Column, Entity } from 'typeorm';
import { BaseModel } from './base.entity';

@Entity()
export class VcModel extends BaseModel {
  @Column({ nullable: false })
  credential: string;
}
