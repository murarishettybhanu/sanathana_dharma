import { readFileSync } from 'node:fs';

const css = readFileSync('src/styles/index.css', 'utf8');

function tokens(scopeRe) {
  const block = css.match(scopeRe)[1];
  const map = {};
  for (const [, k, v] of block.matchAll(/(--color-[\w-]+):\s*([^;]+);/g)) map[k] = v.trim();
  // resolve one level of var() indirection
  for (const k of Object.keys(map)) {
    const m = map[k].match(/^var\((--color-[\w-]+)\)$/);
    if (m) map[k] = map[m[1]] ?? map[k];
  }
  return map;
}
const base = tokens(/@theme \{([\s\S]*?)\n\}/);
const hc = { ...base, ...tokens(/\[data-contrast='high'\] \{([\s\S]*?)\n\}/) };

const lum = (hex) => {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [label, foreground token, background token, minimum required]
const PAIRS = [
  ['body text on page',        '--color-ink-700',    '--color-sand-50',  4.5],
  ['muted text on page',       '--color-ink-600',    '--color-sand-50',  4.5],
  ['muted text on sunken',     '--color-ink-600',    '--color-sand-100', 4.5],
  ['heading on page',          '--color-ink-900',    '--color-sand-50',  4.5],
  ['ochre eyebrow on page',  '--color-ochre-600','--color-sand-50',  4.5],
  ['ochre eyebrow on sunken','--color-ochre-600','--color-sand-100', 4.5],
  ['indigo link on page',      '--color-indigo-600', '--color-sand-50',  4.5],
  ['indigo link on card',      '--color-indigo-600', '--color-surface-raised', 4.5],
  ['primary btn label',        '--color-sand-50',   '--color-indigo-600', 4.5],
  ['accent btn label',         '--color-sand-50',   '--color-ochre-600', 4.5],
  ['footer text on indigo',    '--color-sand-200',  '--color-indigo-900', 4.5],
  ['footer eyebrow on indigo', '--color-ochre-300',   '--color-indigo-900', 4.5],
  ['hero body on indigo',      '--color-sand-200',  '--color-indigo-900', 4.5],
  ['hero h1 accent on indigo',  '--color-ochre-300','--color-indigo-900', 4.5],
  ['CTA text on indigo-800',   '--color-sand-200',  '--color-indigo-800', 4.5],
  ['CTA icon on indigo-800',   '--color-ochre-300','--color-indigo-800', 3.0],
  ['banyan accent on page',    '--color-banyan-600', '--color-sand-50',  4.5],
  ['banyan accent on card',    '--color-banyan-600', '--color-surface-raised', 4.5],
  ['sky accent on indigo',     '--color-sky-300',    '--color-indigo-900', 4.5],
  // Non-text UI indicators — WCAG 2.1 SC 1.4.11 requires 3:1
  ['active nav underline',     '--color-ochre-500','--color-sand-50',  3.0],
  ['active carousel dot',      '--color-ochre-500','--color-surface-raised', 3.0],
  ['focus ring on page',       '--color-brand',      '--color-sand-50',  3.0],
  ['focus ring on card',       '--color-brand',      '--color-surface-raised', 3.0],
];

let fails = 0;
for (const [mode, map] of [['standard', base], ['high-contrast', hc]]) {
  console.log(`\n  ${mode}`);
  for (const [label, fg, bg, min] of PAIRS) {
    const r = ratio(map[fg], map[bg]);
    const ok = r >= min;
    if (!ok) fails++;
    console.log(`   ${ok ? '✓' : '✗'} ${label.padEnd(26)} ${r.toFixed(2).padStart(6)}:1  (min ${min})`);
  }
}
console.log(fails ? `\n${fails} pair(s) below threshold` : '\nAll checked pairs meet WCAG AA.');
process.exit(fails ? 1 : 0);
