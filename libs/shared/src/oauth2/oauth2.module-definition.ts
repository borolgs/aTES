import { ConfigurableModuleBuilder } from '@nestjs/common';
import { OAuth2ModuleOptions } from './types';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<OAuth2ModuleOptions>()
  .setExtras({}, (definition) => {
    return { ...definition, global: true };
  })
  .build();
