import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { Transaction } from './entity';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      user: this.configService.get('DB_USERNAME'),
      host: this.configService.get('DB_HOST'),
      database: this.configService.get('DB_DATABASE'),
      password: this.configService.get('DB_PASSWORD'),
      port: +this.configService.get('DB_PORT'),
    });
  }

  async getPendingTransactions() {
    const query = 'SELECT * FROM transactions WHERE status = $1';
    const values = ['pending'];
    try {
      const res = await this.pool.query(query, values);
      return res.rows;
    } catch (err) {
      console.error('Error executing query', err.stack);
      return [];
    }
  }

  async updateTransactionStatus(transactionIds, newStatus) {
    const query = `UPDATE transactions SET status = $1 WHERE id = ANY($2::int[])`;
    try {
      await this.pool.query(query, [newStatus, transactionIds]);
      console.log('Transaction status updated successfully');
    } catch (err) {
      console.error('Error executing query', err.stack);
    }
  }

  // 이벤트 데이터를 저장하는 함수 추가
  async saveEscrowEvent(eventData: any): Promise<void> {
    const query =
      'INSERT INTO escrow_events(event_type, market, data) VALUES($1, $2, $3)';
    const values = [
      eventData.eventType,
      eventData.market,
      JSON.stringify(eventData.data),
    ];

    try {
      await this.pool.query(query, values);
      console.log('Escrow event data saved successfully');
    } catch (err) {
      console.error('Error executing query', err.stack);
    }
  }
}
