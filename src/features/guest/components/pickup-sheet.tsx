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
import { DEPARTMENT_OPTIONS, ISSUER_OPTIONS, ISSUER_DEPARTMENT } from '../constants';
import { toast } from 'sonner';
import { useEffect, useState, useActionState } from 'react';
import type { Item } from '@/db/schema/items';

const initialState = { success: false, message: '' };

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  'lemari-c01': 'Lemari C-01',
  'lemari-c02': 'Lemari C-02',
  'lemari-c03': 'Lemari C-03'
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
      toast.info('Wajib klik Simpan sebelum menutup!', { duration: 5000 });
    }
  }, [open, category]);

  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  const [_state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const dateVal = formData.get('pickedDate') as string;
      const timeVal = formData.get('pickedTime') as string;
      const pickedAt = dateVal && timeVal ? `${dateVal}T${timeVal}:00` : '';

      const data = {
        itemId: formData.get('itemId') as string,
        personName: formData.get('personName') as string,
        departmentOrigin: formData.get('departmentOrigin') as string,
        quantity: Number(formData.get('quantity')),
        purpose: formData.get('purpose') as string,
        issuedBy: formData.get('issuedBy') as string,
        issuerDepartment: ISSUER_DEPARTMENT,
        pickedAt
      };

      if (!data.itemId || !data.personName || !data.departmentOrigin || !data.quantity || !data.purpose || !data.issuedBy || !data.pickedAt) {
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
      <SheetContent side='right' className='sm:max-w-[460px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle className='text-xl font-semibold' style={{ letterSpacing: '-0.02em' }}>
            Pengambilan Barang {CATEGORY_LABELS[category]}
          </SheetTitle>
          <SheetDescription className='text-[14px]'>
            Isi semua data lalu <strong>wajib klik Simpan</strong>.
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className='flex flex-1 flex-col gap-4 py-5'>
          {/* 1. Nama yang mengambil */}
          <div className='space-y-1.5'>
            <Label className='text-[13px] font-medium'>Nama yang Mengambil</Label>
            <Input name='personName' placeholder='Nama lengkap' required className='h-10 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800' />
          </div>

          {/* 2. Departemen Asal */}
          <div className='space-y-1.5'>
            <Label className='text-[13px] font-medium'>Departemen Asal</Label>
            <Select name='departmentOrigin' required>
              <SelectTrigger className='h-10 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'>
                <SelectValue placeholder='Pilih departemen' />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. Nama Barang */}
          <div className='space-y-1.5'>
            <Label className='text-[13px] font-medium'>Nama Barang</Label>
            <Select name='itemId' required>
              <SelectTrigger className='h-10 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'>
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

          {/* 4. Jumlah */}
          <div className='space-y-1.5'>
            <Label className='text-[13px] font-medium'>Jumlah</Label>
            <Input name='quantity' type='number' min={1} placeholder='1' required className='h-10 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800' />
          </div>

          {/* 5. Tanggal Pengambilan */}
          <div className='space-y-1.5'>
            <Label className='text-[13px] font-medium'>Tanggal Pengambilan</Label>
            <Input name='pickedDate' type='date' defaultValue={today} required className='h-10 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800' />
          </div>

          {/* 6. Waktu Pengambilan */}
          <div className='space-y-1.5'>
            <Label className='text-[13px] font-medium'>Waktu Pengambilan</Label>
            <Input name='pickedTime' type='time' defaultValue={currentTime} required className='h-10 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800' />
          </div>

          {/* 7. Jenis Keperluan */}
          <div className='space-y-1.5'>
            <Label className='text-[13px] font-medium'>Jenis Keperluan</Label>
            <Input name='purpose' placeholder='Perbaikan mesin, maintenance, dll.' required className='h-10 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800' />
          </div>

          {/* 8. Nama yang Mengeluarkan */}
          <div className='space-y-1.5'>
            <Label className='text-[13px] font-medium'>Nama yang Mengeluarkan</Label>
            <Select name='issuedBy' required>
              <SelectTrigger className='h-10 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'>
                <SelectValue placeholder='Pilih nama' />
              </SelectTrigger>
              <SelectContent>
                {ISSUER_OPTIONS.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 9. Departemen (fixed FMD) */}
          <div className='space-y-1.5'>
            <Label className='text-[13px] font-medium'>Departemen</Label>
            <Input value={ISSUER_DEPARTMENT} disabled className='h-10 rounded-lg border-zinc-200 text-[14px] bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900' />
          </div>

          <SheetFooter className='mt-2 pt-2'>
            <Button
              type='submit'
              disabled={isPending}
              className='w-full h-11 rounded-lg text-[14px] font-medium active:scale-[0.98] transition-transform'
            >
              {isPending ? (
                <><Icons.spinner className='mr-2 h-4 w-4 animate-spin' />Menyimpan...</>
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
