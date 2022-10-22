import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users';

import { Task } from './task.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Task]), UsersModule],
  exports: [TypeOrmModule],
})
export class TasksModule {}
