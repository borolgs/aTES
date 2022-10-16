import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app';
import { KafkaConfig, kafkaConfig, TasksConfig, tasksConfig } from './config';
import { AsyncContext } from '@nestjs-steroids/async-context';
import { CustomLogger } from '@shared/logger';
import { KafkaCustomTransport } from '@shared/kafka';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const config = app.get<TasksConfig>(tasksConfig.KEY);

  const asyncContext: AsyncContext<string, unknown> = app.get(AsyncContext);
  app.useLogger(new CustomLogger('Tasks', asyncContext));

  if (!config.MOCK_MB) {
    const { options } = app.get<KafkaConfig>(kafkaConfig.KEY);
    app.connectMicroservice({ strategy: new KafkaCustomTransport(options) });
  }
  await app.startAllMicroservices();

  await app.listen(config.TASKS_PORT);
}

bootstrap();
