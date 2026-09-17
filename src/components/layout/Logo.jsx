import { Link } from 'react-router-dom';

import site from '@/data/site.json';
import { BanyanMark } from './BanyanMark';

/**
 * Brand lockup: the Trust's banyan medallion plus its name.
 *
 * The mark is inline SVG rather than an <img> so it needs no second network
 * request and stays crisp at any density — the original site serves it as a
 * 139px raster.
 */
export function Logo({ compact = false }) {
  return (
    <Link
      to="/"
      className="group flex items-center gap-3 rounded-lg"
      aria-label={`${site.name}, ${site.location} — home`}
    >
      <BanyanMark className="size-15 shrink-0 transition-transform duration-500 ease-[var(--ease-calm)] group-hover:scale-105" />

      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="whitespace-nowrap font-display text-base font-semibold tracking-tight text-indigo-800 sm:text-lg 2xl:text-xl">
            Sanathana Dharma
          </span>
          <span className="mt-1.5 whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ink-500 sm:text-[0.72rem] sm:tracking-[0.16em] 2xl:text-[0.78rem] 2xl:tracking-[0.18em]">
            Charitable Trust · {site.location}
          </span>
        </span>
      )}
    </Link>
  );
}
