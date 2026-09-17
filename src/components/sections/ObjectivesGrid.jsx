import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Flame,
  HeartHandshake,
  Music,
  ScrollText,
  Sparkles,
} from 'lucide-react';

import objectives from '@/data/objectives.json';
import { cn } from '@/lib/cn';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Explicit icon map rather than a dynamic lookup on the lucide barrel export.
 * Naming each import is what lets the bundler tree-shake the other ~1,500
 * icons out of the build.
 */
const ICONS = {
  flame: Flame,
  'scroll-text': ScrollText,
  music: Music,
  'book-open': BookOpen,
  'heart-handshake': HeartHandshake,
  award: Award,
};

/**
 * Per-card accent styling. Keeping the full class strings here (rather than
 * composing them from fragments) is required for Tailwind's static extractor
 * to see them.
 */
const ACCENTS = {
  indigo: {
    tile: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-sand-50',
    rule: 'bg-indigo-500',
    glow: 'group-hover:shadow-[0_18px_40px_-18px_rgba(55,72,166,0.45)]',
  },
  ochre: {
    tile: 'bg-ochre-50 text-ochre-600 group-hover:bg-ochre-600 group-hover:text-sand-50',
    rule: 'bg-ochre-500',
    glow: 'group-hover:shadow-[0_18px_40px_-18px_rgba(138,97,40,0.45)]',
  },
  banyan: {
    tile: 'bg-banyan-50 text-banyan-600 group-hover:bg-banyan-600 group-hover:text-sand-50',
    rule: 'bg-banyan-500',
    glow: 'group-hover:shadow-[0_18px_40px_-18px_rgba(47,96,44,0.45)]',
  },
};

/**
 * @param {boolean} [heading=true]  Set false on the Objectives page, where the
 *   page masthead already carries the title — two "Our Objectives" eyebrows
 *   stacked on top of each other reads as a mistake.
 */
export function ObjectivesGrid({ heading = true }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // With the section heading suppressed the page <h1> is the nearest ancestor,
  // so the card titles move up a level to keep the outline unbroken.
  const CardHeading = heading ? 'h3' : 'h2';

  return (
    <Section
      id="objectives"
      tone="default"
      labelledBy={heading ? 'objectives-heading' : undefined}
    >
      {heading && (
        <SectionHeading
          id="objectives-heading"
          eyebrow="Our Objectives"
          title="Six pillars of the Trust's work"
          lead="Dharma held in thought, sounded in music, set down in print, and carried out
                in service — the same principle expressed four different ways."
          className="mb-16"
        />
      )}
      <motion.ul
        variants={staggerContainer(0.08)}
        initial={prefersReducedMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {objectives.map((objective) => (
          <ObjectiveCard
            key={objective.id}
            objective={objective}
            headingTag={CardHeading}
          />
        ))}
      </motion.ul>
    </Section>
  );
}

function ObjectiveCard({ objective, headingTag: CardHeading = 'h3' }) {
  const Icon = ICONS[objective.icon] ?? Sparkles;
  const accent = ACCENTS[objective.accent] ?? ACCENTS.indigo;

  return (
    <motion.li variants={fadeUp} className="h-full">
      <article
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)]',
          'border border-line bg-white p-7',
          'transition-all duration-500 ease-[var(--ease-calm)]',
          'hover:-translate-y-1.5 hover:border-line',
          // `focus-within` mirrors every hover state for keyboard users, so
          // tabbing through the grid looks exactly like mousing through it.
          'focus-within:-translate-y-1.5 focus-within:border-line',
          // The stretched link has no box of its own to ring, so the card
          // wears the focus indicator on its behalf.
          'has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-indigo-600',
          accent.glow,
        )}
      >
        {/* Accent rule that wipes across the top edge on hover/focus. */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-calm)]',
            'group-hover:scale-x-100 group-focus-within:scale-x-100',
            accent.rule,
          )}
        />

        <span
          aria-hidden="true"
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 ease-[var(--ease-calm)]',
            'group-hover:scale-105 group-focus-within:scale-105',
            accent.tile,
          )}
        >
          <Icon className="size-7" strokeWidth={1.6} />
        </span>

        <CardHeading className="mt-6 text-xl leading-snug">
          {/* The stretched pseudo-element makes the whole card clickable while
              keeping a single, properly-labelled link in the tab order. */}
          <Link
            to={objective.to}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {objective.title}
          </Link>
        </CardHeading>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">
          {objective.summary}
        </p>

        <span
          aria-hidden="true"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors group-hover:text-indigo-700"
        >
          Read more
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-[var(--ease-calm)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </article>
    </motion.li>
  );
}
