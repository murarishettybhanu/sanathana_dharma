import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router';

import { RootLayout } from '@/app/RootLayout';
import Home from '@/pages/Home';
import AboutGuruji from '@/pages/AboutGuruji';
import GurujiIndex from '@/pages/GurujiIndex';
import GurujiSection from '@/pages/GurujiSection';
import Anandavanam from '@/pages/Anandavanam';
import AnandavanamPlace from '@/pages/AnandavanamPlace';
import Saptadham from '@/pages/Saptadham';
import TrustAbout from '@/pages/TrustAbout';
import TrustObjectives from '@/pages/TrustObjectives';
import TrustTrustees from '@/pages/TrustTrustees';
import ActivitiesIndex from '@/pages/ActivitiesIndex';
import TrustActivities from '@/pages/TrustActivities';
import ActivityDetail from '@/pages/ActivityDetail';
import HonoursIndex from '@/pages/HonoursIndex';
import TrustHonours from '@/pages/TrustHonours';
import HonourDetail from '@/pages/HonourDetail';
import Objectives from '@/pages/Objectives';
import Publications from '@/pages/Publications';
import Trusts from '@/pages/Trusts';
import Photos from '@/pages/Photos';
import Videos from '@/pages/Videos';
import Audios from '@/pages/Audios';
import Live from '@/pages/Live';
import ContactTrust from '@/pages/ContactTrust';
import Feedback from '@/pages/Feedback';
import Support from '@/pages/Support';
import NotFound from '@/pages/NotFound';

/**
 * Pages are imported eagerly here (not via React.lazy) so renderToString can
 * walk the whole tree instead of stopping at a Suspense boundary.
 *
 * The route patterns mirror App.jsx so `useParams` resolves exactly as it does
 * in the real app — an audit that rendered these components bare would miss
 * every parameterised page.
 */
const PAGES = {
  Home: ['/', '/', Home],
  AboutGuruji: ['/about-guruji', '/about-guruji', AboutGuruji],
  GurujiIndex: ['/about-guruji/guruji', '/about-guruji/guruji', GurujiIndex],
  GurujiBiography: ['/about-guruji/guruji/:sectionSlug', '/about-guruji/guruji/biography', GurujiSection],
  GurujiTravel: ['/about-guruji/guruji/:sectionSlug', '/about-guruji/guruji/travel', GurujiSection],
  GurujiWritings: ['/about-guruji/guruji/:sectionSlug', '/about-guruji/guruji/guruji-writings', GurujiSection],
  Anandavanam: ['/about-guruji/anandavanam', '/about-guruji/anandavanam', Anandavanam],
  AnandavanamPlace: ['/about-guruji/anandavanam/:placeSlug', '/about-guruji/anandavanam/yoga-ganapati-temple', AnandavanamPlace],
  Saptadham: ['/about-guruji/saptadham-warangal', '/about-guruji/saptadham-warangal', Saptadham],
  TrustAbout: ['/about-guruji/:trustId', '/about-guruji/siva-ganga-sangeeta-parishad', TrustAbout],
  TrustObjectives: ['/about-guruji/:trustId/objectives', '/about-guruji/sanathana-dharma-charitable-trust/objectives', TrustObjectives],
  TrustTrustees: ['/about-guruji/:trustId/trustees', '/about-guruji/sanathana-dharma-charitable-trust/trustees', TrustTrustees],
  TrusteesEmpty: ['/about-guruji/:trustId/trustees', '/about-guruji/siva-ganga-sangeeta-parishad/trustees', TrustTrustees],
  ActivitiesIndex: ['/activities', '/activities', ActivitiesIndex],
  TrustActivities: ['/activities/:trustId', '/activities/sanathana-dharma-charitable-trust', TrustActivities],
  ActivityDetail: ['/activities/:trustId/:activitySlug', '/activities/sanathana-dharma-charitable-trust/sivananda-eminent-citizen-awards', ActivityDetail],
  ActivityNeedsContent: ['/activities/:trustId/:activitySlug', '/activities/sanathana-dharma-charitable-trust/july-11th', ActivityDetail],
  HonoursIndex: ['/honors-awards', '/honors-awards', HonoursIndex],
  TrustHonours: ['/honors-awards/:trustId', '/honors-awards/siva-ganga-sangeeta-parishad', TrustHonours],
  HonourDetail: ['/honors-awards/:trustId/:honourSlug', '/honors-awards/siva-ganga-sangeeta-parishad/natya-vidya-nidhi', HonourDetail],
  HonourWithSections: ['/honors-awards/:trustId/:honourSlug', '/honors-awards/sanathana-dharma-charitable-trust/sri-krishna-jayanti-puraskaram', HonourDetail],
  Objectives: ['/objectives', '/objectives', Objectives],
  Publications: ['/publications', '/publications', Publications],
  Trusts: ['/trusts', '/trusts', Trusts],
  Photos: ['/photos', '/photos', Photos],
  Videos: ['/videos', '/videos', Videos],
  Audios: ['/audios', '/audios', Audios],
  Live: ['/live', '/live', Live],
  ContactTrust: ['/contact/:trustId', '/contact/sanathana-dharma-charitable-trust', ContactTrust],
  Feedback: ['/feedback', '/feedback', Feedback],
  Support: ['/support', '/support', Support],
  NotFound: ['*', '/nope', NotFound],
};

export function render(name) {
  const [pattern, url, Page] = PAGES[name];
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path={pattern} element={<Page />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

export const names = Object.keys(PAGES);
