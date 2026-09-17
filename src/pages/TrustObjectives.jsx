import { Navigate, useParams } from 'react-router-dom';

import { getTrust } from '@/lib/content';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { usePageTitle } from '@/hooks/usePageTitle';

/** /about-guruji/:trustId/objectives */
export default function TrustObjectives() {
  const { trustId } = useParams();
  const trust = getTrust(trustId);
  usePageTitle(trust && `Objectives — ${trust.shortName}`);

  if (!trust) return <Navigate to="/404" replace />;

  return (
    <>
      <PageHeader eyebrow={trust.name} title="Objectives" lead={trust.objectivesIntro ?? undefined} />

      <Section tone="default" containerClassName="max-w-3xl">
        <ol className="space-y-10">
          {trust.objectives.map((objective, i) => (
            <Reveal as="li" key={objective.slug} delay={i * 0.05} className="flex gap-6">
              <span
                aria-hidden="true"
                className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-line font-display text-sm text-indigo-700"
              >
                {i + 1}
              </span>
              <div>
                <h2 className="text-xl leading-snug">{objective.title}</h2>
                <p className="mt-3 text-base leading-relaxed text-ink-600">{objective.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <SupportCTA />
    </>
  );
}
