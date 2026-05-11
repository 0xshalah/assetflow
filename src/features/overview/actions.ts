'use server';

import { db } from '@/db';
import { items } from '@/db/schema/items';
import { loans } from '@/db/schema/loans';
import { pickups } from '@/db/schema/pickups';
import { eq, count, sql } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

export interface DashboardMetrics {
  totalElektrik: number;
  totalMekanik: number;
  totalFacility: number;
  outOfStock: number;
  activeLoans: number;
  totalPickups: number;
}

/**
 * Get dashboard overview metrics. Admin only.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  await requireAdmin();

  const [elektrik] = await db
    .select({ value: sql<number>`COALESCE(SUM(${items.quantity}), 0)` })
    .from(items)
    .where(eq(items.category, 'elektrik'));

  const [mekanik] = await db
    .select({ value: sql<number>`COALESCE(SUM(${items.quantity}), 0)` })
    .from(items)
    .where(eq(items.category, 'mekanik'));

  const [facility] = await db
    .select({ value: sql<number>`COALESCE(SUM(${items.quantity}), 0)` })
    .from(items)
    .where(eq(items.category, 'facility'));

  const [outOfStock] = await db.select({ value: count() }).from(items).where(eq(items.quantity, 0));

  const [activeLoans] = await db
    .select({ value: count() })
    .from(loans)
    .where(eq(loans.status, 'active'));

  const [totalPickups] = await db.select({ value: count() }).from(pickups);

  return {
    totalElektrik: Number(elektrik.value),
    totalMekanik: Number(mekanik.value),
    totalFacility: Number(facility.value),
    outOfStock: outOfStock.value,
    activeLoans: activeLoans.value,
    totalPickups: totalPickups.value
  };
}
