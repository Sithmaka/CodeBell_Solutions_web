# API contract

Browser calls default to same-origin Vercel endpoints. Direct Function URLs are intended only for controlled local/emulator testing.

## `POST /api/leads`

Headers: `Content-Type: application/json`, `Idempotency-Key` (16–128 safe characters), optional `X-Firebase-AppCheck`.

Required JSON: `brandId` (`codebell_development`), `name`, `email`, `country`, IANA `timezone`, canonical `service`, `projectDescription` (30–4000 chars), `preferredContactMethod`, and `privacyAcknowledged: true`.

Conditional: `phone` is required for phone/WhatsApp preference. Optional: `companyName`, budget range/currency, timeline, existing HTTP(S) URL, separate `marketingOptIn`, honeypot `website`, and sanitized `source` fields.

Canonical service values: `custom_software`, `erp_crm_hrms`, `ai_automation`, `website_ecommerce`, `mobile_app`, `integrations_maintenance`, `other`.

Success (`201`, or `200` for an idempotent replay):

```json
{"success":true,"duplicate":false,"leadReference":"CB-2026-000001","message":"Your enquiry has been received."}
```

Errors use `{ "success": false, "error": { "code", "message", "fields?" } }`. Expected statuses: `400` invalid idempotency key, `401` proxy/App Check failure, `403` origin, `413` size, `415` media type, `422` validation, `429` rate limit, `5xx` transient/configuration.

The same key with the same normalized request returns the original reference. Reuse with different data returns `409 idempotency_conflict`.

## `POST /api/crm`

Headers: JSON, Firebase `Authorization: Bearer ID_TOKEN`, optional App Check. All requests include `leadId` and one action:

- `{ "action": "update_status", "status": "qualified" }`
- `{ "action": "assign", "assignedTo": "FIREBASE_UID_OR_NULL" }` (manager only)
- `{ "action": "add_note", "note": "..." }`
- `{ "action": "schedule_followup", "followupAt": "2026-10-12T09:30:00.000Z" }`

Success: `200 {"success":true}`. Authentication/authorization uses `401/403`; unknown lead `404`; invalid actions `422`.

## Function-to-n8n event

Headers: `X-Codebell-Timestamp`, `X-Codebell-Signature = HMAC_SHA256(secret, timestamp + "." + exact_json_body)`, and `X-Codebell-Event-Id`.

The versioned `lead.created` body includes IDs/reference, canonical service, assignment state and CRM-relative path. It deliberately excludes name, email, phone and free-text requirements.
