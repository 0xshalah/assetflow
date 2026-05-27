'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to structured logger (server-side) or external service
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        message: 'Unhandled dashboard error',
        context: { errorMessage: error.message, digest: error.digest }
      })
    );
  }, [error]);

  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20'>
      <div className='text-center'>
        <h2 className='text-2xl font-semibold tracking-tight' style={{ letterSpacing: '-0.025em' }}>
          Terjadi Kesalahan
        </h2>
        <p className='text-muted-foreground mt-2 text-[14px] max-w-md'>
          Maaf, terjadi kesalahan saat memproses permintaan. Silakan coba lagi atau hubungi
          administrator jika masalah berlanjut.
        </p>
        {error.digest && (
          <p className='text-muted-foreground/60 mt-2 text-[12px] font-mono'>
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <Button
        onClick={reset}
        className='mt-4 rounded-full px-6 text-[13px] font-medium active:scale-[0.98] transition-transform'
      >
        Coba Lagi
      </Button>
    </div>
  );
}
