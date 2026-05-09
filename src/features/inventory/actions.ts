'use server';

import { db } from '@/db';
import { items, type ItemStatus } from '@/db/schema/items';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createItemSchema, updateItemSchema } from './schemas';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/auth';

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
 * Create a new item with Zod validation. Admin only.
 */
export async function createItem(data: unknown): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = createItemSchema.safeParse(data);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Input tidak valid.';
      return { success: false, message: firstError };
    }

    await db.insert(items).values(parsed.data);
    revalidatePath('/dashboard/inventory');
    logger.audit('item.created', {
      name: parsed.data.name,
      category: parsed.data.category,
      by: admin.email
    });
    return { success: true, message: 'Item berhasil ditambahkan.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menambahkan item.';
    if (message.includes('Forbidden') || message.includes('Unauthorized')) {
      return { success: false, message };
    }
    logger.error('Failed to create item', { error: String(error) });
    return { success: false, message: 'Gagal menambahkan item.' };
  }
}

/**
 * Update an existing item with Zod validation. Admin only.
 */
export async function updateItem(id: string, data: unknown): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();

    if (!id || typeof id !== 'string') {
      return { success: false, message: 'ID tidak valid.' };
    }

    const parsed = updateItemSchema.safeParse(data);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Input tidak valid.';
      return { success: false, message: firstError };
    }

    await db.update(items).set(parsed.data).where(eq(items.id, id));
    revalidatePath('/dashboard/inventory');
    logger.audit('item.updated', { itemId: id, changes: parsed.data, by: admin.email });
    return { success: true, message: 'Item berhasil diperbarui.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui item.';
    if (message.includes('Forbidden') || message.includes('Unauthorized')) {
      return { success: false, message };
    }
    logger.error('Failed to update item', { error: String(error), itemId: id });
    return { success: false, message: 'Gagal memperbarui item.' };
  }
}

/**
 * Delete an item by ID. Admin only.
 */
export async function deleteItem(id: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();

    if (!id || typeof id !== 'string') {
      return { success: false, message: 'ID tidak valid.' };
    }

    await db.delete(items).where(eq(items.id, id));
    revalidatePath('/dashboard/inventory');
    logger.audit('item.deleted', { itemId: id, by: admin.email });
    return { success: true, message: 'Item berhasil dihapus.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus item.';
    if (message.includes('Forbidden') || message.includes('Unauthorized')) {
      return { success: false, message };
    }
    logger.error('Failed to delete item', { error: String(error), itemId: id });
    return {
      success: false,
      message: 'Gagal menghapus item. Pastikan item tidak sedang dipinjam.'
    };
  }
}
