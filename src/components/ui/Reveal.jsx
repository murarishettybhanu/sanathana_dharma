import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Scroll-triggered entrance wrapper.
 *
 * `as` lets it produce the element the surrounding markup actually requires —
 * `<Reveal as="li">` inside a `<ul>`, for instance — so animating a list does
 * not mean putting `<div>`s where list items belong.
 *
 * When the visitor prefers reduced motion this renders the plain element with
 * no animation at all: the content appears immediately rather than animating
 * quickly, which is what the preference actually asks for.
 */
export function Reveal({
  as = 'div',
  delay = 0,
  variants = fadeUp,
  className,
  children,
  ...rest
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
