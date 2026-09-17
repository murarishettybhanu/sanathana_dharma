/**
 * Suspense fallback for lazily-loaded routes.
 *
 * `role="status"` with a visually-hidden label announces the wait to screen
 * readers; the spinner itself is decorative.
 */
export function PageLoader() {
  return (
    <div role="status" className="flex min-h-[60vh] items-center justify-center">
      <span
        aria-hidden="true"
        className="size-10 animate-spin rounded-full border-2 border-line border-t-indigo-600"
      />
      <span className="sr-only">Loading page…</span>
    </div>
  );
}
