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

export async function getItemsByCategory(category: ItemCategory) {
  return db.select().from(items).where(eq(items.category, category)).orderBy(items.name);
}

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
    itemName: z.string().min(1, 'Nama barang wajib diisi.').max(200).trim(),
    quantity: z.number().int().min(1, 'Jumlah minimal 1.').max(50, 'Maksimal 50.'),
    purpose: z.string().min(1, 'Keperluan wajib diisi.').max(500).trim(),
    borrowerName: z.string().min(1, 'Nama peminjam wajib diisi.').max(100).trim(),
    department: z.string().min(1, 'Departemen wajib diisi.').max(100).trim(),
    borrowerContact: z.string().min(1, 'Kontak wajib diisi.').max(100).trim()
  })
  .strict();

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

export async function createGuestLoan(data: unknown) {
  const parsed = createLoanSchema.safeParse(data);

  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? 'Input tidak valid.';
    return { success: false, message: msg };
  }

  try {
    await db.insert(loans).values({
      itemName: parsed.data.itemName,
      quantity: parsed.data.quantity,
      purpose: parsed.data.purpose,
      borrowerName: parsed.data.borrowerName,
      department: parsed.data.department,
      borrowerContact: parsed.data.borrowerContact,
      status: 'active'
    });

    revalidatePath('/guest/menu');
    revalidatePath('/dashboard/loans');
    logger.audit('loan.created_by_guest', {
      itemName: parsed.data.itemName,
      borrower: parsed.data.borrowerName
    });
    return { success: true, message: 'Peminjaman berhasil dicatat.' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : '';
    if (msg.includes('Forbidden') || msg.includes('Unauthorized'))
      return { success: false, message: msg };
    logger.error('Failed to create guest loan', { error: String(error) });
    return { success: false, message: 'Gagal mencatat peminjaman.' };
  }
}
