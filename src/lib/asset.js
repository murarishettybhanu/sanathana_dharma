/**
 * Resolves a path in `public/` against the deployment's base URL.
 *
 * The site is served from a sub-path on GitHub Pages
 * (`/sanathana_dharma/`), so a bare `/images/guruji.jpg` would resolve
 * against the domain root and 404. Vite rewrites asset URLs it can see in
 * markup and CSS, but not strings that live in JSON data or are built at
 * runtime — those have to be prefixed here.
 *
 * Paths stay root-relative in the data files, which is the honest way to
 * describe them; the base is applied at the point of use.
 *
 * Absolute URLs and data: URIs are passed through untouched.
 */
export function asset(path) {
  if (!path) return path;
  if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith('data:')) return path;

  // BASE_URL is '/' in dev and '/sanathana_dharma/' in the Pages build.
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}
