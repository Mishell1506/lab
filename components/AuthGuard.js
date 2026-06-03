'use client';

import { useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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

  // Run synchronously before the browser paints
  useIsomorphicLayoutEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      document.documentElement.style.display = 'none';
      window.location.replace('/');
    } else {
      document.documentElement.style.display = '';
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', { cache: 'no-store' });
        if (!res.ok) {
          // Session expired or cookie cleared → redirect to login
          localStorage.removeItem('isLoggedIn');
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
        if (localStorage.getItem('isLoggedIn') !== 'true') {
          document.documentElement.style.display = 'none';
          window.location.replace('/');
          return;
        }
        checkAuth();
      }
    };

    // Check when page is restored from bfcache (back-forward cache)
    const handlePageShow = (event) => {
      if (event.persisted) {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
          document.documentElement.style.display = 'none';
          window.location.replace('/');
          return;
        }
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
