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
import type { Item } from '@/db/schema/items';
import { updateItem } from '../actions';
import { toast } from 'sonner';
import { useActionState } from 'react';
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from './item-columns';

const initialState = { success: false, message: '' };

interface EditItemSheetProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditItemSheet({ item, open, onOpenChange }: EditItemSheetProps) {
  const [_state, formAction, isPending] = useActionState(
    async (_prevState: typeof initialState, formData: FormData) => {
      const name = formData.get('name') as string;
      const category = formData.get('category') as string;
      const status = formData.get('status') as string;

      const result = await updateItem(item.id, { name, category, status });

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
      <SheetContent side='right' className='sm:max-w-[420px]'>
        <SheetHeader>
          <SheetTitle className='text-xl font-semibold' style={{ letterSpacing: '-0.02em' }}>
            Edit Barang
          </SheetTitle>
          <SheetDescription className='text-[14px]'>Perbarui informasi barang.</SheetDescription>
        </SheetHeader>

        <form action={formAction} className='flex flex-1 flex-col gap-7 py-8'>
          <div className='space-y-2.5'>
            <Label htmlFor='edit-name' className='text-[13px] font-medium'>
              Nama Barang
            </Label>
            <Input
              id='edit-name'
              name='name'
              defaultValue={item.name}
              required
              autoFocus
              className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
            />
          </div>

          <div className='space-y-2.5'>
            <Label htmlFor='edit-category' className='text-[13px] font-medium'>
              Kategori
            </Label>
            <Select name='category' defaultValue={item.category} required>
              <SelectTrigger
                id='edit-category'
                className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
              >
                <SelectValue />
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

          <div className='space-y-2.5'>
            <Label htmlFor='edit-status' className='text-[13px] font-medium'>
              Status
            </Label>
            <Select name='status' defaultValue={item.status} required>
              <SelectTrigger
                id='edit-status'
                className='h-11 rounded-lg border-zinc-200 text-[14px] dark:border-zinc-800'
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
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
                'Simpan Perubahan'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
