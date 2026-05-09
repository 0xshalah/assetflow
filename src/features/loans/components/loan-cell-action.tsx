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
import type { LoanRow } from './loan-columns';
import { returnLoan, deleteLoan } from '../actions';
import { toast } from 'sonner';
import { useTransition } from 'react';

interface LoanCellActionProps {
  data: LoanRow;
}

export function LoanCellAction({ data }: LoanCellActionProps) {
  const [isPending, startTransition] = useTransition();

  function handleReturn() {
    startTransition(async () => {
      const result = await returnLoan(data.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteLoan(data.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
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
        {data.status === 'active' && (
          <DropdownMenuItem onClick={handleReturn}>
            <Icons.check className='mr-2 h-4 w-4' />
            Mark as Returned
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={handleDelete}
          className='text-destructive focus:text-destructive'
        >
          <Icons.trash className='mr-2 h-4 w-4' />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
