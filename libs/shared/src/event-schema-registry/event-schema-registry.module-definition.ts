import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder()
  .setClassMethodName('forRoot')
  .setExtras({}, (definition) => {
    return { ...definition, global: true };
  })
  .build();
