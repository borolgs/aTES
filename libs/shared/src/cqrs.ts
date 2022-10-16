import { ICommand as IBaseCommand, IQuery as IBaseQuery } from '@nestjs/cqrs';

export interface ICommand<T> extends IBaseCommand {
  payload: T;
}

export interface IQuery<T> extends IBaseQuery {
  payload: T;
}
