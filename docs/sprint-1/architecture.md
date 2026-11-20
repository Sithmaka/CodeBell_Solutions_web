# Sprint 1 architecture

Status: implemented locally; not deployed. Brand scope: `codebell_development`.

## Lead path

1. The React contact form validates required fields and sends JSON to same-origin `POST /api/leads` with a browser-generated idempotency key. WhatsApp is offered only after a successful response.
2. The Vercel route enforces method, origin and body-size limits, forwards App Check when present, and signs the exact body, timestamp and effective client IP with `LEAD_PROXY_SHARED_SECRET`.
3. `leadApi` verifies origin/proxy/App Check policy, applies a distributed Firestore rate limit, validates and normalizes all fields, then runs one transaction.
4. The transaction creates or links a deterministic contact, assigns a human-readable reference, stores the lead and consent/source metadata, records an activity, and writes an outbox event plus idempotency record.
5. `dispatchLeadEvent` sends a small signed `lead.created` event to n8n after persistence. It never sends the full contact record.
6. n8n validates signature, timestamp, schema and event ID; acknowledges duplicates; confirms assigned/unassigned routing; and calls a separately configured notification transport.
7. Failed dispatches use exponential retry. The five-minute scheduler also recovers `pending_configuration` events; terminal failures become `dead_letter` and create an activity.

The database commit is the source of truth. Notification failure cannot lose or roll back an accepted enquiry.

## CRM path

Firebase Authentication signs staff in at `/internal/crm/login`. Custom claims carry `crm_role` and `crm_brands`. Firestore rules permit only authorized reads; all browser writes are denied. Mutations use `POST /api/crm`, which validates a fresh Firebase ID token and writes the lead change, activity and audit log atomically.

## Trust boundaries

- Browser input, URL parameters, attribution and IDs are untrusted.
- `VITE_*` configuration is public and must never contain a secret.
- Vercel holds proxy secrets and Function URLs; Firebase/Google Secret Manager holds Functions and n8n secrets.
- Firestore Admin SDK bypasses rules, so Functions repeat authentication, role, brand and assignment checks.
- n8n is downstream automation, not the lead database.

## Failure states

- Validation: `422`, field errors, form data retained.
- Duplicate request: original reference returned with `duplicate: true`.
- Rate limit: `429`, generic retry guidance.
- Firebase unavailable: form retains data and direct email/phone remain visible.
- n8n unconfigured/unavailable: lead remains stored; event waits or retries.
- No eligible default owner: lead is stored with `assignmentState: unassigned` for manual routing.

## Future multi-brand expansion

Every operational record has `brandId`; authorization claims list brands; rules and queries enforce brand scope. New brands should receive a brand document, distinct origin/domain settings, assignment configuration, taxonomy, templates, and per-brand access tests before activation.
