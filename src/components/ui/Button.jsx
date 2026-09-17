import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

const base = [
  'inline-flex items-center justify-center gap-2',
  'font-semibold tracking-tight whitespace-nowrap',
  'rounded-full border transition-all duration-300 ease-[var(--ease-calm)]',
  'disabled:opacity-50 disabled:pointer-events-none',
  // Generous hit area: the WCAG 2.2 target-size minimum is 24px, and thumbs
  // on phones want considerably more than that.
  'min-h-11',
].join(' ');

const variants = {
  /** Maroon fill — one per view, reserved for the single most important action. */
  primary:
    'bg-indigo-600 text-sand-50 border-indigo-600 shadow-soft hover:bg-indigo-700 hover:border-indigo-700 hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0',
  /** Outlined — for the secondary action sitting beside a primary one. */
  secondary:
    'bg-transparent text-indigo-600 border-indigo-600/35 hover:border-indigo-600 hover:bg-indigo-50 hover:-translate-y-0.5 active:translate-y-0',
  /** Saffron fill — used sparingly, for donation and support actions. */
  accent:
    'bg-ochre-600 text-sand-50 border-ochre-600 shadow-soft hover:bg-ochre-700 hover:border-ochre-700 hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0',
  /** Chromeless — inline and in-card links that still want a button target. */
  ghost:
    'bg-transparent text-ink-700 border-transparent hover:bg-sand-100 hover:text-indigo-600',
  /** For use on a dark or photographic background. */
  onDark:
    'bg-sand-50/10 text-sand-50 border-sand-50/40 backdrop-blur-sm hover:bg-sand-50 hover:text-indigo-700 hover:-translate-y-0.5 active:translate-y-0',
};

const sizes = {
  sm: 'text-sm px-4 py-2',
  md: 'text-sm px-6 py-3',
  lg: 'text-base px-8 py-3.5',
};

/**
 * Polymorphic button.
 *
 * Renders a real `<button>` for actions, a React Router `<Link>` for internal
 * navigation, and an `<a>` for external URLs. Getting this right matters for
 * more than tidiness: screen readers announce the two roles differently, and
 * only a real link supports middle-click, copy-link and open-in-new-tab.
 */
export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', to, href, className, children, ...rest },
  ref,
) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    return (
      <a
        ref={ref}
        href={href}
        className={classes}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
        {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <button ref={ref} type="button" className={classes} {...rest}>
      {children}
    </button>
  );
});
