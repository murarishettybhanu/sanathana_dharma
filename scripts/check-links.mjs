/**
 * Link integrity check.
 *
 * Crawls the running dev server from "/", following every internal <a href>,
 * and reports any page that renders the 404 view or throws. This is what
 * catches a nav entry pointing at a route that was never wired up — something
 * neither the build nor the a11y audit can see.
 *
 * Also asserts that every link in navigation.json and footer.json resolves.
 */
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const EXEC = path.join(
  os.homedir(),
  'Library/Caches/ms-playwright/chromium-1194/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
);
const BASE = process.env.BASE ?? 'http://localhost:5173';

// Uses the Playwright-managed Chromium. If it has not been downloaded on this
// machine, skip rather than fail — the other checks do not need a browser.
if (!existsSync(EXEC)) {
  console.log('  skipped: no Chromium at', EXEC);
  console.log('  run `npx playwright install chromium` to enable this check.');
  process.exit(0);
}

const nav = JSON.parse(readFileSync(new URL('../src/data/navigation.json', import.meta.url)));
const footer = JSON.parse(readFileSync(new URL('../src/data/footer.json', import.meta.url)));

/** Every internal `to` in the navigation tree, at any depth. */
function navPaths(items, out = []) {
  for (const item of items) {
    if (item.to) out.push(item.to);
    if (item.children) navPaths(item.children, out);
    if (item.groups) navPaths(item.groups, out);
  }
  return out;
}

const declared = [
  ...navPaths(nav),
  ...footer.columns.flatMap((c) => c.links.map((l) => l.to)),
];

const browser = await chromium.launch({ executablePath: EXEC });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(`${page.url()} :: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') pageErrors.push(`${page.url()} :: ${m.text()}`);
});

const visited = new Map(); // path -> { ok, h1 }
const queue = ['/', ...declared];
const broken = [];

while (queue.length) {
  const target = queue.shift();
  if (visited.has(target)) continue;

  await page.goto(BASE + target, { waitUntil: 'networkidle' });
  await page.waitForTimeout(220);

  const info = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim() ?? '',
    path: location.pathname,
    hrefs: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')),
  }));

  const isNotFound = /could not be found/i.test(info.h1);
  visited.set(target, { ok: !isNotFound, h1: info.h1, landed: info.path });
  if (isNotFound) broken.push(`${target}  →  404`);

  // Follow newly-discovered internal links (ignoring in-page anchors).
  for (const href of info.hrefs) {
    const clean = href.split('#')[0];
    if (clean && !visited.has(clean) && !queue.includes(clean)) queue.push(clean);
  }
}

await browser.close();

const okCount = [...visited.values()].filter((v) => v.ok).length;
console.log(`  crawled ${visited.size} paths — ${okCount} ok, ${broken.length} broken`);

// Any declared nav/footer link that never resolved is a wiring bug.
const missing = declared.filter((d) => !visited.get(d)?.ok);
if (missing.length) {
  console.log(`\n  ${missing.length} navigation/footer link(s) not resolving:`);
  missing.forEach((m) => console.log(`   ✗ ${m}`));
}
if (broken.length) {
  console.log(`\n  broken paths:`);
  [...new Set(broken)].forEach((b) => console.log(`   ✗ ${b}`));
}
const uniqueErrors = [...new Set(pageErrors)];
if (uniqueErrors.length) {
  console.log(`\n  ${uniqueErrors.length} runtime error(s):`);
  uniqueErrors.slice(0, 10).forEach((e) => console.log(`   ! ${e.slice(0, 180)}`));
}

const failed = broken.length + missing.length + uniqueErrors.length;
console.log(failed ? `\n${failed} problem(s)` : '\n  every link resolves, no runtime errors');
process.exit(failed ? 1 : 0);
