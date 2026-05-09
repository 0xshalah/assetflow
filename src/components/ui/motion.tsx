'use client';

import { motion } from 'motion/react';

/**
 * Fade-in-up animation wrapper for page content.
 * Apple-style: subtle, fast, no bounce.
 */
export function FadeIn({
  children,
  delay = 0,
  className
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger children animation — each child fades in sequentially.
 */
export function StaggerContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual stagger item — use inside StaggerContainer.
 */
export function StaggerItem({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
