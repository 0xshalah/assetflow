import PageContainer from '@/components/layout/page-container';
import { InventoryTable } from '@/features/inventory/components/inventory-table';
import { AddItemSheet } from '@/features/inventory/components/add-item-sheet';
import { getItems } from '@/features/inventory/actions';

export const metadata = {
  title: 'Dashboard: Inventory'
};

export default async function InventoryPage() {
  const items = await getItems();

  return (
    <PageContainer
      pageTitle='Inventory'
      pageDescription='Kelola daftar barang dan aset perusahaan.'
      pageHeaderAction={<AddItemSheet />}
    >
      <InventoryTable data={items} />
    </PageContainer>
  );
}
