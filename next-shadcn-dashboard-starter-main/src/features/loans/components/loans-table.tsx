'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Icons } from '@/components/icons';
import { returnLoan } from '../actions';
import { toast } from 'sonner';
import { useTransition } from 'react';

interface LoanRow {
  id: string;
  itemId: string;
  itemName: string;
  itemCategory: string;
  borrowerName: string;
  borrowerContact: string;
  loanDate: Date;
  returnDate: Date | null;
  status: string;
}

function ReturnButton({ loanId }: { loanId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleReturn() {
    startTransition(async () => {
      const result = await returnLoan(loanId);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={handleReturn}
      disabled={isPending}
      className='rounded-full px-3 text-[12px] active:scale-[0.98] transition-transform'
    >
      {isPending ? (
        <Icons.spinner className='h-3 w-3 animate-spin' />
      ) : (
        <Icons.check className='mr-1 h-3 w-3' />
      )}
      Return
    </Button>
  );
}

export function LoansTable({ data }: { data: LoanRow[] }) {
  if (data.length === 0) {
    return (
      <div className='text-muted-foreground py-16 text-center text-[14px]'>
        Belum ada data peminjaman.
      </div>
    );
  }

  return (
    <div className='rounded-lg border border-zinc-100 dark:border-zinc-800/50'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-[12px]'>Barang</TableHead>
            <TableHead className='text-[12px]'>Peminjam</TableHead>
            <TableHead className='text-[12px]'>Kontak</TableHead>
            <TableHead className='text-[12px]'>Tgl Pinjam</TableHead>
            <TableHead className='text-[12px]'>Status</TableHead>
            <TableHead className='w-24' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>
                <div className='font-medium text-[14px]'>{loan.itemName}</div>
                <div className='text-[12px] text-muted-foreground'>{loan.itemCategory}</div>
              </TableCell>
              <TableCell className='text-[14px]'>{loan.borrowerName}</TableCell>
              <TableCell className='text-[13px] text-muted-foreground'>
                {loan.borrowerContact}
              </TableCell>
              <TableCell className='text-[13px] tabular-nums text-muted-foreground'>
                {new Intl.DateTimeFormat('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }).format(new Date(loan.loanDate))}
              </TableCell>
              <TableCell>
                {loan.status === 'active' ? (
                  <Badge
                    variant='outline'
                    className='rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900'
                  >
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant='outline'
                    className='rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-500'
                  >
                    Returned
                  </Badge>
                )}
              </TableCell>
              <TableCell>{loan.status === 'active' && <ReturnButton loanId={loan.id} />}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
