import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

import { Reveal } from './Reveal';

/**
 * A grid of onward links. Used by every index page (Activities, Honours, the
 * Guruji section) so they share one hover treatment and one focus behaviour.
 *
 * Each item: { to, title, summary?, eyebrow? }
 *
 * `headingLevel` exists because the grid is used both under a section <h2>
 * (where h3 is right) and directly under a page <h1> (where h3 would skip a
 * level). Getting this wrong breaks screen-reader navigation of the page.
 */
export function LinkGrid({
  items,
  columns = 'sm:grid-cols-2 lg:grid-cols-3',
  headingLevel: Heading = 'h3',
}) {
  return (
    <ul className={`grid gap-6 ${columns}`}>
      {items.map((item, i) => (
        <Reveal as="li" key={item.to} delay={i * 0.05} className="h-full">
          <article className="group relative flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 transition-all duration-500 ease-[var(--ease-calm)] hover:-translate-y-1 hover:shadow-lift has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-indigo-600">
            {item.eyebrow && (
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ochre-600">
                {item.eyebrow}
              </p>
            )}
            <Heading className="mt-2 text-lg leading-snug">
              <Link
                to={item.to}
                className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
              >
                {item.title}
              </Link>
            </Heading>
            {item.summary && (
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">{item.summary}</p>
            )}
            <span
              aria-hidden="true"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600"
            >
              Read more
              <ArrowUpRight className="size-4 transition-transform duration-500 ease-[var(--ease-calm)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}
