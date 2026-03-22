/**
 * LinguaPath Audio Pre-generation Script
 * =======================================
 * Generates missing ElevenLabs MP3 files for:
 *   1. Lesson vocabulary words (all languages, all levels)
 *   2. Situation quick phrases (all languages)
 *   3. (Skips files that already exist)
 *
 * Usage:
 *   ELEVENLABS_API_KEY=sk-... node scripts/generate-audio.mjs
 *
 * Options (env vars):
 *   LANGCODE=de      Only process one language code
 *   DRY_RUN=1        Print what would be generated, don't call API
 *   CONCURRENCY=3    Parallel requests (default 3, max 5 to stay safe)
 *
 * Output:
 *   public/audio/{langCode}/{slug}.mp3
 *
 * Slugification matches staticAudio.js exactly so the app picks up files automatically.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Config ────────────────────────────────────────────────────────────────────
const API_KEY = process.env.ELEVENLABS_API_KEY;
const DRY_RUN = process.env.DRY_RUN === "1";
const ONLY_LANG = process.env.LANGCODE || null;
const CONCURRENCY = Math.min(parseInt(process.env.CONCURRENCY || "3", 10), 5);

if (!API_KEY && !DRY_RUN) {
  console.error("❌ ELEVENLABS_API_KEY is required. Run with: ELEVENLABS_API_KEY=sk-... node scripts/generate-audio.mjs");
  process.exit(1);
}

// Voice IDs — must match api/tts.js and audioPlayer.js exactly
const VOICES = {
  de: "kUqnjA18C6ISqjtKOpsJ",
  es: "zdzXtQ5BTOYMDG04sR8R",
  it: "BUAZlX1JYGONhOQdurfl",
  fr: "ttrVUBHgC9AEENt2kGi6",
  zh: "RrYpxumYIVoc5NKCTGOg",
  ko: "FNrsMcVkTfKeSyL1UYXS",
  ja: "9XG6vvb5sQYWawDizIlo",
  ru: "1iQuCymkuonZDnoteVZT",
  el: "8C0RosTo9KZhAz8UmM7c",
  pt: "CImjz27snHwe55ik6hke",
};

const LANG_NAMES = {
  de: "german", es: "spanish", fr: "french", it: "italian",
  pt: "portuguese", ru: "russian", zh: "chinese", ja: "japanese",
  ko: "korean", el: "greek",
};

// ── Slugify — mirrors staticAudio.js exactly ──────────────────────────────────
function slugify(text) {
  return String(text || "")
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_")
    .toLowerCase();
}

// ── Collect vocab words from language JSON files ───────────────────────────────
function collectVocabWords(langCode) {
  const name = LANG_NAMES[langCode];
  const jsonPath = path.join(ROOT, "languages", `${name}.json`);
  if (!fs.existsSync(jsonPath)) return [];

  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const words = new Set();

  for (const level of levels) {
    if (!data[level]) continue;
    for (const mod of data[level].modules || []) {
      for (const w of mod.vocab || []) {
        const word = (w[langCode] || "").trim();
        if (word) words.add(word);
      }
    }
  }

  return [...words];
}

// ── Collect situation quick phrases ───────────────────────────────────────────
function collectSituationPhrases(langCode) {
  // Read situations.js as text and extract quickPhrases via regex
  const sitPath = path.join(ROOT, "src", "data", "situations.js");
  if (!fs.existsSync(sitPath)) return [];

  const content = fs.readFileSync(sitPath, "utf8");

  // Extract all quickPhrase objects — match { ... langCode: "..." ... }
  const phrases = new Set();

  // Find all occurrences of langCode: "value" or langCode: 'value'
  const pattern = new RegExp(`\\b${langCode}:\\s*["']([^"'\\n]+)["']`, "g");
  let match;
  while ((match = pattern.exec(content)) !== null) {
    const phrase = match[1].trim();
    if (phrase) phrases.add(phrase);
  }

  return [...phrases];
}

// ── ElevenLabs API call ────────────────────────────────────────────────────────
async function generateAudio(text, langCode) {
  const voiceId = VOICES[langCode] || VOICES.de;
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify({
      text: text.slice(0, 4500),
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.42,
        similarity_boost: 0.9,
        style: 0.28,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`ElevenLabs ${response.status}: ${errText.slice(0, 200)}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

// ── Process a batch of items with concurrency limit ───────────────────────────
async function processBatch(items, fn, concurrency) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const langCodes = ONLY_LANG
    ? [ONLY_LANG]
    : Object.keys(LANG_NAMES);

  let totalGenerated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const langCode of langCodes) {
    if (!VOICES[langCode]) {
      console.log(`⚠️  No voice ID for ${langCode}, skipping`);
      continue;
    }

    // Collect all text strings needed for this language
    const vocabWords = collectVocabWords(langCode);
    const sitPhrases = collectSituationPhrases(langCode);
    const allTexts = [...new Set([...vocabWords, ...sitPhrases])];

    const audioDir = path.join(ROOT, "public", "audio", langCode);
    fs.mkdirSync(audioDir, { recursive: true });

    // Determine which are missing
    const existing = new Set(fs.readdirSync(audioDir));
    const missing = allTexts.filter(text => !existing.has(slugify(text) + ".mp3"));

    console.log(`\n🌐 ${langCode.toUpperCase()} — ${allTexts.length} total, ${existing.size} existing, ${missing.length} to generate`);

    if (missing.length === 0) {
      console.log(`   ✅ Already complete!`);
      continue;
    }

    if (DRY_RUN) {
      console.log(`   [DRY RUN] Would generate ${missing.length} files:`);
      missing.slice(0, 10).forEach(t => console.log(`     • ${t} → ${slugify(t)}.mp3`));
      if (missing.length > 10) console.log(`     ... and ${missing.length - 10} more`);
      continue;
    }

    let langGenerated = 0;
    let langErrors = 0;

    await processBatch(missing, async (text, i) => {
      const slug = slugify(text);
      const filePath = path.join(audioDir, `${slug}.mp3`);

      // Double-check it doesn't exist (race condition guard)
      if (fs.existsSync(filePath)) {
        totalSkipped++;
        return;
      }

      try {
        const buffer = await generateAudio(text, langCode);
        fs.writeFileSync(filePath, buffer);
        langGenerated++;
        totalGenerated++;
        process.stdout.write(`   ✓ [${i + 1}/${missing.length}] ${text}\r`);
      } catch (err) {
        langErrors++;
        totalErrors++;
        console.error(`\n   ❌ Failed: "${text}" — ${err.message}`);

        // If we hit a rate limit (429), pause and retry once
        if (err.message.includes("429")) {
          console.log(`   ⏳ Rate limited, waiting 10s...`);
          await new Promise(r => setTimeout(r, 10000));
          try {
            const buffer = await generateAudio(text, langCode);
            fs.writeFileSync(filePath, buffer);
            langGenerated++;
            langErrors--;
            totalGenerated++;
            totalErrors--;
          } catch (retryErr) {
            console.error(`   ❌ Retry failed: ${retryErr.message}`);
          }
        }
      }

      // Small delay between requests to be polite to the API
      await new Promise(r => setTimeout(r, 100));
    }, CONCURRENCY);

    console.log(`\n   Done: ${langGenerated} generated, ${langErrors} errors`);
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`✅ Complete: ${totalGenerated} generated, ${totalSkipped} skipped, ${totalErrors} errors`);

  if (totalGenerated > 0) {
    console.log(`\n📦 Next step: commit the new audio files to git`);
    console.log(`   cd linguapath-main`);
    console.log(`   git add public/audio/`);
    console.log(`   git commit -m "Add pre-recorded audio for all lesson vocab and quick phrases"`);
    console.log(`   git push origin main`);
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
