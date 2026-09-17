import { PageHeader } from '@/components/layout/PageHeader';
import { PublicationsGrid } from '@/components/sections/PublicationsGrid';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Publications() {
  usePageTitle('Publications');

  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Books, commentaries and archives"
        lead="Works published by the Trust and its associated institutions, together with
              the recorded discourses of Guruji."
      />
      <PublicationsGrid heading={false} />
    </>
  );
}
