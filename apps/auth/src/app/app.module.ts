import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AsyncContextModule } from '@nestjs-steroids/async-context';
import { AppController } from './app.controller';
import { ClientKafkaModule } from '@shared/kafka';
import { AuthConfig, authConfig, kafkaConfig, KafkaConfig } from '../config';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AsyncCtxInterceptor, HttpLogInterceptor } from '@shared/interseptors';
import { ClientAppsModule } from '../client-apps';
import { OAuth2Module } from '@shared/oauth2';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [authConfig, kafkaConfig] }),
    AsyncContextModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [authConfig.KEY],
      useFactory: async (config) => {
        return {
          type: 'postgres',
          host: config.DB_HOST,
          port: config.DB_PORT,
          username: config.DB_USERNAME,
          password: config.DB_PASSWORD,
          database: config.DB_DATABASE,
          schema: config.AUTH_DB_SCHEMA,
          // shouldn't be used in production - otherwise you can lose production data.
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    ClientKafkaModule.registerAsync({
      inject: [kafkaConfig.KEY, authConfig.KEY],
      useFactory: (options: KafkaConfig, config: AuthConfig) => ({
        options,
        mock: config.MOCK_MB,
        topics: ['account-stream'],
      }),
    }),
    OAuth2Module.registerAsync({
      inject: [authConfig.KEY],
      useFactory: (config: AuthConfig) => ({
        client_id: config.AUTH_APP_CLIENT_ID,
        client_secret: config.AUTH_APP_CLIENT_SECRET,
        host: config.AUTH_APP_HOST,
      }),
    }),
    AuthModule,
    ClientAppsModule,
    UsersModule,
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
export class AppModule {}
