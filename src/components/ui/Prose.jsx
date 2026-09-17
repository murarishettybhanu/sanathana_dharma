import { cn } from '@/lib/cn';

/**
 * Long-form body copy at a comfortable reading measure.
 *
 * Takes an array of paragraph strings rather than children so page content can
 * live in JSON and be swapped for a CMS without touching the component.
 */
export function Prose({ paragraphs = [], className }) {
  return (
    <div className={cn('space-y-4 text-base leading-relaxed text-ink-600', className)}>
      {paragraphs.map((text, i) => (
        // Paragraph text is stable content, so index keys are safe here.
        // eslint-disable-next-line react/no-array-index-key
        <p key={i}>{text}</p>
      ))}
    </div>
  );
}
