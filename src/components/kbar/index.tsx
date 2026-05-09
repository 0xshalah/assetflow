'use client';
import { navGroups } from '@/config/nav-config';
import { EVENTS, emitEvent } from '@/lib/events';
import { KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarSearch } from 'kbar';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import RenderResults from './render-result';
import useThemeSwitching from './use-theme-switching';
import { useFilteredNavGroups } from '@/hooks/use-nav';

export default function KBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const filteredGroups = useFilteredNavGroups(navGroups);

  // These action are for the navigation
  const actions = useMemo(() => {
    // Define navigateTo inside the useMemo callback to avoid dependency array issues
    const navigateTo = (url: string) => {
      router.push(url);
    };

    const allItems = filteredGroups.flatMap((group) => group.items);

    const navActions = allItems.flatMap((navItem) => {
      // Only include base action if the navItem has a real URL and is not just a container
      const baseAction =
        navItem.url !== '#'
          ? {
              id: `${navItem.title.toLowerCase()}Action`,
              name: navItem.title,
              shortcut: navItem.shortcut,
              keywords: navItem.title.toLowerCase(),
              section: 'Navigation',
              subtitle: `Go to ${navItem.title}`,
              perform: () => navigateTo(navItem.url)
            }
          : null;

      // Map child items into actions
      const childActions =
        navItem.items?.map((childItem) => ({
          id: `${childItem.title.toLowerCase()}Action`,
          name: childItem.title,
          shortcut: childItem.shortcut,
          keywords: childItem.title.toLowerCase(),
          section: navItem.title,
          subtitle: `Go to ${childItem.title}`,
          perform: () => navigateTo(childItem.url)
        })) ?? [];

      // Return only valid actions (ignoring null base actions for containers)
      return baseAction ? [baseAction, ...childActions] : childActions;
    });

    // AssetFlow-specific quick actions
    const assetFlowActions = [
      {
        id: 'addNewItemAction',
        name: 'Add New Item',
        keywords: 'add item inventory create barang',
        section: 'Actions',
        subtitle: 'Open the Add Item form',
        perform: () => {
          navigateTo('/dashboard/inventory');
          // Small delay to ensure page is loaded before emitting event
          setTimeout(() => emitEvent(EVENTS.OPEN_ADD_ITEM_SHEET), 300);
        }
      },
      {
        id: 'createNewLoanAction',
        name: 'Create New Loan',
        keywords: 'loan borrow pinjam create new',
        section: 'Actions',
        subtitle: 'Open the New Loan form',
        perform: () => {
          navigateTo('/dashboard/loans');
          setTimeout(() => emitEvent(EVENTS.OPEN_NEW_LOAN_SHEET), 300);
        }
      }
    ];

    return [...navActions, ...assetFlowActions];
  }, [router, filteredGroups]);

  return (
    <KBarProvider actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
}
const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  useThemeSwitching();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className='bg-background/80 fixed inset-0 z-99999 p-0! backdrop-blur-sm'>
          <KBarAnimator className='bg-card text-card-foreground relative mt-64! w-full max-w-[600px] -translate-y-12! overflow-hidden rounded-lg border shadow-lg'>
            <div className='bg-card border-border sticky top-0 z-10 border-b'>
              <KBarSearch className='bg-card w-full border-none px-6 py-4 text-lg outline-hidden focus:ring-0 focus:ring-offset-0 focus:outline-hidden' />
            </div>
            <div className='max-h-[400px]'>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
