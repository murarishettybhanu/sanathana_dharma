import { HeroSection } from '@/components/sections/HeroSection';
import { ObjectivesGrid } from '@/components/sections/ObjectivesGrid';
import { GuruIntro } from '@/components/sections/GuruIntro';
import { EventsPreview } from '@/components/sections/EventsPreview';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Home() {
  usePageTitle();

  return (
    <>
      <HeroSection />
      <ObjectivesGrid />
      <GuruIntro />
      <EventsPreview />
      <SupportCTA />
    </>
  );
}
