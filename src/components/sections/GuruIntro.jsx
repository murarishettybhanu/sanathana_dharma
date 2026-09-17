import site from '@/data/site.json';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { asset } from '@/lib/asset';
import { ArrowRight } from 'lucide-react';

/** Short introduction to Guruji, shown on the homepage above the calendar. */
export function GuruIntro() {
  return (
    <Section tone="raised" labelledBy="guru-heading">
      <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <div className="relative">
            {/* Offset gold frame — a single decorative flourish. */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -left-4 h-full w-full rounded-[var(--radius-card)] border border-ochre-300/60"
            />
            <img
              src={asset(site.guru.portrait)}
              alt={`Portrait of ${site.guru.name}`}
              loading="lazy"
              decoding="async"
              // Until a portrait is supplied, show the warm block behind it
              // rather than the browser's broken-image glyph.
              onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
              className="relative aspect-[4/5] w-full rounded-[var(--radius-card)] bg-sand-100 object-cover shadow-lift"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre-600">
            About Guruji
          </p>
          <h2 id="guru-heading" className="mt-4 text-3xl sm:text-4xl">
            {site.guru.name}
          </h2>
          <div className="rule-ornament mt-5 w-24" aria-hidden="true" />

          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-600">
            <p>
              Guruji taught Sanathana Dharma as something to be lived rather than
              merely believed — holding together its theory and its daily practice,
              and drawing equally on the example of Lord Sri Rama and Lord Sri Krishna.
            </p>
            <p>
              From that pairing comes the teaching at the centre of his work:{' '}
              <em className="font-display not-italic text-indigo-700">
                God as Man, and Man as God
              </em>
              . The Trust exists to keep that instruction available — in discourse, in
              music, in print, and in service.
            </p>
          </div>

          <div className="mt-9">
            <Button to="/about-guruji" variant="secondary" size="lg">
              Read his life and teaching
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
