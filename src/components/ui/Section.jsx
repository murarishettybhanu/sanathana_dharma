import { cn } from '@/lib/cn';
import { Container } from './Container';

const tones = {
  default: 'bg-sand-50',
  sunken: 'bg-sand-100',
  raised: 'bg-white',
  dark: 'bg-indigo-900 text-sand-100',
};

/**
 * A vertical band of the page. Handles the section tone, the consistent
 * vertical rhythm, and the landmark wiring (`aria-labelledby`) in one place.
 */
export function Section({
  id,
  tone = 'default',
  size = 'default',
  labelledBy,
  className,
  containerClassName,
  children,
}) {
  const padding = size === 'compact' ? 'py-14 sm:py-16' : 'py-20 sm:py-24 lg:py-28';

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(tones[tone], padding, className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
