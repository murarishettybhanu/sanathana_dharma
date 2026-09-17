import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Flame, Home, Landmark, Library } from 'lucide-react';

import { getAnandavanamPlace } from '@/lib/content';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { usePageTitle } from '@/hooks/usePageTitle';

const ICONS = {
  'gurujis-residence': Home,
  'yoga-ganapati-temple': Landmark,
  'gurujis-library': Library,
  yagasala: Flame,
};

/** /about-guruji/anandavanam/:placeSlug */
export default function AnandavanamPlace() {
  const { placeSlug } = useParams();
  const place = getAnandavanamPlace(placeSlug);
  usePageTitle(place?.title);

  if (!place) return <Navigate to="/404" replace />;
  const Icon = ICONS[place.id] ?? Landmark;

  return (
    <>
      <PageHeader eyebrow="Anandavanam" title={place.title} />

      <Section tone="default" containerClassName="max-w-3xl">
        <Reveal>
          <Link
            to="/about-guruji/anandavanam"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All of Anandavanam
          </Link>
        </Reveal>

        <Reveal className="mt-8">
          <span
            aria-hidden="true"
            className="flex size-14 items-center justify-center rounded-2xl bg-banyan-50 text-banyan-600"
          >
            <Icon className="size-7" strokeWidth={1.6} />
          </span>
          <p className="mt-6 text-lg leading-relaxed text-ink-600">{place.body}</p>
        </Reveal>
      </Section>

      <SupportCTA />
    </>
  );
}
