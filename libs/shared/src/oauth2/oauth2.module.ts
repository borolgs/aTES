import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './oauth2.module-definition';
import { OAuth2Service } from './oauth2.service';

@Module({
  providers: [OAuth2Service],
  exports: [OAuth2Service],
})
export class OAuth2Module extends ConfigurableModuleClass {}
