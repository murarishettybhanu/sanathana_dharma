import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Client-side routing keeps the scroll position across navigations, which
 * drops visitors into the middle of the page they just opened. This restores
 * the behaviour people expect from a link — while honouring in-page `#hash`
 * targets and the browser's own back/forward restoration.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
