import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  AssignTasksParameters,
  CreateTaskParameters,
  DeleteTaskParameters,
  FindTasksParameters,
  GetTaskParameters,
  UpdateTaskParameters,
} from '../types';
import {
  AssignTasksCommand,
  CreateTaskCommand,
  DeleteTaskCommand,
  UpdateTaskCommand,
} from './commands';
import { FindTaskQuery, FindTasksQuery } from './queries';

@Injectable()
export class TaskService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async findAll(args?: FindTasksParameters) {
    return this.queryBus.execute(new FindTasksQuery(args ?? {}));
  }

  async create(args: CreateTaskParameters) {
    return this.commandBus.execute(new CreateTaskCommand(args));
  }

  async findOne(args: GetTaskParameters) {
    return this.queryBus.execute(new FindTaskQuery(args ?? {}));
  }

  async update(args: UpdateTaskParameters) {
    return this.commandBus.execute(new UpdateTaskCommand(args));
  }

  async delete(args: DeleteTaskParameters) {
    return this.commandBus.execute(new DeleteTaskCommand(args));
  }

  async assign(args: AssignTasksParameters) {
    return this.commandBus.execute(new AssignTasksCommand(args));
  }
}
