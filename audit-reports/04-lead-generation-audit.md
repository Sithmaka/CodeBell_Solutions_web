# Lead Generation, CRO, Sales Funnel, and Campaign Audit

## Current conversion-point inventory

| Conversion point | Location | Current behavior | Capture/measurement status |
|---|---|---|---|
| Get Started | Home hero (`src/pages/Home.jsx:125-131`) | Goes to `/services` | No event tracking |
| Contact Us / Start a Project | Home (`src/pages/Home.jsx:129-131`, `220-230`) | Goes to `/contact` | No event tracking |
| Get a Quote | Desktop/mobile nav (`src/components/common/Navbar.jsx:83-86`, `187-189`) | Goes to `/contact` | No source preservation or event tracking |
| Service Learn More | Services cards (`src/pages/Services.jsx:144-146`) | Goes to `/contact`, despite label | No service context passed |
| Start a Project / View Pricing | Services (`src/pages/Services.jsx:168-174`) | Both go to `/contact` | No distinction or event tracking |
| Portfolio CTA | Portfolio (`src/pages/Portfolio.jsx:211-217`) | Goes to `/contact` | No project/category context |
| Contact form | Contact (`src/pages/Contact.jsx:83-131`) | Opens prefilled WhatsApp URL in new window | No first-party record, success confirmation, attribution, consent, owner, or SLA |
| Direct contact | Contact (`src/pages/Contact.jsx:141-163`) | Email/phone/WhatsApp displayed as text | Not clickable or tracked |
| Project chatbot | Global (`src/components/chatbot/Chatbot.jsx:600-605`, `677-735`) | Long service-specific questionnaire; sends to optional webhook or WhatsApp | Optional lead capture; no visible consent/privacy link; no attribution beyond fixed source |
| AI support | Global/Support (`src/pages/Support.jsx:151-163`; `src/components/chatbot/Chatbot.jsx:608-675`) | Optional n8n chat; fallback to ticket/WhatsApp | Session ID in local storage; no analytics |
| Support ticket | Support (`src/pages/Support.jsx:188-320`) | Optional webhook; fallback opens email draft | Good form states/consent, but delivery depends on external setup |
| Ticket tracking | Support (`src/pages/Support.jsx:374-423`) | Optional status webhook | No live verification; privacy/security controls external |
| Newsletter/resources | None found | — | Missing |
| Consultation scheduling | None found | — | Missing |

## Homepage conversion assessment

### Five-second test

1. **What CodeBell does:** Partially clear—web applications, business systems, and mobile experiences are named (`src/pages/Home.jsx:119-123`).
2. **Who it serves:** Not clear beyond “businesses”; no company stage, buyer role, geography, or problem profile.
3. **Why it is credible:** Not clear above the fold. Decorative animation occupies the visual area and proof comes later as anonymous logos (`src/pages/Home.jsx:135-178`).
4. **What to do next:** Two CTAs exist, but “Get Started” means browse services rather than begin a conversion (`src/pages/Home.jsx:125-131`).

### Recommended homepage section order

1. Outcome-led hero: audience + offer + business result; primary “Book a discovery call,” secondary “Explore solutions.”
2. Verified trust strip: named/permissioned clients or factual delivery proof; otherwise omit logos.
3. Problems CodeBell solves: operational inefficiency, disconnected systems, customer experience, growth constraints.
4. Solution paths: linked service categories with buyer outcomes.
5. Selected case studies: challenge, CodeBell scope, verified result.
6. Why CodeBell: delivery model, communication, security/QA, handover/support—with evidence.
7. Delivery process: buyer inputs, outputs, stages, and next-step expectations.
8. Buyer-fit/engagement models: new product, modernization, automation, maintenance.
9. Sales FAQ: pricing approach, timeline, IP, support, remote delivery.
10. Consultation CTA plus direct contact and a concise privacy assurance.

## Form and lead-flow findings

| Severity | Status | Finding | Evidence | Business impact | Improvement | Complexity | Expected benefit |
|---|---|---|---|---|---|---|---|
| Critical | Confirmed | Contact submission depends on the visitor completing a WhatsApp send after a popup opens | `src/pages/Contact.jsx:15-38` | Abandoned drafts are invisible; no lead receipt, ownership, or recovery. | POST to a same-origin lead endpoint first; create CRM ID; show success; then offer WhatsApp. | Medium | Reliable lead ownership. |
| Critical | Confirmed | No attribution captured | Contact fields at `src/pages/Contact.jsx:83-126`; chatbot payload at `src/components/chatbot/Chatbot.jsx:702-711` | Cannot compare SEO, ads, referrals, or CTAs through revenue. | Capture landing URL, referrer, UTMs, click IDs where permitted, CTA ID, consent version, and anonymous/session ID; persist to CRM. | Medium | Channel and content optimization. |
| High | Confirmed | Contact form lacks explicit privacy notice/consent | `src/pages/Contact.jsx:83-131` | Visitors do not receive point-of-collection transparency before details are sent to WhatsApp. | Add concise notice, privacy link, and required consent only where legally appropriate; separate optional marketing consent. | Low | Better transparency and governance. |
| High | Confirmed | Form qualification is incomplete | `src/pages/Contact.jsx:86-126` | Sales must re-ask basics; service and message are optional; country/timeline/budget/preferences absent. | Use a short first step plus progressive optional qualifiers. | Low–Medium | More actionable enquiries without excessive friction. |
| High | Confirmed | Chatbot can ask 12–16 questions before capture | Service questions plus final questions (`src/components/chatbot/Chatbot.jsx:23-497`) | High abandonment before contact details; contact is asked last. | Capture business email/contact after service and problem, then progressively gather 3–5 relevant qualifiers; allow skip/save. | Medium | More recoverable partial leads. |
| High | Confirmed | Chatbot lead collection has no visible consent/privacy link | Summary/send UI at `src/components/chatbot/Chatbot.jsx:872-929` | Personal/project data may be sent to n8n or WhatsApp without clear point-of-collection notice. | Add data-use notice, privacy link, consent record, and separate channel-specific disclosure. | Low | Better compliance and trust. |
| Medium | Confirmed | Contact service taxonomy omits AI/Automation and differs across pages | `src/pages/Contact.jsx:110-118`; `src/components/chatbot/Chatbot.jsx:13-21` | Misclassification and lost intent. | Use one service enum across UI/API/CRM. | Low | Cleaner routing/reporting. |
| Medium | Confirmed | No meeting booking flow | No scheduling integration in repository | Adds back-and-forth and delays qualified opportunities. | Offer scheduling after successful qualification, with timezone detection/display and human fallback. | Medium | Shorter time-to-meeting. |
| Medium | Confirmed | No inline validation/error summary on Contact | Native required/email only (`src/pages/Contact.jsx:88-98`) | Errors and popup failures receive weak feedback. | Add accessible field errors, summary, loading, retry, and success receipt; retain server validation. | Medium | Better completion and accessibility. |
| Medium | Confirmed | Direct contact details are not links | `src/pages/Contact.jsx:141-163` | Adds mobile friction. | Use `mailto:`, `tel:`, and WhatsApp anchors; track click intent with consent-aware analytics. | Low | Easier contact. |

## Recommended low-friction B2B enquiry form

### Step 1 — required to create a lead

- Name — required.
- Business email — required; allow personal email for founders but flag it for scoring rather than rejecting.
- Company/organization — optional initially; required later for enterprise qualification.
- Country/timezone — required using country selection; needed for routing and scheduling.
- Service required — required; use canonical service taxonomy.
- Business problem/project description — required, 30–2,000 characters with sensitive-data warning.
- Preferred contact method — required (email, phone, WhatsApp, meeting).
- Privacy acknowledgment — required where appropriate; link policy and store policy version/timestamp.

### Step 2 — optional/progressive qualification

- Phone/WhatsApp number — required only if that contact method is selected.
- Budget range — optional with currency selector and “not sure / need guidance.” Do not expose only LKR for international users.
- Target timeline — optional with realistic ranges and “exploring.”
- Existing system/site URL — optional.
- Number of users/locations and integrations — conditional by service.
- Marketing updates consent — optional, unchecked, separate from enquiry processing.

Collect procurement, technical discovery, documents, and detailed module lists later. Do not require a 10–16 question chatbot sequence before creating a recoverable lead.

## Recommended B2B funnel

```text
Anonymous visit
  → engaged/high-intent visit
  → lead created (CRM ID + attribution + consent)
  → triage and deduplication
  → qualified / nurture / disqualified
  → discovery meeting booked and held
  → opportunity + solution discovery
  → proposal issued
  → negotiation / procurement
  → contract signed
  → payment/deposit collected
  → delivery onboarding
  → expansion/cross-brand referral (only with lawful basis/consent)
```

### Qualification criteria

Use transparent criteria that support prioritization without silently excluding people:

- Fit: requested service matches verified capability.
- Problem clarity: business problem and desired outcome are understandable.
- Authority: contact can sponsor, influence, or connect CodeBell to the decision group.
- Timing: target window and urgency are credible.
- Commercial viability: budget/procurement path aligns after discovery.
- Delivery readiness: access to stakeholders, data, systems, and content.
- Risk: legal, data, security, technical, or reputational constraints.

### Lead scoring example

Treat this as a routing model to validate, not a performance claim.

- +20: verified business email and organization.
- +20: high-fit service/problem.
- +15: clear timeline.
- +15: relevant budget/procurement path.
- +10: decision-maker or sponsor identified.
- +10: existing system/site or detailed context.
- +10: requested consultation.
- Negative flags: spam indicators, student/job enquiry, unsupported request, duplicate, incomplete contact.

Score bands should route work; they should not replace human review. Record why the score was assigned and audit for bias.

### Pipeline stages and ownership

| Stage | Entry condition | Owner | Required action/exit |
|---|---|---|---|
| New | Valid unique lead created | Sales coordinator | Acknowledge immediately; review during published service hours |
| Attempting contact | First response sent | Assigned salesperson | Complete defined multi-channel cadence or receive reply |
| Connected | Two-way contact | Salesperson | Confirm need, fit, stakeholders, timing |
| Qualified | Agreed fit criteria met | Account owner | Book discovery; create opportunity value range |
| Discovery | Meeting booked/held | Sales + solution lead | Document requirements, risks, next decision |
| Proposal | Approved proposal sent | Account owner | Track version, value, expiry, next meeting |
| Negotiation | Active commercial/procurement review | Sales lead | Resolve actions; maintain decision date |
| Contracted | Signed agreement | Sales/operations | Handoff checklist and invoice/deposit |
| Won / revenue pending | Contract signed | Finance/operations | Record collections separately from contract value |
| Won / collected | Required initial payment received | Finance | Start delivery and retention/expansion tracking |
| Nurture | Valid but not ready | Marketing/sales | Consent-based content/follow-up date |
| Lost/disqualified | Reason recorded | Sales manager | Capture structured reason; recovery date when appropriate |

### Response and recovery

- Publish a realistic service-hours response commitment only after staffing is verified. Suggested operational target for internal testing: immediate automated receipt and human triage within one business day; do not publish until consistently achieved.
- Alert on unassigned leads, failed notifications, overdue first response, no-show meetings, stalled proposals, and webhook dead letters.
- Use a limited, respectful follow-up cadence across the prospect’s chosen channels.
- Require explicit consent before newsletters or remarketing audience uploads.
- Record lost reasons such as no response, timing, budget, competitor, capability mismatch, trust/proof gap, or procurement failure.

## KPI framework

No baseline or target rate is asserted. Define each KPI in analytics and CRM before reporting.

| KPI | Definition |
|---|---|
| Sessions by channel | Consent-eligible sessions grouped by documented source/medium/campaign rules |
| Engaged high-intent sessions | Sessions reaching a service/case/contact action threshold |
| Visitor-to-lead rate | Unique valid leads ÷ eligible unique visitors |
| Lead completion rate | Successful lead records ÷ form/chat starts |
| Lead-to-qualified rate | Qualified leads ÷ valid leads |
| Qualified-to-meeting rate | Held qualified meetings ÷ qualified leads |
| Meeting-to-proposal rate | Proposals issued ÷ held discovery meetings |
| Proposal-to-close rate | Signed contracts ÷ proposals issued |
| Average contract value | Signed contract value ÷ signed contracts, with currency policy |
| Sales cycle duration | Median days from valid lead creation to signature; segment by service/source |
| Pipeline value | Stage-weighted and unweighted opportunity value, clearly labeled |
| Revenue collected | Cash collected and reconciled to opportunity, separate from booked value |
| Customer acquisition cost | Attributable sales + marketing cost ÷ new customers; attribution model documented |
| Speed to lead | Time from valid lead creation to first meaningful human response |
| Failure rate | Failed/duplicate/spam submissions and automation errors ÷ attempts |

## Campaign readiness by channel

| Channel | Readiness | Suitable current destination | Blockers | Required tracking/trust/content |
|---|---|---|---|---|
| Google Search Ads | Low | `/services` or `/contact`, neither ideal | No service pages, conversion tracking, first-party capture, negative-intent separation, or proof | Intent-specific landing page; lead/qualified/offline conversion events; call/WhatsApp tracking; proof; privacy/consent |
| LinkedIn | Low | Home for awareness only | Generic audience/value; no B2B case assets or firmographic capture | Role/industry-specific page; case study; LinkedIn Insight consent; CRM company/role fields; qualified-lead feedback |
| Facebook/Instagram | Low | Portfolio for creative awareness only | No campaign page, pixel/consent, retargeting governance, or low-friction offer | Visual proof, lead magnet only if genuinely useful, server/client event dedupe, consent-based audiences |
| Organic search | Medium-low | Home/About/Services | Thin service architecture, CSR metadata risk, no content/case cluster | Service pages, cases, technical fixes, Search Console, query-to-lead reporting |
| Referral | Medium-low | Home/Contact | No referral preservation or partner context | `referral_partner`/campaign parameter, tailored welcome copy, CRM source lock, partner terms |
| Email marketing | Not ready | None | No subscription form, preference records, suppression process, or content programme | Consent, double opt-in where appropriate, preferences/unsubscribe, CRM sync, useful content |
| Retargeting | Not ready | None | No consent management, pixels, audience policy, or exclusions | Consent-mode implementation, privacy update, audience windows, customer/converted exclusions, platform governance |

## CRO test backlog after measurement is live

Do not A/B test before accurate lead and quality measurement. Then prioritize:

1. Outcome-led hero vs current generic hero.
2. “Book a discovery call” vs “Request a project assessment” by service intent.
3. Short progressive form vs current all-at-once contact/long chatbot.
4. Case study proof immediately after hero vs after services.
5. Scheduling offered after qualification vs email-only follow-up.
6. Pricing approach/engagement guidance vs no commercial guidance.

Primary experiment outcome should be qualified opportunities or meetings held, not raw button clicks.
