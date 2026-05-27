'use client';

import { FadeIn } from '@/components/ui/motion';

export function OverviewAnimated({ children }: { children: React.ReactNode }) {
  return <FadeIn>{children}</FadeIn>;
}
