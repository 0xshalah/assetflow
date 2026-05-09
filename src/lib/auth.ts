import 'server-only';

import { createClient } from '@/lib/supabase/server';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Get the current authenticated user with role from server context.
 * Role is stored in Supabase Auth user_metadata.
 * Default role for new users: 'user'
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
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
}

/**
 * Check if the current user has admin role.
 * Use in server actions before mutations.
 */
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

/**
 * Check if user is authenticated (any role).
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized: Anda harus login.');
  }

  return user;
}
