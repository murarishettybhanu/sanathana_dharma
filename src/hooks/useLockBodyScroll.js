import { useLayoutEffect } from 'react';

/**
 * Freezes background scrolling while an overlay (the mobile drawer) is open.
 *
 * Padding compensates for the scrollbar's width so the page underneath does
 * not visibly shift sideways the moment the drawer opens.
 */
export function useLockBodyScroll(locked) {
  useLayoutEffect(() => {
    if (!locked) return undefined;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    // Clamped deliberately. If an overlay is already in the DOM when this
    // runs, the raw difference can come back as the overlay's own width rather
    // than the scrollbar's — padding the body by hundreds of pixels and
    // crushing the page. No real scrollbar exceeds ~32px, so anything larger
    // is a bad measurement, not a wide scrollbar.
    const measured = window.innerWidth - document.documentElement.clientWidth;
    const scrollbarWidth = Math.min(Math.max(measured, 0), 32);

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [locked]);
}
