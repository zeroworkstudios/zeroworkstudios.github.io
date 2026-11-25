// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import rehypeDocs from './src/lib/rehype-docs.mjs';
import comboTheme from './src/packages/combo-counter/shiki-theme.mjs';

// https://astro.build/config
// One site for the whole studio: the about page at /, package docs at /docs/.
export default defineConfig({
  site: 'https://zeroworkstudios.github.io',
  trailingSlash: 'ignore',
  // /about/ (the old about repo) redirects from src/pages/about.astro, which keeps the #anchor.
  redirects: {
    // The Combo Counter Setup window links to /docs/combocounter (Setup.DOCS_URL).
    '/docs/combocounter': '/docs/combo-counter/',
  },
  build: {
    // Small pages: inline the CSS so the first paint needs no extra request.
    inlineStylesheets: 'always',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  markdown: {
    // remark/rehype pipeline, so src/lib/rehype-docs.mjs can shape each package's docs.
    processor: unified({ rehypePlugins: [rehypeDocs] }),
    shikiConfig: {
      theme: comboTheme,
      wrap: false,
    },
  },
  vite: {
    // Tailwind only runs on the about page's stylesheet (src/styles/about.css), for Hank's ID card.
    plugins: [tailwindcss()],
    server: { allowedHosts: true },
  },
});
