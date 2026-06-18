'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function InventoryError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        message: 'Inventory page error',
        context: { errorMessage: error.message, digest: error.digest }
      })
    );
  }, [error]);

  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20'>
      <div className='text-center'>
        <h2 className='text-xl font-semibold tracking-tight' style={{ letterSpacing: '-0.02em' }}>
          Gagal Memuat Inventory
        </h2>
        <p className='text-muted-foreground mt-2 text-[14px] max-w-sm'>
          Tidak dapat terhubung ke database. Periksa koneksi internet atau coba lagi.
        </p>
      </div>
      <Button
        onClick={reset}
        variant='outline'
        className='mt-2 rounded-full px-5 text-[13px] font-medium active:scale-[0.98] transition-transform'
      >
        Muat Ulang
      </Button>
    </div>
  );
}
