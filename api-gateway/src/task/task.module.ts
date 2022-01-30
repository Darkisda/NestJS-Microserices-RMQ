import { Module } from '@nestjs/common';
import { RabbitMQClient } from '@RMQClient/rabbit-mq-client';
import { AuthModule } from '@auth/auth.module';
import { TaskController } from './task.controller';

@Module({
  imports: [AuthModule],
  controllers: [TaskController],
  providers: [RabbitMQClient],
})
export class TaskModule {}
