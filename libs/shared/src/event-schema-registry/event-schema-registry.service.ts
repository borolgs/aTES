import { Injectable } from '@nestjs/common';
import { eventValidator } from './event-validator';

@Injectable()
export class EventSchemaRegistryService {
  public validate = eventValidator();
}
