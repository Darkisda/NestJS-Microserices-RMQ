import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { RabbitMQClient } from '@RMQClient/rabbit-mq-client';
import { AuthInterceptor } from '@interceptors/auth.interceptor';
import { SignInDTO } from './dto/signin.dto';
import { SignUpDTO } from './dto/signup.dto';

@Controller('/auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(private readonly clientProxyRMQ: RabbitMQClient) {}

  private clientAuth = this.clientProxyRMQ.getAuthInstance();

  @Get()
  async getUsers() {
    try {
      const response$ = this.clientAuth.send('getAll', '');
      const response = await lastValueFrom(response$);

      return response;
    } catch (error) {
      this.logger.error(error);

      if (error.err.cause.code === 'ECONNREFUSED') {
        throw new BadGatewayException(
          'Oops! We have one connection problem. Sorry for that',
        );
      }
    }
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    try {
      const response$ = this.clientAuth.send('getByID', id);
      const response = await lastValueFrom(response$);

      return response;
    } catch (error) {
      this.logger.error(error);

      if (error.err.cause.code === 'ECONNREFUSED') {
        throw new BadGatewayException(
          'Oops! We have one connection problem. Sorry for that',
        );
      }
    }
  }

  @Post('/signup')
  async signUp(@Body() signUpDTO: SignUpDTO) {
    try {
      const response$ = this.clientAuth.emit('signup', signUpDTO);
      const response = await lastValueFrom(response$);

      this.logger.debug(response);
    } catch (error) {
      this.logger.error(error);

      if (error.err.cause.code === 'ECONNREFUSED') {
        throw new BadGatewayException(
          'Oops! We have one connection problem. Sorry for that',
        );
      }
    }
  }

  @Post('/signin')
  @UseInterceptors(new AuthInterceptor())
  async signIn(@Body() signInDTO: SignInDTO) {
    try {
      const response$ = this.clientAuth.send('signin', signInDTO);
      const accessToken = await lastValueFrom(response$);

      return accessToken;
    } catch (error) {
      this.logger.error(error);

      if (error.err.cause.code === 'ECONNREFUSED') {
        throw new BadGatewayException(
          'Oops! We have one connection problem. Sorry for that',
        );
      }
    }
  }
}
