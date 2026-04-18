import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // ✅ CORS FIX (IMPORTANT)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight request (browser sends this first)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ❌ Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { service, business, features } = req.body || {};

    const prompt = `
You are CodeBell's AI inquiry assistant.

Generate exactly 2 short, practical follow-up questions for a potential client.

Context:
- Service: ${service || "Not provided"}
- Business / industry: ${business || "Not provided"}
- Initial requirements: ${features || "Not provided"}

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
    } catch (err) {
      console.warn("JSON parse failed, using fallback:", text);

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
    console.error("OpenAI error:", error);

    return res.status(500).json({
      error: "Failed to generate follow-up questions",
      questions: [
        "What main features or modules do you need?",
        "Do you require admin panel or analytics?",
      ],
    });
  }
}