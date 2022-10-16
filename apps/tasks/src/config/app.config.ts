/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ConfigType, registerAs } from '@nestjs/config';

export const tasksConfig = registerAs('tasks', () => ({
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: process.env.DB_PORT!,
  DB_USERNAME: process.env.DB_USERNAME!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_DATABASE: process.env.DB_DATABASE!,
  TASKS_DB_SCHEMA: process.env.TASKS_DB_SCHEMA!,
  TASKS_PORT: process.env.TASKS_PORT!,
  TASKS_AUTH_CLIENT_ID: process.env.TASKS_AUTH_CLIENT_ID!,
  TASKS_AUTH_CLIENT_SECRET: process.env.TASKS_AUTH_CLIENT_SECRET!,
  TASKS_AUTH_HOST: process.env.TASKS_AUTH_HOST!,
  MOCK_MB: process.env.MOCK_MB === 'true',
}));

export type TasksConfig = ConfigType<typeof tasksConfig>;
