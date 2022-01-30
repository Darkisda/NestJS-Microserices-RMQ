import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDTO } from '@dtos/create-task.dto';
import { Task, TaskType } from '@entities/task';
import { UpdateTaskDTO } from '@dtos/update-task.dto';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectModel(Task.name) private readonly model: Model<TaskType>,
  ) {}

  async getAll(user_id: string) {
    return await this.model.find().where({ user_id });
  }

  async getByID(id: string) {
    return await this.model.findById(id);
  }

  async create(createTaskDTO: CreateTaskDTO) {
    const { content, title, user_id } = createTaskDTO;

    const task = await this.model.create({
      title,
      content,
      user_id,
    });

    await task.save();

    return task;
  }

  async update(id: string, updateTaskDTO: UpdateTaskDTO) {
    const { content, title } = updateTaskDTO;

    const task = await this.model.findByIdAndUpdate(id, {
      content,
      title,
    });

    await task.save();

    return task;
  }

  async delete(id: string) {
    const task = await this.model.findByIdAndDelete(id);

    return task;
  }

  async closeOpenTask(id: string) {
    const task = await this.model.findByIdAndUpdate(id, { open: false });

    return task;
  }
}
