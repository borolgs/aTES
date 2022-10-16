import Ajv, { JSONSchemaType } from 'ajv';

export const ajv = new Ajv();

export function validatorFactory<T>(schema: JSONSchemaType<T>) {
  const validate = ajv.compile(schema);
  return validate;
}
