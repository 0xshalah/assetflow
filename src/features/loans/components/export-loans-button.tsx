'use client';

import { Button } from '@/components/ui/button';
import { IconFileSpreadsheet } from '@tabler/icons-react';
import type { LoanRow } from './loan-columns';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { Icons } from '@/components/icons';

interface ExportLoansButtonProps {
  data: LoanRow[];
}

export function ExportLoansButton({ data }: ExportLoansButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      try {
        const XLSX = await import('xlsx');

        const exportData = data.map((loan) => ({
          'Nama Barang': loan.itemName,
          Kategori: loan.itemCategory,
          Peminjam: loan.borrowerName,
          Kontak: loan.borrowerContact,
          'Tanggal Pinjam': new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }).format(new Date(loan.loanDate)),
          'Tanggal Kembali': loan.returnDate
            ? new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }).format(new Date(loan.returnDate))
            : 'Belum dikembalikan',
          Status:
            loan.status === 'active'
              ? 'Aktif'
              : loan.status === 'returned'
                ? 'Dikembalikan'
                : 'Terlambat'
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);

        worksheet['!cols'] = [
          { wch: 28 },
          { wch: 16 },
          { wch: 22 },
          { wch: 24 },
          { wch: 20 },
          { wch: 20 },
          { wch: 14 }
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Peminjaman');

        const dateStr = new Intl.DateTimeFormat('id-ID', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
          .format(new Date())
          .replace(/\//g, '-');

        XLSX.writeFile(workbook, `AssetFlow_Laporan_${dateStr}.xlsx`);
        toast.success('Laporan berhasil diekspor.');
      } catch (error) {
        console.error('Export failed:', error);
        toast.error('Gagal mengekspor laporan.');
      }
    });
  }

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={handleExport}
      disabled={isPending || data.length === 0}
      className='rounded-full px-4 text-[13px] font-medium border-zinc-200 dark:border-zinc-800 active:scale-[0.98] transition-transform'
    >
      {isPending ? (
        <Icons.spinner className='mr-1.5 h-3.5 w-3.5 animate-spin' />
      ) : (
        <IconFileSpreadsheet className='mr-1.5 h-3.5 w-3.5' />
      )}
      Export
    </Button>
  );
}
