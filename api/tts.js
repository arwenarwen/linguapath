/**
 * LinguaPath ElevenLabs TTS route
 * Put this in: api/tts.js
 */
function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
}

function getVoiceId(langCode, overrideVoiceId) {
  if (overrideVoiceId && typeof overrideVoiceId === "string" && overrideVoiceId.trim()) {
    return overrideVoiceId.trim();
  }

  const VOICES = {
    de: "kUqnjA18C6ISqjtKOpsJ",  // German man
    es: "zdzXtQ5BTOYMDG04sR8R",  // Spanish man
    it: "BUAZlX1JYGONhOQdurfl",  // Italian man
    fr: "ttrVUBHgC9AEENt2kGi6",  // French man
    zh: "RrYpxumYIVoc5NKCTGOg",  // Chinese man
    ko: "FNrsMcVkTfKeSyL1UYXS",  // Korean man
    ja: "9XG6vvb5sQYWawDizIlo",  // Japanese man
    ru: "1iQuCymkuonZDnoteVZT",  // Russian man
    el: "8C0RosTo9KZhAz8UmM7c",  // Greek man
    pt: "CImjz27snHwe55ik6hke",  // Portuguese man
  };

  return VOICES[langCode] || VOICES.de;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ELEVENLABS_API_KEY missing" });
  }

  try {
    const body = parseBody(req);
    const { text, langCode, voiceId: overrideVoiceId } = body || {};

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "No text provided" });
    }

    const voiceId = getVoiceId(langCode, overrideVoiceId);
    const cleanText = String(text).replace(/\s+/g, " ").trim().slice(0, 4500);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.42,
            similarity_boost: 0.9,
            style: 0.28,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return res.status(500).json({ error: errorText || `ElevenLabs HTTP ${response.status}`, voiceId });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-TTS-Voice", voiceId);
    return res.status(200).send(buffer);
  } catch (err) {
    return res.status(500).json({ error: err?.message || "TTS failed" });
  }
}
