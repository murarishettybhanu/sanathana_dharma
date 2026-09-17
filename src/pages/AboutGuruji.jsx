import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import site from '@/data/site.json';
import trusts from '@/data/trusts.json';
import { PageHeader } from '@/components/layout/PageHeader';
import { GuruIntro } from '@/components/sections/GuruIntro';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { usePageTitle } from '@/hooks/usePageTitle';

/** Where to go next from the overview. */
const PATHS = [
  { to: '/about-guruji/guruji', title: 'Guruji', body: 'Biography, travels, writings and the published work.' },
  { to: '/about-guruji/anandavanam', title: 'Anandavanam', body: 'The mango grove at Bheemunipatnam, the Yoga Ganapati temple and the library.' },
  { to: '/about-guruji/saptadham-warangal', title: 'Saptadham, Warangal', body: 'The seven rishis, consecrated on Maha Sivaratri in 2010.' },
  { to: '/trusts', title: 'The Trusts', body: 'The four trusts Guruji established, and what each one carries.' },
];

export default function AboutGuruji() {
  usePageTitle('About Guruji');

  return (
    <>
      <PageHeader
        eyebrow="The Lineage"
        title={site.guru.name}
        lead={`“${site.guru.epithet}” — the teaching at the centre of a life spent making Sanathana Dharma practicable for ordinary householders.`}
      />

      <GuruIntro />

      <Section tone="sunken" labelledBy="paths-heading">
        <SectionHeading id="paths-heading" eyebrow="Read On" title="Where to go next" className="mb-14" />
        <ul className="grid gap-6 sm:grid-cols-2">
          {PATHS.map((path, i) => (
            <Reveal as="li" key={path.to} delay={i * 0.06} className="h-full">
              <article className="group relative flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-7 transition-all duration-500 ease-[var(--ease-calm)] hover:-translate-y-1 hover:shadow-lift has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-indigo-600">
                <h3 className="text-xl">
                  <Link to={path.to} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                    {path.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">{path.body}</p>
                <span aria-hidden="true" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                  Read more
                  <ArrowUpRight className="size-4 transition-transform duration-500 ease-[var(--ease-calm)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="default" labelledBy="trusts-heading">
        <SectionHeading
          id="trusts-heading"
          eyebrow="Institutions"
          title="Four trusts, one work"
          lead="Guruji established four trusts, with centres at Bheemunipatnam and Warangal."
          className="mb-14"
        />
        <ul className="grid gap-5 sm:grid-cols-2">
          {trusts.map((trust, i) => (
            <Reveal as="li" key={trust.id} delay={i * 0.05} className="h-full">
              <Link
                to={`/about-guruji/${trust.id}`}
                className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-sand-100 p-6 transition-colors hover:border-indigo-600/30 hover:bg-indigo-50"
              >
                <h3 className="text-lg leading-snug">{trust.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ochre-600">{trust.seat}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{trust.summary}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <SupportCTA />
    </>
  );
}
