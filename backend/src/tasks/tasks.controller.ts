import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { User } from '../auth/user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async createTask(
    @Body() body: { title: string; description: string },
    @User() user: any,
  ) {
    try {
      if (!body.title || !body.description) {
        throw new BadRequestException('Title e description são obrigatórios.');
      }

      return await this.tasksService.createTask(
        user.id,
        body.title,
        body.description,
      );
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw new InternalServerErrorException('Erro ao criar tarefa.');
    }
  }

  @Get()
  async getTasks(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @User() user: any,
  ) {
    try {
      return await this.tasksService.getTasks(user.id, page, limit);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      throw new InternalServerErrorException('Erro ao buscar tarefas.');
    }
  }

  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: number, @User() user: any) {
    try {
      const task = await this.tasksService.getTaskById(user.id, taskId);
      if (!task) {
        throw new NotFoundException('Tarefa não encontrada.');
      }
      return task;
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      if (error instanceof NotFoundException) {
        throw error; // Re-throwing the specific error
      }
      throw new InternalServerErrorException('Erro ao buscar tarefa.');
    }
  }

  @Patch(':taskId')
  async updateTask(
    @Param('taskId') taskId: number,
    @Body() body: { title?: string; description?: string; status?: string },
    @User() user: any,
  ) {
    try {
      const updatedTask = await this.tasksService.updateTask(
        user.id,
        taskId,
        body,
      );
      if (!updatedTask) {
        throw new NotFoundException('Tarefa não encontrada.');
      }
      return updatedTask;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      if (error instanceof NotFoundException) {
        throw error; // Re-throwing the specific error
      }
      throw new InternalServerErrorException('Erro ao atualizar tarefa.');
    }
  }

  @Delete(':taskId')
  async deleteTaskById(@Param('taskId') taskId: number, @User() user: any) {
    try {
      await this.tasksService.deleteTaskById(user.id, taskId);
      return { message: 'Tarefa deletada com sucesso.' };
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Tarefa não encontrada.');
      }
      throw new InternalServerErrorException('Erro ao deletar tarefa.');
    }
  }
}
