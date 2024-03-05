import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { TransactionModel } from '../__base-code__/entity/transaction.entity';

@Injectable()
export class DatabaseService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(TransactionModel)
    private transactionRepository: Repository<TransactionModel>,
  ) {}

  async getPendingTransactions(): Promise<TransactionModel[]> {
    return this.transactionRepository.find({
      where: { status: 'pending' },
    });
  }

  async updateTransactionStatus(
    transactionIds: number[],
    newStatus: string,
  ): Promise<void> {
    await this.transactionRepository
      .createQueryBuilder()
      .update(TransactionModel)
      .set({ status: newStatus })
      .where('id IN (:...ids)', { ids: transactionIds })
      .execute();
  }

  async saveTransactionData(data: {
    walletAddress: string;
    message: string;
    signature: string;
  }): Promise<void> {
    const transaction = this.transactionRepository.create(data);
    await this.transactionRepository.save(transaction);
  }
}
