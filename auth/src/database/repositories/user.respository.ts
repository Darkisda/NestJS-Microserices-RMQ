import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { genSalt, hash } from 'bcrypt';
import { SignUpDTO } from '../../dtos/signup.dto';
import { User, UserType } from '../entities/user';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserType>,
  ) {}

  async getAll() {
    return await this.model.find().select('-password').select('-salt');
  }

  async getById(id: string) {
    const user = await this.model.findById(id);

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.model.findOne({ email });

    return user;
  }

  async signup(signUpDTO: SignUpDTO) {
    const { email, firstName, lastName, password } = signUpDTO;

    const salt = await genSalt();

    const user = await this.model.create({
      email,
      firstName,
      lastName,
      salt,
      password: await hash(password, salt),
    });

    await user.save();

    return user;
  }

  async validate(email: string, password: string) {
    const user = await this.model.findOne({ email });

    if (!user) {
      throw new RpcException('Usuário não encontrado');
    }

    const hashed = await hash(password, user.salt);

    if (hashed === user.password) {
      return user;
    } else {
      return null;
    }
  }
}
