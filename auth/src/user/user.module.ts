import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from '@entities/user';
import { UserRepository } from '@repositories/user.respository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from './jwt-strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [UserController],
  providers: [JwtStrategy, UserService, UserRepository],
})
export class UserModule {}
