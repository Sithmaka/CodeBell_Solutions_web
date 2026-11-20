import { proxyFirebaseFunction } from "./_firebaseProxy.js";

export default function handler(req, res) {
  return proxyFirebaseFunction(req, res, "FIREBASE_CRM_API_URL");
}
