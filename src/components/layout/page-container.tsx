import React from 'react';
import { Heading } from '../ui/heading';
import type { InfobarContent } from '@/components/ui/infobar';

function PageSkeleton() {
  return (
    <div className='flex flex-1 animate-pulse flex-col gap-6 p-6 md:px-10 md:py-8'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='bg-muted mb-2 h-8 w-48 rounded' />
          <div className='bg-muted h-4 w-72 rounded' />
        </div>
      </div>
      <div className='bg-muted mt-4 h-40 w-full rounded-lg' />
      <div className='bg-muted h-40 w-full rounded-lg' />
    </div>
  );
}

export default function PageContainer({
  children,
  isLoading = false,
  access = true,
  accessFallback,
  pageTitle,
  pageDescription,
  infoContent,
  pageHeaderAction
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  access?: boolean;
  accessFallback?: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  infoContent?: InfobarContent;
  pageHeaderAction?: React.ReactNode;
}) {
  if (!access) {
    return (
      <div className='flex flex-1 items-center justify-center p-6 md:px-10'>
        {accessFallback ?? (
          <div className='text-muted-foreground text-center text-lg'>
            You do not have access to this page.
          </div>
        )}
      </div>
    );
  }

  const content = isLoading ? <PageSkeleton /> : children;

  const hasHeader = pageTitle || pageHeaderAction;

  return (
    <div className='flex flex-1 flex-col px-5 pt-4 pb-6 md:px-10 md:pt-8 md:pb-10'>
      {hasHeader && (
        <div className='mb-8 flex items-start justify-between gap-6'>
          <Heading
            title={pageTitle ?? ''}
            description={pageDescription ?? ''}
            infoContent={infoContent}
          />
          {pageHeaderAction && <div className='shrink-0'>{pageHeaderAction}</div>}
        </div>
      )}
      {content}
    </div>
  );
}
