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
import { getItemsForLoan, createGuestLoan } from '../actions';
import { toast } from 'sonner';
import { useEffect, useState, useActionState } from 'react';
import type { Item } from '@/db/schema/items';

const initialState = { success: false, message: '' };

interface LoanSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoanSheet({ open, onOpenChange }: LoanSheetProps) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (open) {
      getItemsForLoan().then(setItems);
      toast.info('Jangan lupa klik Simpan sebelum menutup!', { duration: 4000 });
    }
  }, [open]);

  const [_state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const data = {
        itemId: formData.get('itemId') as string,
        borrowerName: formData.get('borrowerName') as string,
        borrowerContact: formData.get('borrowerContact') as string
      };

      if (!data.itemId || !data.borrowerName || !data.borrowerContact) {
        toast.error('Semua field wajib diisi.');
        return { success: false, message: 'Semua field wajib diisi.' };
      }

      const result = await createGuestLoan(data);

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
            Peminjaman Barang
          </SheetTitle>
          <SheetDescription className='text-[14px]'>
            Isi data peminjaman. Barang akan dikembalikan melalui admin.
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className='flex flex-1 flex-col gap-5 py-6'>
          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Barang</Label>
            <Select name='itemId' required>
              <SelectTrigger className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'>
                <SelectValue placeholder='Pilih barang' />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.id} value={item.id} disabled={item.quantity <= 0}>
                    {item.name} — {item.category}{' '}
                    {item.quantity <= 0 ? '(Habis)' : `(Stok: ${item.quantity})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Nama Peminjam</Label>
            <Input
              name='borrowerName'
              placeholder='Nama lengkap'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Kontak (Email / WhatsApp)</Label>
            <Input
              name='borrowerContact'
              placeholder='08123456789'
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
