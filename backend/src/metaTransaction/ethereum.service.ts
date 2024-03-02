import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { META_ABI } from '../__base-code__/abi/meta.abi';
import { ESCROW_ABI } from '../__base-code__/abi/escrow.abi';

@Injectable()
export class EthereumService {
  private contract: ethers.Contract;
  private databaseService: DatabaseService;

  constructor(private configService: ConfigService) {
    const provider = new ethers.providers.JsonRpcProvider(
      this.configService.get<string>('NETWORK_RPC'),
    );
    const wallet = new ethers.Wallet(
      this.configService.get<string>('PRIVATE_KEY'),
      provider,
    );

    const abi = ESCROW_ABI;
    const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');

    this.contract = new ethers.Contract(contractAddress, abi, wallet);

    this.setupEventListeners();
  }

  private setupEventListeners() {
    // 이벤트 리스너 설정
    this.contract.on('FulfillmentConfirmed', async (market, event) => {
      await this.databaseService.saveTransactionData({
        walletAddress: market,
        message: 'FulfillmentConfirmed',
        signature: '',
      });
    });

    this.contract.on('ProductUsedConfirmed', async (receiver, event) => {
      await this.databaseService.saveTransactionData({
        walletAddress: receiver,
        message: 'ProductUsedConfirmed',
        signature: '',
      });
    });

    this.contract.on(
      'FundsDistributed',
      async (market, marketShare, seller, sellerShare, event) => {
        await this.databaseService.saveTransactionData({
          walletAddress: market,
          message: 'FundsDistributed',
          signature: '',
        });
      },
    );
  }

  async processBatchTransactions(transactions) {
    const abi = META_ABI;

    const tx = await this.contract.processBatchTransactions(
      transactions.map((t) => t.wallet_address),
      transactions.map((t) => t.signature),
      transactions.map((t) => t.message),
    );
    await tx.wait();
    console.log('거래가 성공적으로 처리되었습니다.');
  }
}
