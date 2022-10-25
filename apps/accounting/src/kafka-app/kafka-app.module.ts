import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingModule } from '../accounting';
import { EntitiesModule } from '../entities';
import { KafkaAppController } from './kafka-app.controller';
import { TaskBEConsumerService } from './task-be-consumer.service';
import { TaskConsumerService } from './task-consumer.service';
import { UsersConsumerService } from './user-consumer.service';

@Module({
  imports: [CqrsModule, TypeOrmModule, EntitiesModule, AccountingModule],
  controllers: [KafkaAppController],
  providers: [UsersConsumerService, TaskConsumerService, TaskBEConsumerService],
  exports: [TaskBEConsumerService],
})
export class KafkaAppModule {}
