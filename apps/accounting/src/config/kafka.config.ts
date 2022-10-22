import { ConfigType, registerAs } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig = registerAs(
  'producer',
  (): KafkaOptions => ({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID ?? 'accounting',
        brokers: [process.env.KAFKA_BROKER ?? 'localhost:29092'],
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID ?? '3',
      },
    },
  }),
);

export type KafkaConfig = ConfigType<typeof kafkaConfig>;
