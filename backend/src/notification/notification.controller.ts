import { Body, Controller, Post } from '@nestjs/common';
import { EthereumService } from './ethereum.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private ethereumService: EthereumService) {}

  @Post('send')
  async sendNotification(@Body() body: any): Promise<void> {
    const { recipients } = body;
    await this.ethereumService.sendNotification(recipients);
  }
}
