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
    className:
      'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
  },
  returned: {
    label: 'Returned',
    className:
      'bg-zinc-50 text-zinc-500 border-zinc-200/80 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800'
  },
  overdue: {
    label: 'Overdue',
    className:
      'bg-zinc-200 text-zinc-800 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600'
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
        <div className='font-medium' style={{ letterSpacing: '-0.01em' }}>
          {row.getValue('itemName')}
        </div>
        <div className='text-muted-foreground mt-0.5 text-[12px]'>{row.original.itemCategory}</div>
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
        <div className='font-medium text-[14px]'>{row.getValue('borrowerName')}</div>
        <div className='text-muted-foreground mt-0.5 text-[12px]'>
          {row.original.borrowerContact}
        </div>
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
    id: 'returnDate',
    accessorKey: 'returnDate',
    header: ({ column }: { column: Column<LoanRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tgl Kembali' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('returnDate') as Date | null;
      if (!date) {
        return <span className='text-muted-foreground/50 text-[13px]'>—</span>;
      }
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
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<LoanRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as LoanStatus;
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
