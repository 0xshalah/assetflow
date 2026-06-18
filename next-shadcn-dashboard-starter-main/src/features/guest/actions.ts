'use server';

import { db } from '@/db';
import { items, type ItemCategory } from '@/db/schema/items';
import { loans } from '@/db/schema/loans';
import { pickups } from '@/db/schema/pickups';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { DEPARTMENT_OPTIONS, ISSUER_OPTIONS } from './constants';

/**
 * Validate the global PIN for non-admin access.
 */
export async function validatePin(pin: string): Promise<{ success: boolean; message: string }> {
  const correctPin = process.env.NON_ADMIN_PIN;

  if (!correctPin) {
    logger.error('NON_ADMIN_PIN not configured');
    return { success: false, message: 'Sistem belum dikonfigurasi.' };
  }

  if (pin === correctPin) {
    return { success: true, message: 'PIN valid.' };
  }

  return { success: false, message: 'PIN salah.' };
}

/**
 * Get available items by category.
 */
export async function getItemsByCategory(category: ItemCategory) {
  return db.select().from(items).where(eq(items.category, category)).orderBy(items.name);
}

/**
 * Get all items for loan selection.
 */
export async function getItemsForLoan() {
  return db.select().from(items).orderBy(items.name);
}

// --- Schemas ---

const createPickupSchema = z
  .object({
    itemId: z.string().uuid(),
    personName: z.string().min(1, 'Nama wajib diisi.').max(100).trim(),
    departmentOrigin: z.enum(DEPARTMENT_OPTIONS, { message: 'Departemen tidak valid.' }),
    quantity: z.number().int().min(1, 'Jumlah minimal 1.').max(9999),
    purpose: z.string().min(1, 'Jenis keperluan wajib diisi.').max(200).trim(),
    issuedBy: z.enum(ISSUER_OPTIONS, { message: 'Nama pengeluaran tidak valid.' }),
    issuerDepartment: z.string().default('FMD'),
    pickedAt: z.string().min(1, 'Tanggal & waktu wajib diisi.')
  })
  .strict();

const createLoanSchema = z
  .object({
    itemId: z.string().uuid(),
    borrowerName: z.string().min(1).max(100).trim(),
    borrowerContact: z.string().min(1).max(100).trim()
  })
  .strict();

/**
 * Create a pickup (pengambilan barang). Non-admin action.
 */
export async function createPickup(data: unknown) {
  const parsed = createPickupSchema.safeParse(data);

  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? 'Input tidak valid.';
    return { success: false, message: msg };
  }

  try {
    await db.transaction(async (tx) => {
      const [item] = await tx
        .select({ quantity: items.quantity })
        .from(items)
        .where(eq(items.id, parsed.data.itemId))
        .limit(1);

      if (!item) throw new Error('Barang tidak ditemukan.');
      if (item.quantity < parsed.data.quantity) {
        throw new Error(`Stok tidak cukup. Tersedia: ${item.quantity}`);
      }

      await tx.insert(pickups).values({
        itemId: parsed.data.itemId,
        personName: parsed.data.personName,
        departmentOrigin: parsed.data.departmentOrigin,
        quantity: parsed.data.quantity,
        purpose: parsed.data.purpose,
        issuedBy: parsed.data.issuedBy,
        issuerDepartment: parsed.data.issuerDepartment,
        pickedAt: new Date(parsed.data.pickedAt)
      });

      await tx
        .update(items)
        .set({ quantity: item.quantity - parsed.data.quantity })
        .where(eq(items.id, parsed.data.itemId));
    });

    revalidatePath('/guest/menu');
    logger.audit('pickup.created', {
      itemId: parsed.data.itemId,
      person: parsed.data.personName,
      qty: parsed.data.quantity
    });
    return { success: true, message: 'Pengambilan berhasil dicatat.' };
  } catch (error) {
    const raw = error instanceof Error ? error.message : '';
    const safe: Record<string, string> = {
      'Barang tidak ditemukan.': 'Barang tidak ditemukan.'
    };
    const msg =
      safe[raw] ?? (raw.startsWith('Stok tidak cukup') ? raw : 'Gagal mencatat pengambilan.');
    logger.error('Failed to create pickup', { error: String(error) });
    return { success: false, message: msg };
  }
}

/**
 * Create a loan (peminjaman barang). Non-admin action.
 */
export async function createGuestLoan(data: unknown) {
  const parsed = createLoanSchema.safeParse(data);

  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? 'Input tidak valid.';
    return { success: false, message: msg };
  }

  try {
    await db.transaction(async (tx) => {
      const [item] = await tx
        .select({ quantity: items.quantity })
        .from(items)
        .where(eq(items.id, parsed.data.itemId))
        .limit(1);

      if (!item) throw new Error('Barang tidak ditemukan.');
      if (item.quantity <= 0) throw new Error('Barang tidak tersedia.');

      await tx.insert(loans).values({
        itemId: parsed.data.itemId,
        borrowerName: parsed.data.borrowerName,
        borrowerContact: parsed.data.borrowerContact,
        status: 'active'
      });

      await tx
        .update(items)
        .set({ quantity: item.quantity - 1 })
        .where(eq(items.id, parsed.data.itemId));
    });

    revalidatePath('/guest/menu');
    logger.audit('loan.created_by_guest', {
      itemId: parsed.data.itemId,
      borrower: parsed.data.borrowerName
    });
    return { success: true, message: 'Peminjaman berhasil dicatat.' };
  } catch (error) {
    const raw = error instanceof Error ? error.message : '';
    const safe: Record<string, string> = {
      'Barang tidak ditemukan.': 'Barang tidak ditemukan.',
      'Barang tidak tersedia.': 'Barang tidak tersedia.'
    };
    const msg = safe[raw] ?? 'Gagal mencatat peminjaman.';
    logger.error('Failed to create guest loan', { error: String(error) });
    return { success: false, message: msg };
  }
}
