# Firebase setup

No live Firebase project was created or modified during Sprint 1. Use a non-production project first.

## Prerequisites

- Node.js 22 and Firebase CLI authenticated to the intended Google account.
- A Firebase project with Blaze billing if Cloud Functions, Scheduler and outbound networking are required.
- Enable Email/Password Authentication, Firestore in Native mode, App Check for the web app, Cloud Functions, Secret Manager and Cloud Scheduler.
- Keep service-account JSON outside the repository. Prefer Application Default Credentials for administrative scripts.

## Local configuration

1. Copy `.env.example` to `.env.local` and add the Firebase web-app values. These identifiers are public, but still keep environment separation.
2. Install dependencies with `npm install` and `npm --prefix functions install`.
3. Select the non-production project with `firebase use PROJECT_ID` or pass `--project PROJECT_ID` on every command.
4. Run `firebase emulators:start --only auth,firestore,functions` for local work.
5. Run `npm run test:rules` while the emulator is available.

## Function parameters and secrets

Set secrets independently in each environment:

```bash
firebase functions:secrets:set IP_HASH_SECRET
firebase functions:secrets:set LEAD_PROXY_SHARED_SECRET
firebase functions:secrets:set N8N_WEBHOOK_URL
firebase functions:secrets:set N8N_SIGNING_SECRET
```

Set runtime parameters during deployment/configuration:

- `ALLOWED_ORIGINS`: exact comma-separated origins; include localhost only outside production.
- `REQUIRE_APP_CHECK`: start `false` for monitored validation, then change to `true` after App Check telemetry is healthy.
- `REQUIRE_TRUSTED_PROXY`: `true` in production when all traffic must pass through Vercel.

Use the same random proxy secret in Vercel and Firebase Functions. Use a different random secret for n8n signing. Rotate secrets by updating both ends in a controlled maintenance window.

## Vercel server environment

- `FIREBASE_LEADS_API_URL`: deployed `leadApi` URL.
- `FIREBASE_CRM_API_URL`: deployed `crmApi` URL.
- `LEAD_PROXY_SHARED_SECRET`: exact match to the Function secret.
- `ALLOWED_API_ORIGINS`: exact production origins.

Never prefix these values with `VITE_`.

## Provision staff

Create the user in Firebase Authentication, then authenticate locally with Application Default Credentials and run:

```bash
npm --prefix functions run provision-user -- --uid FIREBASE_UID --role sales_agent --brands codebell_development --name "Employee Name"
npm --prefix functions run configure-assignment -- --default-owner FIREBASE_UID
```

Allowed roles are `super_admin`, `admin`, `sales_manager`, `sales_agent`, and `viewer`. The user must sign out/in after claims change. Disable departing staff in Firebase Auth and set `crm_users/{uid}.status` to `disabled`; then remove their default assignment.

## App Check rollout

Register the production domains with reCAPTCHA Enterprise, add `VITE_FIREBASE_APPCHECK_SITE_KEY`, verify valid/invalid metrics, and only then enforce it. Debug tokens are local secrets and must never be committed. App Check supplements, but does not replace, origin checks, proxy signatures, validation, rate limiting or Authentication.

## Data lifecycle

Configure Firestore TTL for `rate_limits.expiresAt` and `idempotency_keys.expiresAt`. Define an approved retention policy for leads, contacts, activities and audit logs before production. TTL deletion is asynchronous and is not an authorization control.
