import { Event, IEvent } from '@shared/cqrs';
import * as crypto from 'crypto';
import { ok } from 'neverthrow';
import { ITask, TaskId, UserId } from '../../types';

export type TaskAssignedEventData = {
  description: string;
  taskId: TaskId;
  assigneeId: UserId;
};

export class TaskEvent<T> implements IEvent<T> {
  private constructor(public topic: string, public event: Event<T>) {}

  public static createTaskAssignedEvent(topic: string, event: TaskAssignedEventData) {
    const eventWithMetadata: Event<TaskAssignedEventData> = {
      eventId: crypto.randomUUID(),
      eventVersion: 1,
      eventName: 'TaskAssigned',
      eventTime: new Date().toISOString(),
      producer: 'tasks',
      data: event,
    };
    return ok(new TaskEvent(topic, eventWithMetadata));
  }

  public static createTaskCompletedEvent(topic: string, event: TaskAssignedEventData) {
    const eventWithMetadata: Event<TaskAssignedEventData> = {
      eventId: crypto.randomUUID(),
      eventVersion: 1,
      eventName: 'TaskCompleted',
      eventTime: new Date().toISOString(),
      producer: 'tasks',
      data: event,
    };
    return ok(new TaskEvent(topic, eventWithMetadata));
  }

  public static createTaskCreatedEvent(topic: string, event: ITask) {
    const eventWithMetadata: Event<ITask> = {
      eventId: crypto.randomUUID(),
      eventVersion: 1,
      eventName: 'TaskCreated',
      eventTime: new Date().toISOString(),
      producer: 'tasks-tream',
      data: event,
    };
    return ok(new TaskEvent(topic, eventWithMetadata));
  }

  public static createTaskUpdatedEvent(topic: string, event: ITask) {
    const eventWithMetadata: Event<ITask> = {
      eventId: crypto.randomUUID(),
      eventVersion: 1,
      eventName: 'TaskUpdated',
      eventTime: new Date().toISOString(),
      producer: 'tasks-tream',
      data: event,
    };
    return ok(new TaskEvent(topic, eventWithMetadata));
  }

  public static createTaskDeletedEvent(topic: string, event: ITask) {
    const eventWithMetadata: Event<ITask> = {
      eventId: crypto.randomUUID(),
      eventVersion: 1,
      eventName: 'TaskDeleted',
      eventTime: new Date().toISOString(),
      producer: 'tasks-tream',
      data: event,
    };
    return ok(new TaskEvent(topic, eventWithMetadata));
  }
}
