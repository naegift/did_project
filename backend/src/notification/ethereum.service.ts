import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';

// 객체 구조
// {
//   channel: {
//     send: function(recipients, message) { ... }
//   },
//   notification: {
//     subscribe: function(channelAddress) { ... },
//     subscriptions: function() { ... }
//   }
// }

@Injectable()
export class EthereumService {
  private wallet: ethers.Wallet;
  private provider: ethers.providers.JsonRpcProvider;

  constructor(private configService: ConfigService) {
    this.provider = new ethers.providers.JsonRpcProvider(
      this.configService.get<string>('NETWORK_RPC'),
    );
    this.wallet = new ethers.Wallet(
      this.configService.get<string>('MARKET_PRIVATE_KEY'),
      this.provider,
    );
  }

  async sendNotification(recipients) {
    const market = await PushAPI.initialize(this.wallet, {
      env: CONSTANTS.ENV.STAGING,
    });
    try {
      const notificationResult = await market.channel.send([recipients], {
        notification: {
          title: '기프트 사용완료',
          body: '1번 기프트가 사용되었습니다.',
        },
      });
      console.log('전송된 메시지:', notificationResult);
    } catch (error) {
      console.error('알림 전송에 실패했습니다:', error);
    }
  }

  // 메시지 서명 함수
  async signMessage(message: string): Promise<string> {
    const messageHash = ethers.utils.id(message); // 메시지의 해시 생성
    const flatSig = await this.wallet.signMessage(
      ethers.utils.arrayify(messageHash),
    ); // 메시지 해시에 대한 서명 생성
    return flatSig;
  }
}
