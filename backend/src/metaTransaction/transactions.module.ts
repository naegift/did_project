import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsTask } from './transactions.task';
import { DatabaseService } from './database.service';
import { EthereumService } from './ethereum.service';
import { TransactionModel } from '../__base-code__/entity/transaction.entity'; // TransactionModel의 정확한 경로를 확인하고 수정하세요.

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([TransactionModel]),
  ],
  providers: [TransactionsTask, DatabaseService, EthereumService],
})
export class TransactionsModule {}
