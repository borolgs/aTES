import { UsePipes } from '@nestjs/common';
import { JSONSchemaType } from 'ajv';
import { AjvValidationPipe } from './ajv-validation.pipe';

export * from './ajv';

export function ValidateBody<T>(schema: JSONSchemaType<T>) {
  const bodyValidate = new AjvValidationPipe(schema);
  return UsePipes(bodyValidate);
}
