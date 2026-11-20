# Deployment checklist

This repository was not deployed during Sprint 1. Execute first in a non-production project and record owner/date/evidence for every item.

## Before deployment

- [ ] Review the Privacy Policy and retention/deletion language with the responsible legal/privacy owner; implementation added point-of-collection disclosure but did not rewrite legal terms.
- [ ] Confirm Firebase project, billing, regions, service ownership, least-privilege IAM and budget alerts.
- [ ] Enable Email/Password Auth, Firestore, Functions, Scheduler, Secret Manager and App Check monitoring.
- [ ] Set exact Firebase parameters/secrets and exact Vercel server variables; verify production does not allow localhost.
- [ ] Create an initial admin and default sales owner; test claims after a fresh sign-in.
- [ ] Import n8n workflow inactive, configure approved credentials/transports, execute signed non-PII tests, then activate.
- [ ] Run lint, frontend tests, Functions tests and the complete emulator rules suite.
- [ ] Review `npm audit` findings and approve/remediate upgrades without using an unreviewed force fix.
- [ ] Back up/record current Vercel, Firebase rules/indexes/Functions and n8n workflow versions for rollback.

## Staged release

- [ ] Deploy rules and indexes to non-production; wait until indexes are ready.
- [ ] Deploy Functions to non-production; keep `REQUIRE_TRUSTED_PROXY=true` when testing the real proxy path.
- [ ] Configure Vercel preview to those non-production Function URLs.
- [ ] Submit valid, invalid, duplicate, oversized, bot, rate-limit and backend-failure cases; confirm no lead loss and no PII in logs/analytics/notifications.
- [ ] Test all CRM roles, brand isolation, revocation, assignment and audit/activity writes.
- [ ] Enable App Check enforcement only after monitored legitimate traffic succeeds.
- [ ] Validate n8n retry, duplicate, unassigned and downstream-failure branches.
- [ ] Validate GA4 consent and event payloads in DebugView.
- [ ] Run responsive, keyboard, screen-reader and cross-browser smoke checks.
- [ ] Obtain product, security/privacy and operations sign-off.

## Production and rollback

- [ ] Deploy in a low-risk window and run a synthetic enquiry with clearly marked test data.
- [ ] Confirm reference, CRM visibility, assignment, activity, automation completion and internal notification.
- [ ] Monitor Function error/rate-limit/App Check metrics, Firestore usage, n8n failures/dead letters and lead-to-contact SLA.
- [ ] If intake fails, keep direct contact channels visible, roll Vercel back, restore prior Functions/rules/workflow versions as appropriate, and do not delete queued leads/events.
- [ ] Reconcile accepted lead references and outbox states after recovery; document the incident.

## Initial operating alerts

Alert on elevated `5xx`, repeated `rate_limited`, App Check rejection anomalies, `pending_configuration`, retry backlog, any `dead_letter`, notification failures, unassigned-lead age, Auth abuse and Firestore cost anomalies. Avoid PII in alert payloads.
