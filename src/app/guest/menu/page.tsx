import { GuestMenu } from '@/features/guest/components/guest-menu';

export const metadata = { title: 'Menu — AssetFlow' };

export default function GuestMenuPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950'>
      <GuestMenu />
    </div>
  );
}
