import { getToken } from "firebase/app-check";
import { getFirebaseServices } from "./firebaseClient";

const CRM_API_URL = import.meta.env.VITE_CB_CRM_API_URL || "/api/crm";

export async function mutateLead(payload) {
  const services = getFirebaseServices();
  if (!services?.auth.currentUser) throw new Error("Authentication required.");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${await services.auth.currentUser.getIdToken()}`,
  };
  if (services.appCheck) {
    try {
      headers["X-Firebase-AppCheck"] = (await getToken(services.appCheck, false)).token;
    } catch {
      // The server decides whether App Check is mandatory for this environment.
    }
  }
  const response = await fetch(CRM_API_URL, { method: "POST", headers, body: JSON.stringify(payload) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) throw new Error(data.error?.message || "The update could not be saved.");
  return data;
}
