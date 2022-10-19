import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TasksModule } from '../tasks';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsyncContextModule } from '@nestjs-steroids/async-context';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AsyncCtxInterceptor, HttpLogInterceptor } from '@shared/interseptors';
import { OAuth2Module } from '@shared/oauth2';
import { UsersModule } from '../users';
import { KafkaAppModule } from '../kafka-app/kafka-app.module';
import { ClientKafkaModule, ClientKafkaService } from '@shared/kafka';
import { KafkaConfig, kafkaConfig, TasksConfig, tasksConfig } from '../config';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { EventSchemaRegistryModule } from '@shared/event-schema-registry';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [tasksConfig, kafkaConfig] }),
    AsyncContextModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [tasksConfig.KEY],
      useFactory: async (config) => {
        return {
          type: 'postgres',
          host: config.DB_HOST,
          port: config.DB_PORT,
          username: config.DB_USERNAME,
          password: config.DB_PASSWORD,
          database: config.DB_DATABASE,
          schema: config.TASKS_DB_SCHEMA,
          // shouldn't be used in production
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    ClientKafkaModule.registerAsync({
      inject: [kafkaConfig.KEY, tasksConfig.KEY],
      useFactory: (options: KafkaConfig, config: TasksConfig) => ({
        options,
        mock: config.MOCK_MB,
      }),
    }),
    OAuth2Module.registerAsync({
      inject: [tasksConfig.KEY],
      useFactory: (config: TasksConfig) => ({
        client_id: config.TASKS_AUTH_CLIENT_ID,
        client_secret: config.TASKS_AUTH_CLIENT_SECRET,
        host: config.TASKS_AUTH_HOST,
      }),
    }),
    EventSchemaRegistryModule.forRoot({}),
    CqrsModule,
    KafkaAppModule,
    UsersModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AsyncCtxInterceptor,
    },
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
