import crypto from "node:crypto";
import { getAppCheck } from "firebase-admin/app-check";
import { getAuth } from "firebase-admin/auth";
import { BRAND_ID, CRM_ROLES, MANAGER_ROLES } from "./config.js";

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function hmac(secret, value) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function timingSafeEqualHex(left, right) {
  if (!left || !right || left.length !== right.length) return false;
  if (!/^[a-f\d]+$/i.test(left) || !/^[a-f\d]+$/i.test(right) || left.length % 2 !== 0) return false;
  return crypto.timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}

export function requestIp(req, proxyVerified = false) {
  if (proxyVerified && typeof req.get("x-codebell-client-ip") === "string") {
    return req.get("x-codebell-client-ip").split(",")[0].trim().slice(0, 80);
  }
  return (req.ip || req.socket?.remoteAddress || "unknown").slice(0, 80);
}

export async function verifyOptionalAppCheck(req, required) {
  const token = req.get("x-firebase-appcheck");
  if (!token) {
    if (required) throw Object.assign(new Error("App Check required"), { status: 401, code: "app_check_required" });
    return null;
  }
  try {
    return await getAppCheck().verifyToken(token, { consume: true });
  } catch {
    throw Object.assign(new Error("Invalid App Check token"), { status: 401, code: "invalid_app_check" });
  }
}

export async function authenticateCrmRequest(req) {
  const authorization = req.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) {
    throw Object.assign(new Error("Authentication required"), { status: 401, code: "unauthenticated" });
  }
  let decoded;
  try {
    decoded = await getAuth().verifyIdToken(authorization.slice(7), true);
  } catch {
    throw Object.assign(new Error("Invalid session"), { status: 401, code: "invalid_session" });
  }
  const role = decoded.crm_role;
  const brands = Array.isArray(decoded.crm_brands) ? decoded.crm_brands : [];
  if (!CRM_ROLES.has(role) || !brands.includes(BRAND_ID)) {
    throw Object.assign(new Error("Access denied"), { status: 403, code: "forbidden" });
  }
  return { uid: decoded.uid, role, brands, email: decoded.email || null };
}

export function canManageLead(user, lead) {
  if (!user.brands.includes(lead.brandId)) return false;
  if (MANAGER_ROLES.has(user.role)) return true;
  return user.role === "sales_agent" && lead.assignedTo === user.uid;
}

export function isManager(user) {
  return MANAGER_ROLES.has(user.role);
}
