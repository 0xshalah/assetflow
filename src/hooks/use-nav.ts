'use client';

/**
 * Navigation filtering hook (Clerk RBAC removed — simplified for AssetFlow)
 * All nav items are shown. Auth will be handled by Supabase Auth later.
 */

import { useMemo } from 'react';
import type { NavItem, NavGroup } from '@/types';

export function useFilteredNavItems(items: NavItem[]) {
  return useMemo(() => items, [items]);
}

export function useFilteredNavGroups(groups: NavGroup[]) {
  return useMemo(() => groups, [groups]);
}
