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
    id: number,
    title: string,
    description: string,
  ): Promise<Task> {
    if (!title || !description) {
      throw new Error('Title e description são obrigatórios.');
    }

    const task = this.taskRepository.create({
      title,
      description,
      user: { id: id },
    });
    await this.taskRepository.save(task);
    return task;
  }

  async getTasks(
    id: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      where: { user: { id: id } },
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

  async getTaskById(userId: number, taskId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, user: { id: userId } },
    });

    if (!task) {
      throw new Error('Tarefa não encontrada ou não autorizada.');
    }
    return task;
  }

  async updateTask(
    userId: number,
    taskId: number,
    updateData: Partial<Task>,
  ): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id: taskId, user: { id: userId } },
      });

      if (!task) {
        throw new Error('Tarefa não encontrada.');
      }

      // Atualiza os campos permitidos
      Object.assign(task, updateData);
      await this.taskRepository.save(task);
      return task;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw new Error('Erro ao atualizar tarefa.');
    }
  }

  async deleteTaskById(userId: number, taskId: number): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, user: { id: userId } },
    });

    if (!task) {
      throw new Error('Tarefa não encontrada ou não autorizada.');
    }

    await this.taskRepository.remove(task);
  }
}
