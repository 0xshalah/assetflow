import PageContainer from '@/components/layout/page-container';
import { PickupsTabs } from '@/features/pickups/components/pickups-tabs';
import { getPickupsByCategory } from '@/features/pickups/actions';

export const metadata = { title: 'Data Pengambilan — AssetFlow' };

export default async function PickupsPage() {
  const [elektrik, mekanik, facility] = await Promise.all([
    getPickupsByCategory('elektrik'),
    getPickupsByCategory('mekanik'),
    getPickupsByCategory('facility')
  ]);

  return (
    <PageContainer
      pageTitle='Data Pengambilan'
      pageDescription='Riwayat pengambilan barang per kategori.'
    >
      <PickupsTabs elektrik={elektrik} mekanik={mekanik} facility={facility} />
    </PageContainer>
  );
}
