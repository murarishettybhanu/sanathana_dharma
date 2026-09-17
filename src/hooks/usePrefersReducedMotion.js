import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

/**
 * True when the visitor has asked their OS to reduce motion.
 *
 * CSS already neutralises transitions (see index.css), but Framer Motion
 * animates inline styles that CSS cannot reach — so components read this hook
 * and skip the animation entirely rather than merely shortening it.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false, // SSR / pre-hydration default: assume motion is fine
  );
}
