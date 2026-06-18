import { NavGroup } from '@/types';

/**
 * Admin sidebar navigation.
 */
export const navGroups: NavGroup[] = [
  {
    label: 'Menu',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/overview',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Inventory',
        url: '/dashboard/inventory',
        icon: 'inventory',
        isActive: false,
        shortcut: ['i', 'i'],
        items: []
      },
      {
        title: 'Data Peminjaman',
        url: '/dashboard/loans',
        icon: 'loans',
        isActive: false,
        shortcut: ['l', 'l'],
        items: []
      },
      {
        title: 'Data Pengambilan',
        url: '/dashboard/pickups',
        icon: 'product',
        isActive: false,
        shortcut: ['p', 'p'],
        items: []
      }
    ]
  }
];
