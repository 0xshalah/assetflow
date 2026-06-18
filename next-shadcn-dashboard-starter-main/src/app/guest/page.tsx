import { PinForm } from '@/features/guest/components/pin-form';

export const metadata = { title: 'Verifikasi PIN — AssetFlow' };

export default function GuestPinPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950'>
      <PinForm />
    </div>
  );
}
