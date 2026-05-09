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
import { EVENTS, onEvent } from '@/lib/events';
import { createItem } from '../actions';
import { toast } from 'sonner';
import { useActionState, useEffect, useState } from 'react';
import { CATEGORY_OPTIONS } from './item-columns';

const initialState = { success: false, message: '' };

export function AddItemSheet() {
  const [open, setOpen] = useState(false);

  // Listen for kbar event to open this sheet
  useEffect(() => {
    return onEvent(EVENTS.OPEN_ADD_ITEM_SHEET, () => setOpen(true));
  }, []);

  const [_state, formAction, isPending] = useActionState(
    async (_prevState: typeof initialState, formData: FormData) => {
      const name = formData.get('name') as string;
      const category = formData.get('category') as string;

      if (!name || !category) {
        return { success: false, message: 'Semua field wajib diisi.' };
      }

      const result = await createItem({ name, category });

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
          Add Item
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='sm:max-w-[420px]'>
        <SheetHeader>
          <SheetTitle className='text-xl font-semibold' style={{ letterSpacing: '-0.02em' }}>
            Tambah Barang
          </SheetTitle>
          <SheetDescription className='text-[14px]'>
            Masukkan detail barang yang akan ditambahkan ke inventaris.
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className='flex flex-1 flex-col gap-7 py-8'>
          <div className='space-y-2.5'>
            <Label htmlFor='name' className='text-[13px] font-medium'>
              Nama Barang
            </Label>
            <Input
              id='name'
              name='name'
              placeholder='Laptop Lenovo ThinkPad X1'
              required
              autoFocus
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2.5'>
            <Label htmlFor='category' className='text-[13px] font-medium'>
              Kategori
            </Label>
            <Select name='category' required>
              <SelectTrigger
                id='category'
                className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
              >
                <SelectValue placeholder='Pilih kategori' />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
