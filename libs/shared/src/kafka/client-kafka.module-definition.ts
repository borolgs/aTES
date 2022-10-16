import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ClientKafkaConfig } from './types';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ClientKafkaConfig>()
    .setExtras({}, (definition) => {
      return { ...definition, global: true };
    })
    .build();
