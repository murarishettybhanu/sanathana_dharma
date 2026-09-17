import { Link } from 'react-router-dom';
import { MapPin, Youtube } from 'lucide-react';

import site from '@/data/site.json';
import footer from '@/data/footer.json';
import trusts from '@/data/trusts.json';
import { Container } from '@/components/ui/Container';
import { BanyanMark } from './BanyanMark';

/**
 * Site footer, following the arrangement of the Trust's existing one: the two
 * centres shown on maps, the About Guruji menu, Quick Links, and the YouTube
 * call to action, over a copyright bar.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const yearRange =
    year > footer.copyrightFrom ? `${footer.copyrightFrom} – ${year}` : `${footer.copyrightFrom}`;

  return (
    <footer className="bg-indigo-900 text-sand-200">
      <Container size="wide" className="py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* ---------- The two centres ---------- */}
          {footer.maps.map((map) => (
            <section key={map.id} aria-labelledby={`footer-map-${map.id}`}>
              <h2
                id={`footer-map-${map.id}`}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ochre-300"
              >
                <MapPin className="size-3.5" aria-hidden="true" />
                {map.label}
              </h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-ochre-400/40 bg-indigo-950">
                <iframe
                  src={map.embed}
                  title={`Map of ${map.label} — ${map.caption}`}
                  // Deferred so two third-party map frames never block the page,
                  // and referrer-trimmed so the embed learns as little as possible.
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-44 w-full border-0"
                />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-sand-200/60">{map.caption}</p>
            </section>
          ))}

          {/* ---------- Menu columns ---------- */}
          {footer.columns.map((column) => (
            <nav key={column.id} aria-labelledby={`footer-${column.id}`}>
              <h2
                id={`footer-${column.id}`}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre-300"
              >
                {column.title}
              </h2>
              <ul className="mt-5 space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.id}-${link.to}`}>
                    <Link
                      to={link.to}
                      className="text-sm text-sand-200/80 transition-colors hover:text-sand-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* ---------- Identity + YouTube ---------- */}
          <div>
            <BanyanMark className="size-20" />
            <p className="mt-4 font-display text-base leading-snug text-sand-50">{site.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ochre-300">
              {site.location}
            </p>

            <h2 className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-ochre-300">
              {footer.youtube.title}
            </h2>
            <a
              href={footer.youtube.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-sand-200/25 px-4 py-2.5 text-sm text-sand-200 transition-colors hover:border-ochre-400 hover:bg-ochre-500 hover:text-sand-50"
            >
              <Youtube className="size-4" aria-hidden="true" />
              {footer.youtube.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        {/* ---------- Associated institutions ---------- */}
        <div className="mt-14 border-t border-sand-200/10 pt-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre-300">
            Associated Institutions
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-sand-200/60">
            {trusts.map((trust) => (
              <li key={trust.id}>
                <Link
                  to={`/about-guruji/${trust.id}`}
                  className="transition-colors hover:text-sand-50"
                >
                  {trust.name}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://srigurudham.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-sand-50"
              >
                Balusupadu / Gurudham
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-sand-200/10 pt-8 text-xs text-sand-200/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {yearRange} {footer.copyright}
          </p>
          <p className="font-display italic">Sarve bhavantu sukhinah</p>
        </div>
      </Container>
    </footer>
  );
}
