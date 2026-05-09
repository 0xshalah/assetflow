import { purgeExpiredPII } from '@/features/loans/purge';
import { NextResponse } from 'next/server';

/**
 * Cron endpoint to purge expired PII data.
 * Protected by CRON_SECRET to prevent unauthorized access.
 *
 * Vercel Cron config (vercel.json):
 * { "crons": [{ "path": "/api/cron/purge-pii", "schedule": "0 3 * * *" }] }
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');

  // Verify cron secret (set in Vercel env vars)
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const count = await purgeExpiredPII(30);

  return NextResponse.json({
    success: true,
    purgedRecords: count,
    timestamp: new Date().toISOString()
  });
}
