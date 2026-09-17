import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ExternalLink } from 'lucide-react';

import { cn } from '@/lib/cn';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Desktop navigation menu.
 *
 * The Trust's information architecture is three levels deep (About Guruji →
 * Siva Ganga Sangeeta Parishad → Trustees). Cascading flyouts for that are
 * miserable to use — every sub-level is another corridor the pointer has to
 * stay inside — so the third level is laid out flat instead: a panel of
 * columns, each headed by the second-level page, with its children beneath.
 * Everything is reachable in one movement and one Tab sequence.
 *
 * Opens on hover for pointer users and on click/ArrowDown for keyboard users.
 * A hover-only menu is unreachable from the keyboard; a click-only menu feels
 * broken with a mouse.
 */
export function NavDropdown({ item, linkClass }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const closeTimer = useRef(null);
  const menuId = useId();
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  // `groups` is the wide panel; `children` is the simple single-column list.
  const groups = item.groups ?? (item.children ? [{ children: item.children }] : []);
  const isWide = Boolean(item.groups);

  const isActive =
    (item.match ? location.pathname.startsWith(item.match) : false) ||
    groups.some(
      (group) =>
        group.to === location.pathname ||
        group.children?.some((child) => child.to === location.pathname),
    );

  const open = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setIsOpen(true);
  }, []);

  // A short delay forgives the diagonal mouse path from the trigger down into
  // the panel, which would otherwise close the menu mid-travel.
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setIsOpen(false), 140);
  }, []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  useEffect(() => setIsOpen(false), [location.pathname]);

  function handleKeyDown(event) {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (event.key === 'ArrowDown' && !isOpen) {
      event.preventDefault();
      setIsOpen(true);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={open}
      onMouseLeave={scheduleClose}
      onFocusCapture={open}
      onBlurCapture={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget)) scheduleClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setIsOpen((value) => !value)}
        className={cn(linkClass({ isActive }), 'inline-flex items-center gap-1')}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          className={cn('size-3.5 transition-transform duration-300', isOpen && 'rotate-180')}
        />
        {isActive && (
          <span
            aria-hidden="true"
            className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-ochre-500"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className={cn(
              'absolute top-full z-50 mt-2 rounded-2xl border border-line bg-sand-50 p-4 shadow-lift',
              isWide
                ? // Anchored to the viewport rather than the trigger: a panel this
                  // wide would otherwise run off the edge under the last menus.
                  'fixed left-1/2 w-[min(64rem,calc(100vw-2rem))] -translate-x-1/2'
                : 'left-1/2 w-72 -translate-x-1/2 p-2',
            )}
          >
            <ul
              className={cn(
                isWide && 'grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
              )}
            >
              {groups.map((group, i) => (
                <li key={group.label ?? i}>
                  {group.label && (
                    <MenuHeading group={group} />
                  )}
                  <ul className={cn(group.label && 'mt-1')}>
                    {group.children?.map((child) => (
                      <li key={child.to ?? child.href}>
                        <MenuLink item={child} nested={Boolean(group.label)} />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Second-level entry: a link when it has its own page, plain text otherwise. */
function MenuHeading({ group }) {
  const className =
    'block rounded-lg px-3 py-1.5 font-display text-sm font-semibold leading-snug text-indigo-800';

  if (group.href) {
    return (
      <a
        href={group.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(className, 'hover:bg-sand-100')}
      >
        {group.label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  if (!group.to) {
    return (
      <p className={cn(className, 'text-ink-500')}>{group.label}</p>
    );
  }

  return (
    <NavLink
      to={group.to}
      end
      className={({ isActive }) =>
        cn(className, 'hover:bg-sand-100', isActive && 'bg-indigo-50 text-indigo-700')
      }
    >
      {group.label}
    </NavLink>
  );
}

/** Third-level entry. */
function MenuLink({ item, nested }) {
  const className = cn(
    'block rounded-lg py-1.5 text-sm transition-colors',
    nested ? 'pl-6 pr-3' : 'px-3 py-2.5',
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(className, 'inline-flex items-center gap-1.5 text-ink-600 hover:text-indigo-600')}
      >
        {item.label}
        <ExternalLink className="size-3" aria-hidden="true" />
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
          isActive
            ? 'bg-indigo-50 font-semibold text-indigo-700'
            : 'text-ink-600 hover:bg-sand-100 hover:text-indigo-600',
        )
      }
    >
      {item.label}
    </NavLink>
  );
}
