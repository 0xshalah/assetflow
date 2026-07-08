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
import type { Loan } from '@/db/schema/loans';

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

function downloadExcel(data: Loan[], filename: string) {
  import('xlsx').then((XLSX) => {
    const rows = data.map((loan) => ({
      'Nama Barang': loan.itemName,
      'Jumlah Dipinjam': loan.quantity,
      Keperluan: loan.purpose,
      'Nama Peminjam': loan.borrowerName,
      Departemen: loan.department,
      Kontak: loan.borrowerContact,
      'Tanggal Pinjam': new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(loan.loanDate)),
      Status: loan.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 24 }, { wch: 14 }, { wch: 30 }, { wch: 22 },
      { wch: 16 }, { wch: 20 }, { wch: 18 }, { wch: 10 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Peminjaman');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  });
}

export function LoansTable({ data }: { data: Loan[] }) {
  if (data.length === 0) {
    return (
      <div className='text-muted-foreground py-16 text-center text-[14px]'>
        Belum ada data peminjaman.
      </div>
    );
  }

  const activeCount = data.filter((l) => l.status === 'active').length;

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <p className='text-[13px] text-muted-foreground'>
          {data.length} data ({activeCount} aktif)
        </p>
        <Button
          variant='outline'
          size='sm'
          className='h-8 rounded-lg border-zinc-200 px-3 text-[12px] font-medium dark:border-zinc-800'
          onClick={() => downloadExcel(data, 'Data_Peminjaman')}
        >
          <svg xmlns='http://www.w3.org/2000/svg' className='mr-1.5 h-3.5 w-3.5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
            <polyline points='7 10 12 15 17 10' />
            <line x1='12' y1='15' x2='12' y2='3' />
          </svg>
          Download Excel
        </Button>
      </div>

      <div className='rounded-lg border border-zinc-100 dark:border-zinc-800/50'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-[12px]'>Nama Barang</TableHead>
              <TableHead className='text-[12px]'>Qty</TableHead>
              <TableHead className='text-[12px]'>Keperluan</TableHead>
              <TableHead className='text-[12px]'>Peminjam</TableHead>
              <TableHead className='text-[12px]'>Departemen</TableHead>
              <TableHead className='text-[12px]'>Kontak</TableHead>
              <TableHead className='text-[12px]'>Tgl Pinjam</TableHead>
              <TableHead className='text-[12px]'>Status</TableHead>
              <TableHead className='w-24' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className='font-medium text-[14px]'>{loan.itemName}</TableCell>
                <TableCell className='text-[14px] tabular-nums'>{loan.quantity}</TableCell>
                <TableCell className='text-[13px] text-muted-foreground max-w-[160px] truncate'>
                  {loan.purpose}
                </TableCell>
                <TableCell className='text-[14px]'>{loan.borrowerName}</TableCell>
                <TableCell className='text-[13px] text-muted-foreground'>{loan.department}</TableCell>
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
    </div>
  );
}
