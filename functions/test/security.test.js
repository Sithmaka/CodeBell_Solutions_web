import test from "node:test";
import assert from "node:assert/strict";
import { canManageLead, hmac, isManager, sha256, timingSafeEqualHex } from "../src/security.js";

test("HMAC signatures verify and reject tampering", () => {
  const signature = hmac("test-secret", "1700000000000.payload");
  assert.equal(timingSafeEqualHex(signature, hmac("test-secret", "1700000000000.payload")), true);
  assert.equal(timingSafeEqualHex(signature, hmac("test-secret", "1700000000000.changed")), false);
  assert.equal(timingSafeEqualHex("z".repeat(64), signature), false);
  assert.equal(sha256("value").length, 64);
});

test("CRM role permissions enforce brand and assignment", () => {
  const lead = { brandId: "codebell_development", assignedTo: "agent-1" };
  const manager = { uid: "manager", role: "sales_manager", brands: ["codebell_development"] };
  const agent = { uid: "agent-1", role: "sales_agent", brands: ["codebell_development"] };
  const otherAgent = { uid: "agent-2", role: "sales_agent", brands: ["codebell_development"] };
  const crossBrand = { uid: "admin", role: "admin", brands: ["codebell_business"] };
  assert.equal(canManageLead(manager, lead), true);
  assert.equal(canManageLead(agent, lead), true);
  assert.equal(canManageLead(otherAgent, lead), false);
  assert.equal(canManageLead(crossBrand, lead), false);
  assert.equal(isManager(manager), true);
  assert.equal(isManager(agent), false);
});
