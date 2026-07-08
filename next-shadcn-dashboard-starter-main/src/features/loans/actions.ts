'use server';

import { db } from '@/db';
import { loans } from '@/db/schema/loans';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

export type ActionResult = { success: boolean; message: string };

const loanIdSchema = z.object({ loanId: z.string().uuid() }).strict();

export async function getLoans() {
  await requireAdmin();
  return db.select().from(loans).orderBy(loans.loanDate);
}

export async function returnLoan(loanId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = loanIdSchema.safeParse({ loanId });
    if (!parsed.success) return { success: false, message: 'ID tidak valid.' };

    await db.transaction(async (tx) => {
      const [loan] = await tx
        .select({ status: loans.status })
        .from(loans)
        .where(eq(loans.id, parsed.data.loanId))
        .limit(1);

      if (!loan) throw new Error('not_found');
      if (loan.status === 'returned') throw new Error('already_returned');

      await tx
        .update(loans)
        .set({ status: 'returned', returnDate: new Date() })
        .where(eq(loans.id, parsed.data.loanId));
    });

    revalidatePath('/dashboard/loans');
    logger.audit('loan.returned', { loanId, by: admin.email });
    return { success: true, message: 'Barang berhasil dikembalikan.' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : '';
    if (msg.includes('Forbidden') || msg.includes('Unauthorized'))
      return { success: false, message: msg };
    if (msg === 'not_found') return { success: false, message: 'Data tidak ditemukan.' };
    if (msg === 'already_returned') return { success: false, message: 'Sudah dikembalikan.' };
    logger.error('Failed to return loan', { error: String(error) });
    return { success: false, message: 'Gagal memproses pengembalian.' };
  }
}
