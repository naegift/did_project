import { Module } from '@nestjs/common';
import { GiftModule } from './gift/gift.module';

@Module({
  controllers: [],
  providers: [],
  imports: [GiftModule],
})
export class AccountModule {}
