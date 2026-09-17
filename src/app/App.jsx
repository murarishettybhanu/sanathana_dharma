import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { RootLayout } from './RootLayout';
import { ScrollToTop } from './ScrollToTop';
import Home from '@/pages/Home';

/**
 * Home is imported eagerly — it is the landing page and must paint fast.
 * Every other route is code-split, so a first-time visitor downloads the
 * homepage and nothing else.
 *
 * The URL structure deliberately mirrors the Trust's existing site, slug for
 * slug, so existing links and search results keep working.
 */
const AboutGuruji = lazy(() => import('@/pages/AboutGuruji'));
const GurujiIndex = lazy(() => import('@/pages/GurujiIndex'));
const GurujiSection = lazy(() => import('@/pages/GurujiSection'));
const Anandavanam = lazy(() => import('@/pages/Anandavanam'));
const AnandavanamPlace = lazy(() => import('@/pages/AnandavanamPlace'));
const Saptadham = lazy(() => import('@/pages/Saptadham'));
const TrustAbout = lazy(() => import('@/pages/TrustAbout'));
const TrustObjectives = lazy(() => import('@/pages/TrustObjectives'));
const TrustTrustees = lazy(() => import('@/pages/TrustTrustees'));

const ActivitiesIndex = lazy(() => import('@/pages/ActivitiesIndex'));
const TrustActivities = lazy(() => import('@/pages/TrustActivities'));
const ActivityDetail = lazy(() => import('@/pages/ActivityDetail'));

const HonoursIndex = lazy(() => import('@/pages/HonoursIndex'));
const TrustHonours = lazy(() => import('@/pages/TrustHonours'));
const HonourDetail = lazy(() => import('@/pages/HonourDetail'));

const Objectives = lazy(() => import('@/pages/Objectives'));
const Publications = lazy(() => import('@/pages/Publications'));
const Trusts = lazy(() => import('@/pages/Trusts'));

const Photos = lazy(() => import('@/pages/Photos'));
const Videos = lazy(() => import('@/pages/Videos'));
const Audios = lazy(() => import('@/pages/Audios'));
const Live = lazy(() => import('@/pages/Live'));

const ContactTrust = lazy(() => import('@/pages/ContactTrust'));
const Feedback = lazy(() => import('@/pages/Feedback'));
const Support = lazy(() => import('@/pages/Support'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/** The principal trust, used wherever a bare path needs a default. */
const PRINCIPAL = 'sanathana-dharma-charitable-trust';

export function App() {
  return (
    <>
      <ScrollToTop />
      {/* The Suspense boundary for these lazy routes lives inside RootLayout,
          around <Outlet />. Placing it here instead would put the header and
          footer inside the boundary, so every navigation to a split route
          would unmount the whole chrome and flash a full-page spinner. */}
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />

          {/* ---------------- About Guruji ---------------- */}
          <Route path="about-guruji">
            <Route index element={<AboutGuruji />} />

            <Route path="guruji">
              <Route index element={<GurujiIndex />} />
              <Route path=":sectionSlug" element={<GurujiSection />} />
            </Route>

            <Route path="anandavanam">
              <Route index element={<Anandavanam />} />
              <Route path=":placeSlug" element={<AnandavanamPlace />} />
            </Route>

            <Route path="saptadham-warangal" element={<Saptadham />} />

            {/* One parameterised branch serves all four trusts. */}
            <Route path=":trustId">
              <Route index element={<TrustAbout />} />
              <Route path="objectives" element={<TrustObjectives />} />
              <Route path="trustees" element={<TrustTrustees />} />
            </Route>
          </Route>

          {/* ---------------- Activities ---------------- */}
          <Route path="activities">
            <Route index element={<ActivitiesIndex />} />
            <Route path=":trustId">
              <Route index element={<TrustActivities />} />
              <Route path=":activitySlug" element={<ActivityDetail />} />
            </Route>
          </Route>

          {/* ---------------- Honors & Awards ---------------- */}
          <Route path="honors-awards">
            <Route index element={<HonoursIndex />} />
            <Route path=":trustId">
              <Route index element={<TrustHonours />} />
              <Route path=":honourSlug" element={<HonourDetail />} />
            </Route>
          </Route>

          {/* ---------------- Standalone ---------------- */}
          <Route path="objectives" element={<Objectives />} />
          <Route path="publications" element={<Publications />} />
          <Route path="trusts" element={<Trusts />} />

          {/* ---------------- Media (flat, as on the live site) ------------ */}
          <Route path="photos" element={<Photos />} />
          <Route path="videos" element={<Videos />} />
          <Route path="audios" element={<Audios />} />
          <Route path="live" element={<Live />} />
          {/* The earlier draft nested these under /media; keep those working. */}
          <Route path="media">
            <Route index element={<Navigate to="/photos" replace />} />
            <Route path="photos" element={<Navigate to="/photos" replace />} />
            <Route path="videos" element={<Navigate to="/videos" replace />} />
            <Route path="audios" element={<Navigate to="/audios" replace />} />
            <Route path="live" element={<Navigate to="/live" replace />} />
          </Route>

          {/* ---------------- Contacts ---------------- */}
          <Route path="contact">
            <Route index element={<Navigate to={`/contact/${PRINCIPAL}`} replace />} />
            {/* The live site misspells this one slug; honour it so old links work. */}
            <Route
              path="mahalaxshmi-temple-charitable-trust"
              element={<Navigate to="/contact/mahalakshmi-temple-charitable-trust" replace />}
            />
            <Route path=":trustId" element={<ContactTrust />} />
          </Route>

          <Route path="feedback" element={<Feedback />} />
          <Route path="support" element={<Support />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
