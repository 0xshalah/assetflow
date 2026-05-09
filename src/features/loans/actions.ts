'use server';

import { db } from '@/db';
import { items } from '@/db/schema/items';
import { loans } from '@/db/schema/loans';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createLoanSchema, loanIdSchema } from './schemas';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/auth';

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
 * Create a new loan — atomic transaction with Zod validation. Admin only.
 */
export async function createLoan(data: unknown): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = createLoanSchema.safeParse(data);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Input tidak valid.';
      return { success: false, message: firstError };
    }

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
    logger.audit('loan.created', {
      itemId: parsed.data.itemId,
      borrower: parsed.data.borrowerName,
      by: admin.email
    });
    return { success: true, message: 'Peminjaman berhasil dicatat.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mencatat peminjaman.';
    if (message.includes('Forbidden') || message.includes('Unauthorized')) {
      return { success: false, message };
    }
    logger.error('Failed to create loan', { error: String(error) });
    return { success: false, message };
  }
}

/**
 * Mark a loan as returned — atomic transaction. Admin only.
 */
export async function returnLoan(loanId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = loanIdSchema.safeParse({ loanId });

    if (!parsed.success) {
      return { success: false, message: 'Loan ID tidak valid.' };
    }
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
    logger.audit('loan.returned', { loanId: parsed.data.loanId, by: admin.email });
    return { success: true, message: 'Barang berhasil dikembalikan.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal memproses pengembalian.';
    if (message.includes('Forbidden') || message.includes('Unauthorized')) {
      return { success: false, message };
    }
    logger.error('Failed to return loan', { error: String(error), loanId });
    return { success: false, message };
  }
}

/**
 * Delete a loan record. Admin only.
 */
export async function deleteLoan(loanId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = loanIdSchema.safeParse({ loanId });

    if (!parsed.success) {
      return { success: false, message: 'Loan ID tidak valid.' };
    }
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
    logger.audit('loan.deleted', { loanId: parsed.data.loanId, by: admin.email });
    return { success: true, message: 'Data peminjaman berhasil dihapus.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus data peminjaman.';
    if (message.includes('Forbidden') || message.includes('Unauthorized')) {
      return { success: false, message };
    }
    logger.error('Failed to delete loan', { error: String(error), loanId });
    return { success: false, message: 'Gagal menghapus data peminjaman.' };
  }
}
