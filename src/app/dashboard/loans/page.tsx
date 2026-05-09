import PageContainer from '@/components/layout/page-container';
import { LoansTable } from '@/features/loans/components/loans-table';
import { AdminLoanActions } from '@/features/loans/components/admin-loan-actions';
import { getLoans } from '@/features/loans/actions';
import { getItems } from '@/features/inventory/actions';

export const metadata = {
  title: 'Dashboard: Loans'
};

export default async function LoansPage() {
  const [loansData, allItems] = await Promise.all([getLoans(), getItems()]);

  const availableItems = allItems.filter((item) => item.status === 'available');

  return (
    <PageContainer
      pageTitle='Loan Tracking'
      pageDescription='Pantau peminjaman dan pengembalian barang.'
      pageHeaderAction={<AdminLoanActions availableItems={availableItems} loansData={loansData} />}
    >
      <LoansTable data={loansData} />
    </PageContainer>
  );
}
