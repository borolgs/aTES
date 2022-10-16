import { AsyncContext } from '@nestjs-steroids/async-context';
import { NestFactory } from '@nestjs/core';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import fastifyStatic from '@fastify/static';
import { CustomLogger } from '@shared/logger';
import { AppModule } from './app';
import { AuthConfig, authConfig } from './config';
import { join } from 'path';
import { FastifyInstance } from 'fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const asyncContext: AsyncContext<string, unknown> = app.get(AsyncContext);
  app.useLogger(new CustomLogger('Auth', asyncContext));

  (app.getHttpAdapter().getInstance() as FastifyInstance).register(
    fastifyStatic,
    {
      root: join(process.cwd(), 'apps', 'auth', 'src', 'client'),
    },
  );

  const config = app.get<AuthConfig>(authConfig.KEY);
  await app.listen(config.AUTH_PORT);
}
bootstrap();
