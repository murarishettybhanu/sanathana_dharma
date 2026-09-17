import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Radio, X } from 'lucide-react';

import announcements from '@/data/announcements.json';

/**
 * Slim notice strip above the header.
 *
 * Expired announcements are filtered out by date, so stale notices disappear
 * on their own rather than waiting for someone to remember to delete them.
 */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  const current = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return announcements.find(
      (a) => (!a.expiresAt || a.expiresAt >= today) && (!a.publishedAt || a.publishedAt <= today),
    );
  }, []);

  if (!current || dismissed) return null;

  const isExternal = /^https?:\/\//.test(current.href ?? '');
  const linkClasses =
    'inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:text-ochre-200';

  return (
    <div className="relative bg-indigo-800 text-sand-100">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-12 py-2.5 text-center text-xs sm:text-sm">
        {current.kind === 'live' && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ochre-500/20 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-ochre-300">
            <Radio className="size-3 animate-pulse" aria-hidden="true" />
            Live
          </span>
        )}

        <p className="text-sand-100/90">
          {current.text}{' '}
          {current.href &&
            (isExternal ? (
              <a
                href={current.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
              >
                {current.linkLabel}
                <ArrowRight className="size-3" aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <Link to={current.href} className={linkClasses}>
                {current.linkLabel}
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            ))}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-sand-200/70 transition-colors hover:bg-indigo-700 hover:text-sand-50"
      >
        <X className="size-4" aria-hidden="true" />
        <span className="sr-only">Dismiss announcement</span>
      </button>
    </div>
  );
}
