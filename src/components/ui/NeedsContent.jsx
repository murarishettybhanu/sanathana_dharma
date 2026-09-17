import { FileText } from 'lucide-react';

/**
 * Marks a page whose content the Trust still has to supply.
 *
 * Several pages on the live site are photo galleries with no prose. Rather
 * than inventing text for them — or shipping a blank page that looks broken —
 * the gap is stated plainly, so it reads as a known task rather than a defect.
 */
export function NeedsContent({ children }) {
  return (
    <div className="flex gap-4 rounded-[var(--radius-card)] border border-dashed border-line bg-sand-100 p-6">
      <FileText className="mt-0.5 size-5 shrink-0 text-ink-400" aria-hidden="true" />
      <p className="text-sm leading-relaxed text-ink-600">{children}</p>
    </div>
  );
}
