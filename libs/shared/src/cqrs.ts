import { ICommand as IBaseCommand, IQuery as IBaseQuery, IEvent as IBaseEvent } from '@nestjs/cqrs';

export interface ICommand<T> extends IBaseCommand {
  payload: T;
}

export interface IQuery<T> extends IBaseQuery {
  payload: T;
}

export type Event<T> = {
  eventId: string;
  eventVersion: number;
  eventName: string;
  eventTime: string;
  producer: string;
  data: T;
};

export interface IEvent<Data, Payload = Event<Data>> extends IBaseEvent {
  topic: string;
  event: Payload;
}
