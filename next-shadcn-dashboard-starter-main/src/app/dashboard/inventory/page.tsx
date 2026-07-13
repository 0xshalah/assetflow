import { InventoryPageClient } from '@/features/inventory/components/inventory-page-client';
import { getItems, getTotalItems } from '@/features/inventory/actions';

export const metadata = { title: 'Inventory — AssetFlow' };

const ITEMS_PER_PAGE = 15;

export default async function InventoryPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const [items, total] = await Promise.all([
    getItems(ITEMS_PER_PAGE, offset),
    getTotalItems()
  ]);

  return (
    <InventoryPageClient
      items={items}
      currentPage={page}
      totalPages={Math.ceil(total / ITEMS_PER_PAGE)}
      totalItems={total}
      itemsPerPage={ITEMS_PER_PAGE}
    />
  );
}
