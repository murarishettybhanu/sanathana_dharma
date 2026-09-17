import { PageHeader } from '@/components/layout/PageHeader';
import { MediaArchive } from '@/components/sections/MediaArchive';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Videos() {
  usePageTitle('Videos');

  return (
    <>
      <PageHeader eyebrow="Media" title="Videos" lead={`Recorded discourses, concerts and documentary work.`} />
      <MediaArchive sectionId="videos" />
    </>
  );
}
