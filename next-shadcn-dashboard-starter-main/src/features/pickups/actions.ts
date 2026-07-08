'use server';

import { db } from '@/db';
import { items } from '@/db/schema/items';
import { pickups } from '@/db/schema/pickups';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import type { ItemCategory } from '@/db/schema/items';

export async function getPickupsByCategory(category: ItemCategory) {
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
    .orderBy(pickups.pickedAt);
}
