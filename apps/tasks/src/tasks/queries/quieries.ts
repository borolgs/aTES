import { IQuery } from '@shared/cqrs';
import { FindTasksParameters, GetTaskParameters } from '../../types';

export class FindTasksQuery implements IQuery<FindTasksParameters> {
  constructor(public payload: FindTasksParameters) {}
}

export class FindTaskQuery implements IQuery<GetTaskParameters> {
  constructor(public payload: GetTaskParameters) {}
}
