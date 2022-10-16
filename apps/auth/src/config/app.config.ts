/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ConfigType, registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: process.env.DB_PORT!,
  DB_USERNAME: process.env.DB_USERNAME!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_DATABASE: process.env.DB_DATABASE!,
  AUTH_DB_SCHEMA: process.env.AUTH_DB_SCHEMA!,
  AUTH_PORT: process.env.AUTH_PORT!,
  MOCK_MB: process.env.MOCK_MB === 'true',
  AUTH_APP_CLIENT_ID: process.env.AUTH_APP_CLIENT_ID!,
  AUTH_APP_CLIENT_SECRET: process.env.AUTH_APP_CLIENT_SECRET!,
  AUTH_APP_HOST: process.env.AUTH_APP_HOST!,
}));

export type AuthConfig = ConfigType<typeof authConfig>;
