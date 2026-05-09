import 'server-only';

import { db } from '@/db';
import { loans } from '@/db/schema/loans';
import { eq, lt, and } from 'drizzle-orm';
import { logger } from '@/lib/logger';

/**
 * PII Data Retention: Mask borrower contact info on returned loans
 * older than the retention period (default: 30 days).
 *
 * This should be called via a scheduled cron job (e.g., Vercel Cron).
 * Masks borrower_contact with '***' to comply with data minimization principles.
 */
export async function purgeExpiredPII(retentionDays = 30): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  const result = await db
    .update(loans)
    .set({ borrowerContact: '***' })
    .where(and(eq(loans.status, 'returned'), lt(loans.returnDate, cutoffDate)))
    .returning({ id: loans.id });

  const count = result.length;

  if (count > 0) {
    logger.audit('pii.purged', { recordsAffected: count, retentionDays });
  }

  return count;
}
