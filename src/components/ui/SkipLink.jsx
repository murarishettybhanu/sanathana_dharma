/**
 * Visually hidden until focused. The first Tab press on any page reveals it,
 * letting keyboard and switch users jump past the navigation straight into the
 * content instead of walking through every menu item on every page.
 */
export function SkipLink({ href = '#main' }) {
  return (
    <a
      href={href}
      className="sr-only rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-sand-50 shadow-lift focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
    >
      Skip to main content
    </a>
  );
}
