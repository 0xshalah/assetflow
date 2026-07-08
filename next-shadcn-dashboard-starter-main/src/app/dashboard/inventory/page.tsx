import { InventoryPageClient } from '@/features/inventory/components/inventory-page-client';
import { getItems } from '@/features/inventory/actions';

export const metadata = { title: 'Inventory — AssetFlow' };

export default async function InventoryPage() {
  const items = await getItems();
  return <InventoryPageClient items={items} />;
}
