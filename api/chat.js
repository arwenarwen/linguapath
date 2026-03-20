/**
 * LinguaPath — AI Tutor / Dictionary Chat Proxy
 * File name in your project: api/chat.js
 * Uses OpenAI only.
 */

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ reply: null, error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[chat] OPENAI_API_KEY is not set");
    return res.status(500).json({ reply: null, error: "OPENAI_API_KEY is not configured" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const {
      messages = [],
      system,
      max_tokens = 350,
      temperature = 0.5,
      expectJson = false,
      model = "gpt-4o-mini",
    } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ reply: null, error: "No messages provided" });
    }

    const filtered = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant"))
      .map((m) => ({
        role: m.role,
        content: String(m.content || "").slice(0, 8000),
      }));

    while (filtered.length > 0 && filtered[0].role === "assistant") filtered.shift();

    if (filtered.length === 0) {
      return res.status(400).json({ reply: null, error: "No valid user message" });
    }

    const payload = {
      model,
      messages: [
        {
          role: "system",
          content: system || "You are a helpful language tutor. Keep replies concise, natural, and useful."
        },
        ...filtered.slice(-20)
      ],
      max_tokens: Math.min(Number(max_tokens) || 350, 800),
      temperature: typeof temperature === "number" ? temperature : 0.5,
    };

    if (expectJson) {
      payload.response_format = { type: "json_object" };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[chat] OpenAI error:", response.status, JSON.stringify(data));
      return res.status(500).json({
        reply: null,
        error: data?.error?.message || `API error ${response.status}`,
      });
    }

    const reply = data?.choices?.[0]?.message?.content || "";
    return res.status(200).json({ reply, error: null });
  } catch (err) {
    console.error("[chat] fetch error:", err);
    return res.status(500).json({
      reply: null,
      error: err?.message || "Chat request failed",
    });
  }
}
