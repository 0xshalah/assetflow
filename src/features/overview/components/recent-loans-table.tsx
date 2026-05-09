import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { RecentLoan } from '../actions';

interface RecentLoansTableProps {
  data: RecentLoan[];
}

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900',
  returned: 'bg-zinc-50 text-zinc-500 border-zinc-200/80 dark:bg-zinc-900 dark:text-zinc-500',
  overdue: 'bg-zinc-200 text-zinc-800 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-200'
};

export function RecentLoansTable({ data }: RecentLoansTableProps) {
  if (data.length === 0) {
    return (
      <div className='text-muted-foreground py-12 text-center text-[14px]'>
        Belum ada transaksi peminjaman.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className='border-zinc-100 dark:border-zinc-800/50'>
          <TableHead className='text-[12px] font-medium text-muted-foreground'>Barang</TableHead>
          <TableHead className='text-[12px] font-medium text-muted-foreground'>Peminjam</TableHead>
          <TableHead className='text-[12px] font-medium text-muted-foreground'>Tanggal</TableHead>
          <TableHead className='text-[12px] font-medium text-muted-foreground'>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((loan) => (
          <TableRow key={loan.id} className='border-zinc-100 dark:border-zinc-800/50'>
            <TableCell className='font-medium text-[14px]' style={{ letterSpacing: '-0.01em' }}>
              {loan.itemName}
            </TableCell>
            <TableCell className='text-[14px]'>{loan.borrowerName}</TableCell>
            <TableCell className='text-muted-foreground text-[13px] tabular-nums'>
              {new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'short'
              }).format(new Date(loan.loanDate))}
            </TableCell>
            <TableCell>
              <Badge
                variant='outline'
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLE[loan.status] ?? ''}`}
              >
                {loan.status === 'active'
                  ? 'Active'
                  : loan.status === 'returned'
                    ? 'Returned'
                    : 'Overdue'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
