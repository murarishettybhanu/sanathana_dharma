import { Clock, ExternalLink, Image as ImageIcon, Play } from 'lucide-react';

import { cn } from '@/lib/cn';
import { asset } from '@/lib/asset';
import { Reveal } from '@/components/ui/Reveal';

/**
 * The running order of an award evening: pooja, programme, speeches, book
 * release, felicitation, and the hall — each with its photographs and, where
 * there is footage, its recordings.
 *
 * Sections come from the honour record in trusts.json, so the order and the
 * media lists are content rather than code. A section with neither photographs
 * nor video still renders its heading and summary: the running order is itself
 * the useful part, and a missing gallery reads as pending rather than absent.
 */
export function HonourSections({ sections }) {
  if (!sections?.length) return null;

  return (
    <div className="space-y-20">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-heading`}
          className="scroll-mt-32"
        >
          <Reveal>
            <div className="flex items-baseline gap-3">
              {section.letter && (
                <span
                  aria-hidden="true"
                  className="font-display text-sm font-semibold text-ochre-600"
                >
                  {section.letter}
                </span>
              )}
              <h2 id={`${section.id}-heading`} className="text-2xl sm:text-3xl">
                {section.title}
              </h2>
            </div>
            <div className="rule-ornament mt-4 w-20" aria-hidden="true" />
            {section.summary && (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-600">
                {section.summary}
              </p>
            )}
          </Reveal>

          {section.photos?.length > 0 && (
            <PhotoGrid photos={section.photos} sectionTitle={section.title} />
          )}

          {section.videos?.length > 0 && (
            <VideoList videos={section.videos} sectionTitle={section.title} />
          )}

          {!section.photos?.length && !section.videos?.length && (
            <Reveal className="mt-8">
              <p className="rounded-[var(--radius-card)] border border-dashed border-line bg-sand-100 px-6 py-8 text-center text-sm text-ink-600">
                Photographs from this part of the evening have not been added yet.
              </p>
            </Reveal>
          )}
        </section>
      ))}
    </div>
  );
}

function PhotoGrid({ photos, sectionTitle }) {
  return (
    <>
      <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-ochre-600">
        Photographs
      </h3>
      <ul className="mt-5 grid gap-5 lg:grid-cols-2">
        {photos.map((photo, i) => (
          <Reveal as="li" key={photo.id} delay={i * 0.04}>
            <figure className="group overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
              <div className="relative aspect-[3/1] overflow-hidden bg-sand-100">
                {/* Sits under the image; visible only once the image hides
                    itself on error. Paint order does this — a negative
                    z-index would put it behind the container's background. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center text-sand-300"
                >
                  <ImageIcon className="size-8" strokeWidth={1.2} />
                </span>
                <img
                  src={asset(photo.src)}
                  alt={`${sectionTitle} — ${photo.caption}`}
                  loading="lazy"
                  decoding="async"
                  // No photographs supplied yet: hide the element so the
                  // placeholder beneath shows instead of a broken-image glyph.
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden';
                  }}
                  className="relative size-full object-cover transition-transform duration-700 ease-[var(--ease-calm)] group-hover:scale-105"
                />
              </div>
              <figcaption className="px-4 py-3 text-sm leading-snug text-ink-600">
                {photo.caption}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </>
  );
}

/** mm:ss, or h:mm:ss past the hour. */
function formatTimestamp(total) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  return h
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`;
}

function VideoList({ videos, sectionTitle }) {
  return (
    <>
      <h3 className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-ochre-600">
        Video
      </h3>
      <ul className="mt-5 grid gap-5 sm:grid-cols-2">
        {videos.map((video, i) => (
          <Reveal as="li" key={video.id} delay={i * 0.05}>
            <article
              className={cn(
                'group relative flex gap-4 rounded-[var(--radius-card)] border border-line bg-white p-4',
                'transition-all duration-500 ease-[var(--ease-calm)] hover:-translate-y-1 hover:shadow-lift',
                'has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-indigo-600',
              )}
            >
              <span
                aria-hidden="true"
                className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-sand-50"
              >
                <Play className="size-6" strokeWidth={1.6} />
              </span>
              <div className="min-w-0">
                <h4 className="text-base leading-snug">
                  {video.href ? (
                    <a
                      href={video.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                    >
                      {video.title}
                      <span className="sr-only">
                        {' '}
                        — {sectionTitle}
                        {typeof video.startSeconds === 'number'
                          ? `, from ${formatTimestamp(video.startSeconds)}`
                          : ''}{' '}
                        (opens in a new tab)
                      </span>
                    </a>
                  ) : (
                    video.title
                  )}
                </h4>
                <p className="mt-1.5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500">
                  {typeof video.startSeconds === 'number' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">
                      <Clock className="size-3" aria-hidden="true" />
                      {formatTimestamp(video.startSeconds)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <ExternalLink className="size-3" aria-hidden="true" />
                    Opens the recording at this point
                  </span>
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </>
  );
}
