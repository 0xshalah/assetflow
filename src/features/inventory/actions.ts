'use server';

import { db } from '@/db';
import { items, type NewItem, type ItemStatus } from '@/db/schema/items';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export type ActionResult = {
  success: boolean;
  message: string;
};

/**
 * Fetch all items with optional filtering.
 */
export async function getItems(filters?: {
  status?: ItemStatus;
  category?: string;
  search?: string;
}) {
  let query = db.select().from(items).$dynamic();

  if (filters?.status) {
    query = query.where(eq(items.status, filters.status));
  }

  if (filters?.category) {
    query = query.where(eq(items.category, filters.category));
  }

  // For search, we use ilike if available; drizzle supports it via sql
  if (filters?.search) {
    const { ilike } = await import('drizzle-orm');
    query = query.where(ilike(items.name, `%${filters.search}%`));
  }

  return query;
}

/**
 * Fetch a single item by ID.
 */
export async function getItemById(id: string) {
  const result = await db.select().from(items).where(eq(items.id, id)).limit(1);
  return result[0] ?? null;
}

/**
 * Create a new item.
 */
export async function createItem(data: NewItem): Promise<ActionResult> {
  try {
    await db.insert(items).values(data);
    revalidatePath('/dashboard/inventory');
    return { success: true, message: 'Item berhasil ditambahkan.' };
  } catch (error) {
    console.error('Failed to create item:', error);
    return { success: false, message: 'Gagal menambahkan item.' };
  }
}

/**
 * Update an existing item.
 */
export async function updateItem(
  id: string,
  data: Partial<Pick<NewItem, 'name' | 'category' | 'status'>>
): Promise<ActionResult> {
  try {
    await db.update(items).set(data).where(eq(items.id, id));
    revalidatePath('/dashboard/inventory');
    return { success: true, message: 'Item berhasil diperbarui.' };
  } catch (error) {
    console.error('Failed to update item:', error);
    return { success: false, message: 'Gagal memperbarui item.' };
  }
}

/**
 * Delete an item by ID.
 */
export async function deleteItem(id: string): Promise<ActionResult> {
  try {
    await db.delete(items).where(eq(items.id, id));
    revalidatePath('/dashboard/inventory');
    return { success: true, message: 'Item berhasil dihapus.' };
  } catch (error) {
    console.error('Failed to delete item:', error);
    return { success: false, message: 'Gagal menghapus item. Pastikan item tidak sedang dipinjam.' };
  }
}
