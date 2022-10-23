import { ServerKafka, CustomTransportStrategy, KafkaOptions } from '@nestjs/microservices';
import { Consumer } from 'kafkajs';

export interface IConsumeService {
  consume(events: any[]): void;
}

export class TaskBEConsumerServer extends ServerKafka implements CustomTransportStrategy {
  constructor(options: KafkaOptions['options'], private consumeService: IConsumeService) {
    super(options);
  }
  override async bindEvents(consumer: Consumer) {
    await consumer.subscribe({ topics: ['task'] });
    await consumer.run({
      ...this.options,
      eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
        const events: any[] = [];
        for (const message of batch.messages) {
          events.push(JSON.parse(message.value?.toString() ?? '{}'));

          resolveOffset(message.offset);
          await heartbeat();
        }

        this.consumeService.consume(events);
      },
    });
  }
}
