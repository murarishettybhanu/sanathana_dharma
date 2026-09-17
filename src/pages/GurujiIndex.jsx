import guruji from '@/data/guruji.json';
import site from '@/data/site.json';
import { PageHeader } from '@/components/layout/PageHeader';
import { GuruIntro } from '@/components/sections/GuruIntro';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LinkGrid } from '@/components/ui/LinkGrid';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { usePageTitle } from '@/hooks/usePageTitle';

/** /about-guruji/guruji */
export default function GurujiIndex() {
  usePageTitle('Guruji');

  return (
    <>
      <PageHeader
        eyebrow="About Guruji"
        title={site.guru.name}
        lead={`“${site.guru.epithet}” — the teaching at the centre of a life spent making Sanathana Dharma practicable for ordinary householders.`}
      />

      <GuruIntro />

      <Section tone="sunken" labelledBy="guruji-sections">
        <SectionHeading id="guruji-sections" eyebrow="Read On" title="His life and work" className="mb-14" />
        <LinkGrid
          items={guruji.sections.map((section) => ({
            to: section.redirectTo ?? `/about-guruji/guruji/${section.slug}`,
            title: section.title,
            summary: section.lead,
          }))}
        />
      </Section>

      <SupportCTA />
    </>
  );
}
