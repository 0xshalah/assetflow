import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { items } from './items';

/**
 * Loan status enum values.
 */
export const loanStatusValues = ['active', 'returned'] as const;
export type LoanStatus = (typeof loanStatusValues)[number];

/**
 * Table: loans
 * Peminjaman barang (dikembalikan nanti oleh admin).
 */
export const loans = pgTable('loans', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id')
    .notNull()
    .references(() => items.id, { onDelete: 'restrict' }),
  borrowerName: text('borrower_name').notNull(),
  borrowerContact: text('borrower_contact').notNull(),
  loanDate: timestamp('loan_date', { withTimezone: true }).notNull().defaultNow(),
  returnDate: timestamp('return_date', { withTimezone: true }),
  status: text('status', { enum: loanStatusValues }).notNull().default('active')
});

/** TypeScript types derived from the schema */
export type Loan = typeof loans.$inferSelect;
export type NewLoan = typeof loans.$inferInsert;
