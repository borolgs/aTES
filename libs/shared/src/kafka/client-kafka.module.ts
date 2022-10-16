import { Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './client-kafka.module-definition';
import { ClientKafkaService } from './client-kafka.service';

@Module({
  providers: [ClientKafkaService],
  exports: [ClientKafkaService],
})
export class ClientKafkaModule extends ConfigurableModuleClass {}
