import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth, Roles } from '@shared/oauth2';
import {
  AssignTasksParameters,
  CreateTaskParameters,
  FindTasksParameters,
  UpdateTaskParameters,
} from '../types';
import { TaskService } from './task.service';

@Controller()
@Auth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('tasks')
  findAll(@Query() args: FindTasksParameters) {
    return this.taskService.findAll(args);
  }

  @Post('tasks')
  create(@Body() args: CreateTaskParameters) {
    return this.taskService.create(args);
  }

  @Get('tasks/:taskId')
  findOne(@Param('taskId') taskId: string) {
    return this.taskService.findOne({ taskId });
  }

  @Patch('tasks/:taskId')
  update(@Param('taskId') taskId: string, @Body() args: UpdateTaskParameters) {
    return this.taskService.update({ ...args, taskId });
  }

  @Delete('tasks/:taskId')
  delete(@Param('taskId') taskId: string) {
    return this.taskService.delete({ taskId });
  }

  @Post('tasks/assign')
  @Roles('admin', 'manager')
  assign(@Body() args: AssignTasksParameters) {
    return this.taskService.assign(args);
  }
}
