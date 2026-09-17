import { motion } from 'framer-motion';
import { ArrowRight, Heart, MoveDown } from 'lucide-react';

import site from '@/data/site.json';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { QuoteOfTheDay } from './QuoteOfTheDay';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { asset } from '@/lib/asset';

/**
 * Landing hero.
 *
 * The background is built from layered CSS — an indigo base, two radial warm
 * lights and a repeating lotus-petal lattice — with the photograph layered on
 * top at low opacity. That ordering means the hero is fully designed before any
 * image arrives: there is no flash of unstyled banner, no layout shift, and the
 * section still looks finished if the photo fails to load.
 */
export function HeroSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-indigo-900"
    >
      {/* ---------- Background layers (decorative) ---------- */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {/* Photograph, if one has been supplied. */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-55 mix-blend-luminosity sm:bg-[center_30%]"
          style={{ backgroundImage: `url(${asset('/images/hero-temple.jpg')})` }}
        />
        {/* Warm light from the upper right, cooler depth bottom-left. */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_8%,rgba(79,126,196,0.38),transparent_58%),radial-gradient(90%_80%_at_12%_100%,rgba(13,19,48,0.92),transparent_62%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/92 via-indigo-900/70 to-indigo-900/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/60 via-transparent to-indigo-950/75" />
      </div>

      <Container size="wide" className="relative py-20 sm:py-24 lg:py-32">
        <motion.div
          variants={staggerContainer(0.12, 0.05)}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
        >
          {/* ---------- Copy column ---------- */}
          <div className="max-w-2xl">
            <motion.p
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-ochre-300/30 bg-sand-50/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ochre-300 backdrop-blur-sm"
            >
              <span className="size-1.5 rounded-full bg-ochre-400" aria-hidden="true" />
              {site.location} · Est. in service of dharma
            </motion.p>

            <motion.h1
              id="hero-heading"
              variants={fadeUp}
              className="mt-7 text-4xl leading-[1.08] text-sand-50 sm:text-5xl lg:text-6xl"
            >
              The eternal system of
              <span className="block text-ochre-300">values and principles</span>
              of life.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-xl text-base leading-relaxed text-sand-200/85 sm:text-lg"
            >
              The Sanathana Dharma Charitable Trust carries forward the teaching of{' '}
              <strong className="font-semibold text-sand-50">{site.guru.name}</strong> —
              through study and discourse, classical music and the arts, publication of
              the sastras, and quiet, practical service to the people of Bheemunipatnam.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-3">
              <Button to="/objectives" variant="accent" size="lg">
                Explore Teachings
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button to="/support" variant="onDark" size="lg">
                <Heart className="size-4" aria-hidden="true" />
                Support Our Cause
              </Button>
            </motion.div>

            {/* The guru's central teaching, set as a quiet footnote. */}
            <motion.p
              variants={fadeUp}
              className="mt-10 border-l-2 border-ochre-500/50 pl-4 font-display text-base italic text-sand-200/70"
            >
              “{site.guru.epithet}”
            </motion.p>
          </div>

          {/* ---------- Quote card column ---------- */}
          <motion.div variants={fadeUp} className="lg:pl-4">
            <QuoteOfTheDay />
          </motion.div>
        </motion.div>

        {/* Scroll affordance — hidden from AT, it duplicates no information. */}
        <motion.a
          href="#objectives"
          aria-hidden="true"
          tabIndex={-1}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-16 hidden items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-sand-200/55 transition-colors hover:text-sand-50 lg:inline-flex"
        >
          <MoveDown className="size-4 animate-bounce" />
          Discover our work
        </motion.a>
      </Container>
    </section>
  );
}
