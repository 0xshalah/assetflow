'use server';

import { db } from '@/db';
import { items } from '@/db/schema/items';
import { loans } from '@/db/schema/loans';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createLoanSchema, loanIdSchema } from './schemas';

export type ActionResult = {
  success: boolean;
  message: string;
};

/**
 * Fetch all loans with joined item data.
 */
export async function getLoans() {
  return db
    .select({
      id: loans.id,
      itemId: loans.itemId,
      itemName: items.name,
      itemCategory: items.category,
      borrowerName: loans.borrowerName,
      borrowerContact: loans.borrowerContact,
      loanDate: loans.loanDate,
      returnDate: loans.returnDate,
      status: loans.status
    })
    .from(loans)
    .innerJoin(items, eq(loans.itemId, items.id))
    .orderBy(loans.loanDate);
}

/**
 * Create a new loan — atomic transaction with Zod validation:
 * 1. Validate input
 * 2. Verify item is available
 * 3. Insert loan record with status 'active'
 * 4. Update item status to 'borrowed'
 */
export async function createLoan(data: unknown): Promise<ActionResult> {
  const parsed = createLoanSchema.safeParse(data);

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? 'Input tidak valid.';
    return { success: false, message: firstError };
  }

  try {
    await db.transaction(async (tx) => {
      // Verify item is available
      const [item] = await tx
        .select({ status: items.status })
        .from(items)
        .where(eq(items.id, parsed.data.itemId))
        .limit(1);

      if (!item) {
        throw new Error('Item tidak ditemukan.');
      }

      if (item.status !== 'available') {
        throw new Error('Item tidak tersedia untuk dipinjam.');
      }

      // Insert loan record
      await tx.insert(loans).values({
        itemId: parsed.data.itemId,
        borrowerName: parsed.data.borrowerName,
        borrowerContact: parsed.data.borrowerContact,
        status: 'active'
      });

      // Update item status to borrowed
      await tx.update(items).set({ status: 'borrowed' }).where(eq(items.id, parsed.data.itemId));
    });

    revalidatePath('/dashboard/loans');
    revalidatePath('/dashboard/inventory');
    return { success: true, message: 'Peminjaman berhasil dicatat.' };
  } catch (error) {
    console.error('Failed to create loan:', error);
    const message = error instanceof Error ? error.message : 'Gagal mencatat peminjaman.';
    return { success: false, message };
  }
}

/**
 * Mark a loan as returned — atomic transaction:
 * 1. Validate loan ID
 * 2. Update loan status to 'returned' and set return_date
 * 3. Update item status back to 'available'
 */
export async function returnLoan(loanId: string): Promise<ActionResult> {
  const parsed = loanIdSchema.safeParse({ loanId });

  if (!parsed.success) {
    return { success: false, message: 'Loan ID tidak valid.' };
  }

  try {
    await db.transaction(async (tx) => {
      const [loan] = await tx
        .select({ itemId: loans.itemId, status: loans.status })
        .from(loans)
        .where(eq(loans.id, parsed.data.loanId))
        .limit(1);

      if (!loan) {
        throw new Error('Data peminjaman tidak ditemukan.');
      }

      if (loan.status === 'returned') {
        throw new Error('Peminjaman sudah dikembalikan sebelumnya.');
      }

      await tx
        .update(loans)
        .set({
          status: 'returned',
          returnDate: new Date()
        })
        .where(eq(loans.id, parsed.data.loanId));

      await tx.update(items).set({ status: 'available' }).where(eq(items.id, loan.itemId));
    });

    revalidatePath('/dashboard/loans');
    revalidatePath('/dashboard/inventory');
    return { success: true, message: 'Barang berhasil dikembalikan.' };
  } catch (error) {
    console.error('Failed to return loan:', error);
    const message = error instanceof Error ? error.message : 'Gagal memproses pengembalian.';
    return { success: false, message };
  }
}

/**
 * Delete a loan record (admin only, for data correction).
 */
export async function deleteLoan(loanId: string): Promise<ActionResult> {
  const parsed = loanIdSchema.safeParse({ loanId });

  if (!parsed.success) {
    return { success: false, message: 'Loan ID tidak valid.' };
  }

  try {
    await db.transaction(async (tx) => {
      const [loan] = await tx
        .select({ itemId: loans.itemId, status: loans.status })
        .from(loans)
        .where(eq(loans.id, parsed.data.loanId))
        .limit(1);

      if (!loan) {
        throw new Error('Data peminjaman tidak ditemukan.');
      }

      if (loan.status === 'active') {
        await tx.update(items).set({ status: 'available' }).where(eq(items.id, loan.itemId));
      }

      await tx.delete(loans).where(eq(loans.id, parsed.data.loanId));
    });

    revalidatePath('/dashboard/loans');
    revalidatePath('/dashboard/inventory');
    return { success: true, message: 'Data peminjaman berhasil dihapus.' };
  } catch (error) {
    console.error('Failed to delete loan:', error);
    return { success: false, message: 'Gagal menghapus data peminjaman.' };
  }
}
