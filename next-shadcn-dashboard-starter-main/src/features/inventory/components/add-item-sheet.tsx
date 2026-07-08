'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { createItem, updateItem } from '../actions';
import { toast } from 'sonner';
import { useActionState, useState } from 'react';
import type { Item } from '@/db/schema/items';

const initialState = { success: false, message: '' };

interface AddItemSheetProps {
  editItem?: Item;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function toDateInput(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

function toTimeInput(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function AddItemSheet({ editItem, open: externalOpen, onOpenChange: externalOnOpenChange }: AddItemSheetProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen ?? internalOpen;
  const setOpen = externalOnOpenChange ?? setInternalOpen;
  const isEditing = !!editItem;

  const [_state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const dateVal = formData.get('receivedDate') as string;
      const timeVal = formData.get('receivedTime') as string;
      const receivedAt = dateVal && timeVal ? `${dateVal}T${timeVal}:00` : dateVal;

      const data = {
        name: formData.get('name') as string,
        specification: (formData.get('specification') as string) || '',
        category: formData.get('category') as string,
        quantity: Number(formData.get('quantity')),
        unit: formData.get('unit') as string,
        supplier: formData.get('supplier') as string,
        receivedAt,
        minimumStock: Number(formData.get('minimumStock')) || 0
      };

      if (
        !data.name ||
        !data.category ||
        !data.quantity ||
        !data.unit ||
        !data.supplier ||
        !data.receivedAt
      ) {
        toast.error('Semua field wajib diisi.');
        return { success: false, message: 'Semua field wajib diisi.' };
      }

      const result = isEditing
        ? await updateItem(editItem.id, data)
        : await createItem(data);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }

      return result;
    },
    initialState
  );

  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  const triggerButton = isEditing ? null : (
    <SheetTrigger asChild>
      <Button size='sm' className='rounded-full px-4 text-[13px] font-medium'>
        <Icons.add className='mr-1.5 h-3.5 w-3.5' />
        Barang Masuk
      </Button>
    </SheetTrigger>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {triggerButton}
      <SheetContent side='right' className='sm:max-w-[440px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle className='text-xl font-semibold' style={{ letterSpacing: '-0.02em' }}>
            {isEditing ? 'Edit Barang' : 'Input Barang Masuk'}
          </SheetTitle>
          <SheetDescription className='text-[14px]'>
            {isEditing ? 'Perbarui data barang yang sudah ada.' : 'Catat barang baru yang masuk ke inventory.'}
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className='flex flex-1 flex-col gap-4 py-6'>
          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Nama Barang</Label>
            <Input
              name='name'
              placeholder='Nama barang'
              required
              defaultValue={editItem?.name}
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Spesifikasi</Label>
            <Input
              name='specification'
              placeholder='Spesifikasi barang (opsional)'
              defaultValue={editItem?.specification || ''}
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Kategori Barang</Label>
            <Select name='category' required defaultValue={editItem?.category}>
              <SelectTrigger className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'>
                <SelectValue placeholder='Pilih kategori' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='lemari-c01'>Lemari C-01</SelectItem>
                <SelectItem value='lemari-c02'>Lemari C-02</SelectItem>
                <SelectItem value='lemari-c03'>Lemari C-03</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Jumlah Barang Masuk (Qty)</Label>
            <Input
              name='quantity'
              type='number'
              min={1}
              placeholder='10'
              required
              defaultValue={editItem?.quantity}
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Unit</Label>
            <Input
              name='unit'
              placeholder='pcs, box, meter, dll.'
              required
              defaultValue={editItem?.unit || ''}
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Supplier</Label>
            <Input
              name='supplier'
              placeholder='PT. Sumber Jaya'
              required
              defaultValue={editItem?.supplier}
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Tanggal Barang Masuk</Label>
            <Input
              name='receivedDate'
              type='date'
              defaultValue={editItem ? toDateInput(editItem.receivedAt) : today}
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Waktu Barang Masuk</Label>
            <Input
              name='receivedTime'
              type='time'
              defaultValue={editItem ? toTimeInput(new Date(editItem.receivedAt)) : currentTime}
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Jumlah Batas Stok Minimum Barang</Label>
            <Input
              name='minimumStock'
              type='number'
              min={0}
              placeholder='0'
              defaultValue={editItem?.minimumStock ?? 0}
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <SheetFooter className='mt-2 pt-2'>
            <Button
              type='submit'
              disabled={isPending}
              className='w-full h-11 rounded-lg text-[14px] font-medium active:scale-[0.98] transition-transform'
            >
              {isPending ? (
                <>
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  Menyimpan...
                </>
              ) : (
                'Simpan'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
