import { Module } from '@nestjs/common';
import { NotificationsController } from './notification.controller';
import { NotificationService } from './notification.service'; // 주석 해제

@Module({
  controllers: [NotificationsController], // controllers 배열에 NotificationsController 추가
  providers: [NotificationService], // providers 배열에 NotificationService 추가
  exports: [NotificationService], // exports 배열에 NotificationService 추가
})
export class NotificationModule {}
