import { Body, Controller, Post, Get } from '@nestjs/common';
import { EthereumService } from './ethereum.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private ethereumService: EthereumService) {}

  @Post('send')
  async sendNotification(@Body() body: any): Promise<void> {
    const { recipients } = body;
    console.log('알림을 보낼 대상:', recipients);
    await this.ethereumService.sendNotification(recipients);
  }

  @Get()
  async getNotifications(): Promise<any[]> {
    const result = this.ethereumService.getNotifications();
    return result;
  }
}
