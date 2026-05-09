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
import type { Item } from '@/db/schema/items';
import { createLoan } from '../actions';
import { toast } from 'sonner';
import { useActionState, useEffect, useState } from 'react';

const initialState = { success: false, message: '' };

interface NewLoanSheetProps {
  /** Only items with status 'available' should be passed here */
  availableItems: Item[];
}

export function NewLoanSheet({ availableItems }: NewLoanSheetProps) {
  const [open, setOpen] = useState(false);

  // Listen for kbar event to open this sheet
  useEffect(() => {
    return onEvent(EVENTS.OPEN_NEW_LOAN_SHEET, () => setOpen(true));
  }, []);

  const [_state, formAction, isPending] = useActionState(
    async (_prevState: typeof initialState, formData: FormData) => {
      const itemId = formData.get('itemId') as string;
      const borrowerName = formData.get('borrowerName') as string;
      const borrowerContact = formData.get('borrowerContact') as string;

      if (!itemId || !borrowerName || !borrowerContact) {
        toast.error('Semua field wajib diisi.');
        return { success: false, message: 'Semua field wajib diisi.' };
      }

      const result = await createLoan({ itemId, borrowerName, borrowerContact });

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
          New Loan
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='sm:max-w-[420px]'>
        <SheetHeader>
          <SheetTitle className='text-xl font-semibold' style={{ letterSpacing: '-0.02em' }}>
            Peminjaman Baru
          </SheetTitle>
          <SheetDescription className='text-[14px]'>
            Catat peminjaman barang. Hanya barang tersedia yang dapat dipilih.
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className='flex flex-1 flex-col gap-7 py-8'>
          <div className='space-y-2.5'>
            <Label htmlFor='itemId' className='text-[13px] font-medium'>
              Barang
            </Label>
            <Select name='itemId' required>
              <SelectTrigger
                id='itemId'
                className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
              >
                <SelectValue placeholder='Pilih barang' />
              </SelectTrigger>
              <SelectContent>
                {availableItems.length === 0 ? (
                  <SelectItem value='__none' disabled>
                    Tidak ada barang tersedia
                  </SelectItem>
                ) : (
                  availableItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} — {item.category}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2.5'>
            <Label htmlFor='borrowerName' className='text-[13px] font-medium'>
              Nama Peminjam
            </Label>
            <Input
              id='borrowerName'
              name='borrowerName'
              placeholder='John Doe'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2.5'>
            <Label htmlFor='borrowerContact' className='text-[13px] font-medium'>
              Kontak (Email / WhatsApp)
            </Label>
            <Input
              id='borrowerContact'
              name='borrowerContact'
              placeholder='john@company.com atau 08123456789'
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
                  Memproses...
                </>
              ) : (
                'Catat Peminjaman'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
