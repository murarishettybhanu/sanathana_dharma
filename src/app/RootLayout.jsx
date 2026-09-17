import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { SkipLink } from '@/components/ui/SkipLink';
import { PageLoader } from '@/components/ui/PageLoader';

/**
 * The persistent chrome. Only <main> swaps between routes, so the header keeps
 * its scroll state and the fonts are never re-evaluated on navigation.
 */
export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <AnnouncementBar />
      <Navbar />

      {/* tabIndex -1 gives the skip link somewhere to actually land. */}
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Only the content area suspends while a code-split route loads —
            the header, announcement bar and footer stay mounted. */}
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
