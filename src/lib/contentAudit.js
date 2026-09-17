/**
 * Development-only content audit.
 *
 * Several records in src/data are scaffolding — invented dates, titles and
 * contact details used to build the layout against. They are marked with
 * `__placeholder` (or, for quotes, `verified: false`) and must be replaced with
 * information supplied by the Trust before the site goes live.
 *
 * This prints them once on boot so they cannot quietly ship. It is called
 * behind `import.meta.env.DEV`, so the whole module is dropped from the
 * production bundle.
 */
export async function auditContent() {
  const [events, announcements, publications, quotes, site] = await Promise.all([
    import('@/data/events.json'),
    import('@/data/announcements.json'),
    import('@/data/publications.json'),
    import('@/data/quotes.json'),
    import('@/data/site.json'),
  ]);

  const outstanding = [
    ...events.default
      .filter((e) => e.__placeholder)
      .map((e) => `event "${e.title}" — ${e.__placeholder} unverified`),
    ...announcements.default.filter((a) => a.__placeholder).map((a) => `announcement: ${a.id}`),
    ...publications.default.filter((p) => p.__placeholder).map((p) => `publication: ${p.title}`),
    ...quotes.default.filter((q) => q.verified === false).map((q) => `quote: ${q.id}`),
    ...(site.default.contact.__note ? ['site.json contact: no public email or phone published'] : []),
  ];

  if (outstanding.length === 0) return;

  console.warn(
    `[content audit] ${outstanding.length} placeholder record(s) still need real content from the Trust:\n` +
      outstanding.map((line) => `  · ${line}`).join('\n'),
  );
}
