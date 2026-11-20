# n8n integration

Workflow: `n8n/CB-LEAD-INTAKE-001.json`. It is intentionally inactive after import.

## Configure

1. Import the JSON into the intended n8n environment.
2. Set `CB_N8N_SIGNING_SECRET` to the same value as Firebase `N8N_SIGNING_SECRET`.
3. Set `CB_CRM_BASE_URL` to the production origin.
4. Set `CB_NOTIFICATION_WEBHOOK_URL` to an approved internal email/Slack/Teams adapter. The notification contains only reference, canonical service, submission time, CRM link and assigned owner/unassigned state.
5. If the n8n security policy blocks environment access or Node `crypto` in Code nodes, replace the verifier with an approved credential-backed custom node before activation. Do not weaken signature validation.
6. Use the test payload, calculate a fresh timestamp/signature over the exact compact JSON body, execute manually, inspect both branches, then activate and copy the production webhook URL to Firebase `N8N_WEBHOOK_URL`.

## Idempotency and retries

Firebase owns reliable delivery through the Firestore outbox, transactional claim, exponential backoff and scheduled recovery. n8n checks `event_id` using workflow static data and acknowledges repeats. Static data is suitable for this single-instance Sprint 1 workflow but is not a durable concurrency-safe idempotency store; before queue-mode/multi-worker scaling, replace it with a database unique key and retention policy.

Firebase retries non-2xx/timeouts up to the configured maximum, then marks `dead_letter`. Missing configuration is retried every five minutes. n8n should return 2xx only after its required action succeeds; notification transport failure therefore triggers Firebase retry.

## Verification payload

`n8n/test-payloads/lead-created.json` contains non-personal sample data. Never paste a production lead into manual executions. Verify:

- expired/incorrect signatures fail;
- wrong event version/brand fails;
- first event routes and notifies;
- repeat event returns `duplicate: true` without notifying again;
- unassigned events show `unassigned_queue`;
- downstream failure produces non-2xx and later retry;
- execution logs do not contain lead PII.
