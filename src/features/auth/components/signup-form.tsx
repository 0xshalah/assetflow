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

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success('Cek email kamu untuk verifikasi akun.');
    router.push('/auth/sign-in');
  }

  return (
    <div className='w-full max-w-[360px]'>
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight' style={{ letterSpacing: '-0.025em' }}>
          Create account
        </h1>
        <p className='text-muted-foreground mt-2 text-[14px]'>
          Daftar untuk mulai menggunakan AssetFlow.
        </p>
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
            placeholder='Minimal 6 karakter'
            required
            minLength={6}
            className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
          />
        </div>

        <Button
          type='submit'
          disabled={isLoading}
          className='h-11 w-full rounded-lg text-[14px] font-medium active:scale-[0.98] transition-transform'
        >
          {isLoading ? <Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> : 'Create account'}
        </Button>
      </form>

      <p className='text-muted-foreground mt-6 text-center text-[13px]'>
        Sudah punya akun?{' '}
        <Link href='/auth/sign-in' className='text-foreground font-medium hover:underline'>
          Sign in
        </Link>
      </p>
    </div>
  );
}
