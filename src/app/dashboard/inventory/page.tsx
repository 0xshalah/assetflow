import PageContainer from '@/components/layout/page-container';
import { InventoryTable } from '@/features/inventory/components/inventory-table';
import { AdminAddItemButton } from '@/features/inventory/components/admin-add-item-button';
import { getItems } from '@/features/inventory/actions';

export const metadata = {
  title: 'Dashboard: Inventory'
};

export default async function InventoryPage() {
  const items = await getItems();

  return (
    <PageContainer
      pageTitle='Inventory'
      pageDescription='Daftar barang dan aset perusahaan.'
      pageHeaderAction={<AdminAddItemButton />}
    >
      <InventoryTable data={items} />
    </PageContainer>
  );
}
