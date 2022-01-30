import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RabbitMQClient } from '@RMQClient/rabbit-mq-client';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt-strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [RabbitMQClient, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
