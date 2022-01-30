import { CreateTaskDTO } from '@dtos/create-task.dto';
import { UpdateTaskRMQDTO } from '@dtos/update-task-rmq';
import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);
  private readonly ackErrors = ['E11000'];

  constructor(private readonly service: TaskService) {}

  @MessagePattern('getAll')
  async getAll(@Payload() user_id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const task = await this.service.getAll(user_id);
      await channel.ack(originalMsg);

      return task;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('getByID')
  async getByID(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const task = await this.service.getByID(id);
      await channel.ack(originalMsg);

      return task;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('create')
  async create(
    @Payload() createTaskDTO: CreateTaskDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const task = await this.service.create(createTaskDTO);
      await channel.ack(originalMsg);

      return task;
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

  @EventPattern('update')
  async update(
    @Payload() updateTaskRMQDTO: UpdateTaskRMQDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { id, content, title } = updateTaskRMQDTO;

      const task = await this.service.update(id, { content, title });
      await channel.ack(originalMsg);

      return task;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('delete')
  async delete(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.debug(id);

    try {
      const task = await this.service.delete(id);
      await channel.ack(originalMsg);

      return task;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('close')
  async close(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const task = await this.service.closeTask(id);
      await channel.ack(originalMsg);

      return task;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);
      await channel.ack(originalMsg);
    }
  }
}
