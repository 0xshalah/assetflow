import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Connection to Supabase PostgreSQL.
 * Uses individual connection params to avoid URL-encoding issues with special characters in passwords.
 * Set `prepare: false` when using Supabase's connection pooler (PgBouncer in transaction mode).
 */
const client = postgres({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  ssl: 'require',
  prepare: false
});

export const db = drizzle(client, { schema });
