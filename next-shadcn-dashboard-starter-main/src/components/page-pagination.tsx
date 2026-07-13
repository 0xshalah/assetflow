'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext
} from '@/components/ui/pagination';
import { useSearchParams, usePathname } from 'next/navigation';

interface PagePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  paramKey?: string;
}

export function PagePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  paramKey = 'page'
}: PagePaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  function createHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, String(page));
    }
    return `${pathname}?${params.toString()}`;
  }

  const pages: (number | 'ellipsis')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  return (
    <div className='flex items-center justify-between pt-4'>
      <p className='text-[12px] text-muted-foreground'>
        {start}{end > start ? `–${end}` : ''} dari {totalItems}
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createHref(currentPage - 1)}
              className={
                currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>
          {pages.map((page, idx) =>
            page === 'ellipsis' ? (
              <PaginationItem key={`e-${idx}`}>
                <span className='flex size-9 items-center justify-center text-[13px] text-muted-foreground'>
                  ...
                </span>
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href={createHref(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href={createHref(currentPage + 1)}
              className={
                currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
