import PageContainer from '@/components/layout/page-container';
import { LoansTable } from '@/features/loans/components/loans-table';
import { getLoans } from '@/features/loans/actions';

export const metadata = { title: 'Data Peminjaman — AssetFlow' };

export default async function LoansPage() {
  const loans = await getLoans();

  return (
    <PageContainer
      pageTitle='Data Peminjaman'
      pageDescription='Riwayat peminjaman barang. Tandai barang yang sudah dikembalikan.'
    >
      <LoansTable data={loans} />
    </PageContainer>
  );
}
