/**
 * Shared Framer Motion variants.
 *
 * Centralising these keeps motion consistent across the site and makes the
 * "calm, unhurried" character of the brand a single-file decision rather than
 * something re-invented in every component.
 */

/** Long, soft easing — nothing on this site should feel snappy or urgent. */
export const EASE_CALM = [0.22, 1, 0.36, 1];

/** Rise-and-fade, the default entrance for headings, copy and images. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_CALM },
  },
};

/** Plain fade, for elements where vertical movement would feel fussy. */
export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_CALM } },
};

/**
 * Parent container that releases its children one after another.
 * @param {number} stagger seconds between each child
 * @param {number} delay   seconds before the first child
 */
export const staggerContainer = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/**
 * Defaults for scroll-triggered sections: animate once, and trigger on the
 * first intersecting pixel.
 *
 * `amount` is deliberately 'some' rather than a fraction. Anything animated
 * from `opacity: 0` is invisible until its observer fires, so the trigger
 * should be as eager as possible — a stricter threshold buys a little polish
 * at the cost of a window where fast scrolling can leave body copy blank.
 */
export const viewportOnce = { once: true, amount: 'some' };
