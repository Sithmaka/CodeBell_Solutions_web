import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const uidIndex = process.argv.indexOf("--default-owner");
const uid = uidIndex >= 0 ? process.argv[uidIndex + 1] : null;
if (!uid) throw new Error("Usage: npm run configure-assignment -- --default-owner FIREBASE_UID");

initializeApp({ credential: applicationDefault() });
const user = await getAuth().getUser(uid);
const db = getFirestore();
const profile = await db.collection("crm_users").doc(uid).get();
const brands = Array.isArray(user.customClaims?.crm_brands) ? user.customClaims.crm_brands : [];
if (!profile.exists || profile.data().status !== "active" || !brands.includes("codebell_development") || !["sales_agent", "sales_manager", "admin", "super_admin"].includes(user.customClaims?.crm_role)) {
  throw new Error("Default owner must be an active CodeBell Development CRM operator with appropriate custom claims.");
}

await db.collection("crm_config").doc("codebell_development_lead_assignment").set({
  brandId: "codebell_development",
  defaultSalesOwnerUid: uid,
  updatedAt: FieldValue.serverTimestamp(),
}, { merge: true });

console.log(`Configured ${uid} as the default CodeBell Development lead owner.`);
