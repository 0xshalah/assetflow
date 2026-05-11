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
            title='Total Barang Elektrik'
            value={metrics.totalElektrik}
            description='Unit tersedia'
          />
          <MetricCard
            title='Total Barang Mekanik'
            value={metrics.totalMekanik}
            description='Unit tersedia'
          />
          <MetricCard
            title='Total Barang Facility'
            value={metrics.totalFacility}
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
            title='Total Pengambilan'
            value={metrics.totalPickups}
            description='Semua kategori'
          />
        </div>
      </OverviewAnimated>
    </PageContainer>
  );
}
