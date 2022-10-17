import { ICommand } from '@shared/cqrs';
import {
  AssignTasksParameters,
  CreateTaskParameters,
  DeleteTaskParameters,
  UpdateTaskParameters,
} from '../../types';

export class CreateTaskCommand implements ICommand<CreateTaskParameters> {
  constructor(public payload: CreateTaskParameters) {}
}

export class UpdateTaskCommand implements ICommand<UpdateTaskParameters> {
  constructor(public payload: UpdateTaskParameters) {}
}

export class DeleteTaskCommand implements ICommand<UpdateTaskParameters> {
  constructor(public payload: DeleteTaskParameters) {}
}

export class AssignTasksCommand implements ICommand<AssignTasksParameters> {
  constructor(public payload: AssignTasksParameters) {}
}
