import PageContainer from '@/components/layout/page-container';
import { PickupsTabs } from '@/features/pickups/components/pickups-tabs';
import { getPickupsByCategory } from '@/features/pickups/actions';

export const metadata = { title: 'Data Pengambilan — AssetFlow' };

export default async function PickupsPage() {
  const [lemariC01, lemariC02, lemariC03] = await Promise.all([
    getPickupsByCategory('lemari-c01'),
    getPickupsByCategory('lemari-c02'),
    getPickupsByCategory('lemari-c03')
  ]);

  return (
    <PageContainer
      pageTitle='Data Pengambilan'
      pageDescription='Riwayat pengambilan barang per kategori.'
    >
      <PickupsTabs lemariC01={lemariC01} lemariC02={lemariC02} lemariC03={lemariC03} />
    </PageContainer>
  );
}
