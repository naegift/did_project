import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { TransactionModel } from '../__base-code__/entity/transaction.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(TransactionModel)
    private readonly transactionRepository: Repository<TransactionModel>,
  ) {}

  async getTransactionsForStatusUpdate(): Promise<TransactionModel[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return this.transactionRepository.find({
      where: {
        status: 'fulfilled',
        // statusUpdatedAt: LessThan(oneWeekAgo.toISOString()),
      },
    });
  }

  async updateTransactionStatusToExecuted(
    transactionIds: number[],
  ): Promise<void> {
    try {
      await this.transactionRepository
        .createQueryBuilder()
        .update(TransactionModel)
        .set({ status: 'EXECUTED', statusUpdatedAt: () => 'CURRENT_TIMESTAMP' })
        .where('id IN (:...ids)', { ids: transactionIds })
        .execute();
    } catch (error) {
      console.error('Error updating transaction status to EXECUTED:', error);
      throw error;
    }
  }

  async updateFulfilledTransactions(): Promise<void> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
      await this.transactionRepository
        .createQueryBuilder()
        .update(TransactionModel)
        .set({ status: 'EXECUTED' })
        .where('status = :status', { status: 'fulfilled' })
        .andWhere('statusUpdatedAt <= :date', { date: oneWeekAgo })
        .execute();
    } catch (error) {
      console.error('Error updating fulfilled transactions:', error);
      throw error;
    }
  }
}
