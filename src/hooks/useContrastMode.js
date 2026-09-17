import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'sdct:contrast';

function readInitialMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'high' || stored === 'normal') return stored;
  } catch {
    // Private browsing or blocked storage — fall through to the OS preference.
  }
  return window.matchMedia?.('(prefers-contrast: more)').matches ? 'high' : 'normal';
}

/**
 * Site-wide high-contrast toggle.
 *
 * Writes `data-contrast="high"` onto <html>; index.css re-points the semantic
 * colour tokens under that selector, so no component needs to know this exists.
 * The choice is remembered, and defaults to the OS `prefers-contrast` setting.
 */
export function useContrastMode() {
  const [mode, setMode] = useState(readInitialMode);

  useEffect(() => {
    document.documentElement.dataset.contrast = mode;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Persisting is a convenience, not a requirement — ignore failures.
    }
  }, [mode]);

  const toggle = useCallback(
    () => setMode((m) => (m === 'high' ? 'normal' : 'high')),
    [],
  );

  return { mode, isHighContrast: mode === 'high', toggle };
}
