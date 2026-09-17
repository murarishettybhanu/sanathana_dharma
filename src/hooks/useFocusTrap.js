import { useEffect } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Keeps Tab focus inside `ref` while `active`, and restores focus to whatever
 * was focused beforehand on close.
 *
 * This is what makes a modal drawer usable by keyboard and screen-reader users:
 * without it, Tab walks straight out into the page hidden behind the overlay.
 *
 * @param {React.RefObject<HTMLElement>} ref  container to trap focus within
 * @param {boolean} active                    whether the trap is engaged
 * @param {() => void} onEscape               called when Escape is pressed
 */
export function useFocusTrap(ref, active, onEscape) {
  useEffect(() => {
    if (!active || !ref.current) return undefined;

    const container = ref.current;
    const previouslyFocused = document.activeElement;

    // Move focus in on open, so the first Tab lands predictably.
    const initial = container.querySelector(FOCUSABLE);
    (initial ?? container).focus({ preventScroll: true });

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onEscape?.();
        return;
      }
      if (event.key !== 'Tab') return;

      // Re-query each time: the list changes as the drawer animates in.
      const items = Array.from(container.querySelectorAll(FOCUSABLE));
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [ref, active, onEscape]);
}
