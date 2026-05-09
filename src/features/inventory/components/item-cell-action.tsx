'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import type { Item } from '@/db/schema/items';
import { deleteItem } from '../actions';
import { EditItemSheet } from './edit-item-sheet';
import { toast } from 'sonner';
import { useState, useTransition } from 'react';

interface ItemCellActionProps {
  data: Item;
}

export function ItemCellAction({ data }: ItemCellActionProps) {
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteItem(data.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0' disabled={isPending}>
            <span className='sr-only'>Open menu</span>
            <Icons.ellipsis className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Icons.edit className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className='text-destructive focus:text-destructive'
            disabled={data.status === 'borrowed'}
          >
            <Icons.trash className='mr-2 h-4 w-4' />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditItemSheet item={data} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
