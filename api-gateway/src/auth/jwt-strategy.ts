import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RabbitMQClient } from '@RMQClient/rabbit-mq-client';
import { JWTPayload } from './jwt-payload';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly clientProxyRMQ: RabbitMQClient) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    });
  }

  private clientAuth = this.clientProxyRMQ.getAuthInstance();

  async validate(payload: JWTPayload) {
    const { id } = payload;

    const user$ = this.clientAuth.send('getByID', id);
    const user = await lastValueFrom(user$);

    return user;
  }
}
