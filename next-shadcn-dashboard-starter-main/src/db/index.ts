import 'server-only';

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
  port: Number(process.env.DB_PORT ?? 6543),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  ssl: 'require',
  prepare: false,
  // Connection pool tuning for serverless (Vercel functions)
  max: 3, // max 3 connections per serverless instance
  idle_timeout: 20, // release idle connections after 20s
  connect_timeout: 10 // fail fast if DB unreachable
});

export const db = drizzle(client, { schema });
