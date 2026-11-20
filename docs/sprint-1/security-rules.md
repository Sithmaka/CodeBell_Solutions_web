# Security rules and controls

`firestore.rules` defaults to deny. Anonymous visitors cannot access Firestore directly. Authenticated users require both an allowed `crm_role` claim and the record's `brandId` in `crm_brands`.

## Read policy

- Managers (`super_admin`, `admin`, `sales_manager`) and `viewer` can read leads for permitted brands.
- `sales_agent` can read only leads assigned to their own Firebase UID.
- Activities mirror lead assignment visibility.
- Admins can read audit logs; managers can read automation status.
- Managers can list eligible CRM users; individuals can get their own profile.
- Contacts/companies are brand-scoped and limited to managers/viewers; agents use the contact snapshot only on their assigned lead.

## Write policy

All client writes to business and operational collections are denied. Lead intake and CRM changes use Admin SDK Functions. `crmApi` repeats token revocation, role, brand, assignment and action checks, then writes mutation/activity/audit in one transaction. A `viewer` cannot mutate; an agent cannot assign or edit another agent's lead.

## Public endpoint controls

- Exact origin allowlist and same-origin proxy.
- HMAC-signed timestamp, body hash and effective IP between Vercel and Functions.
- Optional/enforceable App Check.
- 16 KiB body ceiling, content-type and method restrictions.
- Server-side field allowlisting, lengths, formats and canonical service validation.
- Honeypot, distributed HMAC-hashed IP window, idempotency keys and generic errors.
- Secrets remain server-side; logs contain codes/IDs rather than submitted PII.

## Test expectations

Rules tests cover anonymous denial, manager brand isolation, assigned-agent visibility, and direct-write denial. Run them against the Firestore emulator before release. Also manually test revoked tokens, wrong-brand claims, unassigned-agent access, forbidden assignment, invalid App Check, origin rejection and proxy replay expiry.

Rules do not protect Admin SDK code. Any new Function must repeat authorization and data-minimization checks and add activity/audit evidence where appropriate.
