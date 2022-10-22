/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ConfigType, registerAs } from '@nestjs/config';

export const accountingConfig = registerAs('accounting', () => ({
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: process.env.DB_PORT!,
  DB_USERNAME: process.env.DB_USERNAME!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_DATABASE: process.env.DB_DATABASE!,
  ACCOUNTING_DB_SCHEMA: process.env.ACCOUNTING_DB_SCHEMA!,
  ACCOUNTING_PORT: process.env.ACCOUNTING_PORT!,
  ACCOUNTING_AUTH_CLIENT_ID: process.env.ACCOUNTING_AUTH_CLIENT_ID!,
  ACCOUNTING_AUTH_CLIENT_SECRET: process.env.ACCOUNTING_AUTH_CLIENT_SECRET!,
  ACCOUNTING_AUTH_HOST: process.env.ACCOUNTING_AUTH_HOST!,
  MOCK_MB: process.env.MOCK_MB === 'true',
}));

export type AccountingConfig = ConfigType<typeof accountingConfig>;
