import { Module } from '@nestjs/common';
import { TasksModule } from '../tasks';
import { UsersModule } from '../users';
import { KafkaAppController } from './kafka-app.controller';
import { TaskConsumerService } from './task-consumer.service';
import { UsersConsumerService } from './user-consumer.service';

@Module({
  imports: [UsersModule, TasksModule],
  controllers: [KafkaAppController],
  providers: [UsersConsumerService, TaskConsumerService],
  exports: [],
})
export class KafkaAppModule {}
