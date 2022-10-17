import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users';
import {
  CreateTaskHandler,
  UpdateTaskHandler,
  DeleteTaskHandler,
  AssignTasksHandler,
} from './commands';
import { FindTaskHandler, FindTasksHandler } from './queries';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Task]), UsersModule],
  controllers: [TaskController],
  providers: [
    CreateTaskHandler,
    UpdateTaskHandler,
    DeleteTaskHandler,
    AssignTasksHandler,
    FindTaskHandler,
    FindTasksHandler,
    TaskService,
  ],
  exports: [TypeOrmModule],
})
export class TasksModule {}
