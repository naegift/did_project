import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import * as fs from 'fs';

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

    const abiPath = this.configService.get<string>('ABI_PATH');
    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');

    this.contract = new ethers.Contract(contractAddress, abi, wallet);

    this.setupEventListeners();
  }

  private setupNaegiftEscrowEventListeners() {
    const escrowContract = new ethers.Contract(
      this.configService.get<string>('NAEGIFT_ESCROW_CONTRACT_ADDRESS'),
      ESCROW_ABI,
      this.provider,
    );

    escrowContract.on('FulfillmentConfirmed', async (market, event) => {
      // 여기에 데이터베이스에 저장하는 로직을 구현합니다.
    });

    escrowContract.on('ProductUsedConfirmed', async (receiver, event) => {
      // 여기에 데이터베이스에 저장하는 로직을 구현합니다.
    });

    escrowContract.on(
      'FundsDistributed',
      async (market, marketShare, seller, sellerShare, event) => {
        // 여기에 데이터베이스에 저장하는 로직을 구현합니다.
      },
    );
  }

  async processBatchTransactions(transactions) {
    const tx = await this.contract.processBatchTransactions(
      transactions.map((t) => t.wallet_address),
      transactions.map((t) => t.signature),
      transactions.map((t) => t.message),
    );
    await tx.wait();
    console.log('거래가 성공적으로 처리되었습니다.');
  }
}
