import { cn } from '@/lib/cn';
import { asset } from '@/lib/asset';

/**
 * The Trust's mark: a banyan under a starry sky.
 *
 * This is the Trust's own artwork, not a redraw. An earlier version of this
 * component rebuilt the composition as SVG, because the only copy available at
 * the time was the 139px `tree.png` the live site serves — soft above about
 * 70px. With the 1020px original in hand there is no reason to approximate it:
 * the real drawing has detail no reasonable amount of vector work would match.
 *
 * Two sizes are shipped. The browser picks by density, so the navbar fetches
 * 23 kB rather than the 59 kB needed for a large display.
 *
 * The mark is also the source of the site's colour palette — see the `@theme`
 * block in styles/index.css.
 */
export function BanyanMark({ className, title, large = false }) {
  return (
    <img
      src={asset(large ? '/brand/banyan-512.png' : '/brand/banyan-256.png')}
      // 256 covers the navbar (60px) and footer (80px) at 3× density; 512 is
      // there for anywhere the mark is shown large.
      srcSet={`${asset('/brand/banyan-256.png')} 256w, ${asset('/brand/banyan-512.png')} 512w`}
      sizes={large ? '(max-width: 640px) 160px, 240px' : '80px'}
      width={large ? 512 : 256}
      height={large ? 512 : 256}
      alt={title ?? ''}
      aria-hidden={title ? undefined : 'true'}
      decoding="async"
      // The navbar mark is above the fold on every page, so it is not lazy.
      className={cn('select-none', className)}
      draggable={false}
    />
  );
}
