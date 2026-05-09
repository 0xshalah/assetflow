'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { requireAdmin, getCurrentUser } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/sign-in');
}

/**
 * Set a user's role. Admin only.
 * For initial setup, the first user can set their own role via Supabase Dashboard:
 * Authentication → Users → click user → Edit user metadata → add: {"role": "admin"}
 */
export async function setUserRole(userId: string, role: 'admin' | 'user') {
  const admin = await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role }
  });

  if (error) {
    logger.error('Failed to set user role', { error: error.message, targetUserId: userId });
    return { success: false, message: error.message };
  }

  logger.audit('user.role_changed', { targetUserId: userId, newRole: role, by: admin.email });
  return { success: true, message: `Role berhasil diubah ke ${role}.` };
}

/**
 * Get current user info (for client components).
 */
export async function getMe() {
  return getCurrentUser();
}
