import { getToken } from "firebase/app-check";
import { getFirebaseServices } from "./firebaseClient";

const LEADS_API_URL = import.meta.env.VITE_CB_LEADS_API_URL || "/api/leads";

export function createIdempotencyKey() {
  return crypto.randomUUID?.() || `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function appCheckHeader() {
  const appCheck = getFirebaseServices()?.appCheck;
  if (!appCheck) return {};
  try {
    const token = await getToken(appCheck, false);
    return { "X-Firebase-AppCheck": token.token };
  } catch {
    return {};
  }
}

export async function submitLead(payload, idempotencyKey) {
  const response = await fetch(LEADS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
      ...(await appCheckHeader()),
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    const error = new Error(data.error?.message || "We could not save your enquiry right now.");
    error.code = data.error?.code || "submission_failed";
    error.fields = data.error?.fields || {};
    error.recoverable = response.status >= 500 || response.status === 429;
    throw error;
  }
  return data;
}
