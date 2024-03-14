import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service'; // 주석 해제

@Module({
  providers: [NotificationService], // providers 배열에 NotificationService 추가
  exports: [NotificationService], // exports 배열에 NotificationService 추가
})
export class NotificationModule {}
