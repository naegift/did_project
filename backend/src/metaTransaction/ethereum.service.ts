import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { META_ABI } from '../__base-code__/abi/meta.abi';

@Injectable()
export class EthereumService {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(private configService: ConfigService) {
    this.provider = new ethers.providers.JsonRpcProvider(
      this.configService.get<string>('NETWORK_RPC'),
    );
    this.wallet = new ethers.Wallet(
      this.configService.get<string>('MARKET_PRIVATE_KEY'),
      this.provider,
    );
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
