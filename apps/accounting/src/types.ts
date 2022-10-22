/**
 * Users
 */

export type UserId = string;

export interface IUser {
  publicId: UserId;
  email: string;
  name: string;
}

export type UserCreatedEvent = {
  eventId: string;
  eventVersion: number;
  eventName: 'AccountCreated' | 'AccountUpdated' | 'AccountDeleted';
  eventTime: string;
  producer: string;
  data: IUser;
};

/**
 * Tasks
 */

export type TaskId = string;

export interface ITask {
  publicId: TaskId;
  assignee: IUser | null;
  description: string;
}

export type TaskCreatedEvent = {
  eventId: string;
  eventVersion: number;
  eventName: 'TaskCreated' | 'TaskUpdated' | 'TaskDeleted';
  eventTime: string;
  producer: string;
  data: ITask;
};
