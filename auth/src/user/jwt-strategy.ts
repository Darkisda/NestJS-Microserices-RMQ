import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JWTPayload } from './jwtpayload';
import { UserService } from '@user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
    });
  }

  async validate(payload: JWTPayload) {
    const { id } = payload;

    const user = await this.userService.getByID(id);

    if (user) {
      return user;
    } else {
      return null;
    }
  }
}
