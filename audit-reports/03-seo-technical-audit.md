# SEO, Performance, Mobile, and Accessibility Audit

## Architecture and technical inventory

| Area | Confirmed implementation | Evidence |
|---|---|---|
| Framework | React 19.2.4 with Vite 8.0.4; client-side entry | `package.json:16-19`, `30`; `src/main.jsx:7-12` |
| Routing | React Router `BrowserRouter`, ten route patterns rendering nine page components; `/terms` aliases `/terms-and-conditions` | `src/routes/AppRoutes.jsx:1-29` |
| Rendering | Client-side SPA; no SSR, static route prerendering, or route-level dynamic imports found | `src/main.jsx:7-12`; `src/routes/AppRoutes.jsx:1-12` |
| Hosting | Vercel-oriented catch-all rewrite | `vercel.json:1-4` |
| Metadata | `react-helmet-async` for route metadata; generic fallback metadata in base HTML | `src/main.jsx:3`, `9-11`; `index.html:8-29` |
| Crawling | Permissive robots file and hand-authored XML sitemap | `public/robots.txt:1-4`; `public/sitemap.xml:1-27` |
| Assets | Public PNG brand assets, eager client-logo glob, CSS background from Unsplash | `src/pages/Home.jsx:14-19`; `src/styles/about.css:278-283` |
| Forms/integrations | WhatsApp contact; optional n8n chat/ticket/status/lead endpoints; Vercel OpenAI handler | `src/pages/Contact.jsx:15-38`; `src/lib/supportApi.js:1-12`; `api/generate-followup.js:1-111` |
| Analytics | None found in source, HTML, or dependencies | `package.json:12-20`; repository search |
| Environment | Four public `VITE_CB_*` endpoint placeholders; server-side `OPENAI_API_KEY` reference | `.env.example:1-12`; `api/generate-followup.js:3-5` |

## Technical SEO findings

| Severity | Status | Issue / affected area | Evidence | Impact | Recommendation | Complexity | Expected benefit |
|---|---|---|---|---|---|---|---|
| High | Confirmed | No dedicated indexable service pages | Only `/services` route at `src/routes/AppRoutes.jsx:21`; service cards are data in `src/pages/Services.jsx:15-82` | Cannot target distinct commercial intents or build deep internal relevance. | Publish unique, useful pages for validated service categories and link from home/services/cases. | High | Broader qualified organic visibility. |
| High | Confirmed | FAQ metadata is incomplete and route is missing from sitemap | `src/pages/FAQs.jsx:45-47`; no `/faqs` entry in `public/sitemap.xml:1-27` | Weak search snippet/share context and reduced discovery signals. | Add description, canonical, OG/Twitter data, and sitemap entry. | Low | Cleaner indexing and sharing. |
| High | Inferred risk | Deep pages initially return generic base metadata in a CSR app | Generic title/description/OG in `index.html:8-29`; route metadata runs client-side | Search engines that render JS may process it, but social/unfurl and less capable crawlers may see generic home tags. | Test production HTML, Google URL Inspection, Bing, LinkedIn/Post Inspector, and messaging previews. If inconsistent, statically prerender public routes. | Medium | Reliable titles, snippets, and social previews. |
| High | Confirmed | No not-found route/component | Routes end without `*` at `src/routes/AppRoutes.jsx:18-29` | Unknown URLs can render a blank shell with a platform-level 200, harming UX and soft-404 quality. | Add a useful 404 page and configure hosting to preserve correct HTTP status where possible. | Low–Medium | Better crawling and recovery. |
| Medium | Confirmed | Duplicate terms routes render the same component | `src/routes/AppRoutes.jsx:27-28` | `/terms` can be a duplicate URL; client canonical appears only after rendering. | 301 redirect `/terms` to `/terms-and-conditions`; retain one canonical URL. | Low | Consolidated signals. |
| Medium | Confirmed | No structured data | No `application/ld+json` in the repository | Missed entity/service/breadcrumb context. | Add `Organization`/`ProfessionalService` only with verified entity/contact data; add `BreadcrumbList`; add `FAQPage` only if visible FAQs comply with search policies. | Low–Medium | Better machine understanding; rich results not guaranteed. |
| Medium | Confirmed | Open Graph implementation lacks images and Twitter card tags | Helmet blocks, e.g. `src/pages/Home.jsx:86-104`; base tags `index.html:19-26` | Unattractive/inconsistent shares reduce referral click-through. | Create an approved 1200×630 brand image and route-specific images/copy; add `og:site_name`, image dimensions/alt, and Twitter card tags. | Low | Better social presentation. |
| Medium | Confirmed | Weak internal linking to commercial detail | Home cards are non-links (`src/pages/Home.jsx:187-197`); service “Learn More” goes to contact (`src/pages/Services.jsx:144-146`) | Limits discovery and user intent progression. | Link each summary to its substantive service page and relevant case/FAQ. | Low | Stronger crawl paths and buyer journeys. |
| Medium | Confirmed | Sitemap is manual and incomplete | `public/sitemap.xml:1-27` lacks FAQ and has no content-derived generation | Route additions can silently go missing. | Generate sitemap from an authoritative route/content manifest during build; include only canonical indexable pages. | Medium | Fewer coverage errors. |
| Low | Confirmed | Legacy meta keywords are used inconsistently | `index.html:14-17`; `src/pages/Home.jsx:92-95`; no equivalent on Portfolio | Major search engines do not use this as a ranking signal; maintenance adds noise. | Remove or ignore; invest in titles, copy, internal links, and structured data. | Low | Cleaner metadata governance. |
| Low | Confirmed | Manifest icon points to a missing file and manifest is not linked | `/favicon.ico` at `public/manifest.webmanifest:10`; only PNG favicon is present; no manifest link in `index.html` | Install/icon experience can fail; not a direct ranking issue. | Reference existing correctly sized icons and link the manifest if PWA behavior is intentional; otherwise remove dead configuration. | Low | Cleaner technical quality. |

### Titles and descriptions

- Core titles are unique but often brand-led/generic rather than intent-led. Recommended metadata appears in `08-content-rewrite-proposals.md`.
- Home, About, Services, Portfolio, Contact, Support, Privacy, and Terms have canonical URLs. FAQ does not (`src/pages/FAQs.jsx:45-47`).
- Legal pages have explicit metadata and one H1 each.
- No production validation was possible for duplicate tags created when Helmet overlays base tags; inspect rendered head in production.

### Heading and semantic structure

- Each page has one visible H1 in source. Core content generally proceeds to H2/H3.
- About statistics use H3 for numbers (`src/pages/About.jsx:148-156`), which is semantically weak; use data text within a list/description structure.
- Footer column labels use H3/H4 without being part of every page’s content hierarchy (`src/components/common/Footer.jsx:13-56`); acceptable visually, but landmarks and list labels are more important than heading rank here.
- FAQ items should be buttons inside headings rather than clickable generic containers (`src/pages/FAQs.jsx:58-75`).

### Image and iframe SEO

- Client logos receive generated labels such as “Client logo 1,” duplicated when the marquee list is doubled (`src/pages/Home.jsx:165-172`). This is not meaningful alternative text. Use verified organization names or `alt=""` for decorative repetition.
- Logo images have no HTML width/height attributes (`src/components/common/Navbar.jsx:22-24`, `110-112`), increasing layout-shift risk before CSS/image dimensions resolve.
- Portfolio iframes have titles but are hidden from accessibility and provide no indexable project narrative (`src/pages/Portfolio.jsx:171-178`). Replace with local responsive images and HTML case summaries.

### International SEO readiness

- Page language is English (`index.html:2`), but there are no locale variants or `hreflang`. Do not add `hreflang` unless true localized URLs exist.
- Canonicals consistently use `https://www.codebell.online`, but redirect consistency among HTTP/HTTPS and apex/www requires live validation.
- No country landing pages exist. Create them only when CodeBell has specific delivery capability, proof, and genuinely localized buyer information—not duplicated city/country keyword pages.
- LKR-only budget options (`src/components/chatbot/Chatbot.jsx:464-488`) create friction for international prospects. Currency presentation should be contextual or include “Discuss / not sure.”

## Performance and Core Web Vitals risks

No Lighthouse or real-user monitoring data was available; no score is claimed.

| Severity | Status | Code-level risk | Likely CWV effect | Recommendation | Complexity |
|---|---|---|---|---|---|
| High | Confirmed | All route components and the global 958-line chatbot are eagerly imported (`src/routes/AppRoutes.jsx:1-12`, `30`) | More initial JS can delay main-thread readiness and INP, especially mobile. | Route-split pages with lazy imports; lazy-load chatbot logic when requested or after idle, preserving a lightweight accessible trigger. | Medium |
| High | Confirmed | Portfolio renders 18 third-party iframes (`src/pages/Portfolio.jsx:148-206`) | Network/CPU/memory pressure; scrolling may trigger multiple loads; third-party availability affects UX. | Use optimized screenshots and links; load a live preview only on explicit request. | Medium |
| High | Confirmed | Homepage eagerly imports all client assets, roughly 2 MB on disk, then duplicates them in the DOM (`src/pages/Home.jsx:14-19`, `165`) | Decode/network cost and marquee rendering can affect LCP/INP. | Convert to WebP/AVIF where suitable, right-size, name explicitly, avoid DOM duplication where possible, and load below-fold assets lazily with dimensions. | Medium |
| Medium | Confirmed | No intrinsic dimensions for logo/client images (`src/pages/Home.jsx:167-172`; `src/components/common/Navbar.jsx:23`) | Potential CLS. | Add width/height or `aspect-ratio` based on actual assets. | Low |
| Medium | Confirmed | About page loads a remote Unsplash CSS background (`src/styles/about.css:278-283`) | Extra connection, privacy/vendor dependency, and unoptimized responsive delivery. | Use an approved local asset with responsive formats and pre-sized delivery. | Low |
| Medium | Confirmed | Persistent animations run on homepage; reduced-motion handling exists only for portfolio | `src/styles/home.css:433`, `586`, `636`, `650`, `664`; only `src/styles/portfolio.css:400` has reduced-motion | Animation work can affect battery/INP and vestibular accessibility. | Add global reduced-motion rules and pause offscreen/decorative animations. | Low |
| Medium | Confirmed | Many stylesheet rules use `transition: all` | Examples: `src/styles/contact.css:150`, `src/styles/navbar.css:83`, `src/styles/faqs.css:58` | Can animate unintended properties and increase rendering work. | Restrict transitions to transform, opacity, color, or border-color. | Low |
| Low | Confirmed | No custom fonts or heavy tag scripts are present | `src/styles/global.css:11-16`; no analytics scripts | Positive for LCP and privacy. Preserve this advantage when adding measurement. | — |

### Recommended measurement

After a production build is available, test Home, Services, one service landing page, Portfolio, Contact, and Support at mobile and desktop widths. Record median lab runs plus field data by template. Monitor LCP element, INP interactions (nav/chat/form/FAQ), CLS sources, JS transfer/parse cost, image bytes, iframe requests, and third-party time. Set performance budgets only after measuring the current production baseline.

## Mobile and responsive audit

### Confirmed strengths

- Every page stylesheet reviewed contains mobile breakpoints.
- Contact form collapses from two columns to one and makes its submit button full width (`src/styles/contact.css:267-310`).
- Navigation switches to a 46×46 px menu control (`src/styles/navbar.css:92-104`, `216-224`).
- Chatbot width adapts to the viewport (`src/styles/chatbot.css:19-26`, `210-222`).

### Risks requiring browser validation

- The mobile sidebar uses `height: 100vh` rather than modern dynamic viewport units and has no explicit overflow-y handling (`src/styles/navbar.css:141-155`); content could clip on short/mobile browser viewports.
- Opening the menu sets body overflow and cleanup to `auto`, which may overwrite a pre-existing body overflow value (`src/components/common/Navbar.jsx:11-16`).
- The chat window is 72vh on small screens and sits above a fixed button (`src/styles/chatbot.css:210-222`); verify soft-keyboard behavior, safe-area insets, input visibility, and zoom at 200–400%.
- Very large hero text and fixed/min heights should be tested for wrapping and landscape displays, e.g. Contact (`src/styles/contact.css:21-35`) and Portfolio (`src/styles/portfolio.css:26`).
- Live iframe previews should be tested on low-memory mobile devices.

## Accessibility audit (WCAG 2.2 AA code review)

### Confirmed violations or defects

| Severity | Principle | Finding and evidence | Recommendation | Complexity |
|---|---|---|---|---|
| High | Operable / keyboard | FAQ uses clickable `div` elements with no keyboard interaction or roles (`src/pages/FAQs.jsx:58-75`). | Use native `button` disclosures, `aria-expanded`, `aria-controls`, unique panel IDs, and hidden state. | Low |
| High | Operable / focus order | Closed mobile navigation remains in DOM with focusable links/buttons and is only transformed offscreen (`src/components/common/Navbar.jsx:108-190`; `src/styles/navbar.css:141-159`). | Conditionally render or apply `inert`/`aria-hidden`; move focus on open, trap it, support Escape, and return focus. | Medium |
| High | Name/role/value | Chat window has no `role="dialog"`, accessible title association, `aria-modal`, focus management, or message-log semantics (`src/components/chatbot/Chatbot.jsx:816-955`). | Implement nonmodal/dialog semantics appropriate to behavior, labelled title, focus entry/return, Escape, and `role="log"`/live updates without excessive announcements. | Medium |
| High | Perceivable / forms | Chat text input relies on placeholder only (`src/components/chatbot/Chatbot.jsx:933-945`). | Add a programmatic label; retain concise placeholder as supplemental text. | Low |
| Medium | Operable / focus visible | Global styles remove link underlines and do not define a general focus indicator (`src/styles/global.css:18-21`); contact/chat inputs set `outline: none` (`src/styles/contact.css:80-107`; `src/styles/chatbot.css:185-196`). | Add a site-wide `:focus-visible` treatment with sufficient contrast and avoid removing outlines unless replaced. | Low |
| Medium | Motion | Smooth scroll and multiple continuous animations lack a site-wide reduced-motion alternative (`src/styles/global.css:7-9`; `src/styles/home.css:433`, `586`, `636-664`). | Under `prefers-reduced-motion: reduce`, disable smooth scroll and nonessential animation/transitions. | Low |
| Medium | Text alternatives | Client logos use ordinal alt text and duplicate it (`src/pages/Home.jsx:165-172`). | Use verified brand-name alt once or empty alt for decorative repeated logos. | Low |
| Medium | Structure | Mobile sidebar is an `aside` without dialog/menu state announced; overlay is a clickable `div` (`src/components/common/Navbar.jsx:103-108`). | Expose expanded control relationship with `aria-controls`; make background inert; ensure dismiss behavior is keyboard accessible. | Medium |
| Low | Links | Contact email, phone, and WhatsApp are plain text rather than actionable `mailto:`, `tel:`, and secure WhatsApp links (`src/pages/Contact.jsx:141-163`). | Use descriptive anchors and preserve visible text. | Low |

### Positive accessibility evidence

- Main content landmarks and single page H1s are used.
- Form controls on Contact and Support have explicit labels (`src/pages/Contact.jsx:86-125`; `src/pages/Support.jsx:215-297`).
- Support error/status messages use `role="alert"`/`role="status"` (`src/pages/Support.jsx:194-211`, `299-311`, `404-423`).
- Portfolio links include descriptive accessible labels and iframe titles (`src/pages/Portfolio.jsx:151-177`, `195-203`).
- Menu and chatbot buttons have accessible labels (`src/components/common/Navbar.jsx:88-94`, `114-121`; `src/components/chatbot/Chatbot.jsx:807-835`).

### Requires browser/assistive-technology testing

- Color contrast for text, gradients, disabled states, and purple-on-light combinations.
- Focus order, focus visibility, zoom/reflow, screen-reader announcements, error association, and touch target spacing.
- Whether the hidden FAQ answer text remains exposed appropriately to accessibility APIs.
- Mobile menu and chatbot behavior with VoiceOver/TalkBack, keyboard, and high zoom.
- Page-title announcement and focus reset after SPA route navigation; `ScrollTop` only scrolls and does not focus the new page heading (`src/components/common/ScrollTop.jsx:4-11`).

## Security and code-quality observations affecting acquisition

- The OpenAI endpoint allows all origins and has no visible authentication, request-size validation, rate limiting, or abuse prevention (`api/generate-followup.js:8-24`). The endpoint is not referenced by the current frontend, but may still be deployed. Restrict or remove after verifying intended use.
- Webhook URLs are intentionally public browser variables (`.env.example:1-12`). Public endpoints must treat every request as hostile; server-side controls are not visible here.
- Ticket-status lookup uses ticket number plus email (`src/lib/supportApi.js:84-87`). Use generic responses, rate limits, monitoring, and strong unguessable identifiers server-side to reduce enumeration risk.
- The support honeypot is useful but insufficient alone (`src/pages/Support.jsx:86-89`, `286-289`). Add server-side bot/rate controls.
- Contact WhatsApp interpolation is not encoded with `encodeURIComponent` (`src/pages/Contact.jsx:27-35`), unlike the helper in `src/lib/supportApi.js:109-110`. Special characters can break the message URL. This is a reliability issue, not evidence of server compromise.
- ESLint currently reports two errors in `api/generate-followup.js`: undefined `process` at line 4 and unused `err` at line 79. This was confirmed with `npm run lint`; no source was modified.

## Framework decision

Do not migrate frameworks solely for SEO. First validate live indexing and metadata behavior. Static prerendering of nine mostly static public routes, route-level splitting, and server-side form endpoints can address the immediate problems with less disruption. Consider SSR/SSG framework migration only if CodeBell commits to a growing content/case-study system, frequent dynamic pages, localization, or server-rendered personalization and the measured benefits justify migration and operational cost.
