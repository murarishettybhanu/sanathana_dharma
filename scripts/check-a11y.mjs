await import('./dom-shim.mjs');
const { render, names } = await import('../.audit/audit-entry.js');

let issues = 0;
for (const name of names) {
  const html = render(name);
  const problems = [];

  // 1. Exactly one <h1>
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) problems.push(`${h1s} <h1> elements (expected 1)`);

  // 2. Heading levels must not skip (h2 -> h4)
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) problems.push(`heading jump h${levels[i-1]} → h${levels[i]}`);
  }

  // 3. Every <img> needs an alt attribute (alt="" is valid for decorative)
  const imgs = html.match(/<img\b[^>]*>/g) || [];
  imgs.filter((t) => !/\salt=/.test(t)).forEach(() => problems.push('img without alt'));

  // 4. Every <button> needs a discernible name: text, aria-label, or sr-only span
  const buttons = html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) || [];
  buttons.forEach((b) => {
    const hasAria = /aria-label=/.test(b);
    const text = b.replace(/<[^>]*>/g, '').trim();
    const srOnly = /sr-only/.test(b);
    if (!hasAria && !srOnly && !text) problems.push('button with no accessible name');
  });

  // 5. Every form control must have a matching <label for>
  const ids = [...html.matchAll(/<(?:input|textarea|select)\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
  const labelFor = new Set([...html.matchAll(/<label[^>]*\bfor="([^"]+)"/g)].map((m) => m[1]));
  ids.filter((id) => !labelFor.has(id)).forEach((id) => problems.push(`control #${id} has no <label for>`));

  // 6. target=_blank must carry rel=noopener
  (html.match(/<a\b[^>]*target="_blank"[^>]*>/g) || [])
    .filter((a) => !/rel="[^"]*noopener/.test(a))
    .forEach(() => problems.push('target=_blank without rel=noopener'));

  const levelStr = levels.join(',');
  if (problems.length) { issues += problems.length; console.log(`  FAIL ${name}`); problems.forEach(p=>console.log(`        · ${p}`)); }
  else console.log(`  ok   ${name.padEnd(13)} headings: h${levelStr.replaceAll(',', ' h')}`);
}
console.log(issues ? `\n${issues} accessibility issue(s)` : '\nNo accessibility issues found.');
process.exit(issues ? 1 : 0);
