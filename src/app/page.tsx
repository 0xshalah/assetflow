import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard/overview');
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-white px-6 dark:from-zinc-950 dark:to-zinc-900'>
      {/* Logo */}
      <div className='mb-6'>
        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 dark:bg-zinc-100'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-zinc-50 dark:text-zinc-900'
          >
            <path d='m7.5 4.27 9 5.15' />
            <path d='M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' />
            <path d='m3.3 7 8.7 5 8.7-5' />
            <path d='M12 22V12' />
          </svg>
        </div>
      </div>

      {/* Headline */}
      <h1
        className='text-center text-4xl font-semibold text-zinc-900 sm:text-5xl dark:text-zinc-50'
        style={{ letterSpacing: '-0.035em' }}
      >
        AssetFlow
      </h1>

      {/* Tagline */}
      <p className='mt-4 max-w-sm text-center text-[17px] text-zinc-500 dark:text-zinc-400'>
        Inventory, Peminjaman & Pengambilan Barang.
      </p>

      {/* Two Options */}
      <div className='mt-12 flex flex-col gap-4 sm:flex-row'>
        <Link
          href='/auth/sign-in'
          className='inline-flex h-14 w-52 items-center justify-center rounded-2xl bg-zinc-900 text-[15px] font-medium text-zinc-50 transition-transform active:scale-[0.97] dark:bg-zinc-100 dark:text-zinc-900'
        >
          Admin
        </Link>
        <Link
          href='/guest'
          className='inline-flex h-14 w-52 items-center justify-center rounded-2xl border border-zinc-200 text-[15px] font-medium text-zinc-700 transition-transform active:scale-[0.97] dark:border-zinc-800 dark:text-zinc-300'
        >
          Non-Admin
        </Link>
      </div>

      {/* Footer */}
      <p className='absolute bottom-8 text-[12px] text-zinc-400 dark:text-zinc-600'>
        IT Support & Asset Management
      </p>
    </div>
  );
}
