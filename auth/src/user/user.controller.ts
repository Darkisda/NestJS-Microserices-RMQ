import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Controller, Logger } from '@nestjs/common';
import { SignUpDTO } from '@dtos/signup.dto';
import { UserService } from './user.service';
import { SignInDTO } from '@dtos/signin.dto';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);
  private readonly ackErrors = ['E11000'];

  constructor(private readonly service: UserService) {}

  @MessagePattern('getAll')
  async getAll() {
    return await this.service.getAll();
  }

  @MessagePattern('getByID')
  async getById(@Payload() id: string) {
    return await this.service.getByID(id);
  }

  @EventPattern('signup')
  async signup(@Payload() signupDTO: SignUpDTO, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.service.signUp(signupDTO);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);

      const filterAckErrors = this.ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckErrors) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('signin')
  async signin(@Payload() signInDTO: SignInDTO, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const token = await this.service.signIn(signInDTO);
      await channel.ack(originalMsg);

      return token;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);

      const filterAckErrors = this.ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckErrors) {
        await channel.ack(originalMsg);
      }

      return error;
    }
  }
}
