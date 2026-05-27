import PageContainer from '@/components/layout/page-container';

export const metadata = { title: 'Dashboard: Billing' };

export default function BillingPage() {
  return (
    <PageContainer pageTitle='Billing' pageDescription='Feature not available.'>
      <div className='text-muted-foreground py-12 text-center'>
        Billing is not configured for this project.
      </div>
    </PageContainer>
  );
}
