/**
 * LinguaPath Audio Pre-generation Script
 * =======================================
 * Generates missing ElevenLabs MP3 files for:
 *   1. Lesson vocabulary words  → /audio/{langCode}/{slug}.mp3
 *   2. Situation quick phrases  → /audio/{langCode}/{slug}.mp3
 *   3. Exam question text       → /audio/en/{slug}.mp3
 *   4. Exam wrong feedback      → /audio/en/{slug}.mp3  ("Incorrect. The correct answer is: X")
 *   5. Exam answer options      → /audio/{langCode}/{slug}.mp3
 *
 * Skips any file that already exists. Safe to re-run after interruption.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=sk-... node scripts/generate-audio.mjs
 *
 * Options (env vars):
 *   LANGCODE=de      Only process one language code
 *   DRY_RUN=1        Print what would be generated, don't call API
 *   CONCURRENCY=3    Parallel requests (default 3, max 5 to stay safe)
 *   SKIP_VOCAB=1     Skip vocab/phrases, only do exam audio
 *   SKIP_EXAM=1      Skip exam audio, only do vocab/phrases
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
const SKIP_VOCAB = process.env.SKIP_VOCAB === "1";
const SKIP_EXAM = process.env.SKIP_EXAM === "1";

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
  en: "21m00Tcm4TlvDq8ikWAM", // Rachel — exam questions & feedback
};

const LANG_NAMES = {
  de: "German", es: "Spanish", fr: "French", it: "Italian",
  pt: "Portuguese", ru: "Russian", zh: "Chinese", ja: "Japanese",
  ko: "Korean", el: "Greek",
};

const LANG_FILES = {
  de: "german", es: "spanish", fr: "french", it: "italian",
  pt: "portuguese", ru: "russian", zh: "chinese", ja: "japanese",
  ko: "korean", el: "greek",
};

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

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
  const name = LANG_FILES[langCode];
  const jsonPath = path.join(ROOT, "languages", `${name}.json`);
  if (!fs.existsSync(jsonPath)) return [];

  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const words = new Set();

  for (const level of LEVELS) {
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
  const sitPath = path.join(ROOT, "src", "data", "situations.js");
  if (!fs.existsSync(sitPath)) return [];

  const content = fs.readFileSync(sitPath, "utf8");
  const phrases = new Set();
  const pattern = new RegExp(`\\b${langCode}:\\s*["']([^"'\\n]+)["']`, "g");
  let match;
  while ((match = pattern.exec(content)) !== null) {
    const phrase = match[1].trim();
    if (phrase) phrases.add(phrase);
  }
  return [...phrases];
}

// ── Load and transform exam bank (mirrors loadLocalExamBank in examUtils.js) ──
function loadExamBank(langCode, level) {
  const name = LANG_NAMES[langCode];
  const bankPath = path.join(ROOT, "public", "data", "exams", langCode, level, `${name}_${level}_exam_bank.json`);
  if (!fs.existsSync(bankPath)) return null;

  const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
  const langName = LANG_NAMES[langCode];

  // Deduplicate
  const seen = new Set();
  const deduped = (bank.questions || []).filter(q => {
    const key = `${q.question || ""}__${(q.options || []).join("|")}__${q.correct_answer || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Build pool of all audio words for distractors
  const allAudioWords = deduped
    .filter(q => q.exercise_type === "translate-en" && q.audio)
    .map(q => q.audio);

  // Transform translate-en questions from DE→EN to EN→DE
  return deduped.map(q => {
    if (q.exercise_type !== "translate-en" || !q.audio || !q.correct_answer) return q;
    const engWord = q.correct_answer;
    const targetWord = q.audio;
    const pool = [...new Set(allAudioWords.filter(w => w !== targetWord))];
    const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 3);
    if (distractors.length < 3) return q;
    const options = [...distractors, targetWord].sort(() => Math.random() - 0.5);
    return {
      ...q,
      question: `What does "${engWord}" mean in ${langName}?`,
      correct_answer: targetWord,
      options,
    };
  });
}

// ── Collect all exam audio items ───────────────────────────────────────────────
// Returns two maps:
//   enTexts   — English strings → save to /audio/en/
//   langTexts — target-language strings → save to /audio/{langCode}/
function collectExamAudio(langCode) {
  const enTexts = new Set();    // question text + wrong feedback (English)
  const langTexts = new Set();  // answer options (target language)

  for (const level of LEVELS) {
    const questions = loadExamBank(langCode, level);
    if (!questions) continue;

    for (const q of questions) {
      // Question text (English instruction) — skip very long C1/C2 questions whose
      // slugs would exceed the OS 255-byte filename limit. Live TTS handles those.
      if (q.question && q.question.trim().length <= 150) enTexts.add(q.question.trim());

      // Wrong feedback (English) — only pre-record for short answers (single words /
      // short phrases). Long C1/C2 sentence answers are unique per question and too
      // expensive to pre-record; the app falls back to live TTS for those.
      if (q.correct_answer && q.correct_answer.length <= 40) {
        enTexts.add(`Incorrect. The correct answer is: ${q.correct_answer}`);
      }

      // Answer options (target language)
      for (const opt of q.options || []) {
        if (opt) langTexts.add(opt.trim());
      }
    }
  }

  return { enTexts: [...enTexts], langTexts: [...langTexts] };
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

// ── Generate a batch of texts into a directory ─────────────────────────────────
async function generateBatch(label, texts, langCode, audioDir, stats) {
  fs.mkdirSync(audioDir, { recursive: true });
  const existing = new Set(fs.readdirSync(audioDir));
  const missing = texts.filter(t => t && !existing.has(slugify(t) + ".mp3"));

  console.log(`\n  📁 ${label} [${langCode}] — ${texts.length} total, ${existing.size} existing, ${missing.length} to generate`);

  if (missing.length === 0) { console.log(`     ✅ Already complete!`); return; }

  if (DRY_RUN) {
    console.log(`     [DRY RUN] Would generate ${missing.length} files:`);
    missing.slice(0, 5).forEach(t => console.log(`       • "${t}" → ${slugify(t)}.mp3`));
    if (missing.length > 5) console.log(`       ... and ${missing.length - 5} more`);
    return;
  }

  let done = 0;
  let errors = 0;
  let idx = 0;

  async function worker() {
    while (idx < missing.length) {
      const i = idx++;
      const text = missing[i];
      const slug = slugify(text);
      // Guard: OS filename limit is 255 bytes; skip anything that would exceed it
      if (Buffer.byteLength(slug + ".mp3") > 240) {
        console.log(`     ⚠️  Skipped (slug too long): "${text.slice(0, 50)}..."`);
        continue;
      }
      const filePath = path.join(audioDir, `${slug}.mp3`);

      if (fs.existsSync(filePath)) { stats.skipped++; continue; }

      try {
        const buffer = await generateAudio(text, langCode);
        fs.writeFileSync(filePath, buffer);
        done++;
        stats.generated++;
        process.stdout.write(`     ✓ [${done}/${missing.length}] ${text.slice(0, 60)}\r`);
      } catch (err) {
        errors++;
        stats.errors++;
        console.error(`\n     ❌ "${text.slice(0, 60)}" — ${err.message}`);
        if (err.message.includes("429")) {
          console.log(`     ⏳ Rate limited, waiting 10s...`);
          await new Promise(r => setTimeout(r, 10000));
          idx--; // retry
        }
      }
      await new Promise(r => setTimeout(r, 120));
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`\n     Done: ${done} generated, ${errors} errors`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const langCodes = ONLY_LANG ? [ONLY_LANG] : Object.keys(LANG_NAMES);
  const stats = { generated: 0, skipped: 0, errors: 0 };

  for (const langCode of langCodes) {
    if (!VOICES[langCode]) { console.log(`⚠️  No voice for ${langCode}, skipping`); continue; }
    console.log(`\n${"═".repeat(55)}\n🌐 ${LANG_NAMES[langCode]} (${langCode})`);

    // ── 1. Vocab words + situation phrases (target language) ──
    if (!SKIP_VOCAB) {
      const vocabWords = collectVocabWords(langCode);
      const sitPhrases = collectSituationPhrases(langCode);
      const allLangTexts = [...new Set([...vocabWords, ...sitPhrases])];
      await generateBatch(
        "Vocab + Quick Phrases",
        allLangTexts,
        langCode,
        path.join(ROOT, "public", "audio", langCode),
        stats
      );
    }

    // ── 2. Exam audio ──────────────────────────────────────────
    if (!SKIP_EXAM) {
      const { enTexts, langTexts } = collectExamAudio(langCode);

      // English question text + wrong feedback → /audio/en/
      await generateBatch(
        "Exam questions + feedback (EN)",
        enTexts,
        "en",
        path.join(ROOT, "public", "audio", "en"),
        stats
      );

      // Answer options in target language → /audio/{langCode}/
      await generateBatch(
        "Exam answer options",
        langTexts,
        langCode,
        path.join(ROOT, "public", "audio", langCode),
        stats
      );
    }
  }

  console.log(`\n${"═".repeat(55)}`);
  console.log(`✅ All done: ${stats.generated} generated, ${stats.skipped} skipped, ${stats.errors} errors`);

  if (stats.generated > 0) {
    console.log(`\n📦 Commit the new audio files:`);
    console.log(`   git add public/audio/`);
    console.log(`   git commit -m "Add pre-recorded audio for lessons, quick phrases, and exam"`);
    console.log(`   git push origin main`);
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
