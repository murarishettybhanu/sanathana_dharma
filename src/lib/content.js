import trusts from '@/data/trusts.json';
import guruji from '@/data/guruji.json';
import anandavanam from '@/data/anandavanam.json';

/** Look up a trust by its URL slug. Returns undefined for an unknown slug. */
export function getTrust(id) {
  return trusts.find((t) => t.id === id);
}

/** Trusts that actually publish activities, for the Activities index. */
export const trustsWithActivities = trusts.filter((t) => t.activities?.length);

/** Trusts that confer honours, for the Honours index. */
export const trustsWithHonours = trusts.filter((t) => t.honours?.length);

export function getActivity(trustId, slug) {
  return getTrust(trustId)?.activities?.find((a) => a.slug === slug);
}

export function getHonour(trustId, slug) {
  return getTrust(trustId)?.honours?.find((h) => h.slug === slug);
}

export function getGurujiSection(slug) {
  return guruji.sections.find((s) => s.slug === slug);
}

export function getAnandavanamPlace(slug) {
  return anandavanam.places.find((p) => p.id === slug);
}

export { trusts, guruji, anandavanam };
