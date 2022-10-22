import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskCreatedEvent, UserCreatedEvent } from '../types';
import { TaskConsumerService } from './task-consumer.service';
import { UsersConsumerService } from './user-consumer.service';

@Controller()
export class KafkaAppController {
  constructor(private userConsumer: UsersConsumerService, private taskConsumer: TaskConsumerService) {}
  @MessagePattern('account-stream')
  async getUserMessage(@Payload() payload: UserCreatedEvent) {
    this.userConsumer.consume(payload);
  }

  @MessagePattern('task-stream')
  async getTaskMessage(@Payload() payload: TaskCreatedEvent) {
    this.taskConsumer.consume(payload);
  }
}
