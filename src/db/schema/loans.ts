import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { items } from './items';

/**
 * Loan status enum values.
 * - active: Peminjaman sedang berlangsung
 * - returned: Barang sudah dikembalikan
 * - overdue: Peminjaman melewati batas waktu
 */
export const loanStatusValues = ['active', 'returned', 'overdue'] as const;
export type LoanStatus = (typeof loanStatusValues)[number];

/**
 * Table: loans
 * Menyimpan transaksi peminjaman barang.
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
