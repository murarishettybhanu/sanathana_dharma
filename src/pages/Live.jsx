import { ExternalLink, Radio } from 'lucide-react';

import media from '@/data/media.json';
import events from '@/data/events.json';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { formatDateRange, partitionByDate } from '@/lib/format';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Live() {
  usePageTitle('LIVE');
  const { upcoming } = partitionByDate(events);
  const next = upcoming[0];

  return (
    <>
      <PageHeader
        eyebrow="Media"
        title="Watch live"
        lead="Major festivals and observances are streamed on the Trust's YouTube channel."
      />

      <Section tone="default" containerClassName="max-w-3xl">
        <Reveal>
          <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 text-center sm:p-12">
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700"
            >
              <Radio className="size-3.5" />
              Live stream
            </span>

            <h2 className="mt-6 text-2xl sm:text-3xl">
              {next ? next.title : 'No stream scheduled'}
            </h2>
            <div className="rule-ornament mx-auto mt-5 w-20" aria-hidden="true" />

            {next ? (
              <p className="mt-6 text-base leading-relaxed text-ink-600">
                <time dateTime={next.startDate}>
                  {formatDateRange(next.startDate, next.endDate)}
                </time>{' '}
                · {next.venue}
              </p>
            ) : (
              <p className="mt-6 text-base leading-relaxed text-ink-600">
                There is no broadcast scheduled at the moment. Past recordings remain available
                on the channel.
              </p>
            )}

            <div className="mt-9">
              <Button href={media.youtube} variant="accent" size="lg">
                <ExternalLink className="size-4" aria-hidden="true" />
                Watch on YouTube
              </Button>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-ink-500">
              {/* Honest about the limitation rather than embedding a player that
                  would sit dead for most of the year. */}
              Streams are published on the Trust&apos;s channel. Embedding a player here would
              require the Trust&apos;s stream key or a scheduled video ID.
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
