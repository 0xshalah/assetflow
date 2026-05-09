import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

/**
 * Connection pool for Supabase PostgreSQL.
 * Uses the connection pooler URL (port 6543) for serverless environments.
 * Set `prepare: false` when using Supabase's connection pooler (PgBouncer in transaction mode).
 */
const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString, {
  prepare: false
});

export const db = drizzle(client, { schema });
