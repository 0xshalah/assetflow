import { NavGroup } from '@/types';

/**
 * AssetFlow navigation configuration.
 * Simplified from the template — only relevant pages for loan tracking.
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
        title: 'Loans',
        url: '/dashboard/loans',
        icon: 'loans',
        isActive: false,
        shortcut: ['l', 'l'],
        items: []
      }
    ]
  }
];
