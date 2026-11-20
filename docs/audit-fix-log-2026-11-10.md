# Audit fix log — 10 November 2026

Local implementation only; nothing was published or deployed.

## Completed in this pass

- Rebuilt FAQ disclosures as real buttons with `aria-expanded`, controlled regions, visible focus, aligned service/process answers, unique metadata, canonical URL, Twitter summary metadata, FAQPage JSON-LD, and sitemap inclusion.
- Added an application 404 page. Vercel now rewrites only known SPA routes so unknown direct requests can return a platform 404 instead of an index-page `200`.
- Added a permanent Vercel redirect from `/terms` to `/terms-and-conditions`; the client route also replaces history as a local fallback.
- Split public and CRM routes into lazy chunks, deferred chatbot loading until browser idle, and moved Firebase Auth behind the internal CRM route boundary.
- Made the mobile navigation drawer inert while closed, focus the close control when opened, trap keyboard focus, close on Escape, and return focus to the menu button.
- Removed unsupported client/project statistics and the dead case-study link; replaced aggressive or vague “monolith” language with problem-, process-, and outcome-focused copy.
- Retained user-requested live portfolio previews as lazy-loaded, non-interactive iframes with explicit outbound links.
- Changed unidentified logo-strip image alternatives to decorative empty alternatives rather than announcing meaningless “Client logo 1” labels.
- Added component tests for FAQ semantics and mobile-menu keyboard behavior.

## Verification

- `npm run lint`: pass.
- `npm test`: pass, 8/8 tests.
- `npm run build`: pass.
- Build now emits route-level chunks. The shared application entry is approximately 188 kB (59.7 kB gzip); chatbot is a separate 17.9 kB chunk and Firebase is isolated in a separate chunk used by relevant routes.
- `git diff --check`: pass.
- Browser screenshot QA was attempted, but the browser-access host was unavailable. The local server was stopped after the failed visual-QA attempt.

## Still pending

- Approved 1200×630 Open Graph/Twitter share artwork and live social-preview validation.
- Static prerendering or server rendering if live crawler tests show client-rendered metadata is insufficient.
- Permissioned, evidence-rich case studies and verified client-logo permissions/names.
- Differentiated service landing pages based on buyer research, service priority, and approved proof.
- Live accessibility testing with keyboard, screen reader, zoom, reduced motion, and mobile devices.
- Lighthouse/field performance measurement, the cost of live portfolio previews, and further optimization of large logo assets.
- Legal/privacy-owner review of processors, retention, entity details, and actual production configuration.

When adding a new public SPA route, add its exact Vercel rewrite and sitemap entry at the same time; otherwise a direct request will correctly remain a 404.
