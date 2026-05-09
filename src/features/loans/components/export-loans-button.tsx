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
        // Dynamic import — xlsx is only loaded when user clicks export
        const XLSX = await import('xlsx');

        // Transform data for clean export
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

        // Create workbook with professional formatting
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // Set column widths for readability
        worksheet['!cols'] = [
          { wch: 28 }, // Nama Barang
          { wch: 16 }, // Kategori
          { wch: 22 }, // Peminjam
          { wch: 24 }, // Kontak
          { wch: 20 }, // Tanggal Pinjam
          { wch: 20 }, // Tanggal Kembali
          { wch: 14 } // Status
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Peminjaman');

        // Generate filename with current date
        const dateStr = new Intl.DateTimeFormat('id-ID', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
          .format(new Date())
          .replace(/\//g, '-');

        XLSX.writeFile(workbook, `AssetFlow_Laporan_Peminjaman_${dateStr}.xlsx`);
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
      className='text-xs md:text-sm'
    >
      {isPending ? (
        <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
      ) : (
        <IconFileSpreadsheet className='mr-2 h-4 w-4' />
      )}
      Export
    </Button>
  );
}
