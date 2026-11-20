import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const ALLOWED_ROLES = new Set(["super_admin", "admin", "sales_manager", "sales_agent", "viewer"]);

function argumentsByName(values) {
  const result = {};
  for (let index = 0; index < values.length; index += 2) {
    const key = values[index]?.replace(/^--/, "");
    if (!key || !values[index + 1]) throw new Error("Arguments must be provided as --name value pairs.");
    result[key] = values[index + 1];
  }
  return result;
}

const args = argumentsByName(process.argv.slice(2));
const uid = args.uid;
const role = args.role;
const brands = (args.brands || "codebell_development").split(",").map((value) => value.trim()).filter(Boolean);
if (!uid || !ALLOWED_ROLES.has(role) || !brands.length) {
  throw new Error("Usage: npm run provision-user -- --uid FIREBASE_UID --role sales_agent --brands codebell_development [--name 'Display Name']");
}

initializeApp({ credential: applicationDefault() });
const auth = getAuth();
const db = getFirestore();
const user = await auth.getUser(uid);
await auth.setCustomUserClaims(uid, {
  ...(user.customClaims || {}),
  crm_role: role,
  crm_brands: brands,
});
await db.collection("crm_users").doc(uid).set({
  displayName: args.name || user.displayName || null,
  email: user.email || null,
  role,
  brands,
  status: "active",
  updatedAt: FieldValue.serverTimestamp(),
}, { merge: true });

console.log(`Provisioned CRM user ${uid} as ${role}. They must refresh their ID token or sign in again.`);
