import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Item category enum values.
 */
export const itemCategoryValues = ['lemari-c01', 'lemari-c02', 'lemari-c03'] as const;
export type ItemCategory = (typeof itemCategoryValues)[number];

/**
 * Table: items
 * Inventory barang dengan quantity tracking.
 */
export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  specification: text('specification').notNull().default(''),
  category: text('category', { enum: itemCategoryValues }).notNull(),
  quantity: integer('quantity').notNull().default(0),
  unit: text('unit').notNull().default(''),
  supplier: text('supplier').notNull(),
  minimumStock: integer('minimum_stock').notNull().default(0),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

/** TypeScript types derived from the schema */
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
