# CodeBell Website Growth Audit — Executive Summary

Audit date: 10 October 2026  
Repository reviewed: CodeBell Development (`codebell.online`)  
Audit basis: source-code review only; no production analytics, CRM, Search Console, ad-platform, browser, assistive-technology, or Lighthouse access was available.

## Executive conclusion

This repository is the CodeBell Development website, not the CodeBell Business Systems website. The evidence is the canonical domain, service catalogue, and contact details in `index.html:26`, `src/pages/Services.jsx:15-82`, and `src/pages/Contact.jsx:43-59`. CodeBell Business Systems appears only as a portfolio link (`src/pages/Portfolio.jsx:15-18`).

The site is a credible visual brochure, but it is not yet a measurable B2B acquisition system. Its strongest foundations are a clear technical-services theme, responsive layouts, legal pages, a working WhatsApp enquiry path, and optional support/lead webhooks. Its largest commercial gaps are:

1. The primary contact form opens WhatsApp but does not persist or notify CodeBell, record attribution, show an in-site success state, or collect privacy consent (`src/pages/Contact.jsx:15-38`, `83-131`).
2. No analytics, tag manager, advertising pixels, conversion events, or consent tooling is present anywhere in the reviewed codebase.
3. Six materially different services share one shallow `/services` page; there are no dedicated service URLs or intent-matched campaign destinations (`src/routes/AppRoutes.jsx:19-28`, `src/pages/Services.jsx:15-82`).
4. Homepage language is broad and self-focused rather than buyer-, industry-, and outcome-specific (`src/pages/Home.jsx:113-131`).
5. Trust claims such as “150 Happy Clients” and “260 Projects” have no supporting case studies, sources, named outcomes, or verification in the repository (`src/pages/About.jsx:23-40`, `254-256`).
6. The client logo strip uses generic alt text and unidentified image assets, while the portfolio embeds 18 third-party sites without explaining the problem, scope, result, or client permission (`src/pages/Home.jsx:14-19`, `161-175`; `src/pages/Portfolio.jsx:8-99`, `148-206`).
7. The app is client-side rendered and serves generic base metadata before JavaScript; the FAQ has only a title and is absent from the sitemap (`index.html:8-29`, `src/pages/FAQs.jsx:45-47`, `public/sitemap.xml:1-27`).
8. Accessibility blockers include mouse-only FAQ controls, focusable off-canvas navigation when closed, and chatbot dialog/focus semantics that are absent (`src/pages/FAQs.jsx:58-75`, `src/components/common/Navbar.jsx:103-190`, `src/components/chatbot/Chatbot.jsx:805-955`).
9. Route-level code splitting is absent; a 958-line chatbot and every page are eagerly included, the homepage eagerly imports roughly 2 MB of logo assets, and the portfolio can load 18 iframes (`src/routes/AppRoutes.jsx:1-12`, `src/components/chatbot/Chatbot.jsx:1-958`, `src/pages/Home.jsx:14-19`, `src/pages/Portfolio.jsx:148-206`).
10. The optional public webhooks have no client-visible authentication or integrity mechanism, and the deployed OpenAI helper allows any origin and has no visible rate limit (`src/lib/supportApi.js:33-45`, `api/generate-followup.js:3-20`). Server-side controls could exist outside this repository and require verification.

The LKR 35–40 million business-value goal cannot be validated or forecast from this codebase. The appropriate response is to instrument the funnel, improve lead capture and qualification, create high-intent service pages, substantiate proof, then optimize from observed pipeline and collected-revenue data.

## Weighted audit score

Scores measure code-evidenced readiness, not live performance. Categories marked “Not fully verified” need runtime or business-system evidence.

| Category | Weight | Score | Rationale and evidence | Verification limitation |
|---|---:|---:|---|---|
| Business positioning | 10 | 5 | Technical offer is identifiable, but audience, differentiators, industries, engagement model, and outcomes remain generic (`src/pages/Home.jsx:113-123`; `src/pages/Services.jsx:113-123`). | Buyer research and competitor positioning not supplied. |
| Content quality | 10 | 4 | Core pages exist, but terminology is inconsistent, several statements are vague or aggressive, and FAQs conflict with the service catalogue (`src/pages/FAQs.jsx:8-33`; `src/pages/About.jsx:44-70`). | Claim accuracy and editorial ownership not verified. |
| User experience | 10 | 6 | Navigation is consistent and responsive, but labels misrepresent destinations and there is no 404 route (`src/components/common/Navbar.jsx:26-86`; `src/pages/Services.jsx:144-174`; `src/routes/AppRoutes.jsx:18-29`). | Not browser- or user-tested. |
| Lead generation | 15 | 5 | WhatsApp and chatbot paths exist, but contact leads are not stored and progressive qualification is missing from the main form (`src/pages/Contact.jsx:15-38`; `src/components/chatbot/Chatbot.jsx:464-497`). | Webhook environment and CRM delivery not verified. |
| Conversion optimization | 15 | 4 | CTAs exist but value proposition, proof, objection handling, scheduling, case studies, and intent-specific destinations are weak or missing (`src/pages/Home.jsx:109-233`). | No conversion data or experiments available. |
| SEO | 10 | 5 | Core canonicals and sitemap exist; FAQ metadata, structured data, service routes, server-rendered metadata, OG images, and 404 handling do not (`src/pages/Home.jsx:86-104`; `src/pages/FAQs.jsx:45-47`; `public/sitemap.xml:1-27`). | Index status, rankings, backlinks, and live response headers not verified. |
| Technical performance | 10 | 5 | Lazy image/iframe hints exist, but all routes/chat content load eagerly and portfolio embeds are expensive (`src/routes/AppRoutes.jsx:1-12`; `src/pages/Portfolio.jsx:171-178`). | **Not fully verified:** no Lighthouse or field data. |
| Trust and credibility | 5 | 2 | Contact/legal pages and portfolio links help, but quantified claims lack repository evidence and no outcome-led case study or team profile exists (`src/pages/About.jsx:23-40`; `src/pages/Portfolio.jsx:8-99`). | Client permission, registrations, and claims require business verification. |
| Marketing readiness | 5 | 1 | No channel-specific landing pages, conversion tracking, audiences, or attribution parameters are implemented. | **Not fully verified:** ad accounts and external tooling unavailable. |
| CRM and automation | 5 | 2 | Optional n8n-style endpoint architecture exists, but configuration, security, ownership, retries, and CRM state are not evident (`src/lib/supportApi.js:1-12`, `79-91`). | **Not fully verified:** external n8n/CRM workflows unavailable. |
| Analytics and measurement | 5 | 0 | No analytics or conversion instrumentation was found in source or dependencies (`package.json:12-20`). | **Not fully verified:** hosting-level analytics could exist outside the repo. |
| **Total** | **100** | **39/100** | Functional brochure; early lead-capture components; not yet a measurable acquisition platform. | Code-based score only. |

## Major risks

| Severity | Type | Risk | Evidence | Business impact | Recommended action | Complexity | Expected benefit |
|---|---|---|---|---|---|---|---|
| Critical | Confirmed | No observable acquisition or revenue funnel | No analytics dependency/configuration; no event calls in `src/`; `package.json:12-20` | CodeBell cannot attribute leads, identify leakage, optimize campaigns, or relate spend to collected revenue. | Define an event/data-layer contract, add consent-aware analytics and CRM IDs, and report pipeline stages through revenue. | Medium | Establishes the feedback loop required for growth. |
| Critical | Confirmed | Main form does not submit to a first-party lead system | `src/pages/Contact.jsx:15-38` only constructs and opens a WhatsApp URL | Popup blocking, abandonment, and unsent drafts can lose leads; no owner or SLA is created. | Submit server-side first, create a CRM lead, return a receipt, then offer WhatsApp as an optional continuation. | Medium | More reliable capture and follow-up. |
| High | Confirmed | No service-level landing architecture | Only `/services` is routed (`src/routes/AppRoutes.jsx:19-28`) | Organic and paid traffic cannot land on a highly relevant page; intent and lead quality remain opaque. | Build differentiated pages for the highest-value verified services; avoid templated thin copy. | High | Better relevance, qualification, internal linking, and campaign quality. |
| High | Confirmed | Trust claims are unsupported in site content | `src/pages/About.jsx:23-40`; dead case-study link at `254-256` | Sophisticated buyers may distrust claims; legal/reputation exposure if numbers are inaccurate. | Verify, date, and substantiate each claim or remove it; publish permissioned case studies. | Medium | Stronger buyer confidence and sales enablement. |
| High | Confirmed | Public automation/API abuse controls are not evident | `src/lib/supportApi.js:33-45`; `api/generate-followup.js:8-20` | Spam, personal-data exposure, ticket enumeration, or OpenAI cost abuse are possible if server-side controls are absent. | Put public submissions behind same-origin server endpoints; validate, rate-limit, sign internal webhooks, redact logs, and use generic ticket lookup responses. | Medium | Protects availability, data, and spend. |
| High | Confirmed | Portfolio delivery is both thin and potentially heavy | `src/pages/Portfolio.jsx:8-99`, `171-178` | Weak proof for buyers; 18 live embeds can degrade mobile performance and depend on third parties. | Replace embeds with optimized screenshots and create 3–5 detailed, permissioned case studies. | Medium | Better proof and faster browsing. |
| High | Confirmed | FAQ interaction is inaccessible by keyboard | `src/pages/FAQs.jsx:58-75` uses clickable `div` elements | Keyboard and assistive-technology users cannot reliably operate a core information component. | Use disclosure buttons with `aria-expanded`, `aria-controls`, keyboard support, and visible focus. | Low | WCAG improvement and better usability. |
| Medium | Confirmed | CTA labels do not match outcomes | “LEARN MORE” and “View Pricing” both route to contact (`src/pages/Services.jsx:144-174`) | Creates surprise and reduces trust/intent clarity. | Link Learn More to service detail; link pricing to an honest pricing/process section or relabel it. | Low | Clearer navigation and better conversion intent. |
| Medium | Confirmed | Homepage proof and buyer specificity are weak | `src/pages/Home.jsx:113-123`, `161-218` | Visitors may not understand who the firm best serves or why it is safer than alternatives within five seconds. | Lead with audience + outcome + offer; add validated proof, selected cases, service outcomes, and a consultation CTA. | Medium | Stronger first-impression relevance. |
| Medium | Inferred risk | Client-side rendering may reduce metadata reliability outside major search crawlers | Vite SPA and catch-all rewrite (`src/main.jsx:7-12`; `vercel.json:1-4`) | Social crawlers and some bots may receive only generic base tags; deep-page discovery can be weaker. | Validate rendered HTML and crawler previews, then prerender public routes if required; do not migrate framework without evidence. | Medium | More reliable indexing and sharing. |

## Top 10 recommended actions

1. Implement first-party lead capture plus CRM creation before redirecting or deep-linking to WhatsApp.
2. Add consent-aware analytics with source/medium/campaign, landing page, CTA, form-start, form-submit, booked-meeting, qualified-lead, proposal, win, revenue, and lost-reason events.
3. Rewrite the homepage around buyer outcomes and target segments; replace “monolith” language with plain, commercial language.
4. Create differentiated landing pages for Custom Software, ERP/CRM/HRMS, AI & Automation, Website/E-commerce, Mobile Apps, and Integrations/Maintenance, prioritizing demand and deal value.
5. Verify or remove the 150-client/260-project claims and convert permissioned work into evidence-rich case studies.
6. Repair the primary UX/accessibility defects: FAQ disclosures, mobile navigation focus/inert state, chatbot dialog/focus/live semantics, visible focus, reduced motion, and meaningful logo alt treatment.
7. Replace live portfolio iframes with responsive images and defer/lazy-load the global chatbot and route modules.
8. Complete technical SEO: FAQ metadata/canonical/sitemap entry, OG/Twitter images, 404 route/status strategy, structured data tied to verified content, and static prerendering validation.
9. Secure public form and automation boundaries with server-side validation, rate limits, bot controls, signed n8n calls, idempotency, duplicate detection, least privilege, and audit logs.
10. Add consultation scheduling and a documented sales SLA/pipeline, with ownership and recovery workflows for every captured lead.

## What is already working

- Public routes cover homepage, about, services, portfolio, contact, support, FAQ, privacy, and terms (`src/routes/AppRoutes.jsx:18-29`).
- Most core pages have unique titles, descriptions, canonical URLs, and Open Graph basics.
- `robots.txt` allows crawling and references the XML sitemap (`public/robots.txt:1-4`).
- Support forms have explicit labels, required fields, consent, a honeypot, loading/error/success states, and email fallback (`src/pages/Support.jsx:213-320`).
- Contact information and Colombo/remote-first positioning are present (`src/pages/Contact.jsx:134-197`).
- Responsive rules are present across page styles, including contact at `src/styles/contact.css:260-330` and navigation at `src/styles/navbar.css:216-249`.
- Legal pages describe personal-data handling, AI-assisted support, international transfers, and Sri Lankan governing law (`src/pages/PrivacyPolicy.jsx:86-268`; `src/pages/Terms.jsx:291-307`). These are content artifacts, not legal validation.

## Validation limits

- No claims were independently verified. Portfolio inclusion is not proof of client authorization or commercial outcome.
- No live environment variables or secret values were inspected or reported.
- No production requests, headers, webhook responses, email delivery, WhatsApp completion, or CRM records were tested.
- No Lighthouse, Core Web Vitals, screen reader, contrast, keyboard, device, or cross-browser tests were run; performance and some accessibility findings are code-level risks.
- No search volume, keyword rankings, backlink data, campaign economics, sales data, or customer research was provided.
- Legal copy should be reviewed by qualified counsel, particularly before international campaigns or cross-brand data sharing.

## Five highest-priority improvements

1. Capture every enquiry first-party and create an owned lead record.
2. Instrument the full source-to-revenue funnel.
3. Replace generic homepage messaging with audience/outcome/proof-led positioning.
4. Launch high-intent, non-duplicative service landing pages.
5. Publish verified case studies and remove or substantiate unsupported claims.
