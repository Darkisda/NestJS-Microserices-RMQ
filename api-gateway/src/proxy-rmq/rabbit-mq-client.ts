import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMQClient {
  getAuthInstance() {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_URL}:${process.env.RMQ_PORT}`,
        ],
        queue: 'auth',
      },
    });
  }

  getTaskInstance() {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_URL}:${process.env.RMQ_PORT}`,
        ],
        queue: 'task',
      },
    });
  }
}
