/**
 * LinguaPath — Pre-generate German exam question audio
 *
 * Run from the project root:
 *   export ELEVENLABS_API_KEY=your_key_here
 *   node scripts/generate_exam_audio_de.js
 *
 * Output: public/audio/exam/de/<LEVEL>_<ID>.mp3
 *   e.g.  public/audio/exam/de/A1_Q01.mp3
 *
 * Voice:  kUqnjA18C6ISqjtKOpsJ (German male — same as vocab audio)
 * Total:  126 files  (listen questions skipped — audio already exists in public/audio/de/)
 *
 * Why pre-record?
 *   1,000 users × 25 questions = 25,000 live TTS calls per exam session.
 *   Pre-recording is a one-time cost; playback is free forever.
 *
 * Feedback phrases already exist (no generation needed):
 *   public/audio/de/richtig.mp3  — "Richtig!"
 *   public/audio/de/falsch.mp3   — "Falsch."
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY      = process.env.ELEVENLABS_API_KEY;
const VOICE_DE     = "kUqnjA18C6ISqjtKOpsJ"; // German male — question content
const VOICE_EN     = "21m00Tcm4TlvDq8ikWAM"; // Rachel (English) — "Question 1", "Question 2"…
const OUT_DIR      = path.join(__dirname, "../public/audio/exam/de");
const NUMBERS_DIR  = path.join(__dirname, "../public/audio/exam/numbers");
const BANKS_DIR    = path.join(__dirname, "../public/data/exams/de");

const LEVELS       = ["A1", "A2", "B1", "B2", "C1", "C2"];
const MAX_QUESTION = 30; // highest question number across any exam

/**
 * Convert a question's data into the spoken text that should be recorded.
 * Mirrors the logic in AIChat.jsx buildExamSpeechText(), but without
 * the "Question X of Y" prefix (that's shown on screen, not spoken).
 */
function getSpeechText(q) {
  const raw = String(q.question || "").trim();
  const type = q.exercise_type || "";

  // Listen questions: the German phrase is already pre-recorded in public/audio/de/
  if (type === "listen") return null;

  // translate-en: "What does 'X' mean in English?" — speak just the German word/phrase
  // so the learner hears the German before choosing its English meaning
  if (type === "translate-en" && q.audio) return q.audio;

  // Extract a quoted term from the question text
  const quoted = raw.match(/["'"'‛‟]([^"'"'‛‟]+)["'"'‛‟]/)?.[1];

  // MCQ / translate-en: "What does 'X' mean?" → "Was bedeutet X?"
  if (quoted) return `Was bedeutet "${quoted}"?`;

  // Translate-to-German: "Translate to German: 'X'" → "Wie sagt man X auf Deutsch?"
  const transMatch = raw.match(/Translate to German:\s*["']?(.+?)["']?\s*$/i);
  if (transMatch) return `Wie sagt man "${transMatch[1]}" auf Deutsch?`;

  // Fill-in-the-blank: "Complete the sentence: ..." → read full question in German prefix
  if (type === "fill") return `Ergänze den Satz: ${raw.replace(/^Complete the sentence:\s*/i, "")}`;

  // True/False: read the statement
  if (type === "truefalse") return raw;

  // Default: speak the raw question text
  return raw;
}

async function generateAudio(text, outPath, voiceId = VOICE_DE) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.50, similarity_boost: 0.75 },
      }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
}

async function main() {
  if (!API_KEY) {
    console.error("❌  Set ELEVENLABS_API_KEY first:\n    export ELEVENLABS_API_KEY=sk_...");
    process.exit(1);
  }
  if (!fs.existsSync(OUT_DIR))     fs.mkdirSync(OUT_DIR,     { recursive: true });
  if (!fs.existsSync(NUMBERS_DIR)) fs.mkdirSync(NUMBERS_DIR, { recursive: true });

  // Build the list of all files to generate
  const toGenerate = [];

  // ── "Question 1" … "Question 25" — language-agnostic, reusable for all languages ──
  for (let n = 1; n <= MAX_QUESTION; n++) {
    const numFile = path.join(NUMBERS_DIR, `${n}.mp3`);
    if (!fs.existsSync(numFile)) {
      toGenerate.push({
        label:      `number ${n}`,
        speechText: `Question ${n}.`,
        outPath:    numFile,
        voiceId:    VOICE_EN,
      });
    }
  }
  for (const level of LEVELS) {
    const bankPath = path.join(BANKS_DIR, level, `German_${level}_exam_bank.json`);
    if (!fs.existsSync(bankPath)) {
      console.warn(`⚠️  Missing bank: ${bankPath} — skipping ${level}`);
      continue;
    }
    const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));

    for (const q of bank.questions || []) {
      // ── Question audio ──────────────────────────────────────────────────────
      const speechText = getSpeechText(q);
      if (speechText) {
        const qFile = path.join(OUT_DIR, `${level}_${q.id}.mp3`);
        if (!fs.existsSync(qFile)) {
          toGenerate.push({ label: `${level} ${q.id} question`, speechText, outPath: qFile, voiceId: VOICE_DE });
        }
      }

      // ── Wrong-answer feedback ────────────────────────────────────────────────
      // Only for questions where the correct answer is German (not English).
      // listen + translate-en have English answers — skip those; falsch.mp3 is enough.
      const hasGermanAnswer = !["listen", "translate-en"].includes(q.exercise_type);
      if (hasGermanAnswer && q.correct_answer) {
        const wrongText = `Falsch. Die richtige Antwort ist: ${q.correct_answer}.`;
        const wrongFile = path.join(OUT_DIR, `${level}_${q.id}_wrong.mp3`);
        if (!fs.existsSync(wrongFile)) {
          toGenerate.push({ label: `${level} ${q.id} wrong-feedback`, speechText: wrongText, outPath: wrongFile, voiceId: VOICE_DE });
        }
      }
    }
  }

  console.log(`🎙️  ${toGenerate.length} audio files to generate\n`);
  if (toGenerate.length === 0) {
    console.log("✅  All exam audio already exists. Nothing to do.");
    return;
  }

  let done = 0, failed = 0;
  for (const { label, speechText, outPath, voiceId } of toGenerate) {
    process.stdout.write(`  [${done + failed + 1}/${toGenerate.length}] ${label}: "${speechText.slice(0, 55)}" ... `);
    try {
      await generateAudio(speechText, outPath, voiceId);
      console.log("✅");
      done++;
    } catch (e) {
      console.log(`❌  ${e.message}`);
      failed++;
    }
    // 600ms delay to stay within ElevenLabs rate limit
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\n✅  Done! Generated ${done}, failed ${failed}`);
  console.log("\nNow push the files:\n");
  console.log("  git add public/audio/exam");
  console.log('  git commit -m "Add pre-recorded German exam question + feedback audio"');
  console.log("  git push");
}

main();
