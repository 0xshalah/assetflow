'use client';

import { useState } from 'react';
import { LoanSheet } from './loan-sheet';
import { PickupSheet } from './pickup-sheet';
import Link from 'next/link';

const MENU_ITEMS = [
  {
    title: 'Peminjaman Barang',
    description: 'Pinjam barang yang akan dikembalikan nanti.',
    type: 'loan' as const
  },
  {
    title: 'Pengambilan Barang Elektrik',
    description: 'Ambil barang elektrik untuk keperluan kerja.',
    type: 'pickup-elektrik' as const
  },
  {
    title: 'Pengambilan Barang Mekanik',
    description: 'Ambil barang mekanik untuk keperluan kerja.',
    type: 'pickup-mekanik' as const
  },
  {
    title: 'Pengambilan Barang Facility',
    description: 'Ambil barang facility untuk keperluan kerja.',
    type: 'pickup-facility' as const
  }
];

type SheetType = 'loan' | 'pickup-elektrik' | 'pickup-mekanik' | 'pickup-facility' | null;

export function GuestMenu() {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  return (
    <div className='w-full max-w-lg'>
      <div className='mb-10 text-center'>
        <h1
          className='text-3xl font-semibold text-zinc-900 dark:text-zinc-50'
          style={{ letterSpacing: '-0.03em' }}
        >
          Pilih Menu
        </h1>
        <p className='text-muted-foreground mt-2 text-[15px]'>
          Pilih jenis transaksi yang ingin dilakukan.
        </p>
      </div>

      <div className='grid gap-3'>
        {MENU_ITEMS.map((item) => (
          <button
            key={item.type}
            onClick={() => setActiveSheet(item.type)}
            className='flex flex-col items-start rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-all hover:border-zinc-300 hover:shadow-sm active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
          >
            <span className='text-[15px] font-medium text-zinc-900 dark:text-zinc-50'>
              {item.title}
            </span>
            <span className='mt-1 text-[13px] text-zinc-500 dark:text-zinc-400'>
              {item.description}
            </span>
          </button>
        ))}
      </div>

      <p className='text-muted-foreground mt-8 text-center text-[13px]'>
        <Link href='/' className='hover:underline'>
          ← Kembali ke halaman utama
        </Link>
      </p>

      {/* Sheets */}
      <LoanSheet open={activeSheet === 'loan'} onOpenChange={(v) => !v && setActiveSheet(null)} />
      <PickupSheet
        category='elektrik'
        open={activeSheet === 'pickup-elektrik'}
        onOpenChange={(v) => !v && setActiveSheet(null)}
      />
      <PickupSheet
        category='mekanik'
        open={activeSheet === 'pickup-mekanik'}
        onOpenChange={(v) => !v && setActiveSheet(null)}
      />
      <PickupSheet
        category='facility'
        open={activeSheet === 'pickup-facility'}
        onOpenChange={(v) => !v && setActiveSheet(null)}
      />
    </div>
  );
}
