'use client';

import { Icons } from '@/components/icons';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Link from 'next/link';

export function OrgSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' asChild>
          <Link href='/dashboard/overview'>
            <div className='bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
              <Icons.logo className='size-4' />
            </div>
            <div className='flex flex-col gap-0.5 leading-none'>
              <span className='font-semibold'>AssetFlow</span>
              <span className='text-xs text-muted-foreground'>Loan Tracking</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
