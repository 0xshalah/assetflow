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
      const data = {
        name: formData.get('name') as string,
        category: formData.get('category') as string,
        quantity: Number(formData.get('quantity')),
        supplier: formData.get('supplier') as string
      };

      if (!data.name || !data.category || !data.quantity || !data.supplier) {
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size='sm' className='rounded-full px-4 text-[13px] font-medium'>
          <Icons.add className='mr-1.5 h-3.5 w-3.5' />
          Barang Masuk
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='sm:max-w-[420px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle className='text-xl font-semibold' style={{ letterSpacing: '-0.02em' }}>
            Input Barang Masuk
          </SheetTitle>
          <SheetDescription className='text-[14px]'>
            Catat barang baru yang masuk ke inventory.
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className='flex flex-1 flex-col gap-5 py-6'>
          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Nama Barang</Label>
            <Input
              name='name'
              placeholder='Kabel HDMI, Baut M8, dll.'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Kategori</Label>
            <Select name='category' required>
              <SelectTrigger className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'>
                <SelectValue placeholder='Pilih kategori' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='elektrik'>Elektrik</SelectItem>
                <SelectItem value='mekanik'>Mekanik</SelectItem>
                <SelectItem value='facility'>Facility</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Jumlah</Label>
            <Input
              name='quantity'
              type='number'
              min={1}
              placeholder='10'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Supplier</Label>
            <Input
              name='supplier'
              placeholder='PT. Sumber Jaya'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <SheetFooter className='mt-auto pt-4'>
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
