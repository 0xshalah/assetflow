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
  SheetTitle
} from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import type { ItemCategory } from '@/db/schema/items';
import { getItemsByCategory, createPickup } from '../actions';
import { toast } from 'sonner';
import { useEffect, useState, useActionState } from 'react';
import type { Item } from '@/db/schema/items';

const initialState = { success: false, message: '' };

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  elektrik: 'Elektrik',
  mekanik: 'Mekanik',
  facility: 'Facility'
};

interface PickupSheetProps {
  category: ItemCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PickupSheet({ category, open, onOpenChange }: PickupSheetProps) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (open) {
      getItemsByCategory(category).then(setItems);
      toast.info('Jangan lupa klik Simpan sebelum menutup!', { duration: 4000 });
    }
  }, [open, category]);

  const [_state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const data = {
        itemId: formData.get('itemId') as string,
        personName: formData.get('personName') as string,
        department: formData.get('department') as string,
        quantity: Number(formData.get('quantity')),
        purpose: formData.get('purpose') as string
      };

      if (!data.itemId || !data.personName || !data.department || !data.quantity || !data.purpose) {
        toast.error('Semua field wajib diisi.');
        return { success: false, message: 'Semua field wajib diisi.' };
      }

      const result = await createPickup(data);

      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }

      return result;
    },
    initialState
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='sm:max-w-[440px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle className='text-xl font-semibold' style={{ letterSpacing: '-0.02em' }}>
            Pengambilan Barang {CATEGORY_LABELS[category]}
          </SheetTitle>
          <SheetDescription className='text-[14px]'>
            Isi data pengambilan barang. Pastikan klik Simpan.
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className='flex flex-1 flex-col gap-5 py-6'>
          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Nama</Label>
            <Input
              name='personName'
              placeholder='Nama lengkap'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Departemen</Label>
            <Input
              name='department'
              placeholder='IT, Produksi, dll.'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Barang</Label>
            <Select name='itemId' required>
              <SelectTrigger className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'>
                <SelectValue placeholder='Pilih barang' />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.id} value={item.id} disabled={item.quantity <= 0}>
                    {item.name} {item.quantity <= 0 ? '(Habis)' : `(Stok: ${item.quantity})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Jumlah</Label>
            <Input
              name='quantity'
              type='number'
              min={1}
              placeholder='1'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Jenis Keperluan</Label>
            <Input
              name='purpose'
              placeholder='Perbaikan mesin, maintenance, dll.'
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
