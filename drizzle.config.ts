import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DB_HOST) {
  throw new Error('DB_HOST environment variable is not set. Check your .env file.');
}

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT ?? 6543),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: 'require'
  },
  // Generate verbose SQL for review
  verbose: true,
  // Require confirmation before applying destructive changes
  strict: true
});
