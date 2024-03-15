import { Body, Controller, Post, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private ethereumService: NotificationService) {}

  @Post('send')
  async sendNotification(@Body() body: any): Promise<void> {
    const { recipients, giftTitle } = body;
    console.log('알림을 보낼 대상:', recipients);
    await this.ethereumService.sendNotification(recipients, giftTitle);
  }

  @Get()
  async getNotifications(): Promise<any[]> {
    const result = this.ethereumService.getNotifications();
    return result;
  }
}
