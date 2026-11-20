import { BRAND_ID, MAX_BODY_BYTES, SERVICE_IDS } from "./config.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const IDEMPOTENCY_RE = /^[A-Za-z0-9._:-]{16,128}$/;
const URL_PROTOCOLS = new Set(["http:", "https:"]);

function cleanString(value, maxLength, { required = false, minLength = 0 } = {}) {
  if (value == null) value = "";
  if (typeof value !== "string") return { error: "must be text" };
  // eslint-disable-next-line no-control-regex -- strip non-printing input before persistence
  const normalized = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  if (required && !normalized) return { error: "is required" };
  if (normalized && normalized.length < minLength) return { error: `must be at least ${minLength} characters` };
  if (normalized.length > maxLength) return { error: `must be at most ${maxLength} characters` };
  return { value: normalized || null };
}

function optionalUrl(value) {
  const cleaned = cleanString(value, 300);
  if (cleaned.error || !cleaned.value) return cleaned;
  try {
    const parsed = new URL(cleaned.value);
    if (!URL_PROTOCOLS.has(parsed.protocol)) return { error: "must use http or https" };
    parsed.username = "";
    parsed.password = "";
    parsed.hash = "";
    return { value: parsed.toString() };
  } catch {
    return { error: "must be a valid URL" };
  }
}

function attributionPath(value, maxLength = 300) {
  const cleaned = cleanString(value, maxLength);
  if (cleaned.error || !cleaned.value) return cleaned;
  try {
    const parsed = new URL(cleaned.value, "https://www.codebell.online");
    if (!parsed.hostname.endsWith("codebell.online")) {
      return { value: parsed.origin.slice(0, maxLength) };
    }
    return { value: `${parsed.pathname}${parsed.search}`.slice(0, maxLength) };
  } catch {
    return { value: cleaned.value.split("#")[0].slice(0, maxLength) };
  }
}

function setField(target, errors, key, result) {
  if (result.error) errors[key] = result.error;
  else target[key] = result.value;
}

export function validateIdempotencyKey(value) {
  return typeof value === "string" && IDEMPOTENCY_RE.test(value);
}

export function requestBodySize(body) {
  return Buffer.byteLength(JSON.stringify(body ?? {}), "utf8");
}

export function validateLeadInput(body) {
  const errors = {};
  const lead = {};
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { valid: false, errors: { body: "must be a JSON object" } };
  }
  if (requestBodySize(body) > MAX_BODY_BYTES) {
    return { valid: false, errors: { body: "is too large" }, oversized: true };
  }

  lead.brandId = body.brandId === BRAND_ID ? BRAND_ID : null;
  if (!lead.brandId) errors.brandId = "is not supported";
  setField(lead, errors, "name", cleanString(body.name, 120, { required: true, minLength: 2 }));
  setField(lead, errors, "email", cleanString(body.email, 254, { required: true }));
  if (lead.email && !EMAIL_RE.test(lead.email)) errors.email = "must be a valid email address";
  setField(lead, errors, "phone", cleanString(body.phone, 40));
  setField(lead, errors, "companyName", cleanString(body.companyName, 160));
  setField(lead, errors, "country", cleanString(body.country, 100, { required: true, minLength: 2 }));
  setField(lead, errors, "timezone", cleanString(body.timezone, 80, { required: true }));
  lead.service = typeof body.service === "string" && SERVICE_IDS.has(body.service) ? body.service : null;
  if (!lead.service) errors.service = "is not supported";
  setField(lead, errors, "projectDescription", cleanString(body.projectDescription, 4000, { required: true, minLength: 30 }));
  setField(lead, errors, "budgetRange", cleanString(body.budgetRange, 80));
  setField(lead, errors, "budgetCurrency", cleanString(body.budgetCurrency, 3));
  if (lead.budgetCurrency) lead.budgetCurrency = lead.budgetCurrency.toUpperCase();
  setField(lead, errors, "timeline", cleanString(body.timeline, 80));
  setField(lead, errors, "existingSystemUrl", optionalUrl(body.existingSystemUrl));

  const allowedContact = new Set(["email", "phone", "whatsapp"]);
  lead.preferredContactMethod = allowedContact.has(body.preferredContactMethod)
    ? body.preferredContactMethod
    : null;
  if (!lead.preferredContactMethod) errors.preferredContactMethod = "is not supported";
  if (["phone", "whatsapp"].includes(lead.preferredContactMethod) && !lead.phone) {
    errors.phone = "is required for the selected contact method";
  }

  if (body.privacyAcknowledged !== true) errors.privacyAcknowledged = "must be accepted";
  lead.marketingOptIn = body.marketingOptIn === true;
  lead.honeypot = typeof body.website === "string" ? body.website.trim() : "";

  const sourceInput = body.source && typeof body.source === "object" ? body.source : {};
  const source = {};
  setField(source, errors, "landingPage", attributionPath(sourceInput.landingPage));
  setField(source, errors, "submissionPage", attributionPath(sourceInput.submissionPage));
  setField(source, errors, "referrer", attributionPath(sourceInput.referrer));
  for (const [inputKey, outputKey] of [
    ["utmSource", "utmSource"],
    ["utmMedium", "utmMedium"],
    ["utmCampaign", "utmCampaign"],
    ["utmContent", "utmContent"],
    ["utmTerm", "utmTerm"],
    ["ctaId", "ctaId"],
  ]) {
    setField(source, errors, outputKey, cleanString(sourceInput[inputKey], 120));
  }
  lead.source = source;

  return { valid: Object.keys(errors).length === 0, errors, value: lead };
}

export function equivalentPayloadHashInput(lead) {
  return JSON.stringify({
    ...lead,
    email: lead.email?.toLowerCase(),
    honeypot: undefined,
  });
}
