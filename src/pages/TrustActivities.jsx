import { Navigate, useParams } from 'react-router-dom';

import { getTrust } from '@/lib/content';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { LinkGrid } from '@/components/ui/LinkGrid';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { usePageTitle } from '@/hooks/usePageTitle';

/** /activities/:trustId */
export default function TrustActivities() {
  const { trustId } = useParams();
  const trust = getTrust(trustId);
  usePageTitle(trust && `Activities — ${trust.shortName}`);

  if (!trust?.activities?.length) return <Navigate to="/404" replace />;

  return (
    <>
      <PageHeader eyebrow="Activities" title={trust.name} lead={trust.summary} />

      <Section tone="default">
        <LinkGrid
          headingLevel="h2"
          items={trust.activities.map((activity) => ({
            to: `/activities/${trust.id}/${activity.slug}`,
            title: activity.title,
            summary: activity.summary,
          }))}
        />
      </Section>

      <SupportCTA />
    </>
  );
}
