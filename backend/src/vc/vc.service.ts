import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VcModel } from 'src/__base-code__/entity/vc.entity';
import { Repository } from 'typeorm';
import { CreateVcDto } from './dto/create-vc.dto';

@Injectable()
export class VcService {
  constructor(
    @InjectRepository(VcModel)
    private readonly productRepo: Repository<VcModel>,
  ) {}

  async findOne(id: number) {
    return this.productRepo.findOne({ where: { id: +id } });
  }

  async create(requestCreate: CreateVcDto) {
    const { credential } = requestCreate;
    return this.productRepo.save({ credential });
  }
}
