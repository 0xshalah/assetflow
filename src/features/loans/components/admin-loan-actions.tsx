'use client';

import { useRole } from '@/hooks/use-role';
import { NewLoanSheet } from './new-loan-sheet';
import { ExportLoansButton } from './export-loans-button';
import type { Item } from '@/db/schema/items';
import type { LoanRow } from './loan-columns';

interface AdminLoanActionsProps {
  availableItems: Item[];
  loansData: LoanRow[];
}

/**
 * Renders loan action buttons based on role.
 * - Export: visible to all users
 * - New Loan: admin only
 */
export function AdminLoanActions({ availableItems, loansData }: AdminLoanActionsProps) {
  const { isAdmin, isLoading } = useRole();

  return (
    <div className='flex items-center gap-2'>
      <ExportLoansButton data={loansData} />
      {!isLoading && isAdmin && <NewLoanSheet availableItems={availableItems} />}
    </div>
  );
}
