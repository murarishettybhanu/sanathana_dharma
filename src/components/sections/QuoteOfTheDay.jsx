import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

import allQuotes from '@/data/quotes.json';
import { cn } from '@/lib/cn';
import { EASE_CALM } from '@/lib/motion';
import { useQuoteOfTheDay } from '@/hooks/useQuoteOfTheDay';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Unverified entries are scaffolding for the carousel UI. They stay visible in
 * development (so the controls can be exercised, and so the dev content audit's
 * warning has something to point at) but are never shown to the public — the
 * hero is the last place a "PLACEHOLDER" string should appear.
 */
const quotes = import.meta.env.PROD
  ? allQuotes.filter((q) => q.verified !== false)
  : allQuotes;

/** Slides in from the side the visitor is travelling towards. */
const slide = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 28 : -28 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -28 : 28 }),
};

/**
 * "Quote of the Day" card.
 *
 * The quote shown on load is derived from the calendar date (see
 * useQuoteOfTheDay), so it is genuinely the quote *of the day* rather than a
 * random pick that changes on every refresh.
 */
export function QuoteOfTheDay({ className }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { quote, index, total, direction, next, previous, goTo, pause, resume } =
    useQuoteOfTheDay(quotes);

  if (!quote) return null;

  return (
    <figure
      // Auto-advance must not run out from under someone who is reading or
      // tabbing through the card (WCAG 2.2.2, Pause/Stop/Hide).
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      aria-roledescription="carousel"
      aria-label="Quote of the day"
      className={cn(
        'relative overflow-hidden rounded-[1.25rem] border border-line/80 bg-sand-50 p-7 shadow-lift sm:p-9',
        className,
      )}
    >
      {/* Oversized watermark glyph, purely decorative. */}
      <Quote
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-4 size-28 text-ochre-100"
        strokeWidth={1}
      />

      <div className="relative">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ochre-600">
          Quote of the Day
        </p>

        {/* min-height stops the card resizing as quotes of different lengths
            cycle through, which would otherwise nudge the page around. */}
        <div className="mt-5 min-h-[9.5rem] sm:min-h-[8.5rem]">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={quote.id}
              custom={direction}
              variants={prefersReducedMotion ? undefined : slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: EASE_CALM }}
              // Announces the new quote to screen readers without stealing focus.
              aria-live="polite"
              aria-atomic="true"
            >
              <blockquote>
                <p className="font-display text-xl leading-snug text-ink-900 sm:text-2xl">
                  “{quote.text}”
                </p>
              </blockquote>

              {quote.attribution && (
                <figcaption className="mt-4 text-sm font-medium text-ink-600">
                  — {quote.attribution}
                  {quote.source && (
                    <span className="text-ink-500"> · {quote.source}</span>
                  )}
                </figcaption>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {total > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
            {/* Dots are real buttons: reachable by keyboard, labelled for AT. */}
            <div className="flex items-center gap-2">
              {quotes.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show quote ${i + 1} of ${total}`}
                  aria-current={i === index}
                  className="group flex size-6 items-center justify-center rounded-full"
                >
                  <span
                    className={cn(
                      'block h-1.5 rounded-full transition-all duration-300',
                      i === index
                        ? 'w-5 bg-ochre-500'
                        : 'w-1.5 bg-sand-300 group-hover:bg-ochre-300',
                    )}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <CarouselButton onClick={previous} label="Previous quote">
                <ChevronLeft className="size-5" aria-hidden="true" />
              </CarouselButton>
              <CarouselButton onClick={next} label="Next quote">
                <ChevronRight className="size-5" aria-hidden="true" />
              </CarouselButton>
            </div>
          </div>
        )}
      </div>
    </figure>
  );
}

function CarouselButton({ onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-full border border-line text-ink-600 transition-colors hover:border-indigo-600/40 hover:bg-indigo-50 hover:text-indigo-700"
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}
