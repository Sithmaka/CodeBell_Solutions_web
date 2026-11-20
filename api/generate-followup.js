import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_BODY_BYTES = 8 * 1024;
const WINDOW_MS = 15 * 60 * 1000;
const requestBuckets = new Map();

function allowedOrigin(origin) {
  if (!origin) return true;
  const allowed = new Set(
    String(process.env.ALLOWED_API_ORIGINS || "https://www.codebell.online,https://codebell.online")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
  return allowed.has(origin);
}

function limited(req) {
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim().slice(0, 80);
  const bucket = `${Math.floor(Date.now() / WINDOW_MS)}:${ip}`;
  const count = requestBuckets.get(bucket) || 0;
  requestBuckets.set(bucket, count + 1);
  if (requestBuckets.size > 5000) requestBuckets.clear();
  return count >= 10;
}

function bounded(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (!allowedOrigin(origin)) return res.status(403).json({ error: "Origin not allowed" });
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  // ✅ Handle preflight request (browser sends this first)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ❌ Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (Number(req.headers["content-length"] || 0) > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Request too large" });
  }
  if (!String(req.headers["content-type"] || "").toLowerCase().includes("application/json")) {
    return res.status(415).json({ error: "Use application/json" });
  }
  if (Buffer.byteLength(JSON.stringify(req.body || {}), "utf8") > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Request too large" });
  }
  if (limited(req)) return res.status(429).json({ error: "Too many requests" });

  try {
    const { service, business, features } = req.body || {};
    const context = {
      service: bounded(service, 100) || "Not provided",
      business: bounded(business, 300) || "Not provided",
      features: bounded(features, 1000) || "Not provided",
    };

    const prompt = `
You are CodeBell's AI inquiry assistant.

Generate exactly 2 short, practical follow-up questions for a potential client.

Context:
- Service: ${context.service}
- Business / industry: ${context.business}
- Initial requirements: ${context.features}

Rules:
- Keep each question under 18 words.
- Ask only useful scope clarification questions.
- Do not greet.
- Do not explain.
- Return ONLY valid JSON in this format:
{"questions":["question 1","question 2"]}
`;

    // ✅ Call OpenAI (low-cost model 👍)
    const response = await client.responses.create({
      model: "gpt-4.1-nano",
      input: prompt,
    });

    // ✅ Extract text safely
    let text = "";

    if (response.output_text) {
      text = response.output_text;
    } else if (response.output && response.output.length > 0) {
      text =
        response.output[0]?.content?.[0]?.text ||
        "";
    }

    // ✅ Fallback if empty
    if (!text) {
      text = `{"questions":["What main features do you need?","Do you require admin dashboard access?"]}`;
    }

    // ✅ Clean text (important for GPT JSON issues)
    text = text.trim();

    // Remove ```json ``` if present
    if (text.startsWith("```")) {
      text = text.replace(/```json|```/g, "").trim();
    }

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      console.warn("Follow-up response was not valid JSON; using fallback.");

      parsed = {
        questions: [
          "What main features or modules do you need?",
          "Do you require admin panel or analytics?",
        ],
      };
    }

    // ✅ Final safety check
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      parsed = {
        questions: [
          "What main features or modules do you need?",
          "Do you require admin panel or analytics?",
        ],
      };
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error("OpenAI follow-up failure", { name: error.name, status: error.status || null });

    return res.status(500).json({
      error: "Failed to generate follow-up questions",
      questions: [
        "What main features or modules do you need?",
        "Do you require admin panel or analytics?",
      ],
    });
  }
}
