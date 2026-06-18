'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { validatePin } from '../actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

export function PinForm() {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const result = await validatePin(pin);

    if (result.success) {
      // Store PIN validation in sessionStorage (client-only, not a security measure)
      sessionStorage.setItem('guest_verified', 'true');
      router.push('/guest/menu');
    } else {
      toast.error(result.message);
      setIsLoading(false);
    }
  }

  return (
    <div className='w-full max-w-[320px]'>
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight' style={{ letterSpacing: '-0.025em' }}>
          Masukkan PIN
        </h1>
        <p className='text-muted-foreground mt-2 text-[14px]'>
          Masukkan PIN untuk mengakses menu pengambilan & peminjaman.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <Input
          type='password'
          inputMode='numeric'
          maxLength={8}
          placeholder='••••'
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
          autoFocus
          className='h-14 rounded-xl border-zinc-200 text-center text-2xl tracking-[0.3em] dark:border-zinc-800'
        />

        <Button
          type='submit'
          disabled={isLoading || pin.length === 0}
          className='h-12 w-full rounded-xl text-[14px] font-medium active:scale-[0.98] transition-transform'
        >
          {isLoading ? <Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> : 'Masuk'}
        </Button>
      </form>

      <p className='text-muted-foreground mt-6 text-center text-[13px]'>
        <Link href='/' className='hover:underline'>
          ← Kembali
        </Link>
      </p>
    </div>
  );
}
