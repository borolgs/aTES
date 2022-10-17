/**
 * Users
 */

export const userRoles = ['admin', 'manager', 'accountant', 'user'] as const;
export type UserRoleType = typeof userRoles[number];

export type UserId = string;

export interface IUser {
  publicId: UserId;
  email: string;
  name: string;
  role?: UserRoleType;
}

export type UserCreatedEvent = {
  name: 'AccountCreated' | 'AccountUpdated' | 'AccountDeleted';
  data: IUser;
};

/**
 * Tasks
 */

export type TaskId = string;

export const taskStatuses = ['todo', 'in-progess', 'done'] as const;
export type TaskStatus = typeof taskStatuses[number];

export interface ITask {
  publicId: TaskId;
  assignee: IUser | null;
  description: string;
  status: TaskStatus;
}

export type FindTasksParameters = {
  status?: TaskStatus;
};
export type FindTasksResponse = {
  results: ITask;
};

export interface CreateTaskParameters {
  assigneeId?: UserId;
  description: string;
  status?: TaskStatus;
}
export type CreateTaskResponse = ITask;

export type GetTaskParameters = {
  taskId: TaskId;
};
export type GetTaskResponse = ITask;

export type UpdateTaskParameters = {
  taskId: TaskId;
  assigneeId?: UserId;
  description?: string;
  status?: TaskStatus;
};
export type UpdateTaskResponse = ITask;

export type DeleteTaskParameters = { taskId: TaskId };
export type DeleteTaskResponse = ITask;

export type AssignTasksParameters = any;
export type AssignTasksResponse = any;
