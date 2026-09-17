import { Navigate, useParams } from 'react-router-dom';

import { getTrust } from '@/lib/content';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { LinkGrid } from '@/components/ui/LinkGrid';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { usePageTitle } from '@/hooks/usePageTitle';

/** /honors-awards/:trustId */
export default function TrustHonours() {
  const { trustId } = useParams();
  const trust = getTrust(trustId);
  usePageTitle(trust && `Honours — ${trust.shortName}`);

  if (!trust?.honours?.length) return <Navigate to="/404" replace />;

  return (
    <>
      <PageHeader eyebrow="Honors & Awards" title={trust.name} lead={trust.summary} />

      <Section tone="default">
        <LinkGrid
          headingLevel="h2"
          items={trust.honours.map((honour) => ({
            to: `/honors-awards/${trust.id}/${honour.slug}`,
            title: honour.title,
            summary: honour.summary,
          }))}
        />
      </Section>

      <SupportCTA />
    </>
  );
}
