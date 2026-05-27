'use server';

import { db } from '@/db';
import { items } from '@/db/schema/items';
import { loans } from '@/db/schema/loans';
import { eq, count, sql, lt, and, gt } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

export interface DashboardMetrics {
  totalLemariC01: number;
  totalLemariC02: number;
  totalLemariC03: number;
  outOfStock: number;
  activeLoans: number;
  lowStockItems: number;
}

/**
 * Get dashboard overview metrics. Admin only.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  await requireAdmin();

  const [lemariC01] = await db
    .select({ value: sql<number>`COALESCE(SUM(${items.quantity}), 0)` })
    .from(items)
    .where(eq(items.category, 'lemari-c01'));

  const [lemariC02] = await db
    .select({ value: sql<number>`COALESCE(SUM(${items.quantity}), 0)` })
    .from(items)
    .where(eq(items.category, 'lemari-c02'));

  const [lemariC03] = await db
    .select({ value: sql<number>`COALESCE(SUM(${items.quantity}), 0)` })
    .from(items)
    .where(eq(items.category, 'lemari-c03'));

  const [outOfStock] = await db.select({ value: count() }).from(items).where(eq(items.quantity, 0));

  const [activeLoans] = await db
    .select({ value: count() })
    .from(loans)
    .where(eq(loans.status, 'active'));

  const [lowStockItems] = await db
    .select({ value: count() })
    .from(items)
    .where(and(gt(items.quantity, 0), lt(items.quantity, 7)));

  return {
    totalLemariC01: Number(lemariC01.value),
    totalLemariC02: Number(lemariC02.value),
    totalLemariC03: Number(lemariC03.value),
    outOfStock: outOfStock.value,
    activeLoans: activeLoans.value,
    lowStockItems: lowStockItems.value
  };
}
