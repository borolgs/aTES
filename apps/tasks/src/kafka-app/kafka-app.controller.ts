import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserCreatedEvent } from '../types';
import { UsersConsumerService } from './user-consumer.service';

@Controller()
export class KafkaAppController {
  constructor(private userConsumer: UsersConsumerService) {}
  @MessagePattern('account-stream')
  async getUserMessage(@Payload() payload: UserCreatedEvent) {
    this.userConsumer.consume(payload);
  }
}
