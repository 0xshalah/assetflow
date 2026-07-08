'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { InventoryTable } from '@/features/inventory/components/inventory-table';
import { AddItemSheet } from '@/features/inventory/components/add-item-sheet';
import type { Item } from '@/db/schema/items';

interface InventoryPageClientProps {
  items: Item[];
}

export function InventoryPageClient({ items }: InventoryPageClientProps) {
  const [editItem, setEditItem] = useState<Item | undefined>(undefined);

  return (
    <PageContainer
      pageTitle='Inventory'
      pageDescription='Kelola stok barang per kategori lemari.'
      pageHeaderAction={
        <AddItemSheet
          key={editItem?.id ?? 'new'}
          editItem={editItem}
          open={!!editItem}
          onOpenChange={(open) => {
            if (!open) setEditItem(undefined);
          }}
        />
      }
    >
      <InventoryTable
        data={items}
        onEdit={(item) => setEditItem(item)}
      />
    </PageContainer>
  );
}
