import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Item status enum values.
 * - available: Barang tersedia untuk dipinjam
 * - borrowed: Barang sedang dipinjam
 * - maintenance: Barang sedang dalam perawatan
 */
export const itemStatusValues = ['available', 'borrowed', 'maintenance'] as const;
export type ItemStatus = (typeof itemStatusValues)[number];

/**
 * Table: items
 * Menyimpan daftar barang/aset yang dikelola.
 */
export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  status: text('status', { enum: itemStatusValues }).notNull().default('available'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

/** TypeScript types derived from the schema */
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
