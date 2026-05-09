import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  // If already logged in, go straight to dashboard
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
      <div className='mb-6 flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
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
        className='text-center text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50'
        style={{ letterSpacing: '-0.035em' }}
      >
        AssetFlow
      </h1>

      {/* Tagline */}
      <p className='mt-4 max-w-md text-center text-[17px] text-zinc-500 dark:text-zinc-400'>
        Inventory & Loan Tracking for IT Operations.
      </p>

      {/* CTAs */}
      <div className='mt-10 flex items-center gap-3'>
        <Link
          href='/auth/sign-in'
          className='inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-7 text-[14px] font-medium text-zinc-50 transition-transform active:scale-[0.97] dark:bg-zinc-100 dark:text-zinc-900'
        >
          Sign In
        </Link>
        <Link
          href='/auth/sign-up'
          className='inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 px-7 text-[14px] font-medium text-zinc-700 transition-transform active:scale-[0.97] dark:border-zinc-800 dark:text-zinc-300'
        >
          Create Account
        </Link>
      </div>

      {/* Footer */}
      <p className='absolute bottom-8 text-[12px] text-zinc-400 dark:text-zinc-600'>
        Built for IT Support & Asset Management
      </p>
    </div>
  );
}
