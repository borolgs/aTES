import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './event-schema-registry.module-definition';
import { EventSchemaRegistryService } from './event-schema-registry.service';

@Module({
  providers: [EventSchemaRegistryService],
  exports: [EventSchemaRegistryService],
})
export class EventSchemaRegistryModule extends ConfigurableModuleClass {}
