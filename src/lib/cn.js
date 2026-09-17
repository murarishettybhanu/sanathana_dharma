import { twMerge } from 'tailwind-merge';

/**
 * Joins classnames and resolves Tailwind conflicts, last one winning.
 *
 * The merge step is not cosmetic. Tailwind's cascade is decided by the order
 * utilities appear in the generated stylesheet, not by their order in the
 * class attribute — so a component whose base styles include `inline-flex`
 * will silently beat a `hidden` passed in by the caller, and the element stays
 * visible at every breakpoint. twMerge drops the losing utility outright so
 * caller intent always wins.
 */
export function cn(...classes) {
  return twMerge(classes.filter(Boolean).join(' '));
}
