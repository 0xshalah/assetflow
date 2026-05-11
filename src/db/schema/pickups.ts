import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { items } from './items';

/**
 * Table: pickups
 * Pengambilan barang consumable (tidak dikembalikan).
 * Setiap pickup mengurangi quantity di tabel items.
 */
export const pickups = pgTable('pickups', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id')
    .notNull()
    .references(() => items.id, { onDelete: 'restrict' }),
  personName: text('person_name').notNull(),
  department: text('department').notNull(),
  quantity: integer('quantity').notNull(),
  purpose: text('purpose').notNull(),
  pickedAt: timestamp('picked_at', { withTimezone: true }).notNull().defaultNow()
});

/** TypeScript types derived from the schema */
export type Pickup = typeof pickups.$inferSelect;
export type NewPickup = typeof pickups.$inferInsert;
