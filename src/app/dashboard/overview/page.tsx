import PageContainer from '@/components/layout/page-container';
import { MetricCard } from '@/features/overview/components/metric-card';
import { getDashboardMetrics } from '@/features/overview/actions';
import { OverviewAnimated } from '@/features/overview/components/overview-animated';

export const metadata = { title: 'Dashboard — AssetFlow' };

export default async function OverviewPage() {
  const metrics = await getDashboardMetrics();

  return (
    <PageContainer pageTitle='Dashboard' pageDescription='Ringkasan inventaris dan transaksi.'>
      <OverviewAnimated>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <MetricCard
            title='Total Barang Lemari C-01'
            value={metrics.totalLemariC01}
            description='Unit tersedia'
          />
          <MetricCard
            title='Total Barang Lemari C-02'
            value={metrics.totalLemariC02}
            description='Unit tersedia'
          />
          <MetricCard
            title='Total Barang Lemari C-03'
            value={metrics.totalLemariC03}
            description='Unit tersedia'
          />
          <MetricCard
            title='Barang Habis (Stok 0)'
            value={metrics.outOfStock}
            description='Perlu restock'
          />
          <MetricCard
            title='Peminjaman Aktif'
            value={metrics.activeLoans}
            description='Belum dikembalikan'
          />
          <MetricCard
            title='Barang Hampir Habis'
            value={metrics.lowStockItems}
            description='Stok kurang dari 7'
          />
        </div>
      </OverviewAnimated>
    </PageContainer>
  );
}
