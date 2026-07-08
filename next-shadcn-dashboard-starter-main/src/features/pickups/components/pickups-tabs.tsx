'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface PickupRow {
  id: string;
  itemName: string;
  itemSpecification: string;
  personName: string;
  departmentOrigin: string;
  quantity: number;
  purpose: string;
  issuedBy: string;
  issuerDepartment: string;
  pickedAt: Date;
}

interface PickupsTabsProps {
  lemariC01: PickupRow[];
  lemariC02: PickupRow[];
  lemariC03: PickupRow[];
}

function downloadExcel(data: PickupRow[], filename: string) {
  import('xlsx').then((XLSX) => {
    const rows = data.map((row) => ({
      'Tanggal': new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(new Date(row.pickedAt)),
      'Waktu': new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(row.pickedAt)),
      'Nama Barang': row.itemName,
      'Spesifikasi': row.itemSpecification || '-',
      'Keperluan': row.purpose,
      'Nama Pengambil': row.personName,
      'Departemen': row.departmentOrigin,
      'Jumlah': row.quantity,
      'Dikeluarkan Oleh': row.issuedBy
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 14 }, { wch: 8 }, { wch: 24 }, { wch: 24 },
      { wch: 24 }, { wch: 22 }, { wch: 14 }, { wch: 8 }, { wch: 28 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pengambilan');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  });
}

function PickupTable({ data, categoryLabel }: { data: PickupRow[]; categoryLabel: string }) {
  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <p className='text-[13px] text-muted-foreground'>{data.length} data</p>
        <Button
          variant='outline'
          size='sm'
          className='h-8 rounded-lg border-zinc-200 px-3 text-[12px] font-medium dark:border-zinc-800'
          onClick={() => downloadExcel(data, `Pengambilan_${categoryLabel.replace(/\s+/g, '_')}`)}
          disabled={data.length === 0}
        >
          <svg xmlns='http://www.w3.org/2000/svg' className='mr-1.5 h-3.5 w-3.5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
            <polyline points='7 10 12 15 17 10' />
            <line x1='12' y1='15' x2='12' y2='3' />
          </svg>
          Download Excel
        </Button>
      </div>

      {data.length === 0 ? (
        <div className='text-muted-foreground py-12 text-center text-[14px]'>Belum ada data.</div>
      ) : (
        <div className='rounded-lg border border-zinc-100 overflow-x-auto dark:border-zinc-800/50'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-[12px]'>Tgl Pickup</TableHead>
                <TableHead className='text-[12px]'>Waktu</TableHead>
                <TableHead className='text-[12px]'>Nama Barang</TableHead>
                <TableHead className='text-[12px]'>Spesifikasi</TableHead>
                <TableHead className='text-[12px]'>Keperluan</TableHead>
                <TableHead className='text-[12px]'>Pengambil</TableHead>
                <TableHead className='text-[12px]'>Departemen</TableHead>
                <TableHead className='text-[12px]'>Qty</TableHead>
                <TableHead className='text-[12px]'>Dikeluarkan Oleh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className='text-[13px] tabular-nums text-muted-foreground whitespace-nowrap'>
                    {new Intl.DateTimeFormat('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    }).format(new Date(row.pickedAt))}
                  </TableCell>
                  <TableCell className='text-[13px] tabular-nums text-muted-foreground'>
                    {new Intl.DateTimeFormat('id-ID', {
                      hour: '2-digit', minute: '2-digit'
                    }).format(new Date(row.pickedAt))}
                  </TableCell>
                  <TableCell className='font-medium text-[14px]'>{row.itemName}</TableCell>
                  <TableCell className='text-[13px] text-muted-foreground max-w-[120px] truncate'>
                    {row.itemSpecification || '-'}
                  </TableCell>
                  <TableCell className='text-[13px] text-muted-foreground max-w-[140px] truncate'>{row.purpose}</TableCell>
                  <TableCell className='text-[14px]'>{row.personName}</TableCell>
                  <TableCell className='text-[13px] text-muted-foreground'>{row.departmentOrigin}</TableCell>
                  <TableCell className='text-[14px] tabular-nums'>{row.quantity}</TableCell>
                  <TableCell className='text-[13px]'>{row.issuedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export function PickupsTabs({ lemariC01, lemariC02, lemariC03 }: PickupsTabsProps) {
  return (
    <Tabs defaultValue='lemari-c01' className='w-full'>
      <TabsList className='mb-4'>
        <TabsTrigger value='lemari-c01'>Lemari C-01 ({lemariC01.length})</TabsTrigger>
        <TabsTrigger value='lemari-c02'>Lemari C-02 ({lemariC02.length})</TabsTrigger>
        <TabsTrigger value='lemari-c03'>Lemari C-03 ({lemariC03.length})</TabsTrigger>
      </TabsList>
      <TabsContent value='lemari-c01'>
        <PickupTable data={lemariC01} categoryLabel='Lemari C-01' />
      </TabsContent>
      <TabsContent value='lemari-c02'>
        <PickupTable data={lemariC02} categoryLabel='Lemari C-02' />
      </TabsContent>
      <TabsContent value='lemari-c03'>
        <PickupTable data={lemariC03} categoryLabel='Lemari C-03' />
      </TabsContent>
    </Tabs>
  );
}
