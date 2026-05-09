'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Item, ItemStatus } from '@/db/schema/items';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { ItemCellAction } from './item-cell-action';

const STATUS_CONFIG: Record<ItemStatus, { label: string; className: string }> = {
  available: {
    label: 'Available',
    className:
      'bg-zinc-50 text-zinc-600 border-zinc-200/80 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800'
  },
  borrowed: {
    label: 'Borrowed',
    className:
      'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
  },
  maintenance: {
    label: 'Maintenance',
    className:
      'bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600'
  }
};

export const CATEGORY_OPTIONS = [
  { label: 'Elektronik', value: 'Elektronik' },
  { label: 'Aksesoris', value: 'Aksesoris' },
  { label: 'Furniture', value: 'Furniture' },
  { label: 'Networking', value: 'Networking' },
  { label: 'Lainnya', value: 'Lainnya' }
];

export const STATUS_OPTIONS = [
  { label: 'Available', value: 'available' },
  { label: 'Borrowed', value: 'borrowed' },
  { label: 'Maintenance', value: 'maintenance' }
];

export const itemColumns: ColumnDef<Item>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Item, unknown> }) => (
      <DataTableColumnHeader column={column} title='Nama Barang' />
    ),
    cell: ({ row }) => (
      <span className='font-medium' style={{ letterSpacing: '-0.01em' }}>
        {row.getValue('name')}
      </span>
    ),
    meta: {
      label: 'Nama',
      placeholder: 'Cari barang...',
      variant: 'text' as const
    },
    enableColumnFilter: true
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: ({ column }: { column: Column<Item, unknown> }) => (
      <DataTableColumnHeader column={column} title='Kategori' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground text-[13px]'>{row.getValue('category')}</span>
    ),
    meta: {
      label: 'Kategori',
      variant: 'multiSelect' as const,
      options: CATEGORY_OPTIONS
    },
    enableColumnFilter: true,
    enableSorting: false
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<Item, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as ItemStatus;
      const config = STATUS_CONFIG[status];
      return (
        <Badge
          variant='outline'
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${config.className}`}
        >
          {config.label}
        </Badge>
      );
    },
    meta: {
      label: 'Status',
      variant: 'select' as const,
      options: STATUS_OPTIONS
    },
    enableColumnFilter: true,
    enableSorting: false
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<Item, unknown> }) => (
      <DataTableColumnHeader column={column} title='Ditambahkan' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date;
      return (
        <span className='text-muted-foreground text-[13px] tabular-nums'>
          {new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }).format(new Date(date))}
        </span>
      );
    },
    enableColumnFilter: false
  },
  {
    id: 'actions',
    cell: ({ row }) => <ItemCellAction data={row.original} />
  }
];
