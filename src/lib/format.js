/**
 * Date helpers. All dates in the JSON content files are ISO `YYYY-MM-DD`
 * strings so they stay timezone-agnostic and diff cleanly in git.
 */

/** Parse an ISO date as *local* midnight, avoiding the UTC off-by-one-day bug. */
function parseISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** "4 September 2026" */
export function formatDate(iso, locale = 'en-IN') {
  return parseISODate(iso).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** "12–15 October 2026", collapsing the shared month and year. */
export function formatDateRange(startISO, endISO, locale = 'en-IN') {
  if (!endISO || endISO === startISO) return formatDate(startISO, locale);

  const start = parseISODate(startISO);
  const end = parseISODate(endISO);
  const sameMonth =
    start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();

  if (!sameMonth) return `${formatDate(startISO, locale)} – ${formatDate(endISO, locale)}`;
  return `${start.getDate()}–${formatDate(endISO, locale)}`;
}

/** Splits events into upcoming and past, relative to today. */
export function partitionByDate(events, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const upcoming = [];
  const past = [];

  for (const event of events) {
    const end = parseISODate(event.endDate ?? event.startDate);
    (end >= today ? upcoming : past).push(event);
  }

  upcoming.sort((a, b) => a.startDate.localeCompare(b.startDate));
  past.sort((a, b) => b.startDate.localeCompare(a.startDate));
  return { upcoming, past };
}
