import { AudioLines, ExternalLink, Image as ImageIcon, Video } from 'lucide-react';

import media from '@/data/media.json';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { asset } from '@/lib/asset';

const ICONS = { image: ImageIcon, video: Video, 'audio-lines': AudioLines };

/**
 * Renders one media archive (photos, videos or audios).
 *
 * The Trust's archives are grouped by centre — Bheemunipatnam and Warangal —
 * but the live site exposes no machine-readable index, so each group renders
 * an honest empty state rather than inventing entries. Drop items into
 * media.json (or point it at a CMS) and the grid fills in with no code change.
 */
export function MediaArchive({ sectionId }) {
  const section = media.sections.find((s) => s.id === sectionId);
  if (!section) return null;

  const Icon = ICONS[section.icon] ?? ImageIcon;

  return (
    <Section tone="default">
      {section.groups.map((group, groupIndex) => (
        <div key={group.id} className={groupIndex > 0 ? 'mt-16' : undefined}>
          <Reveal>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre-600">
              {group.label}
            </h2>
            <div className="rule-ornament mt-4 w-16" aria-hidden="true" />
          </Reveal>

          {group.items.length === 0 ? (
            <Reveal delay={0.05}>
              <div className="mt-8 flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-line bg-sand-100 px-6 py-16 text-center">
                <Icon className="size-10 text-ink-400" strokeWidth={1.2} aria-hidden="true" />
                <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-600">
                  The {section.title.toLowerCase()} archive for {group.label} has not been
                  published here yet. In the meantime, recordings are available on the Trust&apos;s
                  YouTube channel.
                </p>
                <Button
                  href={media.youtube}
                  variant="secondary"
                  size="md"
                  className="mt-6"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  Open the YouTube channel
                </Button>
              </div>
            </Reveal>
          ) : (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item, i) => (
                <Reveal as="li" key={item.id} delay={i * 0.05} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-all duration-500 ease-[var(--ease-calm)] hover:-translate-y-1 hover:shadow-lift">
                    <div className="relative aspect-video overflow-hidden bg-sand-100">
                      <img
                        src={asset(item.thumbnail)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.style.visibility = 'hidden';
                        }}
                        className="size-full object-cover transition-transform duration-700 ease-[var(--ease-calm)] group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-base leading-snug">
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="after:absolute after:inset-0 after:content-['']"
                          >
                            {item.title}
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        ) : (
                          item.title
                        )}
                      </h3>
                      {item.description && (
                        <p className="mt-2 text-sm leading-relaxed text-ink-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      ))}
    </Section>
  );
}
