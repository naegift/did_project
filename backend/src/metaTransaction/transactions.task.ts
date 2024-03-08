import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from './database.service';

@Injectable()
export class TransactionsTask {
  constructor(private databaseService: DatabaseService) {}

  @Cron(CronExpression.EVERY_WEEK)
  async handleCron() {
    console.log('상태 업데이트 작업을 시작합니다...');
    const transactions =
      await this.databaseService.getTransactionsForStatusUpdate();

    if (transactions.length > 0) {
      try {
        console.log('상태를 업데이트할 트랜잭션:', transactions);
        await this.databaseService.updateTransactionStatusToExecuted(
          transactions.map((t) => t.id),
        );
      } catch (error) {
        console.error('상태 업데이트 중 오류가 발생했습니다:', error);
      }
    } else {
      console.log('상태를 업데이트할 트랜잭션이 없습니다.');
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateFulfilledTransactions() {
    console.log('fulfilled 상태의 트랜잭션을 확인합니다...');
    await this.databaseService.updateFulfilledTransactions();
  }
}
