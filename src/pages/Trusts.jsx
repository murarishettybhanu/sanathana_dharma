import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import trusts from '@/data/trusts.json';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Prose } from '@/components/ui/Prose';
import { SupportCTA } from '@/components/sections/SupportCTA';
import { formatDate } from '@/lib/format';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Trusts() {
  usePageTitle('The Trusts');

  return (
    <>
      <PageHeader
        eyebrow="About Guruji"
        title="The four trusts"
        lead="Guruji established four trusts, with centres at Bheemunipatnam and Warangal. Each
              carries a different part of the same work."
      />

      <Section tone="default">
        <div className="space-y-16">
          {trusts.map((trust, i) => (
            <Reveal key={trust.id} delay={i * 0.05} id={trust.id} className="scroll-mt-32">
              <article className="grid gap-8 border-b border-line pb-16 last:border-0 last:pb-0 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
                <div>
                  <h2 className="text-2xl leading-snug">{trust.name}</h2>
                  <div className="rule-ornament mt-4 w-16" aria-hidden="true" />
                  <dl className="mt-5 space-y-2 text-sm text-ink-500">
                    <div className="flex gap-2">
                      <dt className="font-semibold text-ink-700">Seat</dt>
                      <dd>{trust.seat}</dd>
                    </div>
                    {trust.registeredOn && (
                      <div className="flex gap-2">
                        <dt className="font-semibold text-ink-700">Registered</dt>
                        <dd>
                          <time dateTime={trust.registeredOn}>
                            {formatDate(trust.registeredOn)}
                          </time>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <Prose paragraphs={trust.body} />

                  <h3 className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-ochre-600">
                    Activities
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {trust.activities.map((activity) => (
                      <li key={activity.slug}>
                        <Link
                          to={`/activities/${trust.id}/${activity.slug}`}
                          className="block rounded-full border border-line bg-sand-100 px-3.5 py-1.5 text-sm text-ink-700 transition-colors hover:border-indigo-600/30 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          {activity.title}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {(
                    <Link
                      to={`/about-guruji/${trust.id}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      More about this trust
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <SupportCTA />
    </>
  );
}
