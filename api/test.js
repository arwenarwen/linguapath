/**
 * Test endpoint — visit /api/test in your browser to diagnose
 * DELETE this file after confirming it works
 */
export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      status: "FAIL",
      problem: "OPENAI_API_KEY is not set in Vercel environment variables"
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 20,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Say: OK" }
        ]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({
        status: "FAIL",
        problem: "OpenAI rejected the request",
        http_status: response.status,
        error: data?.error
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "OpenAI key works! AI tutor should work.",
      reply: data.choices?.[0]?.message?.content
    });

  } catch (err) {
    return res.status(200).json({
      status: "FAIL",
      problem: "Network error reaching OpenAI",
      error: err.message
    });
  }
}
