# CRM, n8n, AI, and Automation Plan

## Existing integration evidence

| Capability | Current code | Confirmed state / limitation |
|---|---|---|
| Chat | `VITE_CB_CHAT_URL`; posts n8n Chat Trigger shape (`src/lib/supportApi.js:64-76`) | Optional browser-to-webhook endpoint; production configuration and controls not verified |
| Ticket creation | `VITE_CB_TICKET_URL`; ticket payload (`src/lib/supportApi.js:79-81`) | Optional; mailto fallback in `src/pages/Support.jsx:91-104` |
| Ticket status | `VITE_CB_TICKET_STATUS_URL`; ticket number + email (`src/lib/supportApi.js:84-87`) | Optional; external authorization/enumeration controls not visible |
| Lead capture | `VITE_CB_LEAD_URL`; questionnaire payload (`src/lib/supportApi.js:89-91`; `src/components/chatbot/Chatbot.jsx:702-717`) | Optional; main Contact form does not use it |
| Session | Local-storage random chat session ID (`src/lib/supportApi.js:51-61`) | No expiration, consent classification, or server linkage visible |
| AI helper | Vercel function calls OpenAI Responses API (`api/generate-followup.js:1-111`) | Not referenced by frontend; wildcard CORS; no visible rate limiting/authentication |
| CRM | No SDK/API/schema found | Internal CodeBell CRM is not evidenced in repository |
| Scheduling | None found | Missing |
| Notifications | Claimed by support UI but implemented externally if at all (`src/pages/Support.jsx:43-60`) | Not verifiable |
| Proposal/payment | None found | Missing |

## Target architecture

```text
Browser UI
  └── same-origin API gateway / server functions
       ├── validation + normalization
       ├── rate limiting / bot defense
       ├── consent + attribution capture
       ├── idempotency + duplicate check
       ├── durable event/outbox write
       └── minimal success receipt with public lead/ticket reference
            ↓ signed server-to-server request
          n8n ingestion workflow
            ├── internal CRM upsert
            ├── owner assignment
            ├── email/WhatsApp acknowledgment
            ├── calendar/meeting path
            ├── SLA timer + alerts
            ├── human-approved proposal drafting
            └── audit/dead-letter log
```

The browser should not call privileged n8n workflow URLs directly. Public URLs can be known, but privilege must remain server-side. The gateway should return quickly after a durable write; notification and enrichment can run asynchronously.

## Canonical event model

Use versioned events with a stable envelope:

```json
{
  "event_id": "uuid",
  "event_type": "lead.created",
  "event_version": 1,
  "occurred_at": "ISO-8601 UTC",
  "source": "codebell.online",
  "correlation_id": "uuid",
  "actor": { "anonymous_id": "...", "crm_contact_id": null },
  "consent": { "policy_version": "...", "inquiry": true, "marketing": false },
  "attribution": { "landing_page": "...", "referrer": "...", "utm": {} },
  "payload": {}
}
```

Do not send secrets, raw IP addresses, or unnecessary personal data in events. Hash or minimize identifiers where analytics does not need identity.

### Recommended events

| Event | Trigger | Essential payload | Consumer |
|---|---|---|---|
| `lead.started` | First meaningful form interaction | anonymous ID, form/service, page, attribution | Analytics only |
| `lead.created` | Valid durable first-party record | lead ID, contact basics, service, problem, consent, attribution | CRM, acknowledgment, assignment |
| `lead.updated` | Progressive qualifier added | lead ID, changed fields, source | CRM |
| `lead.duplicate_detected` | Dedup match | new event ID, existing lead/contact ID, safe match type | CRM/audit |
| `lead.assigned` | Routing succeeds | lead ID, owner/team, assignment rule | CRM/notifications |
| `lead.qualified` / `lead.disqualified` | Human decision | criteria/score, reason, reviewer | CRM/analytics |
| `meeting.booked` / `meeting.held` / `meeting.no_show` | Calendar/CRM state | lead/opportunity ID, timezone, timestamp | CRM/analytics/follow-up |
| `opportunity.created` | Qualified commercial work begins | opportunity ID, service, value range/currency | CRM |
| `proposal.draft_created` | AI/template creates draft | opportunity ID, template/model/version | Human approval queue |
| `proposal.approved` / `proposal.sent` | Human approval/send | approver, version, value, expiry | CRM/audit |
| `contract.signed` | Signature confirmed | opportunity ID, signed date, value/currency | CRM/finance |
| `payment.collected` | Finance reconciliation | invoice/opportunity ID, amount/currency/date | Revenue reporting |
| `ticket.created` | Support request durably stored | ticket ID, customer/project, category, priority | Support/notifications |
| `ticket.status_changed` | Support update | ticket ID, from/to, owner, public message | Support/notification |
| `automation.failed` | Workflow exhausts retry policy | event/correlation ID, step, safe error code | Operations alert/dead letter |
| `consent.changed` | User opt-in/out or policy update | contact ID, purpose, state, source, timestamp | CRM/marketing suppression |
| `cross_brand_referral` | User consents to handoff | from/to brand, minimal data, basis, owner | CRM/audit |

## n8n workflow proposals

### Workflow 1 — Lead intake and acknowledgment

1. Receive signed, versioned `lead.created` from the same-origin gateway.
2. Verify timestamp/signature, schema, event ID, and source allowlist.
3. Check idempotency store; safely acknowledge duplicate delivery.
4. Normalize email/phone/country/service; reject or quarantine malformed data.
5. Search CRM for contact and active lead using normalized identifiers.
6. Upsert contact; create or update lead without overwriting first-touch attribution.
7. Apply transparent routing/score; assign owner and backup queue.
8. Send consent-appropriate acknowledgement with lead reference and next-step expectation.
9. Notify owner; start SLA timer.
10. Write audit record and success status. Retry transient failures with exponential backoff; dead-letter permanent failures.

### Workflow 2 — Qualification and booking

1. On high-fit lead or human triage, send secure scheduling link in visitor timezone.
2. Create `meeting.booked` and CRM activity when booked.
3. Send confirmation/reminders consistent with consent and chosen channel.
4. On cancellation/no-show, create a task and limited recovery sequence.
5. After the meeting, require the owner to record outcome, next step, value range, and date.

### Workflow 3 — AI-assisted lead summary

1. Redact unnecessary identifiers and sensitive text before model use.
2. Ask the model for structured summary, missing questions, risk flags, and service classification—not final qualification or promises.
3. Validate output schema; label it AI-generated with model/prompt version.
4. Present to a human owner for correction and approval.
5. Store approved summary separately from raw visitor input and retain audit history.

### Workflow 4 — Human-approved quotation draft

1. Trigger only after discovery requirements and commercial owner approval.
2. Populate an approved proposal template from CRM facts.
3. AI may suggest scope wording and questions but must not invent pricing, deadlines, client facts, legal clauses, or commitments.
4. Require solution lead, commercial owner, and where needed legal/finance approval.
5. Lock/version the approved document before sending.
6. Emit `proposal.sent`, schedule review follow-up, and preserve all revisions.

### Workflow 5 — Support ticket lifecycle

1. Validate and create ticket with unguessable public reference.
2. Link to authenticated/verified customer and project when possible; do not trust free-text project name alone.
3. Assign by category/contract/SLA; acknowledge with honest target.
4. Notify escalation path for verified critical incidents.
5. Keep public status response minimal; require stronger authentication for sensitive details.
6. Require customer confirmation or documented timeout policy before closure.

### Workflow 6 — Lost-lead recovery

1. Trigger from structured lost/no-response reasons.
2. Exclude unsubscribed, invalid, sensitive, and explicitly closed contacts.
3. Schedule a limited value-led follow-up based on reason/date.
4. Stop immediately on reply, opt-out, qualification, or hard bounce.
5. Report recovered qualified opportunities, not email opens alone.

## Security and privacy requirements

| Control | Requirement | Current evidence/gap |
|---|---|---|
| Server-side validation | Allowlist fields/enums; length/type limits; reject control characters/files unless scanned | Browser fields have only partial HTML constraints (`src/pages/Support.jsx:269-281`) |
| Authentication | Browser uses same-origin public submission; server authenticates internal services | Browser currently posts directly to configured endpoints (`src/lib/supportApi.js:33-45`) |
| Webhook signing | HMAC signature with timestamp/nonce; rotate secret; prevent replay | Not visible |
| Rate limiting | Per-IP/session/account thresholds with privacy-aware logging and burst controls | Not visible; honeypot only on support |
| Bot defense | Honeypot + behavioral/risk challenge after abuse, never as sole control | Support honeypot at `src/pages/Support.jsx:286-289` |
| Idempotency | Unique event/request key; exactly-once business effect despite retries | Not visible |
| Duplicate leads | Normalize email/phone/domain; merge rules; retain attribution chronology | Not visible |
| Encryption | TLS in transit; encrypted stores/backups; secrets only server-side | Hosting assumed, not verified |
| Data minimization | Avoid sensitive data prompts; warn users; redact logs/model inputs | Privacy warns at `src/pages/PrivacyPolicy.jsx:129-133`; chatbot does not |
| Consent | Purpose-specific records, policy version, timestamp, source, withdrawal/suppression | Support has one checkbox (`src/pages/Support.jsx:291-297`); contact/chat do not |
| Access control | Role-based least privilege; separate support/sales/finance; periodic review | Not visible |
| Audit | Append-only record of state changes, sends, approvals, exports, and admin access | Not visible |
| Retention | Documented schedules by raw lead, ticket, proposal, analytics, and logs | Privacy is general (`src/pages/PrivacyPolicy.jsx:176-186`) |
| Incident handling | Detection, escalation, containment, notification decision, postmortem | Not visible |
| AI governance | Vendor/data-use review, redaction, evaluation, model/prompt versions, human approval | UI discloses AI support (`src/pages/Support.jsx:340-346`) but backend governance unknown |

## Failure and retry design

- Return a success message only after the lead/ticket is durably recorded—not merely after n8n receives it.
- Use short synchronous validation and queue/outbox downstream work.
- Retry transient errors with exponential backoff and jitter; cap attempts.
- Never retry permanent schema/auth failures automatically.
- Store a dead-letter record with correlation ID and safe error class; alert an owner.
- Make email, WhatsApp, CRM, calendar, and analytics steps independently idempotent.
- Provide a reconciliation view for events not reflected in CRM.
- Do not expose internal error detail or whether a ticket/email exists to unauthenticated users.

## Analytics and attribution architecture

- Generate an anonymous first-party ID only after the appropriate consent decision; do not repurpose the support chat session without policy review.
- Preserve immutable first-touch and update last-touch attribution separately.
- Capture UTM parameters, documented ad click IDs, referring domain, landing path, CTA/form ID, and service context.
- Pass CRM lead/contact/opportunity IDs back to analytics only as non-PII references.
- Import qualified lead, proposal, contract, and collected-revenue outcomes to ad/analytics platforms only with a valid basis and platform-safe hashing.
- Deduplicate client/server events using the same `event_id`.
- Maintain a campaign naming policy and referral exclusions.

## Cross-brand handoff

1. Classify whether the need is business strategy, technology implementation, or both.
2. Explain the receiving brand and purpose to the prospect.
3. Prefer a contextual external link or explicit opt-in handoff.
4. Transfer only necessary data after legal ownership/controller roles are verified.
5. Create a referral record with both brand owners and separate source attribution.
6. Prevent both teams from sending overlapping outreach.

## Implementation sequence

1. Same-origin lead endpoint, schema, durable store, consent and attribution.
2. CRM upsert/assignment plus acknowledgment and failure queue.
3. Funnel events and reporting.
4. Booking and SLA workflows.
5. Support hardening and ticket authentication.
6. Human-reviewed AI summaries/quotation drafts.
7. Cross-brand referral only after governance approval.

## Acceptance criteria

- A test lead produces one durable lead, one CRM record, one owner, one acknowledgment, and traceable events despite duplicate delivery.
- Invalid, spam, oversized, replayed, and unauthenticated requests are rejected/rate-limited without exposing internals.
- First/last-touch attribution and consent history survive CRM updates.
- Every failed automation is visible and recoverable from a dead-letter process.
- No AI output can send a quotation, set price/timeline, or change pipeline state without human authorization.
- Access and exports are auditable; retention and deletion requests propagate to all relevant systems.
