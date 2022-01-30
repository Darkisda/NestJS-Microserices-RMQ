import { Injectable } from '@nestjs/common';
import { CreateTaskDTO } from '@dtos/create-task.dto';
import { TaskRepository } from '@repositories/task.repository';
import { UpdateTaskDTO } from '@dtos/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  async getAll(user_id: string) {
    return await this.repository.getAll(user_id);
  }

  async getByID(id: string) {
    return await this.repository.getByID(id);
  }

  async create(createTaskDTO: CreateTaskDTO) {
    return await this.repository.create(createTaskDTO);
  }

  async update(id: string, updateTaskDTO: UpdateTaskDTO) {
    return await this.repository.update(id, updateTaskDTO);
  }

  async delete(id: string) {
    return await this.repository.delete(id);
  }

  async closeTask(id: string) {
    return await this.repository.closeOpenTask(id);
  }
}
