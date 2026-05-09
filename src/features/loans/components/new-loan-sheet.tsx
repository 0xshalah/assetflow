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
        <Button className='text-xs md:text-sm'>
          <Icons.add className='mr-2 h-4 w-4' />
          New Loan
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='text-lg tracking-tight'>Peminjaman Baru</SheetTitle>
          <SheetDescription>
            Catat peminjaman barang. Hanya barang yang tersedia yang dapat dipilih.
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className='flex flex-1 flex-col gap-6 py-6'>
          <div className='space-y-2'>
            <Label htmlFor='itemId'>Barang</Label>
            <Select name='itemId' required>
              <SelectTrigger id='itemId' className='h-11'>
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

          <div className='space-y-2'>
            <Label htmlFor='borrowerName'>Nama Peminjam</Label>
            <Input
              id='borrowerName'
              name='borrowerName'
              placeholder='John Doe'
              required
              className='h-11'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='borrowerContact'>Kontak (Email / WhatsApp)</Label>
            <Input
              id='borrowerContact'
              name='borrowerContact'
              placeholder='john@company.com atau 08123456789'
              required
              className='h-11'
            />
          </div>

          <SheetFooter className='mt-auto'>
            <Button type='submit' disabled={isPending} className='w-full h-11'>
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
