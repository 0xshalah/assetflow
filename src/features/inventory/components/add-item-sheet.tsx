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
import { createItem } from '../actions';
import { toast } from 'sonner';
import { useActionState, useState } from 'react';

const initialState = { success: false, message: '' };

export function AddItemSheet() {
  const [open, setOpen] = useState(false);

  const [_state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const dateVal = formData.get('receivedDate') as string;
      const timeVal = formData.get('receivedTime') as string;

      // Combine date and time into ISO string
      const receivedAt = dateVal && timeVal ? `${dateVal}T${timeVal}:00` : dateVal;

      const data = {
        name: formData.get('name') as string,
        specification: (formData.get('specification') as string) || '',
        category: formData.get('category') as string,
        quantity: Number(formData.get('quantity')),
        unit: formData.get('unit') as string,
        supplier: formData.get('supplier') as string,
        receivedAt
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

      const result = await createItem(data);

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

  // Get today's date as default
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size='sm' className='rounded-full px-4 text-[13px] font-medium'>
          <Icons.add className='mr-1.5 h-3.5 w-3.5' />
          Barang Masuk
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='sm:max-w-[440px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle className='text-xl font-semibold' style={{ letterSpacing: '-0.02em' }}>
            Input Barang Masuk
          </SheetTitle>
          <SheetDescription className='text-[14px]'>
            Catat barang baru yang masuk ke inventory.
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className='flex flex-1 flex-col gap-4 py-6'>
          {/* 1. Nama Barang */}
          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Nama Barang</Label>
            <Input
              name='name'
              placeholder='Nama barang'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          {/* 2. Spesifikasi */}
          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Spesifikasi</Label>
            <Input
              name='specification'
              placeholder='Spesifikasi barang (opsional)'
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          {/* 3. Kategori Barang */}
          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Kategori Barang</Label>
            <Select name='category' required>
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

          {/* 4. Jumlah Barang (Qty) */}
          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Jumlah Barang Masuk (Qty)</Label>
            <Input
              name='quantity'
              type='number'
              min={1}
              placeholder='10'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          {/* 5. Unit */}
          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Unit</Label>
            <Input
              name='unit'
              placeholder='pcs, box, meter, dll.'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          {/* 6. Supplier */}
          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Supplier</Label>
            <Input
              name='supplier'
              placeholder='PT. Sumber Jaya'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          {/* 7. Tanggal Barang Masuk */}
          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Tanggal Barang Masuk</Label>
            <Input
              name='receivedDate'
              type='date'
              defaultValue={today}
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          {/* 8. Waktu Barang Masuk */}
          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Waktu Barang Masuk</Label>
            <Input
              name='receivedTime'
              type='time'
              defaultValue={currentTime}
              required
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
