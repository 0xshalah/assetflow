'use server';

import { db } from '@/db';
import { items } from '@/db/schema/items';
import { loans, type NewLoan } from '@/db/schema/loans';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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
 * Create a new loan — atomic transaction:
 * 1. Insert loan record with status 'active'
 * 2. Update item status to 'borrowed'
 */
export async function createLoan(
  data: Pick<NewLoan, 'itemId' | 'borrowerName' | 'borrowerContact'>
): Promise<ActionResult> {
  try {
    await db.transaction(async (tx) => {
      // Verify item is available
      const [item] = await tx
        .select({ status: items.status })
        .from(items)
        .where(eq(items.id, data.itemId))
        .limit(1);

      if (!item) {
        throw new Error('Item tidak ditemukan.');
      }

      if (item.status !== 'available') {
        throw new Error('Item tidak tersedia untuk dipinjam.');
      }

      // Insert loan record
      await tx.insert(loans).values({
        itemId: data.itemId,
        borrowerName: data.borrowerName,
        borrowerContact: data.borrowerContact,
        status: 'active'
      });

      // Update item status to borrowed
      await tx.update(items).set({ status: 'borrowed' }).where(eq(items.id, data.itemId));
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
 * 1. Update loan status to 'returned' and set return_date
 * 2. Update item status back to 'available'
 */
export async function returnLoan(loanId: string): Promise<ActionResult> {
  try {
    await db.transaction(async (tx) => {
      // Get the loan to find the item
      const [loan] = await tx
        .select({ itemId: loans.itemId, status: loans.status })
        .from(loans)
        .where(eq(loans.id, loanId))
        .limit(1);

      if (!loan) {
        throw new Error('Data peminjaman tidak ditemukan.');
      }

      if (loan.status === 'returned') {
        throw new Error('Peminjaman sudah dikembalikan sebelumnya.');
      }

      // Update loan: set status to returned and fill return_date
      await tx
        .update(loans)
        .set({
          status: 'returned',
          returnDate: new Date()
        })
        .where(eq(loans.id, loanId));

      // Update item: set status back to available
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
  try {
    await db.transaction(async (tx) => {
      const [loan] = await tx
        .select({ itemId: loans.itemId, status: loans.status })
        .from(loans)
        .where(eq(loans.id, loanId))
        .limit(1);

      if (!loan) {
        throw new Error('Data peminjaman tidak ditemukan.');
      }

      // If loan is still active, restore item to available
      if (loan.status === 'active') {
        await tx.update(items).set({ status: 'available' }).where(eq(items.id, loan.itemId));
      }

      await tx.delete(loans).where(eq(loans.id, loanId));
    });

    revalidatePath('/dashboard/loans');
    revalidatePath('/dashboard/inventory');
    return { success: true, message: 'Data peminjaman berhasil dihapus.' };
  } catch (error) {
    console.error('Failed to delete loan:', error);
    return { success: false, message: 'Gagal menghapus data peminjaman.' };
  }
}
