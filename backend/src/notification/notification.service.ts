import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';

@Injectable()
export class NotificationService {
  private wallet: ethers.Wallet;
  private provider: ethers.providers.JsonRpcProvider;
  private notifications: any[] = [];

  constructor(private configService: ConfigService) {
    this.provider = new ethers.providers.JsonRpcProvider(
      this.configService.get<string>('NETWORK_RPC'),
    );
    this.wallet = new ethers.Wallet(
      this.configService.get<string>('MARKET_PRIVATE_KEY'),
      this.provider,
    );
  }

  // 알림 전송 함수
  async sendNotification(recipients: string, giftTitle: string) {
    const market = await PushAPI.initialize(this.wallet, {
      env: CONSTANTS.ENV.STAGING,
    });
    try {
      const notificationResult = await market.channel.send([recipients], {
        notification: {
          title: '기프트 사용완료',
          body: `${giftTitle} 기프트가 사용되었습니다.`,
        },
      });
      const parsedData = JSON.parse(notificationResult.config.data);
      const identityStr = parsedData.identity.substring(2);
      const parsedIdentity = JSON.parse(identityStr);

      const notificationData = {
        title: parsedIdentity.notification.title,
        body: parsedIdentity.notification.body,
        source: parsedData.source,
      };
      console.log('알림 전송에 성공했습니다:', notificationData);
      this.notifications.push(notificationData);
    } catch (error) {
      console.error('알림 전송에 실패했습니다:', error);
    }
  }

  // 알림 데이터 조회 함수
  getNotifications(): any[] {
    return this.notifications;
  }

  // 메시지 서명 함수
  async signMessage(message: string): Promise<string> {
    const messageHash = ethers.utils.id(message);
    const flatSig = await this.wallet.signMessage(
      ethers.utils.arrayify(messageHash),
    );
    return flatSig;
  }
}
