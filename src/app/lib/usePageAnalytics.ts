import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { trackPageView } from './supabase';

/**
 * Tracks page views on route changes by sending analytics to the server.
 * Deduplicates rapid navigations to the same path.
 */
export function usePageAnalytics() {
  const location = useLocation();
  const lastTracked = useRef('');

  useEffect(() => {
    const path = location.pathname;
    if (path === lastTracked.current) return;
    lastTracked.current = path;

    // Fire and forget — don't block UI
    trackPageView(path).catch((err) => {
      console.warn('Failed to track page view:', err);
    });
  }, [location.pathname]);
}
