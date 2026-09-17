import { Flame, Home, Landmark, Library } from 'lucide-react';

import anandavanam from '@/data/anandavanam.json';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Prose } from '@/components/ui/Prose';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { formatDate } from '@/lib/format';
import { usePageTitle } from '@/hooks/usePageTitle';

const ICONS = { home: Home, landmark: Landmark, library: Library, flame: Flame };

export default function Anandavanam() {
  usePageTitle('Anandavanam');

  return (
    <>
      <PageHeader
        eyebrow="About Guruji"
        title="Anandavanam"
        lead="A mango grove at Bheemunipatnam, a house, and the settlement that grew around it."
      />

      <Section tone="default" containerClassName="max-w-3xl">
        <Reveal>
          <Prose paragraphs={anandavanam.intro} className="text-lg" />
        </Reveal>
      </Section>

      <Section tone="sunken" labelledBy="places-heading">
        <SectionHeading
          id="places-heading"
          eyebrow="The Grounds"
          title="What stands at Anandavanam"
          className="mb-14"
        />
        <ul className="grid gap-6 sm:grid-cols-2">
          {anandavanam.places.map((place, i) => {
            const Icon = ICONS[place.icon] ?? Landmark;
            return (
              <Reveal as="li" key={place.id} delay={i * 0.07} id={place.id} className="h-full scroll-mt-32">
                <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-7">
                  <span
                    aria-hidden="true"
                    className="flex size-12 items-center justify-center rounded-2xl bg-ochre-50 text-ochre-600"
                  >
                    <Icon className="size-6" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 text-xl">{place.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">{place.body}</p>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      <Section tone="default" labelledBy="saptadham-heading" containerClassName="max-w-3xl">
        <Reveal id="saptadham" className="scroll-mt-32">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre-600">
            Warangal
          </p>
          <h2 id="saptadham-heading" className="mt-4 text-3xl sm:text-4xl">
            {anandavanam.saptadham.title}
          </h2>
          <div className="rule-ornament mt-5 w-24" aria-hidden="true" />
          <p className="mt-4 text-sm text-ink-500">
            Consecrated{' '}
            <time dateTime={anandavanam.saptadham.consecrated}>
              {formatDate(anandavanam.saptadham.consecrated)}
            </time>
          </p>
          <Prose paragraphs={anandavanam.saptadham.body} className="mt-6" />
        </Reveal>
      </Section>

      <SupportCTA />
    </>
  );
}
