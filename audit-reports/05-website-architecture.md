# Website Architecture and Navigation Plan

## Existing application architecture

```text
Vite SPA / React 19
├── BrowserRouter
│   ├── /                         Home
│   ├── /about                    About
│   ├── /services                 Services
│   ├── /portfolio                Portfolio
│   ├── /contact                  Contact
│   ├── /support                  Support
│   ├── /faqs                     FAQs
│   ├── /privacy-policy           Privacy Policy
│   ├── /terms                    Terms alias
│   └── /terms-and-conditions     Terms canonical route
├── Global Navbar + Footer on every page
├── Global Chatbot after the route switch
├── Optional public n8n endpoints
│   ├── chat
│   ├── ticket create
│   ├── ticket status
│   └── lead submit
└── Vercel serverless OpenAI helper (not referenced by current UI)
```

Evidence: `src/routes/AppRoutes.jsx:14-32`, `src/lib/supportApi.js:7-12`, and `api/generate-followup.js:1-111`.

## Existing sitemap assessment

| Route | State | Navigation | Search/canonical status | Conversion role | Finding |
|---|---|---|---|---|---|
| `/` | Existing — improve | Primary nav/logo | In sitemap; canonical present | Awareness → service/contact | Needs clearer audience/outcomes/proof |
| `/about` | Existing — improve | Primary nav/footer | In sitemap; canonical present | Trust | Unsupported statistics and dead case link |
| `/services` | Existing — improve | Primary nav/footer | In sitemap; canonical present | Consideration | Too broad; should be a hub |
| `/portfolio` | Existing — improve | Primary nav/footer | In sitemap; canonical present | Proof | Needs case narratives; iframe-heavy |
| `/contact` | Existing — improve | Nav CTA/footer/other CTAs | In sitemap; canonical present | Lead | WhatsApp-only final submission |
| `/support` | Existing — improve | Primary nav/footer/chatbot | In sitemap; canonical present | Client service | Should be separated from new-business journey in hierarchy |
| `/faqs` | Existing — improve | Primary nav only | Missing sitemap/canonical/description | Objection handling | Content inconsistent and interaction inaccessible |
| `/privacy-policy` | Existing — improve | Footer | In sitemap; canonical present | Trust/compliance | Must track actual processors and data flows |
| `/terms-and-conditions` | Existing — retain/improve | Footer | In sitemap; canonical present | Trust/compliance | Needs counsel/entity validation |
| `/terms` | Remove or consolidate | Not linked | Same component canonicalizes after JS | None | Redirect to canonical URL |
| Unknown route | Missing | — | No 404 route | Recovery | Add not-found experience/status strategy |

## Recommended sitemap

Page names and priorities must be validated against actual demand, sales capability, and proof before publication.

```text
Home
├── Solutions
│   ├── Custom Software Development
│   ├── ERP, CRM & HRMS Systems
│   ├── AI Agents & Business Automation
│   ├── Website & E-commerce Development
│   ├── Mobile Application Development
│   └── Integrations, Analytics & Maintenance
├── Work
│   ├── Case Studies index
│   └── Case Study detail (permissioned)
├── About
│   ├── Company & Team
│   └── Delivery Approach (may remain an About section initially)
├── Insights (phase 3 only with editorial capacity)
│   ├── Guides/articles
│   └── Downloadable resource with consent-aware lead flow
├── FAQs
├── Contact / Book a Consultation
├── Client Support
│   ├── Raise ticket
│   └── Track ticket
└── Legal
    ├── Privacy Policy
    ├── Terms & Conditions
    └── Cookie/Tracking Notice (only if required by implemented tools/markets)
```

## Page classification and purpose

| Proposed URL | Classification | Purpose | Primary CTA | Key internal links | SEO intent | Conversion goal |
|---|---|---|---|---|---|---|
| `/` | Existing — improve | Position CodeBell and route high-intent buyers | Book discovery call | Solutions, cases, about, FAQ | custom software and digital engineering partner | Qualified consultation |
| `/services` | Existing — improve | Solution hub and comparison | Find the right solution / discuss requirements | All service pages, cases, FAQ | software development services | Service selection |
| `/services/custom-software-development` | New — recommended | Address bespoke workflow/platform needs | Request solution discovery | ERP, integrations, cases | custom software development | Qualified lead |
| `/services/erp-crm-hrms` | New — recommended | Consolidate business-system buyer intent without thin pages | Book systems assessment | Custom software, automation, support | custom ERP/CRM/HRMS development | Assessment |
| `/services/ai-automation` | New — recommended | Explain governed AI/automation use cases | Request automation assessment | Integrations, privacy, cases | AI agent/business automation development | Assessment |
| `/services/websites-ecommerce` | New — recommended | Serve acquisition and commerce projects | Request website growth review | UI/UX, integrations, cases | business website/e-commerce development | Review/enquiry |
| `/services/mobile-app-development` | New — recommended | Serve mobile-product demand | Plan app discovery | Custom software, UI/UX, case | mobile app development | Discovery |
| `/services/integrations-maintenance` | New — recommended | Serve existing-system and recurring-support needs | Request technical review | Custom software, automation, support | system integration/software maintenance | Review/recurring lead |
| `/portfolio` | Existing — improve; rename nav to Work | Proof index | Discuss a similar project | Cases, relevant services | software development portfolio | Assisted conversion |
| `/case-studies/:slug` | New — recommended | Deep verified proof | Discuss a similar project | Relevant service, next case, contact | problem/service/industry-specific case intent | Qualified lead |
| `/about` | Existing — improve | Establish company/team/delivery trust | Meet/discuss with team | Cases, approach, contact | CodeBell software company | Trust → consultation |
| `/faqs` | Existing — improve | Resolve common pre-sales objections | Discuss project | Services, contact, legal | software project FAQ | Assisted conversion |
| `/contact` | Existing — improve | Capture, qualify, and schedule | Request consultation | Privacy, services, support | software project enquiry | Lead created |
| `/support` | Existing — improve | Existing-client service | Raise ticket | Track, urgent contact, privacy | CodeBell support | Ticket, not new lead |
| `/privacy-policy` | Existing — improve | Transparent data handling | Privacy request | Contact, terms | privacy policy | Trust/compliance |
| `/terms-and-conditions` | Existing — improve | Commercial/legal expectations | Contact | Privacy | service terms | Trust/compliance |
| `/terms` | Remove/consolidate | Redirect only | — | Canonical terms | — | Signal consolidation |
| `/insights` and article routes | New — phase 3 | Build expertise/search demand | Relevant assessment | Services, cases | informational/problem intent | Assisted lead |
| `/404` or catch-all | New — recommended | Recover invalid visits | Find a solution / contact | Home, services, work | None/noindex | Recovery |

## Navigation recommendations

### Primary navigation

- **Solutions** (accessible disclosure/mega menu): six solution pages.
- **Work**: case-study/portfolio index.
- **About**.
- **Insights** only when a maintained content programme exists.
- **Client Support** as a utility link, visually distinct from acquisition navigation.
- Persistent primary CTA: **Book a discovery call** or **Discuss your project**.

The current six desktop links plus quote CTA are manageable (`src/components/common/Navbar.jsx:26-86`), but Support and FAQs consume top-level space while service discovery has only one entry. Keep FAQ linked from Solutions/footer and retain Support as a utility action for clients.

### Footer

Add:

- Solution links.
- Featured cases.
- Direct clickable email/phone/WhatsApp.
- Location, service hours with timezone, and remote-delivery statement after verification.
- CodeBell Business Systems contextual link with clear ownership and privacy boundaries.
- Privacy/terms/cookie preferences where applicable.
- Final consultation CTA.

The current footer provides general links, legal, LinkedIn, and GitHub but no direct conversion or service navigation (`src/components/common/Footer.jsx:12-82`).

## Landing-page template

Each service page should be materially distinct and include:

1. Intent-matched H1 and outcome proposition.
2. Specific buyer/problem fit and exclusions.
3. Outcomes and capabilities tied together.
4. Deliverables/solution examples.
5. CodeBell’s approach, decision points, and client inputs.
6. Integration, security, QA, handover, and support implications.
7. Permissioned relevant case study.
8. Commercial/process guidance without invented prices.
9. Service-specific FAQs.
10. Short qualification form and alternate scheduling/contact path.
11. Links to adjacent services and relevant insights.

Avoid one template with swapped keywords. ERP, AI automation, websites, and mobile products have different buyers, risks, evidence, and qualification questions.

## Cross-brand architecture

The only confirmed CodeBell Business Systems connection is its portfolio URL (`src/pages/Portfolio.jsx:15-18`). Ownership, data-controller relationship, and sharing permissions are not established by code.

Recommended low-confusion approach:

- Add a clearly labelled footer/ecosystem item: “Business strategy and planning — visit CodeBell Business Systems,” only after ownership wording is legally/business verified.
- Add contextual modules rather than shared top navigation. Example on Custom Software: “Still defining the business model or feasibility? CodeBell Business Systems may be a better first step.”
- On the CodeBell Business Systems site, use the inverse referral after strategy/validation: “Ready to implement the technology?”
- Create dedicated referral URLs on each domain, e.g. `/referrals/codebell-business-systems`, only if they offer substantive orientation and consent—not doorway pages.
- Store `referred_from_brand`, `referred_to_brand`, consent/lawful basis, timestamp, and owning team in CRM.
- Do not transfer detailed lead data across brands automatically until controller/processor roles, privacy notices, and permission are verified. A simple external link is safer initially.

## International information architecture

- Keep one English global site initially; state remote delivery, working timezone, supported communication, contracting entity, and currency policy after verification.
- Add scheduling that displays the visitor’s timezone and CodeBell availability.
- Do not publish country pages without local proof, meaningful service differences, or targeted campaigns.
- If localized pages are later justified, give each locale unique currency, availability, legal, proof, and contact content with reciprocal `hreflang` and self-canonical URLs.
- Separate “currency shown” from “contract currency”; avoid assuming all international buyers accept LKR.

## Architecture acceptance criteria

- Every indexable page has one canonical URL, unique title/description/H1, correct sitemap inclusion, and at least two meaningful internal paths.
- Every primary CTA preserves service/page/campaign context to the lead record.
- Every service page has unique audience, problem, proof, FAQ, and qualification content.
- Support journeys are not mixed with new-business pipeline stages.
- Unknown routes produce a useful not-found experience and an appropriate status/noindex strategy.
- Navigation is keyboard/screen-reader operable and closed overlays are not focusable.
- Cross-brand referrals identify the destination and do not silently share personal data.
