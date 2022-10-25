import { Event, IEvent } from '@shared/cqrs';
import { IUser } from '@shared/oauth2/types';
import * as crypto from 'crypto';
import { ok } from 'neverthrow';

export class UserEvent<T> implements IEvent<T> {
  private constructor(public topic: string, public event: Event<T>) {}

  public static createUserCreatedEvent(topic: string, event: IUser) {
    const eventWithMetadata: Event<IUser> = {
      eventId: crypto.randomUUID(),
      eventVersion: 1,
      eventName: 'AccountCreated',
      eventTime: new Date().toISOString(),
      producer: 'auth',
      data: event,
    };
    return ok(new UserEvent(topic, eventWithMetadata));
  }

  public static createUserUpdatedEvent(topic: string, event: IUser) {
    const eventWithMetadata: Event<IUser> = {
      eventId: crypto.randomUUID(),
      eventVersion: 1,
      eventName: 'AccountUpdated',
      eventTime: new Date().toISOString(),
      producer: 'auth',
      data: event,
    };
    return ok(new UserEvent(topic, eventWithMetadata));
  }

  public static createUserDeletedEvent(topic: string, event: IUser) {
    const eventWithMetadata: Event<IUser> = {
      eventId: crypto.randomUUID(),
      eventVersion: 1,
      eventName: 'AccountDeleted',
      eventTime: new Date().toISOString(),
      producer: 'auth',
      data: event,
    };
    return ok(new UserEvent(topic, eventWithMetadata));
  }
}
