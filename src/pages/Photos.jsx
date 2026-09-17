import { PageHeader } from '@/components/layout/PageHeader';
import { MediaArchive } from '@/components/sections/MediaArchive';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Photos() {
  usePageTitle('Photos');

  return (
    <>
      <PageHeader eyebrow="Media" title="Photos" lead={`Photographs from the festivals, honours and daily life of the two centres.`} />
      <MediaArchive sectionId="photos" />
    </>
  );
}
