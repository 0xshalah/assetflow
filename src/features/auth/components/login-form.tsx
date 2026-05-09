'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    router.push('/dashboard/overview');
    router.refresh();
  }

  async function handleOAuth(provider: 'google' | 'github') {
    if (provider === 'google') setIsGoogleLoading(true);
    if (provider === 'github') setIsGithubLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      toast.error(error.message);
      setIsGoogleLoading(false);
      setIsGithubLoading(false);
    }
  }

  return (
    <div className='w-full max-w-[360px]'>
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight' style={{ letterSpacing: '-0.025em' }}>
          Sign in
        </h1>
        <p className='text-muted-foreground mt-2 text-[14px]'>
          Masuk ke AssetFlow untuk mengelola inventaris.
        </p>
      </div>

      <div className='flex flex-col gap-3'>
        <Button
          variant='outline'
          className='h-11 w-full rounded-lg border-zinc-200 text-[14px] font-medium active:scale-[0.98] transition-transform dark:border-zinc-800'
          onClick={() => handleOAuth('google')}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
              <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#4285F4'
              />
              <path
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                fill='#34A853'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                fill='#FBBC05'
              />
              <path
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                fill='#EA4335'
              />
            </svg>
          )}
          Continue with Google
        </Button>

        <Button
          variant='outline'
          className='h-11 w-full rounded-lg border-zinc-200 text-[14px] font-medium active:scale-[0.98] transition-transform dark:border-zinc-800'
          onClick={() => handleOAuth('github')}
          disabled={isGithubLoading}
        >
          {isGithubLoading ? (
            <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <Icons.github className='mr-2 h-4 w-4' />
          )}
          Continue with GitHub
        </Button>
      </div>

      <div className='relative my-6'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-zinc-200 dark:border-zinc-800' />
        </div>
        <div className='relative flex justify-center text-xs'>
          <span className='bg-zinc-50 px-2 text-muted-foreground dark:bg-zinc-950'>or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <div className='space-y-2'>
          <Label htmlFor='email' className='text-[13px] font-medium'>
            Email
          </Label>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='admin@company.com'
            required
            autoFocus
            className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='password' className='text-[13px] font-medium'>
            Password
          </Label>
          <Input
            id='password'
            name='password'
            type='password'
            placeholder='••••••••'
            required
            className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
          />
        </div>

        <Button
          type='submit'
          disabled={isLoading}
          className='h-11 w-full rounded-lg text-[14px] font-medium active:scale-[0.98] transition-transform'
        >
          {isLoading ? <Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> : 'Sign in'}
        </Button>
      </form>

      <p className='text-muted-foreground mt-6 text-center text-[13px]'>
        Belum punya akun?{' '}
        <Link href='/auth/sign-up' className='text-foreground font-medium hover:underline'>
          Sign up
        </Link>
      </p>
    </div>
  );
}
