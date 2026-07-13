import PageContainer from '@/components/layout/page-container';
import { LoansTable } from '@/features/loans/components/loans-table';
import { PagePagination } from '@/components/page-pagination';
import { getLoans, getTotalLoans } from '@/features/loans/actions';

export const metadata = { title: 'Data Peminjaman — AssetFlow' };

const LOANS_PER_PAGE = 15;

export default async function LoansPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const offset = (page - 1) * LOANS_PER_PAGE;

  const [loans, total] = await Promise.all([
    getLoans(LOANS_PER_PAGE, offset),
    getTotalLoans()
  ]);

  return (
    <PageContainer
      pageTitle='Data Peminjaman'
      pageDescription='Riwayat peminjaman barang. Tandai barang yang sudah dikembalikan.'
    >
      <LoansTable data={loans} />
      <PagePagination
        currentPage={page}
        totalPages={Math.ceil(total / LOANS_PER_PAGE)}
        totalItems={total}
        itemsPerPage={LOANS_PER_PAGE}
      />
    </PageContainer>
  );
}
