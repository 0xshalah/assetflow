import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

/**
 * Item category enum values.
 */
export const itemCategoryValues = ['elektrik', 'mekanik', 'facility'] as const;
export type ItemCategory = (typeof itemCategoryValues)[number];

/**
 * Table: items
 * Inventory barang dengan quantity tracking.
 */
export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  category: text('category', { enum: itemCategoryValues }).notNull(),
  quantity: integer('quantity').notNull().default(0),
  supplier: text('supplier').notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

/** TypeScript types derived from the schema */
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
