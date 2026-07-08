import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const loanStatusValues = ['active', 'returned'] as const;
export type LoanStatus = (typeof loanStatusValues)[number];

export const loans = pgTable('loans', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id'),
  itemName: text('item_name').notNull().default(''),
  quantity: integer('quantity').notNull().default(1),
  purpose: text('purpose').notNull().default(''),
  department: text('department').notNull().default(''),
  borrowerName: text('borrower_name').notNull(),
  borrowerContact: text('borrower_contact').notNull(),
  loanDate: timestamp('loan_date', { withTimezone: true }).notNull().defaultNow(),
  returnDate: timestamp('return_date', { withTimezone: true }),
  status: text('status', { enum: loanStatusValues }).notNull().default('active')
});

export type Loan = typeof loans.$inferSelect;
export type NewLoan = typeof loans.$inferInsert;
