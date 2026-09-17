# Sanathana Dharma Charitable Trust — Bheemili

A redesign of [sdctbheemili.org](https://sdctbheemili.org/) as a React single-page
application: peaceful, dignified, accessible, and fast.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle into dist/
npm run check      # contrast + accessibility audits (see "Verification")
```

---

## 1. Directory structure

```
sdct-bheemili/
├── index.html                  Document shell, meta and Open Graph tags
├── vite.config.js              Plugins, `@` alias, manual vendor chunking
├── brand/
│   └── banyan-1020-master.png  Untouched original — NOT deployed
├── public/
│   ├── brand/                  Derived logo sizes + favicons (104 kB total)
│   └── images/                 Photographs from the Trust's site
├── scripts/                    Verification scripts, not shipped to the browser
│   ├── audit-entry.jsx         Renders every page for the audits
│   ├── dom-shim.mjs            Minimal browser globals for Node
│   ├── check-a11y.mjs          Heading order, alt text, labels, link targets
│   └── check-contrast.mjs      WCAG ratios for every colour pair
└── src/
    ├── main.jsx                Entry: mounts <App> inside <BrowserRouter>
    ├── app/
    │   ├── App.jsx             Route table; splits every page except Home
    │   ├── RootLayout.jsx      Persistent chrome + the Suspense boundary
    │   └── ScrollToTop.jsx     Restores scroll position across navigations
    ├── components/
    │   ├── layout/             Chrome that persists across routes
    │   │   ├── Navbar.jsx      Desktop nav + mobile drawer
    │   │   ├── NavDropdown.jsx Desktop submenu (hover + keyboard)
    │   │   ├── Footer.jsx
    │   │   ├── AnnouncementBar.jsx
    │   │   ├── PageHeader.jsx  Masthead for interior pages
    │   │   └── Logo.jsx
    │   ├── sections/           Full-width page bands, one export each
    │   │   ├── HeroSection.jsx
    │   │   ├── QuoteOfTheDay.jsx
    │   │   ├── ObjectivesGrid.jsx
    │   │   ├── EventsPreview.jsx
    │   │   ├── PublicationsGrid.jsx
    │   │   ├── GuruIntro.jsx
    │   │   ├── MediaArchive.jsx
    │   │   └── SupportCTA.jsx
    │   └── ui/                 Primitives with no content knowledge
    │       ├── Button.jsx      Polymorphic: button / Link / anchor
    │       ├── Container.jsx   The single source of horizontal rhythm
    │       ├── Section.jsx     Vertical rhythm, tone, landmark wiring
    │       ├── SectionHeading.jsx
    │       ├── Reveal.jsx      Scroll-triggered entrance, polymorphic
    │       ├── Prose.jsx       Long-form copy from JSON paragraph arrays
    │       ├── LinkGrid.jsx    Onward-link cards, used by every index page
    │       ├── NeedsContent.jsx Marks a page awaiting the Trust's own content
    │       ├── SkipLink.jsx
    │       └── PageLoader.jsx
    ├── data/                   All copy and content — see sections 4 and 7
    │   ├── site.json           Identity, contact, guru facts
    │   ├── navigation.json     Three-level nav tree (groups → children)
    │   ├── footer.json         Footer columns, maps, YouTube block
    │   ├── trusts.json         The four trusts: objectives, activities,
    │   │                       honours and contact — drives ~40 routes
    │   ├── guruji.json         Biography, travel, writings
    │   ├── anandavanam.json    The grounds, and Saptadham
    │   ├── trustees.json       Eleven trustees + registration
    │   ├── objectives.json     The seven objectives (homepage grid)
    │   ├── publications.json   Guruji's seven published works
    │   ├── events.json         Dated festivals and observances
    │   ├── announcements.json  Dated notice strip
    │   ├── media.json          Photo / video / audio archives by centre
    │   └── quotes.json         Quote of the Day
    ├── hooks/
    │   ├── useQuoteOfTheDay.js
    │   ├── useContrastMode.js
    │   ├── usePrefersReducedMotion.js
    │   ├── useLockBodyScroll.js
    │   ├── useFocusTrap.js
    │   └── usePageTitle.js
    ├── lib/
    │   ├── cn.js               Classname joiner
    │   ├── motion.js           Shared Framer Motion variants
    │   ├── format.js           Date formatting and partitioning
    │   └── contentAudit.js     Dev-only placeholder warning
    └── styles/
        └── index.css           Design tokens, base layer, high-contrast theme
```

### Routes — full parity with the live site

**All 62 pages in the Trust's current navigation are reproduced, slug for
slug**, so existing links and search results keep working. `npm run check:links`
crawls them.

The deep pages are parameterised rather than hand-written — four trusts × their
objectives, trustees, activities and honours is 40-odd URLs served by eight
components. Adding a page is a JSON entry, not a file.

```
/                                          Home
/about-guruji                              Overview
/about-guruji/guruji                       Guruji
/about-guruji/guruji/:section               biography · travel · guruji-writings
                                            (speeches → /audios, publications → /publications)
/about-guruji/anandavanam                  Anandavanam
/about-guruji/anandavanam/:place             gurujis-residence · yoga-ganapati-temple
                                             gurujis-library · yagasala
/about-guruji/saptadham-warangal           Saptadham
/about-guruji/:trust                       one of the four trusts
/about-guruji/:trust/objectives
/about-guruji/:trust/trustees

/activities                                Index
/activities/:trust                         that trust's programme
/activities/:trust/:activity               17 individual observances

/honors-awards                             Index
/honors-awards/:trust
/honors-awards/:trust/:honour              5 awards across 2 trusts

/objectives  /publications  /trusts        standalone
/photos  /videos  /audios  /live           media, flat as on the live site
/contact/:trust                            4 centres, each with its map
/feedback  /support                        forms
*                                          Not found
```

**Redirects kept for compatibility:** `/contact` → the principal trust;
`/contact/mahalaxshmi-temple-charitable-trust` (the live site's misspelling) →
the correct slug; `/media/*` → the flat media paths used by an earlier draft of
this project.

### Navigation and footer

The Trust's menu is **three levels deep** (About Guruji → Siva Ganga Sangeeta
Parishad → Trustees). Cascading flyouts for that are miserable to use, so
[`NavDropdown`](src/components/layout/NavDropdown.jsx) lays the third level out
flat instead: a panel of columns, each headed by its second-level page, with
children beneath. Everything is one movement and one Tab sequence away. The
mobile drawer nests native `<details>` elements, which gives the same depth with
the browser supplying the state and semantics.

The desktop bar switches on at **`xl` (1280px), not `lg`** — nine top-level
items plus the logo and the Donate button need that much room, and switching at
1024px pushed the page 256px wider than the viewport.

The footer follows the live site's arrangement: the two centres on maps
(Bheemunipatnam and Warangal, using the Trust's own embed URLs, lazy-loaded),
the About Guruji menu, Quick Links, and the YouTube call to action, over a
copyright bar.

**The rule that keeps this tidy:** `ui/` knows nothing about the Trust, `sections/`
knows nothing about routing, and `data/` knows nothing about React. A section can be
moved to a different page by moving one import.

---

## 2. Design tokens

This project uses **Tailwind CSS v4**, which is configured in CSS rather than in a
JavaScript file. The tokens live in the `@theme` block at the top of
[`src/styles/index.css`](src/styles/index.css), and Tailwind generates the matching
utilities from them:

| Token | Generated utilities |
|---|---|
| `--color-maroon-600` | `bg-maroon-600`, `text-maroon-600`, `border-maroon-600` … |
| `--font-display` | `font-display` |
| `--shadow-lift` | `shadow-lift` |
| `--ease-calm` | `ease-[var(--ease-calm)]` |

Because those utilities compile to `var(--color-…)` rather than to literal hex values,
**a token can be re-pointed at runtime** — which is exactly how high-contrast mode works
(see section 5).

### The palette

**Every colour on this site is sampled from the Trust's own logo.**

The mark is a banyan under a starry sky on sandy ground. Decoding the PNG and
counting pixels inside the medallion gives the anchors. These were first taken
from the 139px copy, then **re-sampled against the 1020px original** — which
confirmed the brand indigo to within one unit (`#3748a6` → `#3748a5`) and
corrected the ground and canopy, which the small copy had read too dark:

| Sampled | Hex | Share | Becomes |
|---|---|---|---|
| Night sky | `#3748A5` | 11.9% | `indigo-600` — the brand |
| Horizon band | `#99CCE9` | — | `sky-300` |
| Glow around the canopy | `#C7F2F9` | 4.2% | `sky-200` |
| Canopy, mid-tone | `#2E672D` | 3.2% | `banyan-600` |
| Canopy, lit edge | `#50A447` | 1.7% | `banyan-400` |
| Sunlit ground | `#986E35` | — | `ochre-500` |
| Ground, lit edge | `#C9964B` | — | `ochre-400` |

(The most common colour of all is `#010100` at 19.6% — the heavy black linework
of the illustration. That is a drawing style, not a palette colour, so no token
is derived from it.)

`scripts/` has no colour-picking step — the sampling was a one-off, and the
anchors are recorded as comments in the `@theme` block so the derivation is not
lost.

| Role | Ramp | Notes |
|---|---|---|
| Brand | `indigo-*` | Night sky. Headings, primary buttons, links, focus ring |
| Dark grounds | `indigo-800/900/950` | Hero, footer, CTA band |
| Secondary accent | `banyan-*` | Canopy green. Card icons, honours |
| Warm accent | `ochre-*` | Ground. Eyebrows, ornament, donation actions |
| On-dark highlight | `sky-*`, `ochre-300/400` | Light enough to sit on indigo |
| Page surfaces | `sand-50/100` | Warm off-white, not sterile white |
| Text | `ink-400…950` | Warm charcoal |
| Borders | `line` | Semantic alias, so contrast mode can darken borders alone |

One split matters and is easy to undo by accident: **`sand-200` is only ever
used for light content on dark grounds** (footer text, hero copy), and **`line`
is only ever used for borders on light surfaces.** Keeping those roles separate
is what lets high-contrast mode darken every border without turning the footer
text unreadable.

### The mark

`public/brand/` holds the Trust's own artwork — a banyan under a starry sky,
the tree of Sanatana Dharma, whose aerial roots descend, take hold and become
trunks in their own right, so the tree has no single origin and no end.

An earlier version of this project rebuilt the composition as SVG, because the
only copy available was the **139×139 `tree.png`** the live site still serves —
soft above about 70px. With the **1020×1020 original** in hand there is no
reason to approximate it: the real drawing has linework and detail no
reasonable amount of vector work would match.

| File | Size | Used for |
|---|---|---|
| `brand/banyan-256.png` | 23 kB | Navbar (60px) and footer (80px), up to 3× density |
| `brand/banyan-512.png` | 59 kB | Anywhere the mark is shown large |
| `brand/apple-touch-icon.png` | 14 kB | iOS home screen |
| `brand/favicon-32.png` | 2 kB | Browser tab |

[`BanyanMark`](src/components/layout/BanyanMark.jsx) serves the two UI sizes
through `srcset`, so the navbar fetches 23 kB rather than 59 kB.

The untouched master lives at `brand/banyan-1020-master.png`, **outside
`public/`** so it is never deployed — 1 MB has no business in a page load. Keep
it for print and for regenerating the derived sizes.

#### Optimising them

`sips` re-encodes this artwork as 24-bit truecolour, which is wasteful for flat
illustration: the 256px mark came out at 117 kB.
[`scripts/optimise-png.mjs`](scripts/optimise-png.mjs) median-cuts it to an
indexed palette and re-deflates — no native dependency, since `pngquant` and
friends were not available:

```bash
# regenerate the derived sizes, then shrink them
sips -Z 512 brand/banyan-1020-master.png --out public/brand/banyan-512.png
node scripts/optimise-png.mjs public/brand/banyan-512.png --colors 256
#   public/brand/banyan-512.png   378 KB → 59 KB  (−84%, 256 colours)
```

The whole brand folder is **104 kB**, down from 1.6 MB. Quantising a smooth
gradient to 256 colours does band the sky very slightly when the mark is blown
up past ~400px; at the sizes the UI uses it is invisible, and the master is
there if a truecolour copy is ever needed.

### Typography

- **Headings:** Fraunces (variable serif) — `font-display`
- **Body:** Plus Jakarta Sans (variable sans) — the default on `<body>`

Both are self-hosted through `@fontsource-variable`, so there is no render-blocking
request to a third-party origin and no FOUT from a stylesheet on another domain.

### If you are on Tailwind v3

v3 has no `@theme`, so the same tokens go in `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        indigo: { 50:'#EEF1FA', 100:'#DDE3F5', 200:'#BCC6EA', 300:'#8F9FD8', 400:'#6274C2',
                  500:'#4354AC', 600:'#3748A6', 700:'#2A3780', 800:'#1E2A66', 900:'#141E4C', 950:'#0D1330' },
        sky:    { 200:'#C7E4F4', 300:'#9ACFEB', 400:'#6FB6DC' },
        banyan: { 50:'#EEF5EC', 100:'#D8E9D4', 200:'#B2D3AA', 300:'#7FB374', 400:'#4A8C3E',
                  500:'#3A7233', 600:'#2F602C', 700:'#245022', 800:'#1C4519', 900:'#153014' },
        ochre:  { 50:'#FBF4E8', 100:'#F5E7CE', 200:'#EBD2A3', 300:'#DDB76F', 400:'#C9964B',
                  500:'#AC7B33', 600:'#8A6128', 700:'#6E4D20', 800:'#573C19' },
        sand:   { 50:'#FBF8F2', 100:'#F5F0E4', 200:'#EBE3D2', 300:'#DACEB4' },
        ink:    { 400:'#A9A294', 500:'#847C6E', 600:'#635B50', 700:'#423B33',
                  800:'#2B251F', 900:'#1C1811', 950:'#12100C' },
        line:   '#DACEB4',
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Fraunces Variable"', '"Iowan Old Style"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgb(66 59 51 / 0.04), 0 8px 24px -12px rgb(66 59 51 / 0.12)',
        lift: '0 2px 4px rgb(66 59 51 / 0.05), 0 18px 40px -16px rgb(66 59 51 / 0.22)',
      },
      borderRadius: { card: '1rem' },
      transitionTimingFunction: { calm: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    },
  },
};
```

Note that v3 compiles colours to literal hex values, so the runtime
high-contrast switch will **not** work as written — on v3 you would need to
declare the palette as CSS variables and reference them from the config.

---

## 3. Motion

All variants live in [`src/lib/motion.js`](src/lib/motion.js), so the site's unhurried
character is one decision rather than one per component. `EASE_CALM` is a long
ease-out; nothing here should feel snappy.

Reduced motion is handled in **two** places, and both are necessary:

- **CSS** neutralises transitions and `scroll-behavior` under
  `@media (prefers-reduced-motion: reduce)`.
- **JavaScript** (`usePrefersReducedMotion`) gates Framer Motion, which animates inline
  styles that CSS cannot reach. Components skip the animation entirely rather than
  shortening it — content appears immediately, which is what the preference asks for.

---

## 4. Content

Every string a visitor reads comes from `src/data/*.json`. Nothing is hard-coded in a
component, so the files can be handed to a headless CMS later with no component
changes — the shapes below are the contract.

### `quotes.json` → Quote of the Day
```jsonc
{
  "id": "q-bhakthi-coal-gold",      // stable key, also the animation key
  "text": "Bhakthi can convert…",
  "attribution": "Satguru Sri Sivananda Murty",  // null hides the caption
  "source": "sdctbheemili.org",     // optional provenance, shown after the name
  "language": "en",
  "verified": true                  // false → flagged by the dev content audit
}
```
The quote shown on load is **derived from the calendar date**, not picked at random, so
every visitor sees the same quote on a given day and a refresh does not shuffle it.

### `events.json`
```jsonc
{
  "id": "evt-krishna-jayanthi-2026",
  "title": "Sri Krishna Jayanthi Celebrations 2026",
  "startDate": "2026-09-04",        // ISO; parsed as local midnight
  "endDate": "2026-09-04",          // same as start for a one-day event
  "venue": "Tivoli Garden, Secunderabad",
  "category": "festival",           // festival | music | observance
  "summary": "…",
  "image": "/images/events/krishna-jayanthi.jpg",
  "registrationUrl": null,
  "featured": true
}
```
Events sort themselves into upcoming and past against today's date — no manual pruning.

### `announcements.json`
```jsonc
{
  "id": "ann-live-stream",
  "kind": "live",                   // "live" adds the pulsing LIVE pill
  "text": "…",
  "href": "https://…",              // internal paths also work
  "linkLabel": "Watch live",
  "publishedAt": "2026-08-28",
  "expiresAt": "2026-09-05"         // expired notices disappear on their own
}
```

### `objectives.json`
`icon` maps to the explicit icon table in `ObjectivesGrid.jsx`; `accent` is one of
`maroon` / `saffron` / `gold`. Adding a new icon means adding one import there —
deliberately, so the bundler can tree-shake the ~1,500 icons nobody uses.

### Also: `site.json` (identity, contact, associated trusts), `navigation.json`, `publications.json`.

---

## 5. Accessibility

- **Semantic landmarks** — `header` / `nav` / `main` / `footer`, each `<section>` named
  via `aria-labelledby` pointing at its real heading.
- **Heading order** — exactly one `<h1>` per page, no skipped levels. Enforced by
  `npm run check:a11y`.
- **Skip link** — first Tab on any page reveals it; `<main tabIndex={-1}>` gives it
  somewhere to land.
- **Mobile drawer** — `role="dialog"` + `aria-modal`, focus trapped while open, Escape
  closes, focus returns to the trigger, background scroll locked without layout shift.
- **Focus visibility** — one ring, defined once on `:focus-visible`. Cards with a
  stretched link wear the ring on the card's behalf, so the indicator is never lost.
- **Carousel** — auto-advance pauses on hover *and* on keyboard focus, and is disabled
  entirely under reduced motion (WCAG 2.2.2). Dots are real buttons.
- **Route changes** — `usePageTitle` updates `document.title` per route, so SPA
  navigation is announced and browser history is legible.
- **High-contrast mode** — the toggle in the navbar sets `data-contrast="high"` on
  `<html>`, re-pointing the tokens. It defaults to the OS `prefers-contrast` setting and
  is remembered. Because it operates on tokens, **no component knows it exists**.

## Two things not to undo

Both were found by driving the real page in a browser, and both look like
harmless tidying if you meet them cold.

**The mobile drawer is rendered through a portal into `<body>`.** The header
carries `backdrop-blur`, and `backdrop-filter` — like `transform` and `filter` —
establishes a containing block for `position: fixed` descendants. Left inside
`<header>`, the drawer sized itself to the 80px header instead of the viewport:
the panel collapsed to its own title bar and the nav links vanished. The portal
also lifts the overlay clear of every stacking context on the page.

**`cn()` runs class strings through `tailwind-merge`.** Tailwind's cascade is
decided by the order utilities appear in the generated stylesheet, not by their
order in the `class` attribute. `Button`'s base styles include `inline-flex`,
which silently beat the `hidden sm:inline-flex` passed by the caller — so the
Donate button stayed visible at 390px, crowding the logo into three wrapped
lines. `twMerge` drops the losing utility so caller intent wins.

---

## Verification

`npm run check` runs two audits over the real rendered HTML of all eight pages:

- **`check:contrast`** parses the token block and computes WCAG ratios for 20 colour
  pairs in both contrast modes. All pass AA (4.5:1 for text, 3:1 for UI indicators).
  This caught the original `saffron-600` at 4.35:1; it is now `#b2500f` at 5.02:1.
- **`check:a11y`** renders every page and asserts: one `<h1>`, no skipped heading
  levels, `alt` on every image, an accessible name on every button, a `<label for>` for
  every form control, and `rel="noopener"` on every `target="_blank"`.

- **`check:links`** starts from `/`, follows every internal link in a real
  browser, and asserts that each of the 62 navigation and footer destinations
  renders something other than the 404 view. This is what catches a menu entry
  pointing at a route that was never wired up — neither the build nor the a11y
  audit can see that. It also fails on any console or network error, which is
  how the broken Warangal map embed was found.

All three are plain Node scripts with no test-runner dependency, and all exit
non-zero on failure, so they drop straight into CI. `check:links` skips itself
with a message if Playwright's Chromium is not installed.

---

## 6. Performance

| Chunk | gzip |
|---|---|
| `react` (react, react-dom, router) | 82.9 kB |
| `motion` (framer-motion) | 42.3 kB |
| `index` (app shell + Home) | 15.7 kB |
| CSS | 11.3 kB |

- **Home is eager, every other route is code-split** — a first-time visitor downloads
  the homepage and nothing else.
- **Fonts are self-hosted and subsetted** by `unicode-range`; only the latin subset is
  fetched for English content.
- **No layout shift** — every image sits in an `aspect-ratio` box, and the hero's
  background is CSS underneath the photograph, so the section is fully designed before
  any image arrives and still looks finished if one never does.
- **Framer Motion is the largest non-React dependency.** If the budget matters more
  than the animation, `Reveal` and `SectionHeading` could move to a CSS
  `IntersectionObserver` and drop all 42 kB.

---

## 7. Content provenance

Everything in `src/data/` was checked against sdctbheemili.org. `npm run dev`
prints an audit to the console listing whatever is still outstanding.

**Verified from the live site**

| Data | Source |
|---|---|
| Postal address, registered office | `/contact/sanathana-dharma-charitable-trust/` |
| The seven objectives | `/about-guruji/sanathana-dharma-charitable-trust/objectives/` |
| All eleven trustees, registration date (10 Feb 2000) | `/about-guruji/.../trustees/` |
| Guruji's birth details, 2005 doctorate, family | `/about-guruji/guruji/biography/` |
| Seven publications with years and publishers | `/about-guruji/guruji/publications/` |
| Anandavanam, Yoga Ganapati temple, Saptadham (consecrated 12 Feb 2010) | `/about-guruji/anandavanam/`, `/about-guruji/saptadham-warangal/` |
| The four trusts, Gurudham (1990) | `/about-guruji/sivanandaguru-cultural-trust/` and siblings |
| Five honours across two trusts | `/honors-awards/` |
| Event names per trust | `/activities/` |
| Krishna Jayanthi 2026 — 4 September, Tivoli Garden | homepage |

**Still needed from the Trust**

- **Public email and telephone.** The live site publishes neither, so
  `site.contact.email` and `.phone` are `null` and those rows simply do not
  render. Add them to `site.json` and they reappear.
- **Event dates** other than Krishna Jayanthi 2026. Five events carry real
  names and venues but scaffolded dates, flagged `"__placeholder": "dates"`.
- **Quotes 2 and 3.** Only *"Bhakthi can convert coal into gold…"* is sourced.
  The others are blank placeholders **on purpose** — attributing invented words
  to Guruji on the Trust's own site would be a misrepresentation. They carry no
  attribution, and `QuoteOfTheDay` filters anything with `verified: false` out
  of production builds, so they are visible in dev only.
- **Media archives.** Photos, Videos and Audios are grouped by centre
  (Bheemunipatnam / Warangal) exactly as the live site groups them, but the
  site exposes no machine-readable index. Each group renders an honest empty
  state pointing at the YouTube channel; fill `media.json` and the grids
  populate with no code change.
- **Trustee telephone numbers.** The live site publishes personal mobile
  numbers for two trustees. Those are deliberately omitted here — add them only
  if the Trust wants them republished.
- **Donation details.** Bank particulars need the Trust's own verified
  information, so the Support page directs visitors to Contact.
- **The contact form** is not wired to an endpoint. It says so on submit rather
  than silently discarding a message.

**Images** — `public/images/` now carries the Trust's own photographs, taken
from sdctbheemili.org and re-encoded for the web (1.6 MB total):

| File | Source on the live site | Used by |
|---|---|---|
| `hero-temple.jpg` | `new-footer-bg.png` | Hero background, behind the night sky |
| `guruji.jpg` | `swamiji.jpg` | Guruji's portrait |
| `page-banner.jpg` | `inner-banner-new-2026.jpg` | Interior page mastheads |
| `events/krishna-jayanthi.jpg` | `sri-krishna-jayanthi-celebrations-2026.jpg` | Event card |
| `events/guru-poornima.jpg` | `Guru-Purnima.jpg` | Event card |
| `events/sangeetotsavam.jpg` | `slide3-1.jpg` | Event card |
| `events/vaggeyakara.jpg` | `DSC_0427_updated.jpg` | Event card |
| `og-cover.jpg` | `slide3-1.jpg` | Social preview |

Still to come from the Trust: `events/sivaratri.jpg`,
`events/vasantha-navaratrulu.jpg`, `publications/*.jpg` (3:4 covers) and
`anandavanam/*.jpg`. Every `<img>` hides itself on error, so a missing file
shows the designed fallback rather than a broken-image glyph.

---

## 8. Deployment

Live at **https://murarishettybhanu.github.io/sanathana_dharma/**, published by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to
`main`. The contrast and accessibility audits run as gates, so a regression
fails the build rather than reaching the site.

Three things a Pages deployment of this app needs, all of them easy to miss:

**A base path.** Project sites are served from `/<repo>/`, not the domain root.
The workflow passes `VITE_BASE="/${GITHUB_REPOSITORY#*/}/"` so the base always
matches the repository name, and `BrowserRouter` takes `basename` from
`import.meta.env.BASE_URL`. A plain `npm run build` still produces a
root-relative site, so `npm run preview` is unaffected.

**Base-aware asset paths.** Vite rewrites asset URLs it can see in markup and
CSS, but not strings that live in JSON or are assembled at runtime — and most
of this site's images come from `src/data/*.json`. Those paths stay
root-relative in the data, which is the honest way to describe them, and
[`asset()`](src/lib/asset.js) applies the base at the point of use. Every
`<img src>` and `background-image` goes through it.

**An SPA fallback.** GitHub Pages has no rewrite rules: `/activities/…` is a
real 404 to the server. The build copies `index.html` to `404.html`, which
boots the router and resolves the route on the client. Deep links therefore
return a 404 *status* while rendering the correct page — `curl` reports 404 and
the browser shows the right thing, so verify these in a browser, not with a
status check. `.nojekyll` stops Pages stripping underscore-prefixed files.

To deploy elsewhere, drop `VITE_BASE` and point the host's SPA rewrite at
`/index.html`.

```bash
npm run build:pages   # build exactly as CI does, with the Pages base
```
