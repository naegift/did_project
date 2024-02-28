import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TransactionsTask } from './transactions.task';
import { DatabaseService } from './database.service';
import { EthereumService } from './ethereum.service';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule.forRoot()],
  providers: [TransactionsTask, DatabaseService, EthereumService],
})
export class TransactionsModule {}
