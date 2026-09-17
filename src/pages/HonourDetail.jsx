import { Link, Navigate, useParams } from 'react-router-dom';
import { Award, ArrowLeft, Drama, Music, Sparkles, Trophy } from 'lucide-react';

import { getHonour, getTrust, getActivity } from '@/lib/content';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Prose } from '@/components/ui/Prose';
import { NeedsContent } from '@/components/ui/NeedsContent';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { usePageTitle } from '@/hooks/usePageTitle';

const ICONS = { award: Award, sparkles: Sparkles, music: Music, drama: Drama, trophy: Trophy };
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

  return (
    <>
      <PageHeader eyebrow={trust.name} title={honour.title} lead={honour.summary} />

      <Section tone="default" containerClassName="max-w-3xl">
        <Reveal>
          <Link
            to={`/honors-awards/${trust.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All {trust.shortName} honours
          </Link>
        </Reveal>

        <Reveal className="mt-8">
          <span
            aria-hidden="true"
            className={`flex size-14 items-center justify-center rounded-2xl ${ACCENTS[honour.accent] ?? ACCENTS.indigo}`}
          >
            <Icon className="size-7" strokeWidth={1.6} />
          </span>
        </Reveal>

        {activity?.body?.length > 0 ? (
          <Reveal className="mt-6">
            <Prose paragraphs={activity.body} className="text-lg" />
          </Reveal>
        ) : (
          <Reveal className="mt-6">
            <NeedsContent>
              The live site presents this honour as a gallery of ceremony photographs. Criteria,
              and a list of recipients by year, would complete this page.
            </NeedsContent>
          </Reveal>
        )}
      </Section>

      <SupportCTA />
    </>
  );
}
