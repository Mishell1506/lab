'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * AuthGuard - Verifies session is still valid.
 * Handles the browser back-button problem: when user logs out and presses "back",
 * the browser shows the cached page. This component detects that scenario and
 * redirects to login.
 *
 * Triggers on:
 * - Component mount
 * - Tab/window becomes visible again (visibilitychange)
 * - Page restored from browser back-forward cache (pageshow)
 */
export default function AuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', { cache: 'no-store' });
        if (!res.ok) {
          // Session expired or cookie cleared → redirect to login
          router.replace('/');
        }
      } catch {
        // Network error, don't redirect
      }
    };

    // Check on mount
    checkAuth();

    // Check when user comes back to the tab (alt-tab, back button, etc.)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkAuth();
      }
    };

    // Check when page is restored from bfcache (back-forward cache)
    const handlePageShow = (event) => {
      if (event.persisted) {
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [router]);

  return null; // This component renders nothing, it's pure logic
}
