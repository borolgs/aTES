import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsyncContextModule } from '@nestjs-steroids/async-context';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLogInterceptor } from '@shared/interseptors';
import { OAuth2Module } from '@shared/oauth2';
import { KafkaAppModule } from '../kafka-app/kafka-app.module';
import { ClientKafkaModule, ClientKafkaService } from '@shared/kafka';
import { KafkaConfig, kafkaConfig, AccountingConfig, accountingConfig, kafkaAssignConsumerConfig } from '../config';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { EventSchemaRegistryModule } from '@shared/event-schema-registry';
import { EntitiesModule } from '../entities';
import { AccountingModule } from '../accounting';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [accountingConfig, kafkaConfig, kafkaAssignConsumerConfig] }),
    AsyncContextModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [accountingConfig.KEY],
      useFactory: async (config) => {
        return {
          type: 'postgres',
          host: config.DB_HOST,
          port: config.DB_PORT,
          username: config.DB_USERNAME,
          password: config.DB_PASSWORD,
          database: config.DB_DATABASE,
          schema: config.ACCOUNTING_DB_SCHEMA,
          // shouldn't be used in production
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    ClientKafkaModule.registerAsync({
      inject: [kafkaConfig.KEY, accountingConfig.KEY],
      useFactory: (options: KafkaConfig, config: AccountingConfig) => ({
        options,
        mock: config.MOCK_MB,
      }),
    }),
    OAuth2Module.registerAsync({
      inject: [accountingConfig.KEY],
      useFactory: (config: AccountingConfig) => ({
        client_id: config.ACCOUNTING_AUTH_CLIENT_ID,
        client_secret: config.ACCOUNTING_AUTH_CLIENT_SECRET,
        host: config.ACCOUNTING_AUTH_HOST,
      }),
    }),
    ScheduleModule.forRoot(),
    EventSchemaRegistryModule.forRoot({}),
    CqrsModule,
    KafkaAppModule,
    EntitiesModule,
    AccountingModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLogInterceptor,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly event$: EventBus, private readonly kafkaPublisher: ClientKafkaService) {}

  async onModuleInit(): Promise<any> {
    this.kafkaPublisher.subscribeAndConnect(['account-stream', 'task-stream', 'task']);
    this.event$.publisher = this.kafkaPublisher;
  }
}
