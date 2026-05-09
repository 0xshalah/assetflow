'use server';

import { db } from '@/db';
import { items } from '@/db/schema/items';
import { loans } from '@/db/schema/loans';
import { eq, count, desc } from 'drizzle-orm';

export interface DashboardMetrics {
  totalItems: number;
  borrowedItems: number;
  activeLoans: number;
  overdueLoans: number;
}

export interface RecentLoan {
  id: string;
  itemName: string;
  borrowerName: string;
  loanDate: Date;
  status: string;
}

/**
 * Get dashboard overview metrics.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [totalResult] = await db.select({ value: count() }).from(items);
  const [borrowedResult] = await db
    .select({ value: count() })
    .from(items)
    .where(eq(items.status, 'borrowed'));
  const [activeResult] = await db
    .select({ value: count() })
    .from(loans)
    .where(eq(loans.status, 'active'));
  const [overdueResult] = await db
    .select({ value: count() })
    .from(loans)
    .where(eq(loans.status, 'overdue'));

  return {
    totalItems: totalResult.value,
    borrowedItems: borrowedResult.value,
    activeLoans: activeResult.value,
    overdueLoans: overdueResult.value
  };
}

/**
 * Get the 5 most recent loan transactions.
 */
export async function getRecentLoans(): Promise<RecentLoan[]> {
  const result = await db
    .select({
      id: loans.id,
      itemName: items.name,
      borrowerName: loans.borrowerName,
      loanDate: loans.loanDate,
      status: loans.status
    })
    .from(loans)
    .innerJoin(items, eq(loans.itemId, items.id))
    .orderBy(desc(loans.loanDate))
    .limit(5);

  return result;
}
