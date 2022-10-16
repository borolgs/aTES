import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ValidateFunction, JSONSchemaType } from 'ajv';
import { validatorFactory } from './ajv';

@Injectable()
export class AjvValidationPipe<T> implements PipeTransform {
  private validate: ValidateFunction<T>;
  constructor(schema: JSONSchemaType<T>) {
    this.validate = validatorFactory(schema);
  }

  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type !== 'body') return value;
    const valid = this.validate(value);
    if (!valid) {
      throw new BadRequestException(this.validate.errors);
    }
    return value;
  }
}
