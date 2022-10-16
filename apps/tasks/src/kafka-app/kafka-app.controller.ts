import { Controller } from '@nestjs/common';
import { UsersConsumerService } from './user-consumer.service';

@Controller()
export class KafkaAppController {
  constructor(private userConsumer: UsersConsumerService) {}
}
