import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

/**
 * The standard section header: small ochre eyebrow, serif title, ornamental rule,
 * optional lead paragraph.
 *
 * `as` should be set so heading levels stay in document order — a page with an
 * <h1> hero should use "h2" here. Correct heading order is how screen-reader
 * users navigate a long page.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  as = 'h2',
  align = 'center',
  className,
}) {
  const Heading = as;
  const centred = align === 'center';

  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn('flex flex-col', centred ? 'items-center text-center' : 'items-start', className)}
    >
      {eyebrow && (
        <motion.p
          variants={fadeUp}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre-600"
        >
          {eyebrow}
        </motion.p>
      )}

      <motion.div variants={fadeUp}>
        <Heading id={id} className="mt-3 text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
          {title}
        </Heading>
      </motion.div>

      <motion.div
        variants={fadeUp}
        aria-hidden="true"
        className={cn('rule-ornament mt-5 h-px w-24', centred && 'self-center')}
      />

      {lead && (
        <motion.p
          variants={fadeUp}
          className={cn('mt-5 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg')}
        >
          {lead}
        </motion.p>
      )}
    </motion.div>
  );
}
