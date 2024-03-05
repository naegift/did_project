import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from './database.service';
import { EthereumService } from './ethereum.service';

@Injectable()
export class TransactionsTask {
  constructor(
    private databaseService: DatabaseService,
    private ethereumService: EthereumService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    console.log('작업을 시작합니다...');
    const transactions = await this.databaseService.getPendingTransactions();

    if (transactions.length > 0) {
      try {
        console.log('처리할 트랜잭션:', transactions);
        await this.ethereumService.processBatchTransactions(transactions);
        await this.databaseService.updateTransactionStatus(
          transactions.map((t) => t.id),
          'processed',
        );
      } catch (error) {
        console.error('거래 처리 중 오류가 발생했습니다:', error);
      }
    } else {
      console.log('처리할 거래가 없습니다.');
    }
  }
}
