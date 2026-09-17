import { cn } from '@/lib/cn';

/**
 * The single source of truth for horizontal rhythm.
 *
 * Every section uses this instead of inventing its own max-width and padding,
 * which is what keeps left edges aligned all the way down the page.
 */
export function Container({ as: Tag = 'div', size = 'default', className, children, ...rest }) {
  const sizes = {
    narrow: 'max-w-3xl',   // long-form reading measure (~70ch)
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
  };

  return (
    <Tag className={cn('mx-auto w-full px-5 sm:px-8', sizes[size], className)} {...rest}>
      {children}
    </Tag>
  );
}
