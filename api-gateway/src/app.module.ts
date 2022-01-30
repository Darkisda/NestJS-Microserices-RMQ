import { Module } from '@nestjs/common';
import { ProxyRMQModule } from './proxy-rmq/proxy-rmq.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    ProxyRMQModule,
    AuthModule,
    TaskModule,
  ],
})
export class AppModule {}
