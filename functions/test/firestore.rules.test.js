import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";

const emulatorAvailable = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
let environment;

before(async () => {
  if (!emulatorAvailable) return;
  environment = await initializeTestEnvironment({
    projectId: "codebell-sprint1-test",
    firestore: { rules: readFileSync(new URL("../../firestore.rules", import.meta.url), "utf8") },
  });
  await environment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "leads", "lead-a"), {
      brandId: "codebell_development",
      assignedTo: "agent-a",
      status: "new",
    });
    await setDoc(doc(context.firestore(), "leads", "lead-b"), {
      brandId: "codebell_business",
      assignedTo: "agent-b",
      status: "new",
    });
  });
});

after(async () => environment?.cleanup());

test("Firestore rules deny public CRM access", { skip: !emulatorAvailable }, async () => {
  const publicDb = environment.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(publicDb, "leads", "lead-a")));
  await assertFails(setDoc(doc(publicDb, "leads", "public-write"), { brandId: "codebell_development" }));
});

test("manager can read authorized brand but not another brand", { skip: !emulatorAvailable }, async () => {
  const db = environment.authenticatedContext("manager", {
    crm_role: "sales_manager",
    crm_brands: ["codebell_development"],
  }).firestore();
  await assertSucceeds(getDoc(doc(db, "leads", "lead-a")));
  await assertFails(getDoc(doc(db, "leads", "lead-b")));
});

test("sales agent can read only assigned leads and cannot write directly", { skip: !emulatorAvailable }, async () => {
  const assignedDb = environment.authenticatedContext("agent-a", {
    crm_role: "sales_agent",
    crm_brands: ["codebell_development"],
  }).firestore();
  const otherDb = environment.authenticatedContext("agent-other", {
    crm_role: "sales_agent",
    crm_brands: ["codebell_development"],
  }).firestore();
  await assertSucceeds(getDoc(doc(assignedDb, "leads", "lead-a")));
  await assertFails(getDoc(doc(otherDb, "leads", "lead-a")));
  await assertFails(setDoc(doc(assignedDb, "leads", "lead-a"), { status: "won" }, { merge: true }));
  assert.ok(true);
});
