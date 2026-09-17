import { defineConfig } from 'vite';
import { copyFileSync, writeFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

/**
 * GitHub Pages serves this project repo from a sub-path, so the build needs a
 * matching `base`. It is taken from an env var rather than hard-coded, so a
 * local `npm run build` still produces a root-relative site and `npm run
 * preview` works unchanged.
 */
const base = process.env.VITE_BASE ?? '/';

/**
 * GitHub Pages has no rewrite rules: a deep link like /activities/... is a
 * real 404 as far as the server is concerned. The convention is to serve the
 * SPA shell as 404.html, which boots the router and resolves the route on the
 * client. `.nojekyll` stops Pages stripping files that begin with an
 * underscore.
 */
function githubPagesFallback() {
  return {
    name: 'github-pages-fallback',
    apply: 'build',
    closeBundle() {
      copyFileSync('dist/index.html', 'dist/404.html');
      writeFileSync('dist/.nojekyll', '');
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), githubPagesFallback()],
  resolve: {
    // `@/...` keeps imports flat and refactor-safe.
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },
  build: {
    // Split the heaviest third-party code out of the entry chunk so the
    // first paint ships only what the hero actually needs.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // Match on the package directory so sub-paths such as
          // `react-dom/client` and `react/jsx-runtime` land here too.
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
            return 'react';
          }
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) {
            return 'motion';
          }
          return undefined;
        },
      },
    },
  },
});
