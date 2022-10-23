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
  price: number;
  fee: number;
}

export type TaskCUDEvent = {
  eventId: string;
  eventVersion: number;
  eventName: 'TaskCreated' | 'TaskUpdated' | 'TaskDeleted';
  eventTime: string;
  producer: string;
  data: ITask;
};

export type TaskAssignEvent = {
  eventId: string;
  eventVersion: number;
  eventName: 'TaskAssigned' | 'TaskCompleted';
  eventTime: string;
  producer: string;
  data: {
    taskId: TaskId;
    assigneeId: UserId;
    description: string;
  };
};

/**
 * Accountings
 */

export interface ITransaction {
  publicId: TaskId;
  account: IUser;
  description: string;
  credit: number;
  debit: number;
}

export type WithdrawParameters = {
  accountId: UserId;
  value: number;
  description: string;
};

export type DepositParameters = {
  accountId: UserId;
  value: number;
  description: string;
};

export type PaymentParameters = {
  accountId: UserId;
};

export type FindTransactionsParameters = {
  accountId?: UserId;
};
