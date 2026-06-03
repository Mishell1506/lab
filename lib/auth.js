import { cookies } from 'next/headers';
import supabase from './supabase';

const COOKIE_NAME = 'userId';

/**
 * Get the currently authenticated user from the signed cookie.
 * Returns the user object { id, username } or null if not authenticated.
 */
export async function getAuthUser() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get(COOKIE_NAME);

  if (!userIdCookie?.value) {
    return null;
  }

  const userId = parseInt(userIdCookie.value, 10);
  if (isNaN(userId)) {
    return null;
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('id, username')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Set the auth cookie after successful login.
 */
export async function setAuthCookie(userId) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, String(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

/**
 * Clear the auth cookie (logout).
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
