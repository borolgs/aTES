import { ajv } from '@shared/validation';
import { ErrorObject, ValidateFunction } from 'ajv';
import { readdirSync, readFileSync, statSync } from 'fs';
import { err, ok, Result } from 'neverthrow';
import { join, parse } from 'path';

export class EventValidationError extends Error {
  constructor(message: string, public validationErrors?: ErrorObject[]) {
    super(message);

    Object.setPrototypeOf(this, EventValidationError.prototype);
  }
}

export function eventValidator(schemasPath?: string) {
  const validators = compileSchemas(schemasPath);

  return function <T = any>(
    event: T | { event: T },
    type: `${string}.${string}`,
    version: number,
  ): Result<T | { event: T }, EventValidationError> {
    const eventKey = `${type}.${version}`;

    const validator = validators[eventKey];
    if (!validator) {
      return err(new EventValidationError(`Invalid event type or version: ${eventKey}`));
    }

    const e = isNestedEvent(event) ? event.event : event;

    if (!validator(e)) {
      const errors = validator.errors!;
      return err(new EventValidationError(`Invalid event: ${eventKey}`, errors));
    }

    return ok(event);
  };
}

function compileSchemas(schemasPath?: string) {
  const validators: Record<string, ValidateFunction> = {};

  schemasPath ??= join(process.cwd(), 'schemas');

  for (const group of readdirSync(schemasPath)) {
    const eventsPath = join(schemasPath, group);
    if (!statSync(eventsPath).isDirectory()) continue;

    for (const event of readdirSync(eventsPath)) {
      const eventVersionsPath = join(eventsPath, event);
      if (!statSync(eventVersionsPath).isDirectory()) continue;

      for (const version of readdirSync(eventVersionsPath)) {
        const versionPath = join(eventVersionsPath, version);

        const schema = JSON.parse(readFileSync(versionPath, { encoding: 'utf-8' }));

        const validator = ajv.compile(schema);
        validators[`${group}.${event}.${parse(versionPath).name}`] = validator;
      }
    }
  }

  return validators;
}

function isNestedEvent(event: any): event is { event: any } {
  return event.event != null;
}
