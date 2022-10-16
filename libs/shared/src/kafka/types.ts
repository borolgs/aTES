import { KafkaOptions } from '@nestjs/microservices';

export type ClientKafkaConfig = {
  options: KafkaOptions;
  mock?: boolean;
  topics?: string[];
};
