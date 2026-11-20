import { initializeApp } from "firebase-admin/app";
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineBoolean, defineSecret, defineString } from "firebase-functions/params";
import {
  AUTOMATION_MAX_ATTEMPTS,
  BRAND_DOMAIN,
  BRAND_ID,
  LEAD_STATUSES,
  MAX_BODY_BYTES,
  PRIVACY_NOTICE_VERSION,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
} from "./config.js";
import {
  canManageLead,
  authenticateCrmRequest,
  hmac,
  isManager,
  requestIp,
  sha256,
  timingSafeEqualHex,
  verifyOptionalAppCheck,
} from "./security.js";
import {
  equivalentPayloadHashInput,
  requestBodySize,
  validateIdempotencyKey,
  validateLeadInput,
} from "./validation.js";

initializeApp();
const db = getFirestore();

const ALLOWED_ORIGINS = defineString("ALLOWED_ORIGINS", {
  default: "https://www.codebell.online,https://codebell.online,http://localhost:5173",
});
const REQUIRE_APP_CHECK = defineBoolean("REQUIRE_APP_CHECK", { default: false });
const REQUIRE_TRUSTED_PROXY = defineBoolean("REQUIRE_TRUSTED_PROXY", { default: false });
const IP_HASH_SECRET = defineSecret("IP_HASH_SECRET");
const LEAD_PROXY_SHARED_SECRET = defineSecret("LEAD_PROXY_SHARED_SECRET");
const N8N_WEBHOOK_URL = defineSecret("N8N_WEBHOOK_URL");
const N8N_SIGNING_SECRET = defineSecret("N8N_SIGNING_SECRET");

const FUNCTION_SECRETS = [IP_HASH_SECRET, LEAD_PROXY_SHARED_SECRET];
const AUTOMATION_SECRETS = [N8N_WEBHOOK_URL, N8N_SIGNING_SECRET];

function paramValue(param, envName) {
  return process.env[envName] || param.value() || "";
}

function allowedOrigins() {
  return new Set(ALLOWED_ORIGINS.value().split(",").map((value) => value.trim()).filter(Boolean));
}

function applyCors(req, res) {
  const origin = req.get("origin");
  if (origin && allowedOrigins().has(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
  }
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Authorization, Content-Type, Idempotency-Key, X-Firebase-AppCheck");
  res.set("Cache-Control", "no-store");
  return !origin || allowedOrigins().has(origin);
}

function jsonError(res, status, code, message, fields) {
  const body = { success: false, error: { code, message } };
  if (fields) body.error.fields = fields;
  return res.status(status).json(body);
}

function rawRequestBody(req) {
  return req.rawBody instanceof Buffer ? req.rawBody : Buffer.from(JSON.stringify(req.body ?? {}));
}

function verifyTrustedProxy(req) {
  const required = REQUIRE_TRUSTED_PROXY.value();
  const timestamp = req.get("x-codebell-proxy-timestamp");
  const signature = req.get("x-codebell-proxy-signature");
  const clientIp = req.get("x-codebell-client-ip") || "unknown";
  if (!timestamp || !signature) {
    if (required) throw Object.assign(new Error("Trusted proxy required"), { status: 401, code: "proxy_required" });
    return false;
  }
  const age = Math.abs(Date.now() - Number(timestamp));
  if (!Number.isFinite(age) || age > 5 * 60 * 1000) {
    throw Object.assign(new Error("Expired proxy request"), { status: 401, code: "expired_proxy_request" });
  }
  const secret = paramValue(LEAD_PROXY_SHARED_SECRET, "LEAD_PROXY_SHARED_SECRET");
  if (!secret) throw Object.assign(new Error("Proxy verification unavailable"), { status: 503, code: "configuration_unavailable" });
  const bodyHash = sha256(rawRequestBody(req));
  const expected = hmac(secret, `${timestamp}.${clientIp}.${bodyHash}`);
  if (!timingSafeEqualHex(signature, expected)) {
    throw Object.assign(new Error("Invalid proxy signature"), { status: 401, code: "invalid_proxy_signature" });
  }
  return true;
}

async function enforceRateLimit(ip) {
  const secret = paramValue(IP_HASH_SECRET, "IP_HASH_SECRET");
  if (!secret) throw Object.assign(new Error("Rate limiting unavailable"), { status: 503, code: "configuration_unavailable" });
  const now = Date.now();
  const bucket = Math.floor(now / RATE_LIMIT_WINDOW_MS);
  const key = hmac(secret, `${bucket}:${ip}`);
  const ref = db.collection("rate_limits").doc(key);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const count = snapshot.exists ? Number(snapshot.data().count || 0) : 0;
    if (count >= RATE_LIMIT_MAX) {
      throw Object.assign(new Error("Too many requests"), { status: 429, code: "rate_limited" });
    }
    transaction.set(ref, {
      count: count + 1,
      window: bucket,
      expiresAt: Timestamp.fromMillis((bucket + 2) * RATE_LIMIT_WINDOW_MS),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  });
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function publicLeadReference(year, sequence) {
  return `CB-${year}-${String(sequence).padStart(6, "0")}`;
}

async function persistLead(lead, idempotencyKey) {
  const requestHash = sha256(equivalentPayloadHashInput(lead));
  const idempotencyId = sha256(`${lead.brandId}:${idempotencyKey}`);
  const idempotencyRef = db.collection("idempotency_keys").doc(idempotencyId);
  const year = new Date().getUTCFullYear();
  const counterRef = db.collection("counters").doc(`${lead.brandId}_leads_${year}`);
  const normalizedEmail = normalizeEmail(lead.email);
  const contactRef = db.collection("contacts").doc(sha256(`${lead.brandId}:${normalizedEmail}`));
  const assignmentRef = db.collection("crm_config").doc(`${lead.brandId}_lead_assignment`);
  const leadRef = db.collection("leads").doc();
  const eventRef = db.collection("automation_events").doc();
  const activityRef = db.collection("activities").doc();
  const brandRef = db.collection("brands").doc(lead.brandId);

  return db.runTransaction(async (transaction) => {
    const [idempotencySnapshot, counterSnapshot, contactSnapshot, assignmentSnapshot] = await Promise.all([
      transaction.get(idempotencyRef),
      transaction.get(counterRef),
      transaction.get(contactRef),
      transaction.get(assignmentRef),
    ]);

    if (idempotencySnapshot.exists) {
      const existing = idempotencySnapshot.data();
      if (existing.requestHash !== requestHash) {
        throw Object.assign(new Error("Idempotency key was already used for different data"), {
          status: 409,
          code: "idempotency_conflict",
        });
      }
      return {
        duplicate: true,
        leadId: existing.leadId,
        leadReference: existing.leadReference,
      };
    }

    const nextSequence = Number(counterSnapshot.data()?.value || 0) + 1;
    const leadReference = publicLeadReference(year, nextSequence);
    const assignment = assignmentSnapshot.exists ? assignmentSnapshot.data() : {};
    const assignedTo = typeof assignment.defaultSalesOwnerUid === "string"
      ? assignment.defaultSalesOwnerUid
      : null;
    const now = FieldValue.serverTimestamp();

    if (!contactSnapshot.exists) {
      transaction.create(contactRef, {
        brandId: lead.brandId,
        name: lead.name,
        email: lead.email,
        normalizedEmail,
        phone: lead.phone,
        companyId: null,
        createdAt: now,
        updatedAt: now,
      });
    }

    transaction.set(counterRef, { value: nextSequence, updatedAt: now }, { merge: true });
    transaction.set(brandRef, {
      brandId: BRAND_ID,
      name: "CodeBell Development",
      domain: BRAND_DOMAIN,
      status: "active",
      updatedAt: now,
    }, { merge: true });
    transaction.create(leadRef, {
      brandId: lead.brandId,
      leadReference,
      contactId: contactRef.id,
      companyId: null,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      companyName: lead.companyName,
      country: lead.country,
      timezone: lead.timezone,
      service: lead.service,
      projectDescription: lead.projectDescription,
      budgetRange: lead.budgetRange,
      budgetCurrency: lead.budgetCurrency,
      timeline: lead.timeline,
      existingSystemUrl: lead.existingSystemUrl,
      preferredContactMethod: lead.preferredContactMethod,
      status: "new",
      qualificationStatus: "unreviewed",
      assignedTo,
      assignmentState: assignedTo ? "assigned" : "unassigned",
      source: {
        website: BRAND_DOMAIN,
        ...lead.source,
        firstTouch: lead.source,
        lastTouch: lead.source,
      },
      consent: {
        privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
        privacyAcknowledged: true,
        marketingOptIn: lead.marketingOptIn,
        recordedAt: now,
      },
      createdAt: now,
      updatedAt: now,
    });
    transaction.create(eventRef, {
      eventId: eventRef.id,
      eventType: "lead.created",
      eventVersion: 1,
      brandId: lead.brandId,
      leadId: leadRef.id,
      status: "pending",
      attemptCount: 0,
      nextAttemptAt: Timestamp.now(),
      lastErrorCode: null,
      createdAt: now,
      updatedAt: now,
    });
    transaction.create(activityRef, {
      brandId: lead.brandId,
      leadId: leadRef.id,
      eventType: "lead_created",
      actorType: "website_visitor",
      actorId: null,
      assignedTo,
      timestamp: now,
      metadata: { leadReference, service: lead.service },
    });
    transaction.create(idempotencyRef, {
      brandId: lead.brandId,
      leadId: leadRef.id,
      leadReference,
      requestHash,
      createdAt: now,
      expiresAt: Timestamp.fromMillis(Date.now() + 24 * 60 * 60 * 1000),
    });

    return { duplicate: false, leadId: leadRef.id, leadReference };
  });
}

export const leadApi = onRequest({
  region: "asia-south1",
  cors: false,
  secrets: FUNCTION_SECRETS,
  timeoutSeconds: 30,
  memory: "256MiB",
}, async (req, res) => {
  const originAllowed = applyCors(req, res);
  if (req.method === "OPTIONS") return res.status(originAllowed ? 204 : 403).end();
  if (!originAllowed) return jsonError(res, 403, "origin_not_allowed", "This origin is not allowed.");
  if (req.method !== "POST") return jsonError(res, 405, "method_not_allowed", "Use POST.");
  if (!req.is("application/json")) return jsonError(res, 415, "unsupported_media_type", "Use application/json.");

  try {
    const declaredLength = Number(req.get("content-length") || 0);
    if (declaredLength > MAX_BODY_BYTES || requestBodySize(req.body) > MAX_BODY_BYTES) {
      return jsonError(res, 413, "payload_too_large", "The submission is too large.");
    }
    const proxyVerified = verifyTrustedProxy(req);
    await verifyOptionalAppCheck(req, REQUIRE_APP_CHECK.value());
    await enforceRateLimit(requestIp(req, proxyVerified));

    const idempotencyKey = req.get("idempotency-key");
    if (!validateIdempotencyKey(idempotencyKey)) {
      return jsonError(res, 400, "invalid_idempotency_key", "A valid Idempotency-Key header is required.");
    }

    const validation = validateLeadInput(req.body);
    if (!validation.valid) {
      return jsonError(
        res,
        validation.oversized ? 413 : 422,
        validation.oversized ? "payload_too_large" : "validation_failed",
        "Please check the highlighted fields.",
        validation.errors,
      );
    }

    // Honeypot submissions receive a generic response without storing data.
    if (validation.value.honeypot) {
      return res.status(202).json({ success: true, leadReference: null, message: "Your enquiry has been received." });
    }

    const result = await persistLead(validation.value, idempotencyKey);
    return res.status(result.duplicate ? 200 : 201).json({
      success: true,
      duplicate: result.duplicate,
      leadReference: result.leadReference,
      message: "Your enquiry has been received.",
    });
  } catch (error) {
    console.error("leadApi", { code: error.code || "internal_error", message: error.message });
    const status = Number(error.status) || 500;
    return jsonError(
      res,
      status,
      error.code || "temporary_failure",
      status >= 500 ? "We could not save your enquiry right now. Please try again." : error.message,
    );
  }
});

function n8nEventPayload(event, lead) {
  return {
    event_id: event.eventId,
    event_type: event.eventType,
    event_version: event.eventVersion,
    occurred_at: lead.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
    source: BRAND_DOMAIN,
    correlation_id: event.eventId,
    actor: { type: "website_visitor" },
    payload: {
      brand_id: lead.brandId,
      lead_id: event.leadId,
      lead_reference: lead.leadReference,
      service: lead.service,
      assigned_to: lead.assignedTo,
      assignment_state: lead.assignmentState,
      crm_path: `/internal/crm/leads/${event.leadId}`,
    },
  };
}

async function claimAutomationEvent(eventRef) {
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(eventRef);
    if (!snapshot.exists) return null;
    const event = snapshot.data();
    if (["completed", "dead_letter", "processing"].includes(event.status)) return null;
    if (event.nextAttemptAt?.toMillis?.() > Date.now()) return null;
    transaction.update(eventRef, { status: "processing", updatedAt: FieldValue.serverTimestamp() });
    return event;
  });
}

async function processAutomationEvent(eventId) {
  const eventRef = db.collection("automation_events").doc(eventId);
  const event = await claimAutomationEvent(eventRef);
  if (!event) return { skipped: true };
  const webhookUrl = paramValue(N8N_WEBHOOK_URL, "N8N_WEBHOOK_URL");
  const signingSecret = paramValue(N8N_SIGNING_SECRET, "N8N_SIGNING_SECRET");
  if (!webhookUrl || !signingSecret) {
    await eventRef.update({
      status: "pending_configuration",
      lastErrorCode: "n8n_not_configured",
      updatedAt: FieldValue.serverTimestamp(),
    });
    return { configured: false };
  }

  try {
    const leadSnapshot = await db.collection("leads").doc(event.leadId).get();
    if (!leadSnapshot.exists) throw Object.assign(new Error("Lead missing"), { code: "lead_missing", permanent: true });
    const payload = n8nEventPayload(event, leadSnapshot.data());
    const body = JSON.stringify(payload);
    const timestamp = String(Date.now());
    const signature = hmac(signingSecret, `${timestamp}.${body}`);
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-codebell-timestamp": timestamp,
        "x-codebell-signature": signature,
        "x-codebell-event-id": event.eventId,
      },
      body,
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw Object.assign(new Error(`n8n returned ${response.status}`), { code: `n8n_${response.status}` });
    const activityRef = db.collection("activities").doc();
    const batch = db.batch();
    batch.update(eventRef, {
      status: "completed",
      attemptCount: Number(event.attemptCount || 0) + 1,
      completedAt: FieldValue.serverTimestamp(),
      lastErrorCode: null,
      updatedAt: FieldValue.serverTimestamp(),
    });
    batch.create(activityRef, {
      brandId: event.brandId,
      leadId: event.leadId,
      eventType: "automation_dispatched",
      actorType: "system",
      actorId: "lead_event_dispatcher",
      assignedTo: leadSnapshot.data().assignedTo || null,
      timestamp: FieldValue.serverTimestamp(),
      metadata: { eventId: event.eventId },
    });
    await batch.commit();
    return { completed: true };
  } catch (error) {
    const attemptCount = Number(event.attemptCount || 0) + 1;
    const deadLetter = error.permanent || attemptCount >= AUTOMATION_MAX_ATTEMPTS;
    const delayMinutes = Math.min(60, 2 ** attemptCount);
    await eventRef.update({
      status: deadLetter ? "dead_letter" : "retry_scheduled",
      attemptCount,
      nextAttemptAt: deadLetter ? null : Timestamp.fromMillis(Date.now() + delayMinutes * 60 * 1000),
      lastErrorCode: String(error.code || "dispatch_failed").slice(0, 80),
      updatedAt: FieldValue.serverTimestamp(),
    });
    if (deadLetter) {
      await db.collection("activities").add({
        brandId: event.brandId,
        leadId: event.leadId,
        eventType: "notification_failed",
        actorType: "system",
        actorId: "lead_event_dispatcher",
        assignedTo: null,
        timestamp: FieldValue.serverTimestamp(),
        metadata: { eventId: event.eventId, errorCode: String(error.code || "dispatch_failed").slice(0, 80) },
      });
    }
    console.error("automation dispatch", { eventId, code: error.code || "dispatch_failed" });
    return { completed: false, deadLetter };
  }
}

export const dispatchLeadEvent = onDocumentCreated({
  document: "automation_events/{eventId}",
  region: "asia-south1",
  secrets: AUTOMATION_SECRETS,
  retry: false,
}, async (event) => processAutomationEvent(event.params.eventId));

export const retryLeadEvents = onSchedule({
  schedule: "every 5 minutes",
  region: "asia-south1",
  secrets: AUTOMATION_SECRETS,
  timeoutSeconds: 240,
}, async () => {
  const snapshot = await db.collection("automation_events")
    .where("status", "in", ["retry_scheduled", "pending_configuration"])
    .where("nextAttemptAt", "<=", Timestamp.now())
    .limit(25)
    .get();
  await Promise.all(snapshot.docs.map((document) => processAutomationEvent(document.id)));
});

function validateCrmAction(body) {
  if (!body || typeof body !== "object") return { error: "Invalid body" };
  if (typeof body.leadId !== "string" || !/^[A-Za-z0-9]{10,40}$/.test(body.leadId)) return { error: "Invalid lead" };
  if (!["update_status", "assign", "add_note", "schedule_followup"].includes(body.action)) return { error: "Invalid action" };
  return { value: body };
}

export const crmApi = onRequest({
  region: "asia-south1",
  cors: false,
  secrets: FUNCTION_SECRETS,
  timeoutSeconds: 30,
  memory: "256MiB",
}, async (req, res) => {
  const originAllowed = applyCors(req, res);
  if (req.method === "OPTIONS") return res.status(originAllowed ? 204 : 403).end();
  if (!originAllowed) return jsonError(res, 403, "origin_not_allowed", "This origin is not allowed.");
  if (req.method !== "POST") return jsonError(res, 405, "method_not_allowed", "Use POST.");
  if (!req.is("application/json")) return jsonError(res, 415, "unsupported_media_type", "Use application/json.");
  if (requestBodySize(req.body) > MAX_BODY_BYTES) return jsonError(res, 413, "payload_too_large", "The request is too large.");

  try {
    verifyTrustedProxy(req);
    await verifyOptionalAppCheck(req, REQUIRE_APP_CHECK.value());
    const user = await authenticateCrmRequest(req);
    const validation = validateCrmAction(req.body);
    if (validation.error) return jsonError(res, 422, "validation_failed", validation.error);
    const { action, leadId } = validation.value;
    const leadRef = db.collection("leads").doc(leadId);
    const activityRef = db.collection("activities").doc();
    const auditRef = db.collection("audit_logs").doc();

    await db.runTransaction(async (transaction) => {
      const leadSnapshot = await transaction.get(leadRef);
      if (!leadSnapshot.exists) throw Object.assign(new Error("Lead not found"), { status: 404, code: "not_found" });
      const lead = leadSnapshot.data();
      if (!canManageLead(user, lead)) throw Object.assign(new Error("Access denied"), { status: 403, code: "forbidden" });

      const now = FieldValue.serverTimestamp();
      let eventType;
      let changes;
      let metadata = {};
      if (action === "update_status") {
        if (!LEAD_STATUSES.has(req.body.status)) throw Object.assign(new Error("Invalid status"), { status: 422, code: "validation_failed" });
        eventType = "lead_status_changed";
        changes = { status: req.body.status, updatedAt: now };
        metadata = { from: lead.status, to: req.body.status };
      } else if (action === "assign") {
        if (!isManager(user)) throw Object.assign(new Error("Only managers may assign leads"), { status: 403, code: "forbidden" });
        const assignedTo = req.body.assignedTo === null ? null : String(req.body.assignedTo || "");
        if (assignedTo) {
          const userRef = db.collection("crm_users").doc(assignedTo);
          const userSnapshot = await transaction.get(userRef);
          const crmUser = userSnapshot.data();
          if (!userSnapshot.exists || crmUser.status !== "active" || !crmUser.brands?.includes(lead.brandId)) {
            throw Object.assign(new Error("Assignee is not eligible"), { status: 422, code: "invalid_assignee" });
          }
        }
        eventType = "lead_assigned";
        changes = { assignedTo, assignmentState: assignedTo ? "assigned" : "unassigned", updatedAt: now };
        metadata = { from: lead.assignedTo || null, to: assignedTo };
      } else if (action === "add_note") {
        const note = typeof req.body.note === "string" ? req.body.note.trim() : "";
        if (!note || note.length > 2000) throw Object.assign(new Error("Note must be 1–2000 characters"), { status: 422, code: "validation_failed" });
        eventType = "internal_note_added";
        changes = { updatedAt: now };
        metadata = { note };
      } else {
        const followupAt = new Date(req.body.followupAt);
        if (Number.isNaN(followupAt.getTime()) || followupAt.getTime() < Date.now()) {
          throw Object.assign(new Error("Follow-up time must be in the future"), { status: 422, code: "validation_failed" });
        }
        eventType = "followup_scheduled";
        changes = { nextFollowupAt: Timestamp.fromDate(followupAt), updatedAt: now };
        metadata = { followupAt: followupAt.toISOString() };
      }

      transaction.update(leadRef, changes);
      transaction.create(activityRef, {
        brandId: lead.brandId,
        leadId,
        eventType,
        actorType: "crm_user",
        actorId: user.uid,
        assignedTo: changes.assignedTo ?? lead.assignedTo ?? null,
        timestamp: now,
        metadata,
      });
      transaction.create(auditRef, {
        brandId: lead.brandId,
        entityType: "lead",
        entityId: leadId,
        action: eventType,
        actorId: user.uid,
        actorRole: user.role,
        timestamp: now,
        metadata,
      });
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("crmApi", { code: error.code || "internal_error", message: error.message });
    const status = Number(error.status) || 500;
    return jsonError(res, status, error.code || "temporary_failure", status >= 500 ? "The update could not be saved." : error.message);
  }
});

export const _test = {
  publicLeadReference,
  n8nEventPayload,
  validateCrmAction,
};
