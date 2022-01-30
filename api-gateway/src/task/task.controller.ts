import { GetUser } from '@auth/get-user.decorator';
import {
  BadGatewayException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { lastValueFrom } from 'rxjs';
import { RabbitMQClient } from '@RMQClient/rabbit-mq-client';
import { CreateTaskPayload } from './dto/create-task-rmq.dto';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskPayload } from './dto/update-task-rmq.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  private logger = new Logger(TaskController.name);

  constructor(private readonly clientProxyRMQ: RabbitMQClient) {}

  private clientTask = this.clientProxyRMQ.getTaskInstance();

  @Get()
  @UseGuards(AuthGuard())
  async getTasks(@GetUser() user) {
    try {
      const task$ = this.clientTask.send('getAll', user._id);
      const task = await lastValueFrom(task$);

      return task;
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
  @UseGuards(AuthGuard())
  async getByID(@Param('id') id: string) {
    try {
      const task$ = this.clientTask.send('getByID', id);
      const task = await lastValueFrom(task$);

      return task;
    } catch (error) {
      this.logger.error(error);

      if (error.err.cause.code === 'ECONNREFUSED') {
        throw new BadGatewayException(
          'Oops! We have one connection problem. Sorry for that',
        );
      }
    }
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() createTaskDTO: CreateTaskDTO, @GetUser() user) {
    try {
      const { content, title } = createTaskDTO;

      const createTask: CreateTaskPayload = {
        content,
        title,
        user_id: user._id,
      };

      const task$ = this.clientTask.emit('create', createTask);
      const task = await lastValueFrom(task$);

      return task;
    } catch (error) {
      this.logger.error(error);

      if (error.err.cause.code === 'ECONNREFUSED') {
        throw new BadGatewayException(
          'Oops! We have one connection problem. Sorry for that',
        );
      }
    }
  }

  @Put('/:id')
  @UseGuards(AuthGuard())
  async update(@Param('id') id: string, @Body() updateTaskDTO: UpdateTaskDTO) {
    try {
      const { content, title } = updateTaskDTO;

      const updateTask: UpdateTaskPayload = {
        content,
        title,
        id,
      };

      const task$ = this.clientTask.emit('update', updateTask);
      const task = await lastValueFrom(task$);

      return task;
    } catch (error) {
      this.logger.error(error);

      if (error.err.cause.code === 'ECONNREFUSED') {
        throw new BadGatewayException(
          'Oops! We have one connection problem. Sorry for that',
        );
      }
    }
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  async delete(@Param('id') id: string) {
    try {
      const task$ = this.clientTask.send('delete', id);
      const task = await lastValueFrom(task$);

      return task;
    } catch (error) {
      this.logger.error(error);

      if (error.err.cause.code === 'ECONNREFUSED') {
        throw new BadGatewayException(
          'Oops! We have one connection problem. Sorry for that',
        );
      }
    }
  }

  @Patch('/:id')
  @UseGuards(AuthGuard())
  async close(@Param('id') id: string) {
    try {
      const task$ = this.clientTask.send('close', id);
      const task = await lastValueFrom(task$);

      return task;
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
