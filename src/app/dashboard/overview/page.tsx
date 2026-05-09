import PageContainer from '@/components/layout/page-container';
import { MetricCard } from '@/features/overview/components/metric-card';
import { RecentLoansTable } from '@/features/overview/components/recent-loans-table';
import { getDashboardMetrics, getRecentLoans } from '@/features/overview/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = { title: 'Dashboard — AssetFlow' };

export default async function OverviewPage() {
  const [metrics, recentLoans] = await Promise.all([getDashboardMetrics(), getRecentLoans()]);

  return (
    <PageContainer pageTitle='Dashboard' pageDescription='Ringkasan inventaris dan peminjaman.'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <MetricCard
          title='Total Barang'
          value={metrics.totalItems}
          description='Semua aset terdaftar'
        />
        <MetricCard
          title='Sedang Dipinjam'
          value={metrics.borrowedItems}
          description='Barang yang sedang keluar'
        />
        <MetricCard
          title='Peminjaman Aktif'
          value={metrics.activeLoans}
          description='Transaksi berlangsung'
        />
        <MetricCard
          title='Terlambat'
          value={metrics.overdueLoans}
          description='Melewati batas waktu'
        />
      </div>

      <Card className='mt-8 border-zinc-100 dark:border-zinc-800/50'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-[16px] font-semibold' style={{ letterSpacing: '-0.01em' }}>
            Transaksi Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className='px-0 pb-0'>
          <RecentLoansTable data={recentLoans} />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
