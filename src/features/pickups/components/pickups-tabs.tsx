'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  personName: string;
  department: string;
  quantity: number;
  purpose: string;
  pickedAt: Date;
}

interface PickupsTabsProps {
  elektrik: PickupRow[];
  mekanik: PickupRow[];
  facility: PickupRow[];
}

function PickupTable({ data }: { data: PickupRow[] }) {
  if (data.length === 0) {
    return (
      <div className='text-muted-foreground py-12 text-center text-[14px]'>
        Belum ada data pengambilan.
      </div>
    );
  }

  return (
    <div className='rounded-lg border border-zinc-100 dark:border-zinc-800/50'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-[12px]'>Barang</TableHead>
            <TableHead className='text-[12px]'>Nama</TableHead>
            <TableHead className='text-[12px]'>Departemen</TableHead>
            <TableHead className='text-[12px]'>Jumlah</TableHead>
            <TableHead className='text-[12px]'>Keperluan</TableHead>
            <TableHead className='text-[12px]'>Tanggal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className='font-medium text-[14px]'>{row.itemName}</TableCell>
              <TableCell className='text-[14px]'>{row.personName}</TableCell>
              <TableCell className='text-[13px] text-muted-foreground'>{row.department}</TableCell>
              <TableCell className='text-[14px] tabular-nums'>{row.quantity}</TableCell>
              <TableCell className='text-[13px] text-muted-foreground'>{row.purpose}</TableCell>
              <TableCell className='text-[13px] tabular-nums text-muted-foreground'>
                {new Intl.DateTimeFormat('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(new Date(row.pickedAt))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function PickupsTabs({ elektrik, mekanik, facility }: PickupsTabsProps) {
  return (
    <Tabs defaultValue='elektrik' className='w-full'>
      <TabsList className='mb-4'>
        <TabsTrigger value='elektrik'>Elektrik ({elektrik.length})</TabsTrigger>
        <TabsTrigger value='mekanik'>Mekanik ({mekanik.length})</TabsTrigger>
        <TabsTrigger value='facility'>Facility ({facility.length})</TabsTrigger>
      </TabsList>
      <TabsContent value='elektrik'>
        <PickupTable data={elektrik} />
      </TabsContent>
      <TabsContent value='mekanik'>
        <PickupTable data={mekanik} />
      </TabsContent>
      <TabsContent value='facility'>
        <PickupTable data={facility} />
      </TabsContent>
    </Tabs>
  );
}
