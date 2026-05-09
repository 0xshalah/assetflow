'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { LoanStatus } from '@/db/schema/loans';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { LoanCellAction } from './loan-cell-action';

/** Shape returned by getLoans() server action (joined data) */
export interface LoanRow {
  id: string;
  itemId: string;
  itemName: string;
  itemCategory: string;
  borrowerName: string;
  borrowerContact: string;
  loanDate: Date;
  returnDate: Date | null;
  status: LoanStatus;
}

const STATUS_CONFIG: Record<LoanStatus, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-50'
  },
  returned: {
    label: 'Returned',
    className: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-zinc-300 text-zinc-900 border-zinc-400 dark:bg-zinc-600 dark:text-zinc-100 dark:border-zinc-500'
  }
};

export const LOAN_STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Returned', value: 'returned' },
  { label: 'Overdue', value: 'overdue' }
];

export const loanColumns: ColumnDef<LoanRow>[] = [
  {
    id: 'itemName',
    accessorKey: 'itemName',
    header: ({ column }: { column: Column<LoanRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Barang' />
    ),
    cell: ({ row }) => (
      <div>
        <div className='font-medium tracking-tight'>{row.getValue('itemName')}</div>
        <div className='text-muted-foreground text-xs'>{row.original.itemCategory}</div>
      </div>
    ),
    meta: {
      label: 'Barang',
      placeholder: 'Cari barang...',
      variant: 'text' as const
    },
    enableColumnFilter: true
  },
  {
    id: 'borrowerName',
    accessorKey: 'borrowerName',
    header: ({ column }: { column: Column<LoanRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Peminjam' />
    ),
    cell: ({ row }) => (
      <div>
        <div className='font-medium'>{row.getValue('borrowerName')}</div>
        <div className='text-muted-foreground text-xs'>{row.original.borrowerContact}</div>
      </div>
    ),
    enableColumnFilter: false
  },
  {
    id: 'loanDate',
    accessorKey: 'loanDate',
    header: ({ column }: { column: Column<LoanRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tgl Pinjam' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('loanDate') as Date;
      return (
        <span className='text-muted-foreground text-sm'>
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
    id: 'returnDate',
    accessorKey: 'returnDate',
    header: ({ column }: { column: Column<LoanRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tgl Kembali' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('returnDate') as Date | null;
      if (!date) {
        return <span className='text-muted-foreground text-sm'>—</span>;
      }
      return (
        <span className='text-muted-foreground text-sm'>
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
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<LoanRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as LoanStatus;
      const config = STATUS_CONFIG[status];
      return (
        <Badge variant='outline' className={config.className}>
          {config.label}
        </Badge>
      );
    },
    meta: {
      label: 'Status',
      variant: 'select' as const,
      options: LOAN_STATUS_OPTIONS
    },
    enableColumnFilter: true,
    enableSorting: false
  },
  {
    id: 'actions',
    cell: ({ row }) => <LoanCellAction data={row.original} />
  }
];
