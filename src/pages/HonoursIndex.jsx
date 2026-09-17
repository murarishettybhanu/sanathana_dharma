import { trustsWithHonours } from '@/lib/content';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LinkGrid } from '@/components/ui/LinkGrid';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { usePageTitle } from '@/hooks/usePageTitle';

/** /honors-awards */
export default function HonoursIndex() {
  usePageTitle('Honors & Awards');

  return (
    <>
      <PageHeader
        eyebrow="Honors & Awards"
        title="Recognition, quietly given"
        lead="Awards and titles conferred by the Trust and by the Siva Ganga Sangeeta Parishad,
              for lifelong contribution to public life, scholarship and the classical arts."
      />

      {trustsWithHonours.map((trust, i) => (
        <Section
          key={trust.id}
          id={trust.id}
          tone={i % 2 === 0 ? 'default' : 'sunken'}
          labelledBy={`honours-${trust.id}`}
          className="scroll-mt-32"
        >
          <SectionHeading
            id={`honours-${trust.id}`}
            eyebrow="Conferred by"
            title={trust.name}
            className="mb-14"
          />
          <LinkGrid
            items={trust.honours.map((honour) => ({
              to: `/honors-awards/${trust.id}/${honour.slug}`,
              title: honour.title,
              summary: honour.summary,
            }))}
          />
        </Section>
      ))}

      <SupportCTA />
    </>
  );
}
