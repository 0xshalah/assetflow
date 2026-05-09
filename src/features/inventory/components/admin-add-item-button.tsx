'use client';

import { useRole } from '@/hooks/use-role';
import { AddItemSheet } from './add-item-sheet';

/**
 * Only renders the Add Item button if the user is an admin.
 */
export function AdminAddItemButton() {
  const { isAdmin, isLoading } = useRole();

  if (isLoading || !isAdmin) return null;

  return <AddItemSheet />;
}
