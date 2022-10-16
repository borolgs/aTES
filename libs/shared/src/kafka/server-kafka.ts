import { ServerKafka, CustomTransportStrategy } from '@nestjs/microservices';
import {
  Consumer,
  ConsumerRunConfig,
  EachBatchHandler,
  EachMessagePayload,
} from 'kafkajs';

export class KafkaCustomTransport
  extends ServerKafka
  implements CustomTransportStrategy
{
  public async bindEvents(consumer: Consumer) {
    const registeredPatterns = [...this.messageHandlers.keys()];
    const consumerSubscribeOptions = this.options?.subscribe || {};
    const subscribeToPattern = async (pattern: string) =>
      consumer.subscribe({
        topic: pattern,
        ...consumerSubscribeOptions,
      });
    await Promise.all(registeredPatterns.map(subscribeToPattern));

    const eachBatchHandler: EachBatchHandler = async ({
      batch,
      resolveOffset,
      heartbeat,
      pause,
    }) => {
      const handler = this.getMessageHandler();
      for (const message of batch.messages) {
        const payload: EachMessagePayload = {
          topic: batch.topic,
          partition: batch.partition,
          message,
          heartbeat,
          pause,
        };
        handler(payload);

        resolveOffset(message.offset);
        await heartbeat();
      }
    };

    const consumerRunOptions: ConsumerRunConfig = Object.assign(
      this.options?.run || {},
      {
        eachBatch: eachBatchHandler,
      },
    );
    await consumer.run(consumerRunOptions);
  }
}
