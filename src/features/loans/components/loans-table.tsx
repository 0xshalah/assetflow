'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { loanColumns, type LoanRow } from './loan-columns';

interface LoansTableProps {
  data: LoanRow[];
}

export function LoansTable({ data }: LoansTableProps) {
  const { table } = useDataTable({
    data,
    columns: loanColumns,
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
