import { useEffect } from 'react';

const SUFFIX = 'Sanathana Dharma Charitable Trust, Bheemili';

/**
 * Sets the document title per route.
 *
 * In a single-page app the title does not change on its own, which leaves
 * screen-reader users without any announcement that navigation happened — and
 * leaves every browser-history entry reading the same. This fixes both.
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${SUFFIX}` : SUFFIX;
  }, [title]);
}
