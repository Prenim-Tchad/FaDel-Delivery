import { defineConfig } from '@prisma/config';
import 'dotenv/config';
import { buildDatabaseUrl } from './src/config/database-url.js';

export default defineConfig({
  datasource: {
    url: buildDatabaseUrl(process.env),
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL
      ? buildDatabaseUrl({
          ...process.env,
          DATABASE_URL: process.env.SHADOW_DATABASE_URL,
        })
      : undefined,
  },
  migrations: {
    path: './prisma/migrations',
  },
});
