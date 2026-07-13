'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { InventoryTable } from '@/features/inventory/components/inventory-table';
import { AddItemSheet } from '@/features/inventory/components/add-item-sheet';
import { PagePagination } from '@/components/page-pagination';
import type { Item } from '@/db/schema/items';

interface InventoryPageClientProps {
  items: Item[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function InventoryPageClient({
  items,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage
}: InventoryPageClientProps) {
  const [editItem, setEditItem] = useState<Item | undefined>(undefined);

  return (
    <PageContainer
      pageTitle='Inventory'
      pageDescription='Kelola stok barang per kategori lemari.'
      pageHeaderAction={
        <AddItemSheet
          key={editItem?.id ?? 'new'}
          editItem={editItem}
          open={editItem ? true : undefined}
          onOpenChange={
            editItem
              ? (open) => {
                  if (!open) setEditItem(undefined);
                }
              : undefined
          }
        />
      }
    >
      <InventoryTable data={items} onEdit={(item) => setEditItem(item)} />
      <PagePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </PageContainer>
  );
}
