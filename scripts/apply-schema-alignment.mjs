import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Client } from 'pg';
import { buildDatabaseUrl } from '../src/config/database-url.js';

const migrationPath = path.resolve(
  process.cwd(),
  'prisma/migrations/20260422090000_align_user_flow_and_schema/migration.sql',
);

const sql = await fs.readFile(migrationPath, 'utf8');

const client = new Client({
  connectionString: buildDatabaseUrl(process.env),
});

await client.connect();

try {
  await client.query(sql);
  console.log('schema-alignment-ok');
} finally {
  await client.end();
}
