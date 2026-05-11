'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Icons } from '@/components/icons';
import type { Item } from '@/db/schema/items';
import { deleteItem } from '../actions';
import { toast } from 'sonner';
import { useTransition } from 'react';

const CATEGORY_LABEL: Record<string, string> = {
  elektrik: 'Elektrik',
  mekanik: 'Mekanik',
  facility: 'Facility'
};

interface InventoryTableProps {
  data: Item[];
}

function RowAction({ item }: { item: Item }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Hapus "${item.name}"?`)) return;
    startTransition(async () => {
      const result = await deleteItem(item.id);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0' disabled={isPending}>
          <Icons.ellipsis className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={handleDelete}
          className='text-destructive focus:text-destructive'
        >
          <Icons.trash className='mr-2 h-4 w-4' />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function InventoryTable({ data }: InventoryTableProps) {
  if (data.length === 0) {
    return (
      <div className='text-muted-foreground py-16 text-center text-[14px]'>
        Belum ada barang di inventory. Klik "Barang Masuk" untuk menambahkan.
      </div>
    );
  }

  return (
    <div className='rounded-lg border border-zinc-100 dark:border-zinc-800/50'>
      <Table>
        <TableHeader>
          <TableRow className='border-zinc-100 dark:border-zinc-800/50'>
            <TableHead className='text-[12px] font-medium text-muted-foreground'>
              Nama Barang
            </TableHead>
            <TableHead className='text-[12px] font-medium text-muted-foreground'>
              Kategori
            </TableHead>
            <TableHead className='text-[12px] font-medium text-muted-foreground'>Stok</TableHead>
            <TableHead className='text-[12px] font-medium text-muted-foreground'>
              Supplier
            </TableHead>
            <TableHead className='text-[12px] font-medium text-muted-foreground'>
              Tgl Masuk
            </TableHead>
            <TableHead className='w-10' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className='border-zinc-100 dark:border-zinc-800/50'>
              <TableCell className='font-medium text-[14px]' style={{ letterSpacing: '-0.01em' }}>
                {item.name}
              </TableCell>
              <TableCell>
                <Badge
                  variant='outline'
                  className='rounded-full px-2.5 py-0.5 text-[11px] font-medium'
                >
                  {CATEGORY_LABEL[item.category] ?? item.category}
                </Badge>
              </TableCell>
              <TableCell>
                <span
                  className={`text-[14px] tabular-nums font-medium ${item.quantity === 0 ? 'text-destructive' : ''}`}
                >
                  {item.quantity}
                </span>
              </TableCell>
              <TableCell className='text-[13px] text-muted-foreground'>{item.supplier}</TableCell>
              <TableCell className='text-[13px] tabular-nums text-muted-foreground'>
                {new Intl.DateTimeFormat('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }).format(new Date(item.receivedAt))}
              </TableCell>
              <TableCell>
                <RowAction item={item} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
