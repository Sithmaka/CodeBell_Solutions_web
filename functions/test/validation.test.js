import test from "node:test";
import assert from "node:assert/strict";
import { MAX_BODY_BYTES } from "../src/config.js";
import { requestBodySize, validateIdempotencyKey, validateLeadInput } from "../src/validation.js";

function validLead(overrides = {}) {
  return {
    brandId: "codebell_development",
    name: "Test Contact",
    email: "test@example.com",
    phone: null,
    companyName: "Example Company",
    country: "Sri Lanka",
    timezone: "Asia/Colombo",
    service: "custom_software",
    projectDescription: "We need a test system for a non-production workflow.",
    preferredContactMethod: "email",
    privacyAcknowledged: true,
    marketingOptIn: false,
    source: { landingPage: "/?utm_source=test", submissionPage: "/contact", utmSource: "test" },
    ...overrides,
  };
}

test("accepts and normalizes a valid CodeBell Development lead", () => {
  const result = validateLeadInput(validLead({ email: "  Test@Example.com " }));
  assert.equal(result.valid, true);
  assert.equal(result.value.email, "Test@Example.com");
  assert.equal(result.value.brandId, "codebell_development");
  assert.equal(result.value.marketingOptIn, false);
});

test("rejects missing required fields, invalid email, and invalid service", () => {
  const result = validateLeadInput(validLead({ name: "", email: "invalid", service: "admin" }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.service);
});

test("requires phone for phone or WhatsApp contact", () => {
  const result = validateLeadInput(validLead({ preferredContactMethod: "whatsapp", phone: "" }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.phone);
});

test("rejects oversized input", () => {
  const result = validateLeadInput(validLead({ projectDescription: "x".repeat(MAX_BODY_BYTES + 100) }));
  assert.equal(result.valid, false);
  assert.equal(result.oversized, true);
  assert.ok(requestBodySize(validLead({ projectDescription: "x".repeat(MAX_BODY_BYTES) })) > MAX_BODY_BYTES);
});

test("validates idempotency key format", () => {
  assert.equal(validateIdempotencyKey("12345678-1234-1234-1234-123456789012"), true);
  assert.equal(validateIdempotencyKey("short"), false);
  assert.equal(validateIdempotencyKey("invalid key with spaces"), false);
});

test("minimizes external referrers to their origin", () => {
  const result = validateLeadInput(validLead({ source: { referrer: "https://example.org/path?secret=value" } }));
  assert.equal(result.valid, true);
  assert.equal(result.value.source.referrer, "https://example.org");
});
