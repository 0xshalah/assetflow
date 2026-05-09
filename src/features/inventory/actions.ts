'use server';

import { db } from '@/db';
import { items, type ItemStatus } from '@/db/schema/items';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createItemSchema, updateItemSchema } from './schemas';

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
 * Create a new item with Zod validation.
 */
export async function createItem(data: unknown): Promise<ActionResult> {
  const parsed = createItemSchema.safeParse(data);

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? 'Input tidak valid.';
    return { success: false, message: firstError };
  }

  try {
    await db.insert(items).values(parsed.data);
    revalidatePath('/dashboard/inventory');
    return { success: true, message: 'Item berhasil ditambahkan.' };
  } catch (error) {
    console.error('Failed to create item:', error);
    return { success: false, message: 'Gagal menambahkan item.' };
  }
}

/**
 * Update an existing item with Zod validation.
 */
export async function updateItem(id: string, data: unknown): Promise<ActionResult> {
  if (!id || typeof id !== 'string') {
    return { success: false, message: 'ID tidak valid.' };
  }

  const parsed = updateItemSchema.safeParse(data);

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? 'Input tidak valid.';
    return { success: false, message: firstError };
  }

  try {
    await db.update(items).set(parsed.data).where(eq(items.id, id));
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
  if (!id || typeof id !== 'string') {
    return { success: false, message: 'ID tidak valid.' };
  }

  try {
    await db.delete(items).where(eq(items.id, id));
    revalidatePath('/dashboard/inventory');
    return { success: true, message: 'Item berhasil dihapus.' };
  } catch (error) {
    console.error('Failed to delete item:', error);
    return {
      success: false,
      message: 'Gagal menghapus item. Pastikan item tidak sedang dipinjam.'
    };
  }
}
