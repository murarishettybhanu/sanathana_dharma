import { CalendarDays, MapPin } from 'lucide-react';

import events from '@/data/events.json';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { formatDateRange, partitionByDate } from '@/lib/format';
import { asset } from '@/lib/asset';

/** Upcoming festivals and observances, newest first, capped at three. */
export function EventsPreview({ limit = 3 }) {
  const { upcoming } = partitionByDate(events);
  const shown = upcoming.slice(0, limit);

  if (shown.length === 0) return null;

  return (
    <Section id="events" tone="sunken" labelledBy="events-heading">
      <SectionHeading
        id="events-heading"
        eyebrow="The Calendar"
        title="Upcoming observances"
        lead="Festivals, music evenings and remembrance days — all are welcome, and there is no fee to attend."
        className="mb-14"
      />

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((event, i) => (
          <Reveal as="li" key={event.id} delay={i * 0.08} className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-all duration-500 ease-[var(--ease-calm)] hover:-translate-y-1.5 hover:shadow-lift">
              {/* aspect-ratio reserves the space before the image loads, so the
                  grid never jumps — the main cause of a poor CLS score. */}
              <div className="relative aspect-[16/10] overflow-hidden bg-indigo-800">
                <img
                  src={asset(event.image)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  // No artwork supplied yet: hide the element rather than let
                  // the browser draw its broken-image glyph over the fallback.
                  onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                  className="size-full object-cover opacity-90 transition-transform duration-700 ease-[var(--ease-calm)] group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-sand-50/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-indigo-700 backdrop-blur-sm">
                  {event.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg leading-snug">{event.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">
                  {event.summary}
                </p>

                <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm text-ink-600">
                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Date</dt>
                    <CalendarDays className="size-4 shrink-0 text-ochre-600" aria-hidden="true" />
                    <dd>
                      <time dateTime={event.startDate}>
                        {formatDateRange(event.startDate, event.endDate)}
                      </time>
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Venue</dt>
                    <MapPin className="size-4 shrink-0 text-ochre-600" aria-hidden="true" />
                    <dd>{event.venue}</dd>
                  </div>
                </dl>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-12 flex justify-center">
        <Button to="/activities" variant="secondary" size="lg">
          See the full calendar
        </Button>
      </Reveal>
    </Section>
  );
}
