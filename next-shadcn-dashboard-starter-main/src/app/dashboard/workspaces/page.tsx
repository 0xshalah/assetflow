import PageContainer from '@/components/layout/page-container';

export const metadata = { title: 'Dashboard: Workspaces' };

export default function WorkspacesPage() {
  return (
    <PageContainer pageTitle='Workspaces' pageDescription='Feature not available — Clerk removed.'>
      <div className='text-muted-foreground py-12 text-center'>
        Workspace management will be available with Supabase Auth.
      </div>
    </PageContainer>
  );
}
