import crypto from "node:crypto";

const MAX_BODY_BYTES = 16 * 1024;

function jsonError(res, status, code, message) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json({ success: false, error: { code, message } });
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return String(value || req.socket?.remoteAddress || "unknown").split(",")[0].trim().slice(0, 80);
}

export async function proxyFirebaseFunction(req, res, targetEnvName) {
  if (req.method !== "POST") return jsonError(res, 405, "method_not_allowed", "Use POST.");
  const origin = req.headers.origin;
  const allowedOrigins = new Set(
    String(process.env.ALLOWED_API_ORIGINS || "https://www.codebell.online,https://codebell.online")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
  if (origin && !allowedOrigins.has(origin)) {
    return jsonError(res, 403, "origin_not_allowed", "This origin is not allowed.");
  }
  const target = process.env[targetEnvName];
  const secret = process.env.LEAD_PROXY_SHARED_SECRET;
  if (!target || !secret) {
    return jsonError(res, 503, "configuration_unavailable", "This service is not configured.");
  }

  const body = JSON.stringify(req.body ?? {});
  if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
    return jsonError(res, 413, "payload_too_large", "The request is too large.");
  }
  const ip = clientIp(req);
  const timestamp = String(Date.now());
  const bodyHash = crypto.createHash("sha256").update(body).digest("hex");
  const signature = crypto.createHmac("sha256", secret)
    .update(`${timestamp}.${ip}.${bodyHash}`)
    .digest("hex");

  const headers = {
    "content-type": "application/json",
    "x-codebell-proxy-timestamp": timestamp,
    "x-codebell-proxy-signature": signature,
    "x-codebell-client-ip": ip,
  };
  if (origin) headers.origin = origin;
  for (const name of ["authorization", "idempotency-key", "x-firebase-appcheck"]) {
    if (req.headers[name]) headers[name] = Array.isArray(req.headers[name]) ? req.headers[name][0] : req.headers[name];
  }

  try {
    const upstream = await fetch(target, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(20000),
    });
    const responseText = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    res.setHeader("Cache-Control", "no-store");
    return res.send(responseText);
  } catch (error) {
    console.error("Firebase proxy failure", { target: targetEnvName, name: error.name });
    return jsonError(res, 502, "upstream_unavailable", "The service is temporarily unavailable.");
  }
}
