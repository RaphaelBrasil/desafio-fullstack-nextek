import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
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
    return await this.tasksService.createTask(
      user.id,
      body.title,
      body.description,
    );
  }

  @Get()
  async getTasks(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @User() user: any,
  ) {
    return await this.tasksService.getTasks(user.id, page, limit);
  }
}
