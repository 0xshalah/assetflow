'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Kbd } from '@/components/ui/kbd';

export function ThemeModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  const handleThemeToggle = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const newMode = isDark ? 'light' : 'dark';

      // Fallback for browsers without View Transitions API
      if (!document.startViewTransition) {
        setTheme(newMode);
        return;
      }

      // Get click coordinates for the circular reveal origin
      const x = e.clientX;
      const y = e.clientY;

      // Calculate the max radius to cover the entire viewport
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const expandedClip = `circle(${maxRadius}px at ${x}px ${y}px)`;
      const collapsedClip = `circle(0px at ${x}px ${y}px)`;

      // Switching to LIGHT mode → "Sunrise" (new layer expands outward)
      if (isDark) {
        document.documentElement.dataset.transitionMode = 'sunrise';

        const transition = document.startViewTransition(() => {
          setTheme('light');
        });

        transition.ready.then(() => {
          document.documentElement.animate(
            { clipPath: [collapsedClip, expandedClip] },
            {
              duration: 500,
              easing: 'ease-in',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        });

        transition.finished.then(() => {
          delete document.documentElement.dataset.transitionMode;
        });
      } else {
        // Switching to DARK mode → "Eclipse" (old layer shrinks inward)
        delete document.documentElement.dataset.transitionMode;

        const transition = document.startViewTransition(() => {
          setTheme('dark');
        });

        transition.ready.then(() => {
          document.documentElement.animate(
            { clipPath: [expandedClip, collapsedClip] },
            {
              duration: 400,
              easing: 'ease-out',
              fill: 'forwards',
              pseudoElement: '::view-transition-old(root)'
            }
          );
        });
      }
    },
    [isDark, setTheme]
  );

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' className='size-8'>
        <span className='sr-only'>Toggle theme</span>
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative size-8 overflow-hidden'
          onClick={handleThemeToggle}
        >
          <AnimatePresence mode='wait' initial={false}>
            {isDark ? (
              <motion.svg
                key='moon'
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                initial={{ rotate: -90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
              </motion.svg>
            ) : (
              <motion.svg
                key='sun'
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                initial={{ rotate: 90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <circle cx='12' cy='12' r='4' />
                <path d='M12 2v2' />
                <path d='M12 20v2' />
                <path d='m4.93 4.93 1.41 1.41' />
                <path d='m17.66 17.66 1.41 1.41' />
                <path d='M2 12h2' />
                <path d='M20 12h2' />
                <path d='m6.34 17.66-1.41 1.41' />
                <path d='m19.07 4.93-1.41 1.41' />
              </motion.svg>
            )}
          </AnimatePresence>
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Toggle theme <Kbd>D D</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}
