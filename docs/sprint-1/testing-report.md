# Sprint 1 testing report

Date: 2026-10-10. Environment: local workspace, Node.js; no production credentials or deployment.

## Executed

| Check | Result | Evidence |
| --- | --- | --- |
| ESLint, frontend/API/Functions source | Pass | `npm run lint` |
| Frontend unit/component tests | Pass, 6/6 | validation, privacy, failed-submit preservation, synchronous double-submit guard, loading/success/WhatsApp states |
| Functions unit tests | Pass, 8/8 | validation/normalization, sizes, service values, idempotency format, attribution minimization, HMAC and permission helpers |
| Production frontend build | Pass | Vite generated `dist`; existing >500 kB chunk warning remains |
| Firestore rules tests | Authored; execution blocked by local Firebase CLI bootstrap failure | `firebase emulators:exec` exited without starting an emulator and wrote `firepit-log.txt`; anonymous deny, brand isolation, assigned-agent read, direct-write deny cases remain pending |

The build warning is performance-related, not a failed artifact. Route-level code splitting is a follow-up optimization.

## Pending external verification

- Firestore/Auth/Functions emulator suite via `npm run test:rules` using a repaired/current Firebase CLI; the installed global Firepit binary failed before reporting its version and misleadingly returned status 0.
- End-to-end lead transaction, reference counter and duplicate replay against a non-production Firebase project.
- Rate-limit window behavior and TTL cleanup.
- App Check monitor/enforce behavior.
- n8n import, signature rejection, duplicate branch, notification retry and dead-letter recovery.
- GA4 DebugView consent/events/PII inspection.
- CRM matrix with real test users and custom claims.
- Email/Slack/Teams delivery, mobile/responsive browser pass, keyboard/screen-reader pass, and rollback rehearsal.

## Acceptance mapping

- Structured CRM lead persistence: implemented; live integration pending.
- Server validation, size/rate/idempotency/abuse controls: implemented; distributed behavior pending emulator/cloud integration.
- Decoupled automation and fallback: implemented via outbox/retry/unassigned queue.
- CRM authentication/RBAC/audit: implemented; live role matrix pending.
- Consent-aware GA4 and attribution: implemented; property validation pending.
- No deployment: confirmed; all activation steps remain in the checklist.

Do not mark Sprint 1 production-ready until every pending external item has named evidence and owner approval.
