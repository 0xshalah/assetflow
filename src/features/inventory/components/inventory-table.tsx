'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import type { Item } from '@/db/schema/items';
import { itemColumns } from './item-columns';

interface InventoryTableProps {
  data: Item[];
}

export function InventoryTable({ data }: InventoryTableProps) {
  const { table } = useDataTable({
    data,
    columns: itemColumns,
    pageCount: Math.ceil(data.length / 10),
    shallow: false,
    initialState: {
      columnPinning: { right: ['actions'] }
    }
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
