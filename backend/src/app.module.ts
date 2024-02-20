import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { MarketModule } from './market/market.module';
import { CommonModule } from './common/common.module';
import { ProductModel } from './__base-code__/entity/product.entity';
import { GiftModel } from './__base-code__/entity/gift.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOSTNAME,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [ProductModel, GiftModel],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: `${process.cwd()}/public`,
      serveRoot: '/public',
    }),
    AccountModule,
    MarketModule,
    CommonModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
