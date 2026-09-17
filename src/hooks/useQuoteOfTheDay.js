import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/** Day index since the epoch — changes exactly once per local midnight. */
function dayNumber(date = new Date()) {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(local.getTime() / 86_400_000);
}

/**
 * Drives the "Quote of the Day" carousel.
 *
 * The starting quote is derived from the date rather than picked at random, so
 * every visitor sees the same quote on a given day and a refresh does not
 * shuffle it. Visitors can still step through the rest by hand.
 *
 * Auto-advance is suspended while the visitor is hovering or keyboard-focused
 * inside the card, and is disabled outright under `prefers-reduced-motion` —
 * an element that moves on its own is a genuine accessibility problem (WCAG
 * 2.2.2), so the manual controls are always present.
 *
 * @param {Array} quotes            quote records from quotes.json
 * @param {object} [options]
 * @param {number} [options.autoAdvanceMs=9000]  0 disables auto-advance
 */
export function useQuoteOfTheDay(quotes, { autoAdvanceMs = 9000 } = {}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const total = quotes.length;

  // Seeded from today's date, so the "quote of the day" is genuinely daily.
  const seedIndex = useMemo(() => (total ? dayNumber() % total : 0), [total]);

  const [index, setIndex] = useState(seedIndex);
  // +1 forward, -1 backward — lets the view slide in from the correct side.
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (next) => {
      if (!total) return;
      setDirection(next > index ? 1 : -1);
      setIndex(((next % total) + total) % total);
    },
    [index, total],
  );

  const next = useCallback(() => {
    if (!total) return;
    setDirection(1);
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const previous = useCallback(() => {
    if (!total) return;
    setDirection(-1);
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  // Keep the latest `next` without restarting the timer on every render.
  const nextRef = useRef(next);
  nextRef.current = next;

  useEffect(() => {
    const shouldAutoAdvance =
      autoAdvanceMs > 0 && total > 1 && !paused && !prefersReducedMotion;
    if (!shouldAutoAdvance) return undefined;

    const timer = window.setInterval(() => nextRef.current(), autoAdvanceMs);
    return () => window.clearInterval(timer);
  }, [autoAdvanceMs, total, paused, prefersReducedMotion]);

  return {
    quote: quotes[index],
    index,
    total,
    direction,
    next,
    previous,
    goTo,
    pause: useCallback(() => setPaused(true), []),
    resume: useCallback(() => setPaused(false), []),
    isPaused: paused,
  };
}
