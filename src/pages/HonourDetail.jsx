import { Link, Navigate, useParams } from 'react-router-dom';
import { Award, ArrowLeft, CalendarDays, Drama, MapPin, Medal, Music, Sparkles, Trophy } from 'lucide-react';

import { getHonour, getTrust, getActivity } from '@/lib/content';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Prose } from '@/components/ui/Prose';
import { NeedsContent } from '@/components/ui/NeedsContent';
import { HonourSections } from '@/components/sections/HonourSections';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { formatDate } from '@/lib/format';
import { usePageTitle } from '@/hooks/usePageTitle';

const ICONS = { award: Award, sparkles: Sparkles, music: Music, drama: Drama, trophy: Trophy, medal: Medal };
const ACCENTS = {
  indigo: 'bg-indigo-50 text-indigo-600',
  ochre: 'bg-ochre-50 text-ochre-600',
  banyan: 'bg-banyan-50 text-banyan-600',
};

/** /honors-awards/:trustId/:honourSlug */
export default function HonourDetail() {
  const { trustId, honourSlug } = useParams();
  const trust = getTrust(trustId);
  const honour = getHonour(trustId, honourSlug);
  usePageTitle(honour?.title);

  if (!trust || !honour) return <Navigate to="/404" replace />;

  const Icon = ICONS[honour.icon] ?? Award;
  // Several honours are also listed as activities, where the fuller account lives.
  const activity = getActivity(trustId, honourSlug);
  const hasSections = honour.sections?.length > 0;

  return (
    <>
      <PageHeader eyebrow={trust.name} title={honour.title} lead={honour.summary} />

      <Section tone="default" containerClassName={hasSections ? undefined : 'max-w-3xl'}>
        <Reveal>
          <Link
            to={`/honors-awards/${trust.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All {trust.shortName} honours
          </Link>
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <span
            aria-hidden="true"
            className={`flex size-14 items-center justify-center rounded-2xl ${ACCENTS[honour.accent] ?? ACCENTS.indigo}`}
          >
            <Icon className="size-7" strokeWidth={1.6} />
          </span>

          {/* Dateline for the most recent occasion. */}
          {honour.date && (
            <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <dt className="sr-only">Date</dt>
                <CalendarDays className="size-4 shrink-0 text-ochre-600" aria-hidden="true" />
                <dd className="font-semibold text-indigo-800">
                  <time dateTime={honour.date}>{formatDate(honour.date)}</time>
                </dd>
              </div>
              {honour.venue && (
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Venue</dt>
                  <MapPin className="size-4 shrink-0 text-ochre-600" aria-hidden="true" />
                  <dd className="text-ink-600">{honour.venue}</dd>
                </div>
              )}
            </dl>
          )}
        </Reveal>

        {activity?.body?.length > 0 && (
          <Reveal className="mt-8 max-w-3xl">
            <Prose paragraphs={activity.body} className="text-lg" />
          </Reveal>
        )}

        {honour.__placeholder && (
          <Reveal className="mt-8 max-w-3xl">
            <NeedsContent>{honour.__placeholder}</NeedsContent>
          </Reveal>
        )}

        {!hasSections && !activity?.body?.length && !honour.__placeholder && (
          <Reveal className="mt-8">
            <NeedsContent>
              The live site presents this honour as a gallery of ceremony photographs. Criteria,
              and a list of recipients by year, would complete this page.
            </NeedsContent>
          </Reveal>
        )}
      </Section>

      {/* ---------- The evening, section by section ---------- */}
      {hasSections && (
        <Section tone="sunken" labelledBy="programme-heading">
          <SectionHeading
            id="programme-heading"
            eyebrow="The Evening"
            title="How the celebration ran"
            className="mb-16"
          />
          <HonourSections sections={honour.sections} />
        </Section>
      )}

      {/* ---------- Earlier years ---------- */}
      {honour.previousYears?.length > 0 && (
        <Section tone="default" labelledBy="previous-years-heading">
          <SectionHeading
            id="previous-years-heading"
            eyebrow="Archive"
            title="Previous years"
            lead="The same celebration in the five years before this one."
            className="mb-14"
          />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {honour.previousYears.map((entry, i) => (
              <Reveal as="li" key={entry.year} delay={i * 0.05} className="h-full">
                <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6">
                  <p className="font-display text-3xl leading-none text-indigo-800">
                    {entry.year}
                  </p>
                  <div className="rule-ornament mt-4 w-12" aria-hidden="true" />
                  {entry.date && (
                    <p className="mt-4 text-sm text-ink-700">
                      <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                    </p>
                  )}
                  {entry.venue && (
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{entry.venue}</p>
                  )}
                </article>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mx-auto mt-10 max-w-2xl">
            <NeedsContent>
              Photographs and recordings for earlier years are not published here yet. Once the
              Trust supplies them, each year can link to its own page using the same section
              structure as above.
            </NeedsContent>
          </Reveal>
        </Section>
      )}

      <SupportCTA />
    </>
  );
}
