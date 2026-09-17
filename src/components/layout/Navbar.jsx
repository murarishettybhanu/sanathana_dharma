import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Contrast, Heart, Menu, X } from 'lucide-react';

import navigation from '@/data/navigation.json';
import { cn } from '@/lib/cn';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Logo } from './Logo';
import { NavDropdown } from './NavDropdown';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useContrastMode } from '@/hooks/useContrastMode';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** Distance in px after which the bar gains its border and shadow. */
const ELEVATE_AFTER = 12;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isElevated, setIsElevated] = useState(false);
  // The drawer is portalled, which is browser-only; gate it on mount so the
  // component can still be rendered to a string on the server.
  const [isMounted, setIsMounted] = useState(false);
  const drawerRef = useRef(null);
  const location = useLocation();

  const { isHighContrast, toggle: toggleContrast } = useContrastMode();
  const prefersReducedMotion = usePrefersReducedMotion();

  const close = useCallback(() => setIsOpen(false), []);

  // Behavioural plumbing for the drawer: no background scroll, focus kept
  // inside, Escape closes, focus returned to the trigger on close.
  useLockBodyScroll(isOpen);
  useFocusTrap(drawerRef, isOpen, close);

  useEffect(() => setIsMounted(true), []);

  // A drawer left open across a route change would cover the new page.
  useEffect(() => {
    close();
  }, [location.pathname, location.hash, close]);

  // Swap the bar's chrome once the page has scrolled away from the top.
  // `passive` keeps the listener off the scrolling critical path.
  useEffect(() => {
    const onScroll = () => setIsElevated(window.scrollY > ELEVATE_AFTER);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Desktop and drawer links share their active/idle styling.
  const linkClass = ({ isActive }) =>
    cn(
      // nowrap: two-word labels like "Honors & Awards" would otherwise wrap and
      // leave the bar an uneven height.
      'relative whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-200',
      isActive ? 'text-indigo-700' : 'text-ink-700 hover:text-indigo-600',
    );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 ease-[var(--ease-calm)]',
        'bg-sand-50/85 backdrop-blur-md supports-[backdrop-filter]:bg-sand-50/70',
        isElevated ? 'border-b border-line shadow-soft' : 'border-b border-transparent',
      )}
    >
      <Container size="wide">
        <nav aria-label="Primary" className="flex h-20 items-center justify-between gap-4">
          <Logo />

          {/* ---------------- Desktop navigation ---------------- */}
          <ul className="hidden items-center gap-0.5 min-[1380px]:flex">
            {navigation.map((item) => (
              <li key={item.label}>
                {item.groups || item.children ? (
                  <NavDropdown item={item} linkClass={linkClass} />
                ) : (
                  <NavLink to={item.to} end={item.to === '/'} className={linkClass}>
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {/* The underline is decoration; `aria-current`, which
                            NavLink sets for us, is the actual signal. */}
                        {isActive && (
                          <motion.span
                            layoutId="nav-underline"
                            aria-hidden="true"
                            className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-ochre-500"
                            transition={
                              prefersReducedMotion
                                ? { duration: 0 }
                                : { type: 'spring', stiffness: 380, damping: 32 }
                            }
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* ---------------- Utilities + mobile trigger ---------------- */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleContrast}
              aria-pressed={isHighContrast}
              className="flex size-11 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
              title={isHighContrast ? 'Switch to standard contrast' : 'Switch to high contrast'}
            >
              <Contrast className="size-5" aria-hidden="true" />
              <span className="sr-only">
                {isHighContrast ? 'Switch to standard contrast' : 'Switch to high contrast'}
              </span>
            </button>

            <Button to="/support" variant="accent" size="sm" className="hidden sm:inline-flex">
              <Heart className="size-4" aria-hidden="true" />
              Donate
            </Button>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="flex size-11 items-center justify-center rounded-full text-ink-800 transition-colors hover:bg-indigo-50 min-[1380px]:hidden"
            >
              <Menu className="size-6" aria-hidden="true" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </nav>
      </Container>

      {/* ---------------- Mobile drawer ----------------
          Rendered into <body> through a portal, not left inside <header>.
          The header carries `backdrop-blur`, and backdrop-filter establishes a
          containing block for fixed-position descendants — so an in-place
          drawer would size itself to the 80px header instead of the viewport.
          A portal also puts the overlay above every stacking context on the
          page rather than competing with them for z-index. */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
        {isOpen && (
          <motion.div
            // overflow-hidden matters: the panel animates in from x:100%, and
            // without it that off-screen position widens the document, which
            // in turn corrupts the scrollbar-width measurement in
            // useLockBodyScroll and shoves the page sideways.
            className="fixed inset-0 z-50 overflow-hidden min-[1380px]:hidden"
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Scrim. Clicking it closes — a plain div, because the drawer's
                own close button is the accessible control. */}
            <motion.div
              variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
              onClick={close}
              aria-hidden="true"
              className="absolute inset-0 bg-ink-950/45 backdrop-blur-sm"
            />

            <motion.div
              ref={drawerRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              tabIndex={-1}
              variants={{
                closed: { x: '100%' },
                open: { x: 0 },
              }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 340, damping: 36 }
              }
              className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col bg-sand-50 shadow-lift"
            >
              <div className="flex h-20 shrink-0 items-center justify-between border-b border-line px-5">
                <Logo compact />
                <button
                  type="button"
                  onClick={close}
                  className="flex size-11 items-center justify-center rounded-full text-ink-800 transition-colors hover:bg-indigo-50"
                >
                  <X className="size-6" aria-hidden="true" />
                  <span className="sr-only">Close menu</span>
                </button>
              </div>

              <ul className="flex-1 overflow-y-auto px-3 py-5">
                {navigation.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.05 * i + 0.08 }}
                  >
                    {item.groups || item.children ? (
                      <MobileSection item={item} />
                    ) : (
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center rounded-xl px-4 py-3.5 font-display text-lg transition-colors',
                            isActive
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'text-ink-800 hover:bg-sand-100',
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    )}
                  </motion.li>
                ))}
              </ul>

              <div className="shrink-0 border-t border-line p-5">
                <Button to="/support" variant="accent" size="lg" className="w-full">
                  <Heart className="size-4" aria-hidden="true" />
                  Support our cause
                </Button>
              </div>
            </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}

/**
 * A nested group inside the mobile drawer, rendered as native <details>.
 *
 * The browser supplies the open/closed state, keyboard behaviour and correct
 * screen-reader semantics for free — everything a hand-rolled accordion has to
 * reimplement and usually gets wrong. Nesting <details> inside <details> gives
 * the third level with no extra machinery.
 */
function MobileSection({ item }) {
  const location = useLocation();
  const groups = item.groups ?? (item.children ? [{ children: item.children }] : []);
  const containsCurrent = groups.some(
    (g) => g.to === location.pathname || g.children?.some((c) => c.to === location.pathname),
  );

  return (
    <details open={containsCurrent} className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3.5 font-display text-lg text-ink-800 transition-colors marker:content-none hover:bg-sand-100">
        {item.label}
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-300 group-open:rotate-180"
        />
      </summary>

      <ul className="mb-1 ml-4 border-l border-line pl-2">
        {groups.map((group, i) =>
          group.children?.length && group.label ? (
            <li key={group.label}>
              <MobileGroup group={group} />
            </li>
          ) : (
            (group.children ?? []).map((child) => (
              <li key={child.to ?? child.href}>
                <MobileLink item={child} />
              </li>
            ))
          ),
        )}
      </ul>
    </details>
  );
}

/** Third level: the second-level page plus its children. */
function MobileGroup({ group }) {
  const location = useLocation();
  const containsCurrent =
    group.to === location.pathname || group.children.some((c) => c.to === location.pathname);

  return (
    <details open={containsCurrent} className="group/sub">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-indigo-800 transition-colors marker:content-none hover:bg-sand-100">
        <span className="pr-2">{group.label}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-3.5 shrink-0 transition-transform duration-300 group-open/sub:rotate-180"
        />
      </summary>
      <ul className="mb-1 ml-3 border-l border-line pl-2">
        {group.to && (
          <li>
            <MobileLink item={{ label: 'Overview', to: group.to }} />
          </li>
        )}
        {group.children.map((child) => (
          <li key={child.to ?? child.href}>
            <MobileLink item={child} />
          </li>
        ))}
      </ul>
    </details>
  );
}

function MobileLink({ item }) {
  const className = 'block rounded-lg px-4 py-2.5 text-sm transition-colors';

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(className, 'text-ink-600 hover:bg-sand-100')}
      >
        {item.label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <NavLink
      to={item.to}
      end
      className={({ isActive }) =>
        cn(
          className,
          isActive ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-ink-600 hover:bg-sand-100',
        )
      }
    >
      {item.label}
    </NavLink>
  );
}
