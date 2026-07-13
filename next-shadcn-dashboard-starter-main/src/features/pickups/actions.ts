'use server';

import { db } from '@/db';
import { items } from '@/db/schema/items';
import { pickups } from '@/db/schema/pickups';
import { eq, count } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { cache } from 'react';
import type { ItemCategory } from '@/db/schema/items';

const PICKUPS_PER_PAGE = 15;

export const getPickupsByCategory = cache(
  async (category: ItemCategory, limit = PICKUPS_PER_PAGE, offset = 0) => {
    await requireAdmin();

    return db
      .select({
        id: pickups.id,
        itemName: items.name,
        itemSpecification: items.specification,
        personName: pickups.personName,
        departmentOrigin: pickups.departmentOrigin,
        quantity: pickups.quantity,
        purpose: pickups.purpose,
        issuedBy: pickups.issuedBy,
        issuerDepartment: pickups.issuerDepartment,
        pickedAt: pickups.pickedAt
      })
      .from(pickups)
      .innerJoin(items, eq(pickups.itemId, items.id))
      .where(eq(items.category, category))
      .orderBy(pickups.pickedAt)
      .limit(limit)
      .offset(offset);
  }
);

export const getTotalPickups = cache(async (category: ItemCategory) => {
  await requireAdmin();
  const [row] = await db
    .select({ value: count() })
    .from(pickups)
    .innerJoin(items, eq(pickups.itemId, items.id))
    .where(eq(items.category, category));
  return row.value;
});
