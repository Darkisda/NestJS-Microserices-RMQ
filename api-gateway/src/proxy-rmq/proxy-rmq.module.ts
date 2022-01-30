import { Module } from '@nestjs/common';
import { RabbitMQClient } from './rabbit-mq-client';

@Module({
  providers: [RabbitMQClient],
  exports: [RabbitMQClient],
})
export class ProxyRMQModule {}
