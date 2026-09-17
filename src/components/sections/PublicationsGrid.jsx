import { BookOpen, Download, ExternalLink } from 'lucide-react';

import publications from '@/data/publications.json';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { asset } from '@/lib/asset';

/** Books, monographs and archived discourses published by the Trust. */
export function PublicationsGrid({ heading = true }) {
  // On the Publications page the section heading is suppressed (the page's own
  // <h1> already says it), so the card titles move up a level to keep the
  // document outline unbroken — h1 → h3 would be a skipped level.
  const CardHeading = heading ? 'h3' : 'h2';

  return (
    <Section id="publications" tone="default" labelledBy={heading ? 'pubs-heading' : undefined}>
      {heading && (
        <SectionHeading
          id="pubs-heading"
          eyebrow="Publications"
          title="The teaching, set down in print"
          lead="Books, commentaries and collected discourses — published so that the teaching outlasts the teacher."
          className="mb-14"
        />
      )}

      <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {publications.map((item, i) => (
          <Reveal as="li" key={item.id} delay={i * 0.08} className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-all duration-500 ease-[var(--ease-calm)] hover:-translate-y-1.5 hover:shadow-lift">
              <div className="relative aspect-[3/4] overflow-hidden bg-sand-100">
                <img
                  src={asset(item.cover)}
                  alt={`Cover of ${item.title}`}
                  loading="lazy"
                  decoding="async"
                  // No artwork supplied yet: hide the element rather than let
                  // the browser draw its broken-image glyph over the fallback.
                  onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                  className="size-full object-cover transition-transform duration-700 ease-[var(--ease-calm)] group-hover:scale-[1.04]"
                />
                {/* Sits behind the <img>; visible whenever a cover is missing,
                    so an absent asset reads as deliberate rather than broken. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 flex items-center justify-center text-sand-300"
                >
                  <BookOpen className="size-14" strokeWidth={1} />
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ochre-600">
                  {item.format} · {item.language}
                </p>
                <CardHeading className="mt-2 text-lg leading-snug">{item.title}</CardHeading>
                <p className="mt-1 text-sm text-ink-500">
                  {item.author}
                  {item.year ? ` · ${item.year}` : ''}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">
                  {item.description}
                </p>

                {(item.purchaseUrl || item.downloadUrl) && (
                  <div className="mt-5 flex flex-wrap gap-4 border-t border-line pt-4 text-sm font-semibold">
                    {item.purchaseUrl && (
                      <a
                        href={item.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700"
                      >
                        <ExternalLink className="size-4" aria-hidden="true" />
                        Purchase
                        <span className="sr-only"> {item.title} (opens in a new tab)</span>
                      </a>
                    )}
                    {item.downloadUrl && (
                      <a
                        href={item.downloadUrl}
                        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700"
                      >
                        <Download className="size-4" aria-hidden="true" />
                        Download
                        <span className="sr-only"> {item.title}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
