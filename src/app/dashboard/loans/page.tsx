import PageContainer from '@/components/layout/page-container';
import { LoansTable } from '@/features/loans/components/loans-table';
import { NewLoanSheet } from '@/features/loans/components/new-loan-sheet';
import { ExportLoansButton } from '@/features/loans/components/export-loans-button';
import { getLoans } from '@/features/loans/actions';
import { getItems } from '@/features/inventory/actions';

export const metadata = {
  title: 'Dashboard: Loans'
};

export default async function LoansPage() {
  const [loansData, allItems] = await Promise.all([getLoans(), getItems()]);

  // Only pass available items to the NewLoanSheet
  const availableItems = allItems.filter((item) => item.status === 'available');

  return (
    <PageContainer
      pageTitle='Loan Tracking'
      pageDescription='Pantau peminjaman dan pengembalian barang.'
      pageHeaderAction={
        <div className='flex items-center gap-2'>
          <ExportLoansButton data={loansData} />
          <NewLoanSheet availableItems={availableItems} />
        </div>
      }
    >
      <LoansTable data={loansData} />
    </PageContainer>
  );
}
