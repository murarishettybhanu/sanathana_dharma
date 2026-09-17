import { PageHeader } from '@/components/layout/PageHeader';
import { MediaArchive } from '@/components/sections/MediaArchive';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Audios() {
  usePageTitle('Audios');

  return (
    <>
      <PageHeader eyebrow="Media" title="Audios" lead={`Guruji's speeches and discourses, grouped by the centre at which they were recorded.`} />
      <MediaArchive sectionId="audios" />
    </>
  );
}
