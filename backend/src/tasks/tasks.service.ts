import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(
    userId: number,
    title: string,
    description: string,
  ): Promise<Task> {
    const task = this.taskRepository.create({
      title,
      description,
      user: { id: userId },
    });
    await this.taskRepository.save(task);
    return task;
  }

  async getTasks(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      where: { user: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);
    const result = {
      data: tasks,
      total,
      totalPages,
    };

    return result;
  }
}
