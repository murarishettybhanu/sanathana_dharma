import { motion } from 'framer-motion';

import { Container } from '@/components/ui/Container';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { asset } from '@/lib/asset';

/** The masthead every interior page opens with. */
export function PageHeader({ eyebrow, title, lead }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="relative overflow-hidden border-b border-line bg-sand-100">
      {/* The Trust's own interior banner, held well back so the heading stays
          the loudest thing on the page. */}
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
          style={{ backgroundImage: `url(${asset('/images/page-banner.jpg')})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sand-100/70 via-sand-100/85 to-sand-100" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(55,72,166,0.10),transparent_70%)]" />
      </div>
      <Container className="relative py-16 text-center sm:py-20">
        <motion.div
          variants={staggerContainer(0.1)}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
        >
          {eyebrow && (
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre-600"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h1 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl">
            {title}
          </motion.h1>
          <motion.div
            variants={fadeUp}
            aria-hidden="true"
            className="rule-ornament mx-auto mt-6 w-24"
          />
          {lead && (
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg"
            >
              {lead}
            </motion.p>
          )}
        </motion.div>
      </Container>
    </div>
  );
}
