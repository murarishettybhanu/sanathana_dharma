import { Navigate, useParams } from 'react-router-dom';

import { getTrust } from '@/lib/content';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Prose } from '@/components/ui/Prose';
import { LinkGrid } from '@/components/ui/LinkGrid';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { formatDate } from '@/lib/format';
import { usePageTitle } from '@/hooks/usePageTitle';

/** /about-guruji/:trustId */
export default function TrustAbout() {
  const { trustId } = useParams();
  const trust = getTrust(trustId);
  usePageTitle(trust?.name);

  if (!trust) return <Navigate to="/404" replace />;

  const onward = [
    { to: `/about-guruji/${trust.id}/objectives`, title: 'Objectives', summary: 'What this trust sets out to do.' },
    ...(trust.hasTrustees
      ? [{ to: `/about-guruji/${trust.id}/trustees`, title: 'Trustees', summary: 'Who holds the trust in office.' }]
      : []),
    ...(trust.activities?.length
      ? [{ to: `/activities/${trust.id}`, title: 'Activities', summary: 'Festivals, observances and gatherings.' }]
      : []),
    ...(trust.honours?.length
      ? [{ to: `/honors-awards/${trust.id}`, title: 'Honours & Awards', summary: 'Titles and awards conferred.' }]
      : []),
    { to: `/contact/${trust.id}`, title: 'Contact', summary: 'Where to find the trust.' },
  ];

  return (
    <>
      <PageHeader eyebrow="About Guruji" title={trust.name} lead={trust.summary} />

      <Section tone="default" containerClassName="max-w-3xl">
        <Reveal>
          <dl className="mb-8 flex flex-wrap gap-x-10 gap-y-3 text-sm">
            <div>
              <dt className="font-semibold text-ink-900">Seat</dt>
              <dd className="mt-1 text-ink-600">{trust.seat}</dd>
            </div>
            {trust.registeredOn && (
              <div>
                <dt className="font-semibold text-ink-900">Registered</dt>
                <dd className="mt-1 text-ink-600">
                  <time dateTime={trust.registeredOn}>{formatDate(trust.registeredOn)}</time>
                </dd>
              </div>
            )}
          </dl>
          <Prose paragraphs={trust.body} className="text-lg" />
        </Reveal>
      </Section>

      <Section tone="sunken" labelledBy="onward-heading">
        <Reveal className="mb-10">
          <h2 id="onward-heading" className="text-2xl">
            More about this trust
          </h2>
          <div className="rule-ornament mt-4 w-20" aria-hidden="true" />
        </Reveal>
        <LinkGrid items={onward} />
      </Section>

      <SupportCTA />
    </>
  );
}
