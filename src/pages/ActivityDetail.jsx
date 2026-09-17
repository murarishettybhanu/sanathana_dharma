import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { getActivity, getTrust } from '@/lib/content';
import events from '@/data/events.json';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Prose } from '@/components/ui/Prose';
import { NeedsContent } from '@/components/ui/NeedsContent';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { formatDateRange } from '@/lib/format';
import { usePageTitle } from '@/hooks/usePageTitle';

/** /activities/:trustId/:activitySlug */
export default function ActivityDetail() {
  const { trustId, activitySlug } = useParams();
  const trust = getTrust(trustId);
  const activity = getActivity(trustId, activitySlug);
  usePageTitle(activity?.title);

  if (!trust || !activity) return <Navigate to="/404" replace />;

  // Any dated occurrences of this activity held in the shared calendar.
  const dated = events.filter(
    (e) => e.trustId === trustId && e.title.toLowerCase().includes(activity.title.toLowerCase().split('(')[0].trim()),
  );

  return (
    <>
      <PageHeader eyebrow={trust.name} title={activity.title} lead={activity.summary} />

      <Section tone="default" containerClassName="max-w-3xl">
        <Reveal>
          <Link
            to={`/activities/${trust.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All {trust.shortName} activities
          </Link>
        </Reveal>

        {activity.body?.length > 0 && (
          <Reveal className="mt-8">
            <Prose paragraphs={activity.body} className="text-lg" />
          </Reveal>
        )}

        {dated.length > 0 && (
          <Reveal className="mt-10">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre-600">
              In the calendar
            </h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {dated.map((event) => (
                <li key={event.id} className="py-4">
                  <p className="font-semibold text-indigo-700">
                    <time dateTime={event.startDate}>
                      {formatDateRange(event.startDate, event.endDate)}
                    </time>
                  </p>
                  <p className="mt-1 text-sm text-ink-600">{event.venue}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {activity.needsContent && (
          <Reveal className="mt-10">
            <NeedsContent>{activity.needsContent}</NeedsContent>
          </Reveal>
        )}
      </Section>

      <SupportCTA />
    </>
  );
}
