import PageContainer from '@/components/layout/page-container';

export const metadata = { title: 'Dashboard: Profile' };

export default function ProfilePage() {
  return (
    <PageContainer pageTitle='Profile' pageDescription='Manage your account.'>
      <div className='text-muted-foreground py-12 text-center'>
        Profile management will be available with Supabase Auth.
      </div>
    </PageContainer>
  );
}
