'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { UserRole } from '@/lib/auth';

/**
 * Client-side hook to get the current user's role.
 * Used for conditional UI rendering (hiding admin buttons for regular users).
 * NOTE: This is for UX only — actual authorization is enforced server-side.
 */
export function useRole() {
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setRole((user.user_metadata?.role as UserRole) ?? 'user');
      }
      setIsLoading(false);
    });
  }, []);

  return { role, isAdmin: role === 'admin', isLoading };
}
