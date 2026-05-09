import PageContainer from '@/components/layout/page-container';

export const metadata = { title: 'Dashboard: Team' };

export default function TeamPage() {
  return (
    <PageContainer pageTitle='Team' pageDescription='Feature not available — Clerk removed.'>
      <div className='text-muted-foreground py-12 text-center'>
        Team management will be available with Supabase Auth.
      </div>
    </PageContainer>
  );
}
