import { trustsWithActivities } from '@/lib/content';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LinkGrid } from '@/components/ui/LinkGrid';
import { EventsPreview } from '@/components/sections/EventsPreview';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { usePageTitle } from '@/hooks/usePageTitle';

/** /activities — the four trusts, each with its own programme. */
export default function ActivitiesIndex() {
  usePageTitle('Activities');

  return (
    <>
      <PageHeader
        eyebrow="Activities"
        title="What happens through the year"
        lead="Festivals, music, honours and seva. Each of the trusts keeps its own calendar."
      />

      <Section tone="default" labelledBy="by-trust-heading">
        <SectionHeading
          id="by-trust-heading"
          eyebrow="By Trust"
          title="Four programmes"
          className="mb-14"
        />
        <LinkGrid
          columns="sm:grid-cols-2"
          items={trustsWithActivities.map((trust) => ({
            to: `/activities/${trust.id}`,
            title: trust.name,
            eyebrow: trust.seat,
            summary: trust.activities.map((a) => a.title).join(' · '),
          }))}
        />
      </Section>

      <EventsPreview limit={3} />
      <SupportCTA />
    </>
  );
}
