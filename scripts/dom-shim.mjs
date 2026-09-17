/**
 * Minimal browser globals for rendering the app in Node.
 *
 * Just enough surface for Framer Motion's resize/scroll listeners and for
 * useContrastMode, which reads localStorage inside its state initialiser and
 * therefore runs during render rather than in an effect.
 */
const inertTarget = {
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent: () => true,
};

globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

globalThis.window = {
  ...inertTarget,
  innerWidth: 1280,
  innerHeight: 900,
  scrollY: 0,
  scrollTo() {},
  matchMedia: () => ({
    matches: false,
    ...inertTarget,
    addListener() {},
    removeListener() {},
  }),
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  requestAnimationFrame: (cb) => setTimeout(cb, 0),
  cancelAnimationFrame: () => {},
};

globalThis.matchMedia = globalThis.window.matchMedia;
globalThis.requestAnimationFrame = globalThis.window.requestAnimationFrame;
globalThis.cancelAnimationFrame = globalThis.window.cancelAnimationFrame;

globalThis.document = {
  ...inertTarget,
  documentElement: { dataset: {}, clientWidth: 1280, style: {} },
  body: { style: {} },
  createElement: () => ({ style: {}, ...inertTarget }),
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
};
