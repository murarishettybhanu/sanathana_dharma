import { Navigate, useParams } from 'react-router-dom';

import { getGurujiSection } from '@/lib/content';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Prose } from '@/components/ui/Prose';
import { NeedsContent } from '@/components/ui/NeedsContent';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { usePageTitle } from '@/hooks/usePageTitle';

/**
 * /about-guruji/guruji/:sectionSlug
 *
 * Two entries in this menu (Speeches, Publications) point elsewhere on the
 * live site, so they redirect rather than duplicating those pages.
 */
export default function GurujiSection() {
  const { sectionSlug } = useParams();
  const section = getGurujiSection(sectionSlug);
  usePageTitle(section?.title);

  if (!section) return <Navigate to="/404" replace />;
  if (section.redirectTo) return <Navigate to={section.redirectTo} replace />;

  return (
    <>
      <PageHeader eyebrow="About Guruji" title={section.title} lead={section.lead} />

      <Section tone="default" containerClassName="max-w-3xl">
        <Reveal>
          <Prose paragraphs={section.body} className="text-lg" />
        </Reveal>

        {section.facts && (
          <Reveal className="mt-10">
            <dl className="divide-y divide-line border-y border-line">
              {section.facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
                  <dt className="shrink-0 text-sm font-semibold text-ink-900 sm:w-52">
                    {fact.label}
                  </dt>
                  <dd className="text-sm leading-relaxed text-ink-600">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {section.items && (
          <Reveal className="mt-10">
            <ul className="grid gap-4 sm:grid-cols-2">
              {section.items.map((item) => (
                <li
                  key={item.title}
                  className="rounded-[var(--radius-card)] border border-line bg-white p-5"
                >
                  <h2 className="font-display text-lg leading-snug">{item.title}</h2>
                  {item.detail && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.detail}</p>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {section.needsContent && (
          <Reveal className="mt-10">
            <NeedsContent>{section.needsContent}</NeedsContent>
          </Reveal>
        )}
      </Section>

      <SupportCTA />
    </>
  );
}
