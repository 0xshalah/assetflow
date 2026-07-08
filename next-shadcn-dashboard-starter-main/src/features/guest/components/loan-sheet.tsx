'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { createGuestLoan } from '../actions';
import { toast } from 'sonner';
import { useEffect, useActionState } from 'react';

const initialState = { success: false, message: '' };

interface LoanSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoanSheet({ open, onOpenChange }: LoanSheetProps) {
  useEffect(() => {
    if (open) {
      toast.info('Jangan lupa klik Simpan sebelum menutup!', { duration: 4000 });
    }
  }, [open]);

  const [_state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const data = {
        itemName: formData.get('itemName') as string,
        quantity: Number(formData.get('quantity')),
        purpose: formData.get('purpose') as string,
        borrowerName: formData.get('borrowerName') as string,
        department: formData.get('department') as string,
        borrowerContact: formData.get('borrowerContact') as string
      };

      if (
        !data.itemName ||
        !data.quantity ||
        !data.purpose ||
        !data.borrowerName ||
        !data.department ||
        !data.borrowerContact
      ) {
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
            Catat peminjaman barang. Data akan tersimpan sebagai arsip.
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className='flex flex-1 flex-col gap-4 py-6'>
          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Nama Barang</Label>
            <Input
              name='itemName'
              placeholder='Nama barang yang dipinjam'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Jumlah Dipinjam</Label>
            <Input
              name='quantity'
              type='number'
              min={1}
              max={50}
              placeholder='1'
              required
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[13px] font-medium'>Keperluan</Label>
            <Textarea
              name='purpose'
              placeholder='Tujuan peminjaman...'
              required
              className='min-h-[80px] rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
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
            <Label className='text-[13px] font-medium'>Departemen</Label>
            <Input
              name='department'
              placeholder='Departemen peminjam'
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
