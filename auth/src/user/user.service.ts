import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { SignUpDTO } from '@dtos/signup.dto';
import { UserRepository } from '@repositories/user.respository';
import { SignInDTO } from '@dtos/signin.dto';
import { JWTPayload } from './jwtpayload';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly repository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getByID(id: string) {
    return await this.repository.getById(id);
  }

  async getAll() {
    return await this.repository.getAll();
  }

  async signIn(signInDTO: SignInDTO) {
    const { email, password } = signInDTO;

    const user = await this.repository.validate(email, password);

    if (!user) {
      throw new RpcException('Credênciais Inválidas');
    }
    const payload: JWTPayload = {
      id: user._id,
    };

    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }

  async signUp(signUpDTO: SignUpDTO) {
    return await this.repository.signup(signUpDTO);
  }
}
