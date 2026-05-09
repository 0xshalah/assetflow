import PageContainer from '@/components/layout/page-container';

export const metadata = { title: 'Dashboard: Exclusive' };

export default function ExclusivePage() {
  return (
    <PageContainer pageTitle='Exclusive' pageDescription='Feature not available.'>
      <div className='text-muted-foreground py-12 text-center'>
        Exclusive content is not configured for this project.
      </div>
    </PageContainer>
  );
}
