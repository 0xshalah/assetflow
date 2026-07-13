'use server';

import { db } from '@/db';
import { items } from '@/db/schema/items';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import { createItemSchema, updateItemSchema } from './schemas';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/auth';

export type ActionResult = { success: boolean; message: string };

export const getItems = cache(async () => {
  await requireAdmin();
  return db.select().from(items).orderBy(items.name);
});

/**
 * Create a new item (barang masuk). Admin only.
 */
export async function createItem(data: unknown): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = createItemSchema.safeParse(data);

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Input tidak valid.' };
    }

    const { receivedAt, ...rest } = parsed.data;
    await db.insert(items).values({
      ...rest,
      receivedAt: new Date(receivedAt)
    });
    revalidatePath('/dashboard/inventory', 'page');
    revalidatePath('/dashboard/overview', 'page');
    logger.audit('item.created', {
      name: parsed.data.name,
      category: parsed.data.category,
      qty: parsed.data.quantity,
      by: admin.email
    });
    return { success: true, message: 'Barang berhasil ditambahkan.' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : '';
    if (msg.includes('Forbidden') || msg.includes('Unauthorized'))
      return { success: false, message: msg };
    logger.error('Failed to create item', { error: String(error) });
    return { success: false, message: 'Gagal menambahkan barang.' };
  }
}

/**
 * Update an item. Admin only.
 */
export async function updateItem(id: string, data: unknown): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (!id) return { success: false, message: 'ID tidak valid.' };

    const parsed = updateItemSchema.safeParse(data);
    if (!parsed.success)
      return { success: false, message: parsed.error.issues[0]?.message ?? 'Input tidak valid.' };

    const { receivedAt, ...rest } = parsed.data;
    const updateData = receivedAt ? { ...rest, receivedAt: new Date(receivedAt) } : rest;

    await db.update(items).set(updateData).where(eq(items.id, id));
    revalidatePath('/dashboard/inventory', 'page');
    revalidatePath('/dashboard/overview', 'page');
    logger.audit('item.updated', { itemId: id, changes: parsed.data, by: admin.email });
    return { success: true, message: 'Barang berhasil diperbarui.' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : '';
    if (msg.includes('Forbidden') || msg.includes('Unauthorized'))
      return { success: false, message: msg };
    logger.error('Failed to update item', { error: String(error), itemId: id });
    return { success: false, message: 'Gagal memperbarui barang.' };
  }
}

/**
 * Delete an item. Admin only.
 */
export async function deleteItem(id: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (!id) return { success: false, message: 'ID tidak valid.' };

    await db.delete(items).where(eq(items.id, id));
    revalidatePath('/dashboard/inventory', 'page');
    revalidatePath('/dashboard/overview', 'page');
    logger.audit('item.deleted', { itemId: id, by: admin.email });
    return { success: true, message: 'Barang berhasil dihapus.' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : '';
    if (msg.includes('Forbidden') || msg.includes('Unauthorized'))
      return { success: false, message: msg };
    logger.error('Failed to delete item', { error: String(error), itemId: id });
    return {
      success: false,
      message: 'Gagal menghapus barang. Pastikan tidak ada transaksi terkait.'
    };
  }
}
