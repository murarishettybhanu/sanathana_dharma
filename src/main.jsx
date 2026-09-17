import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from '@/app/App';
import '@/styles/index.css';

// Flags any scaffolding content that has not yet been replaced. Dev only —
// the import is statically eliminated from the production build.
if (import.meta.env.DEV) {
  import('@/lib/contentAudit').then((m) => m.auditContent());
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* basename keeps every route relative to the deployment sub-path, so the
        same build works at the domain root and under /sanathana_dharma/. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
