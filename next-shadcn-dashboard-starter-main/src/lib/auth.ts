import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * React cache() ensures supabase.auth.getUser() is called only ONCE per request,
 * even if requireAdmin()/requireAuth() are called multiple times in the same render.
 * This eliminates the double network round-trip (middleware + server action).
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const role = (user.user_metadata?.role as UserRole) ?? 'user';

  return {
    id: user.id,
    email: user.email ?? '',
    role
  };
});

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized: Anda harus login.');
  }

  if (user.role !== 'admin') {
    throw new Error('Forbidden: Hanya admin yang dapat melakukan aksi ini.');
  }

  return user;
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized: Anda harus login.');
  }

  return user;
}
