# Firestore schema

All timestamps are server timestamps unless explicitly supplied. All business collections include `brandId`.

## Business collections

### `brands/{brandId}`

`brandId`, `name`, `domain`, `status`, `updatedAt`. Sprint 1 uses `codebell_development`.

### `contacts/{sha256(brandId:normalizedEmail)}`

`brandId`, `name`, `email`, `normalizedEmail`, `phone`, `companyId`, `createdAt`, `updatedAt`. The deterministic identifier makes contact linking transactional without exposing email in a document path.

### `companies/{companyId}`

Reserved for normalized company records: `brandId`, `name`, `domain`, `country`, `createdAt`, `updatedAt`. Sprint 1 stores submitted company text on the lead and leaves `companyId` null.

### `leads/{leadId}`

- Identity: `brandId`, `leadReference`, `contactId`, `companyId`.
- Contact snapshot: `name`, `email`, `phone`, `companyName`, `country`, `timezone`.
- Qualification: `service`, `projectDescription`, `budgetRange`, `budgetCurrency`, `timeline`, `existingSystemUrl`, `preferredContactMethod`.
- Workflow: `status`, `qualificationStatus`, `assignedTo`, `assignmentState`, optional `nextFollowupAt`.
- Attribution: `source.website`, sanitized first/last touch fields, UTM fields and `ctaId`.
- Consent: `privacyAcknowledged`, `privacyNoticeVersion`, `marketingOptIn`, `recordedAt`.
- Audit dates: `createdAt`, `updatedAt`.

References use `CB-YYYY-NNNNNN`; the random Firestore document ID remains the internal identifier.

### `activities/{activityId}`

`brandId`, `leadId`, `eventType`, `actorType`, `actorId`, `assignedTo`, `timestamp`, and bounded `metadata`. Used for lead-created, assignment, status, notes, follow-ups and automation outcomes.

### `crm_users/{firebaseUid}`

`displayName`, `email`, `role`, `brands[]`, `status`, `updatedAt`. This mirrors administrative claims for display/assignment; custom claims remain the authorization source.

### `audit_logs/{auditId}`

`brandId`, `entityType`, `entityId`, `action`, `actorId`, `actorRole`, `timestamp`, `metadata`. Only admin roles may read these records.

## Operational collections

- `automation_events/{eventId}`: outbox state, `eventType`, `eventVersion`, `leadId`, status, attempts, retry time, last error and timestamps.
- `idempotency_keys/{hash}`: request hash, original lead ID/reference and 24-hour expiry.
- `rate_limits/{hash}`: HMAC-derived network bucket, count and TTL expiry; raw IP is not stored.
- `counters/{brandId}_leads_{year}`: atomic yearly reference sequence.
- `crm_config/{brandId}_lead_assignment`: `defaultSalesOwnerUid`.

## Indexes and pagination

`firestore.indexes.json` defines brand/created, brand/assignee/created, brand/status/created, activity brand/lead/time (plus the agent-assignment variant), and automation status/retry indexes. The CRM reads 26 documents, displays 25, and passes the last snapshot to `startAfter`. It does not use unbounded reads or offset pagination.
