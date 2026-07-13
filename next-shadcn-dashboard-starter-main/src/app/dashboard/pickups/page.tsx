import PageContainer from '@/components/layout/page-container';
import { PickupsTabs } from '@/features/pickups/components/pickups-tabs';
import { PagePagination } from '@/components/page-pagination';
import { getPickupsByCategory, getTotalPickups } from '@/features/pickups/actions';

export const metadata = { title: 'Data Pengambilan — AssetFlow' };

const PICKUPS_PER_PAGE = 15;

export default async function PickupsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; c01?: string; c02?: string; c03?: string }>;
}) {
  const params = await searchParams;

  const pageC01 = Math.max(1, Number(params.c01) || 1);
  const pageC02 = Math.max(1, Number(params.c02) || 1);
  const pageC03 = Math.max(1, Number(params.c03) || 1);

  const offsetC01 = (pageC01 - 1) * PICKUPS_PER_PAGE;
  const offsetC02 = (pageC02 - 1) * PICKUPS_PER_PAGE;
  const offsetC03 = (pageC03 - 1) * PICKUPS_PER_PAGE;

  const [
    lemariC01,
    lemariC02,
    lemariC03,
    totalC01,
    totalC02,
    totalC03
  ] = await Promise.all([
    getPickupsByCategory('lemari-c01', PICKUPS_PER_PAGE, offsetC01),
    getPickupsByCategory('lemari-c02', PICKUPS_PER_PAGE, offsetC02),
    getPickupsByCategory('lemari-c03', PICKUPS_PER_PAGE, offsetC03),
    getTotalPickups('lemari-c01'),
    getTotalPickups('lemari-c02'),
    getTotalPickups('lemari-c03')
  ]);

  return (
    <PageContainer
      pageTitle='Data Pengambilan'
      pageDescription='Riwayat pengambilan barang per kategori.'
    >
      <PickupsTabs
        lemariC01={lemariC01}
        lemariC02={lemariC02}
        lemariC03={lemariC03}
        totalC01={totalC01}
        totalC02={totalC02}
        totalC03={totalC03}
        pageC01={pageC01}
        pageC02={pageC02}
        pageC03={pageC03}
        itemsPerPage={PICKUPS_PER_PAGE}
      />
    </PageContainer>
  );
}
