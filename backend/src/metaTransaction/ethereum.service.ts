import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { META_ABI } from '../__base-code__/abi/meta.abi';
import { ESCROW_ABI } from '../__base-code__/abi/escrow.abi';
import { FACTORY_ABI } from '../__base-code__/abi/factory.abi';

@Injectable()
export class EthereumService {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private proxyContract: ethers.Contract;

  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {
    this.provider = new ethers.providers.JsonRpcProvider(
      this.configService.get<string>('NETWORK_RPC'),
    );
    this.wallet = new ethers.Wallet(
      this.configService.get<string>('MARKET_PRIVATE_KEY'),
      this.provider,
    );

    // 프록시 컨트랙트를 초기화합니다.
    const proxyContractAddress =
      this.configService.get<string>('PROXY_CONTRACT');
    this.proxyContract = new ethers.Contract(
      proxyContractAddress,
      FACTORY_ABI,
      this.wallet,
    );

    this.setupProxyEventListeners();
  }

  private setupProxyEventListeners() {
    this.proxyContract.on('EscrowCreated', async (escrowAddress, uuid) => {
      console.log(
        `새로운 에스크로 컨트랙트가 생성되었습니다: ${escrowAddress}`,
      );
      // 새로 생성된 에스크로 컨트랙트의 주소를 사용하여 이벤트 리스너를 설정합니다.
      this.setupEscrowEventListeners(escrowAddress);
    });
  }

  private setupEscrowEventListeners(escrowAddress: string) {
    const escrowContract = new ethers.Contract(
      escrowAddress,
      ESCROW_ABI,
      this.wallet,
    );

    escrowContract.on('FulfillmentConfirmed', async (receiver, event) => {
      await this.databaseService.saveTransactionData({
        walletAddress: receiver,
        message: 'FulfillmentConfirmed',
        signature: '',
      });
    });

    escrowContract.on('ProductUsedConfirmed', async (market, event) => {
      await this.databaseService.saveTransactionData({
        walletAddress: market,
        message: 'ProductUsedConfirmed',
        signature: '',
      });
    });

    escrowContract.on('FundsDistributed', async (market) => {
      await this.databaseService.saveTransactionData({
        walletAddress: market,
        message: 'FundsDistributed',
        signature: '',
      });
    });
  }

  async processBatchTransactions(transactions) {
    const metaContract = new ethers.Contract(
      this.configService.get<string>('META_CONTRACT_ADDRESS'),
      META_ABI,
      this.wallet,
    );
    const tx = await metaContract.processBatchTransactions(
      transactions.map((t) => t.wallet_address),
      transactions.map((t) => t.signature),
      transactions.map((t) => t.message),
    );
    await tx.wait();
    console.log('거래가 성공적으로 처리되었습니다.');
  }
}
