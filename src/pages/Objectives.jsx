import { PageHeader } from '@/components/layout/PageHeader';
import { ObjectivesGrid } from '@/components/sections/ObjectivesGrid';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Objectives() {
  usePageTitle('Objectives');

  return (
    <>
      <PageHeader
        eyebrow="Our Objectives"
        title="What the Trust sets out to do"
        lead="Sanathana Dharma is not a doctrine to be defended but a way of living to be
              practised. These are the forms that practice takes here."
      />
      <ObjectivesGrid heading={false} />
      <SupportCTA />
    </>
  );
}
