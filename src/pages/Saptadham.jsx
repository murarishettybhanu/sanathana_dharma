import anandavanam from '@/data/anandavanam.json';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Prose } from '@/components/ui/Prose';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { formatDate } from '@/lib/format';
import { usePageTitle } from '@/hooks/usePageTitle';

/** /about-guruji/saptadham-warangal */
export default function Saptadham() {
  usePageTitle('Saptadham, Warangal');
  const { saptadham } = anandavanam;

  return (
    <>
      <PageHeader
        eyebrow="About Guruji"
        title={saptadham.title}
        lead={`Consecrated on ${formatDate(saptadham.consecrated)}, Maha Sivaratri.`}
      />

      <Section tone="default" containerClassName="max-w-3xl">
        <Reveal>
          <Prose paragraphs={saptadham.body} className="text-lg" />
        </Reveal>
      </Section>

      <SupportCTA />
    </>
  );
}
