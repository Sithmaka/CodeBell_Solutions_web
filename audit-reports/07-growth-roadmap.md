# 90-Day Growth Roadmap and KPI Plan

## Operating principle

The LKR 35–40 million additional-business-value ambition is a business target, not a forecast. This roadmap creates the measurement, conversion, proof, and sales operations needed to pursue it. Set numeric targets only after baseline traffic, lead quality, close rates, contract values, capacity, and collection data are reconciled.

## Phase 1 — Immediate improvements (Days 1–14)

| Priority | Task | Expected impact | Complexity | Dependencies | Relevant files/components | Acceptance criteria |
|---|---|---|---|---|---|---|
| P0 | Agree canonical service taxonomy, target buyers, value proposition, and claim register | Removes message/CRM/reporting inconsistency | Medium | Leadership, delivery, sales validation | `src/pages/Home.jsx`, `Services.jsx`, `FAQs.jsx`, `Contact.jsx`, `components/chatbot/Chatbot.jsx` | One approved taxonomy maps page slug, form value, CRM value, owner; every public claim has evidence owner/status/date. |
| P0 | Replace WhatsApp-only contact submission with durable first-party lead capture | Prevents silent lead loss and enables ownership | Medium | API/storage/CRM decision, privacy review | `src/pages/Contact.jsx`, `src/lib/supportApi.js`, new server endpoint | Valid submission returns lead reference; one CRM record/owner created; WhatsApp is optional follow-on; failures show accessible retry/fallback. |
| P0 | Define and implement analytics/event contract | Enables source-to-pipeline measurement | Medium | Consent/tool decision, CRM IDs, campaign taxonomy | `src/main.jsx`, route/CTA/form components, privacy copy | Events for CTA, form start/error/success, service interest, booking, and CRM outcomes are documented, deduplicated, QA-tested, and contain no raw PII. |
| P0 | Add point-of-collection privacy/consent and data minimization | Reduces legal/trust risk | Low–Medium | Privacy/legal review | `src/pages/Contact.jsx`, `src/components/chatbot/Chatbot.jsx`, `src/pages/PrivacyPolicy.jsx` | Contact/chat disclose processors/channels accurately; policy version/timestamp stored; marketing consent separate; sensitive-data warning shown. |
| P0 | Secure public submission boundaries | Reduces spam, enumeration, data, and API-cost risk | Medium | Server endpoint/n8n ownership | `src/lib/supportApi.js`, `api/generate-followup.js`, Support flows | Server validation, length limits, rate limiting, idempotency, signed internal webhook, generic lookup responses, safe logs, and alerts pass abuse tests. |
| P1 | Rewrite homepage hero and CTA hierarchy | Improves five-second clarity and intent | Low | Approved positioning | `src/pages/Home.jsx:109-132` | H1 states audience/offer/outcome without unsupported claims; primary CTA begins consultation; secondary explores solutions; CTA IDs tracked. |
| P1 | Repair misleading/dead CTAs and direct-contact links | Removes friction and trust breaks | Low | Final destinations | `src/pages/Services.jsx:144-174`, `About.jsx:254-256`, `Contact.jsx:141-163` | Every label matches destination; email/phone/WhatsApp work; service context preserved; no `#!` links. |
| P1 | Complete core technical SEO | Improves metadata reliability and crawl coverage | Low–Medium | Approved share image and canonical map | `src/pages/FAQs.jsx`, `public/sitemap.xml`, `src/routes/AppRoutes.jsx`, Helmet blocks | FAQ has metadata/canonical and sitemap inclusion; `/terms` redirects; 404 exists; OG/Twitter preview tests pass; one canonical per route. |
| P1 | Fix high-severity accessibility defects | Expands access and reduces compliance risk | Medium | Design QA | FAQ, Navbar, Chatbot, global/contact/chatbot CSS | Keyboard/screen-reader tests pass for FAQ/menu/chat; closed overlays inert; visible focus; labels/live regions; Escape/focus return; reduced motion. |
| P1 | Verify/remove unsupported proof | Protects credibility | Low–Medium | Business evidence and client permission | `src/pages/About.jsx:23-40`, Home logos, Portfolio | Unverified statistics/industry/project claims removed or substantiated; logo/case permissions recorded. |
| P2 | Establish sales SLA and pipeline definitions | Prevents leads from stalling | Low | Sales owner and CRM | Operational documentation, CRM | Stage definitions, owner/backup, response target, next-action rule, lost reason, and escalation dashboard approved and tested. |

### Day-14 release gate

- Test leads from direct, organic, paid-test, referral, contact, chatbot, and WhatsApp-assisted paths appear once in CRM with correct source/service/consent.
- No production secret is present in browser code.
- Every conversion path has an accessible success/failure outcome.
- Core pages have approved, accurate claims and metadata.
- A dashboard can show attempts, valid leads, assigned leads, qualified state, and failures—even if volumes are low.

## Phase 2 — Lead-generation foundation (Days 15–30)

| Priority | Task | Expected impact | Complexity | Dependencies | Relevant files/components | Acceptance criteria |
|---|---|---|---|---|---|---|
| P0 | Build first 2–3 high-value service pages chosen from demand/deal evidence | Improves organic/ad relevance and lead quality | High | Taxonomy, buyer interviews, proof, design | Routing, new pages/components, sitemap, navigation | Each page has unique buyer/problem/outcome/process/proof/FAQ/qualifier content; metadata and internal links pass review; no thin duplication. |
| P0 | Convert 3–5 permissioned projects into case studies | Supplies decision-stage proof | High | Client permission, project facts/outcomes | `src/pages/Portfolio.jsx`, new case routes | Each case identifies challenge, verified CodeBell scope, constraints, approach, and sourced outcome; client approval stored. |
| P0 | Complete CRM intake, assignment, dedupe, acknowledgment, and error queue | Creates dependable operations | High | CRM/n8n/API access | `src/lib/supportApi.js`, server/n8n/CRM | Duplicate/replayed submissions have one business effect; owner and backup notified; dead-letter/replay works; audit trail complete. |
| P1 | Add progressive qualification and scheduling | Shortens time to meeting | Medium | Calendar/CRM, timezone policy | Contact form/chatbot/new service pages | Lead is created before long questions; conditional fields work; scheduling shows visitor timezone; booked/cancelled/no-show events sync. |
| P1 | Rebuild Services as a solution hub | Improves navigation and internal linking | Medium | First service pages | `src/pages/Services.jsx` | Consistent six-category taxonomy; outcomes and fit are clear; cards link to detail; pricing link is honest. |
| P1 | Replace portfolio iframes and optimize logo assets | Improves performance and proof | Medium | Approved screenshots/assets | `src/pages/Portfolio.jsx`, `Home.jsx`, assets/CSS | No auto-loaded live iframes; responsive images have dimensions/formats; mobile lab requests/bytes materially decline from recorded baseline. |
| P1 | Route-split pages and defer chatbot | Improves initial loading/interaction | Medium | Bundle analysis | `src/routes/AppRoutes.jsx`, `src/components/chatbot/Chatbot.jsx` | Route chunks load on demand; chatbot feature payload loads after intent/idle; no functional/accessibility regression; budget documented. |
| P1 | Implement channel-ready campaign templates | Enables controlled paid acquisition tests | Medium | Service pages, attribution, proof | New landing template/routes | Pages minimize distraction, preserve trust/legal links, use one primary action, map campaigns to CRM, and exclude unsupported claims. |
| P2 | Align FAQ/support/legal content to actual operations | Reduces objections and promise risk | Medium | Sales/support/legal owners | `FAQs.jsx`, `Support.jsx`, `PrivacyPolicy.jsx`, `Terms.jsx` | Services/process answers consistent; support promises match configured workflows; actual vendors/retention/entities reviewed by counsel. |
| P2 | Add cross-brand contextual referrals | Captures adjacent demand without confusion | Low–Medium | Ownership/privacy approval | Service pages/footer/CRM | Destination brand is explicit; referral source tracked; no silent PII transfer; owner sees consent/basis. |

### Day-30 release gate

- At least two priority services have complete pages and campaign-ready conversion paths.
- Case studies contain only approved, sourced facts.
- Lead-to-meeting stages and failures are visible in CRM/reporting.
- Performance and accessibility checks pass agreed budgets on priority templates.
- Test campaigns can be reconciled from click/landing page through qualified lead without exposing PII.

## Phase 3 — Growth optimization (Days 31–90)

| Priority | Task | Expected impact | Complexity | Dependencies | Relevant files/components | Acceptance criteria |
|---|---|---|---|---|---|---|
| P0 | Close the loop through proposal, contract, and collected revenue | Enables commercial optimization | High | Sales/finance process and integrations | CRM/n8n/dashboard | Opportunities, proposals, wins, contract value, invoice, and collection are linked to original lead/campaign with currency rules. |
| P1 | Publish remaining validated service pages | Expands qualified discovery | High | Unique content/proof | Services routes/content | Each page meets non-thin template criteria and is indexed/linked; search and lead quality monitored separately. |
| P1 | Launch an evidence-led insight programme | Builds organic/referral demand | High | Subject experts/editorial calendar | New Insights routes/content model | Every article addresses verified buyer questions, has expert review, internal links, update owner/date, and meaningful assisted-conversion measurement. |
| P1 | Run CRO experiments tied to lead quality | Improves funnel efficiency | Medium | Stable traffic/events | Home/service/contact components | Hypothesis and guardrails pre-registered; sample/decision rule set; outcome uses qualified lead/meeting, not clicks only; results documented. |
| P1 | Optimize acquisition by source and service | Redirects spend to valuable demand | Medium | 4–8+ weeks of clean data, depending on volume | Ads/analytics/CRM | Weekly view shows cost, valid/qualified leads, held meetings, proposals, wins, collections, lag, and confidence limitations. |
| P1 | Add AI-assisted summaries and proposal drafts with human gates | Saves sales time safely | High | Clean CRM data, AI policy/templates | n8n/CRM/OpenAI server-side | Outputs are labelled/versioned; hallucination checks and redaction pass; no external send/commitment without logged human approval. |
| P2 | Implement consent-based nurture/lost-lead recovery | Recovers timing-related demand | Medium | Consent/preference center, lost reasons | CRM/email/n8n | Suppression and opt-out are immediate; cadence is limited; recovery reported by qualified opportunity/revenue. |
| P2 | Evaluate international pages/operating model | Supports market expansion responsibly | Medium–High | Demand/proof/legal/currency/scheduling evidence | Content/CRM/legal | Country/locale page is launched only with unique proof, commercial policy, availability, legal review, and localized metadata. |
| P2 | Establish monthly technical quality review | Prevents regression | Medium | CI/monitoring | Build pipeline/repository | Automated lint/accessibility/sitemap/link checks; field CWV and form failure alerts; claim/content review schedule. |

## KPI implementation plan

### Baseline window

After tracking QA, use an initial clean-data baseline period sufficient for actual traffic and sales-cycle volume. Report counts and confidence; do not infer a rate from tiny denominators. Segment by service, source, device, geography, and new/returning status only when privacy and sample size permit.

### Dashboard layers

1. **Acquisition:** sessions, landing pages, channel/campaign, engaged service visits.
2. **Conversion:** CTA → form start → valid submission → assigned lead; errors and abandonment.
3. **Quality:** qualified/disqualified and reasons, business email/company, target service.
4. **Sales:** speed to lead, meetings booked/held, proposal rate/value, stage age, loss reason.
5. **Revenue:** signed value, collection date/value, currency conversion policy, gross margin if available.
6. **Reliability:** webhook/API failure, duplicates, spam, notification failure, dead-letter age.
7. **Experience:** CWV, accessibility defects, browser/device errors.

### Review cadence

- Daily: new/unassigned/failed leads and SLA breaches.
- Weekly: source/service funnel, pipeline movement, campaign quality, content-assisted leads.
- Monthly: cohort close rate, sales cycle, CAC, contract and collected value, loss themes, experiment decisions.
- Quarterly: positioning, service priorities, content decay, claims/permissions, privacy/security access review.

## Dependencies and decision owners

| Decision | Required owner(s) |
|---|---|
| Target buyers, service priority, claim approval | Leadership + sales + delivery |
| CRM stage/assignment/SLA | Sales operations |
| Technical architecture/security | Engineering + security owner |
| Consent, processors, cross-brand sharing | Legal/privacy owner |
| Case-study facts/permissions | Account owner + client approver |
| Analytics/ad platform configuration | Growth + engineering + privacy |
| AI proposal controls | Sales leadership + delivery + legal/finance |

## Risks to the roadmap

- Publishing many thin service pages before proof/content readiness.
- Optimizing raw lead volume while sales capacity or qualification is undefined.
- Running paid campaigns before first-party capture and attribution work.
- Treating chatbot answers as verified qualification without human review.
- Using client names/results without permission.
- Promising response times or international coverage that operations cannot sustain.
- Reporting signed pipeline as collected revenue or using inconsistent currency conversion.

## Definition of success at Day 90

The site should not be judged by visual changes alone. It should reliably create owned leads, preserve consent and attribution, route them to accountable people, enable consultation booking, connect proposals/contracts/collections to source, provide verified proof for priority services, and expose failures. Growth claims should then be based on observed funnel and revenue data—not projections invented from website traffic.
