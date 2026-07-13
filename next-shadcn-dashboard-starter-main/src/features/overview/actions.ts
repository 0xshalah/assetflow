'use server';

import { db } from '@/db';
import { items } from '@/db/schema/items';
import { loans } from '@/db/schema/loans';
import { eq, count, sql, and, gt, lte } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { cache } from 'react';

export interface DashboardMetrics {
  totalLemariC01: number;
  totalLemariC02: number;
  totalLemariC03: number;
  outOfStock: number;
  activeLoans: number;
  lowStockItems: number;
}

export const getDashboardMetrics = cache(async (): Promise<DashboardMetrics> => {
  await requireAdmin();

  const [
    [lemariC01],
    [lemariC02],
    [lemariC03],
    [outOfStock],
    [activeLoans],
    [lowStockItems]
  ] = await Promise.all([
    db
      .select({ value: sql<number>`COALESCE(SUM(${items.quantity}), 0)` })
      .from(items)
      .where(eq(items.category, 'lemari-c01')),
    db
      .select({ value: sql<number>`COALESCE(SUM(${items.quantity}), 0)` })
      .from(items)
      .where(eq(items.category, 'lemari-c02')),
    db
      .select({ value: sql<number>`COALESCE(SUM(${items.quantity}), 0)` })
      .from(items)
      .where(eq(items.category, 'lemari-c03')),
    db.select({ value: count() }).from(items).where(eq(items.quantity, 0)),
    db
      .select({ value: count() })
      .from(loans)
      .where(eq(loans.status, 'active')),
    db
      .select({ value: count() })
      .from(items)
      .where(and(gt(items.quantity, 0), lte(items.quantity, items.minimumStock)))
  ]);

  return {
    totalLemariC01: Number(lemariC01.value),
    totalLemariC02: Number(lemariC02.value),
    totalLemariC03: Number(lemariC03.value),
    outOfStock: outOfStock.value,
    activeLoans: activeLoans.value,
    lowStockItems: lowStockItems.value
  };
});
