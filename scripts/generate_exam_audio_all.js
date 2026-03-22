/**
 * LinguaPath — Pre-generate exam audio for ALL 10 languages at once
 *
 * Run from the project root:
 *   export ELEVENLABS_API_KEY=your_key_here
 *   node scripts/generate_exam_audio_all.js
 *
 * Output structure:
 *   public/audio/exam/<lang>/correct.mp3             — "Correct!" in target language
 *   public/audio/exam/<lang>/numbers/<n>.mp3         — "Question N." in target language voice
 *   public/audio/exam/<lang>/<LEVEL>_<ID>.mp3        — question audio
 *   public/audio/exam/<lang>/<LEVEL>_<ID>_A.mp3      — option A (tap-to-hear)
 *   public/audio/exam/<lang>/<LEVEL>_<ID>_B.mp3      — option B
 *   public/audio/exam/<lang>/<LEVEL>_<ID>_C.mp3      — option C
 *   public/audio/exam/<lang>/<LEVEL>_<ID>_D.mp3      — option D
 *   public/audio/exam/<lang>/<LEVEL>_<ID>_wrong.mp3  — wrong-answer feedback
 *
 * All existing files are skipped — safe to re-run if interrupted.
 *
 * Estimated total files:
 *   10 languages × 1 correct clip               =    10
 *   10 languages × 30 number clips              =   300
 *   10 languages × 6 levels × 30 questions      = 1,800
 *   10 languages × 6 levels × 30 × 4 options    = 7,200
 *   10 languages × 6 levels × 30 feedback clips = 1,800
 *   ─────────────────────────────────────────────────────
 *   Total:                                       ~11,110 files  (~112 min at 600ms/file)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY     = process.env.ELEVENLABS_API_KEY;
const LEVELS      = ["A1", "A2", "B1", "B2", "C1", "C2"];
const MAX_QUESTION = 30;

// English voice for options that are in English (translate-en + listen types)
const EN_VOICE = "EXAVITQu4vr4xnSDxMaL"; // ElevenLabs "Sarah" — clear, neutral English

// ── Language registry ──────────────────────────────────────────────────────────
const LANGUAGES = [
  {
    code:     "de",
    bankName: "German",
    voice:    "kUqnjA18C6ISqjtKOpsJ",
    correctWord:  "Richtig!",
    wrongPrefix:  "Falsch. Die richtige Antwort ist:",
    fillPrefix:   "Ergänze den Satz:",
    translateFmt: (en) => `Wie sagt man "${en}" auf Deutsch?`,
  },
  {
    code:     "fr",
    bankName: "French",
    voice:    "ttrVUBHgC9AEENt2kGi6",
    correctWord:  "Correct !",
    wrongPrefix:  "Incorrect. La bonne réponse est :",
    fillPrefix:   "Complétez la phrase :",
    translateFmt: (en) => `Comment dit-on "${en}" en français ?`,
  },
  {
    code:     "es",
    bankName: "Spanish",
    voice:    "zdzXtQ5BTOYMDG04sR8R",
    correctWord:  "¡Correcto!",
    wrongPrefix:  "Incorrecto. La respuesta correcta es:",
    fillPrefix:   "Completa la oración:",
    translateFmt: (en) => `¿Cómo se dice "${en}" en español?`,
  },
  {
    code:     "it",
    bankName: "Italian",
    voice:    "BUAZlX1JYGONhOQdurfl",
    correctWord:  "Corretto!",
    wrongPrefix:  "Sbagliato. La risposta corretta è:",
    fillPrefix:   "Completa la frase:",
    translateFmt: (en) => `Come si dice "${en}" in italiano?`,
  },
  {
    code:     "pt",
    bankName: "Portuguese",
    voice:    "CImjz27snHwe55ik6hke",
    correctWord:  "Correto!",
    wrongPrefix:  "Incorreto. A resposta correta é:",
    fillPrefix:   "Complete a frase:",
    translateFmt: (en) => `Como se diz "${en}" em português?`,
  },
  {
    code:     "ru",
    bankName: "Russian",
    voice:    "1iQuCymkuonZDnoteVZT",
    correctWord:  "Правильно!",
    wrongPrefix:  "Неверно. Правильный ответ:",
    fillPrefix:   "Дополните предложение:",
    translateFmt: (en) => `Как сказать "${en}" по-русски?`,
  },
  {
    code:     "zh",
    bankName: "Chinese",
    voice:    "RrYpxumYIVoc5NKCTGOg",
    correctWord:  "正确！",
    wrongPrefix:  "不对。正确答案是：",
    fillPrefix:   "填写空白：",
    translateFmt: (en) => `"${en}"用中文怎么说？`,
  },
  {
    code:     "ja",
    bankName: "Japanese",
    voice:    "9XG6vvb5sQYWawDizIlo",
    correctWord:  "正解！",
    wrongPrefix:  "不正解です。正解は：",
    fillPrefix:   "文を完成させてください：",
    translateFmt: (en) => `「${en}」は日本語でどう言いますか？`,
  },
  {
    code:     "ko",
    bankName: "Korean",
    voice:    "FNrsMcVkTfKeSyL1UYXS",
    correctWord:  "정답!",
    wrongPrefix:  "틀렸습니다. 정답은:",
    fillPrefix:   "문장을 완성하세요:",
    translateFmt: (en) => `"${en}"를 한국어로 어떻게 말합니까?`,
  },
  {
    code:     "el",
    bankName: "Greek",
    voice:    "8C0RosTo9KZhAz8UmM7c",
    correctWord:  "Σωστά!",
    wrongPrefix:  "Λάθος. Η σωστή απάντηση είναι:",
    fillPrefix:   "Συμπληρώστε τη φράση:",
    translateFmt: (en) => `Πώς λέγεται "${en}" στα ελληνικά;`,
  },
];

// ── Build speech text for a question ──────────────────────────────────────────
function getSpeechText(q, lang) {
  const type = q.exercise_type || "";
  const rawQ = String(q.question || "").trim();

  // translate-en: speak the target-language word/phrase so learner hears it
  // (q.audio holds the target-language text, e.g. "Hola", "你好", "こんにちは")
  if (type === "translate-en") return q.audio || null;

  // listen: speak the phrase the learner needs to identify
  if (type === "listen") return q.audio || null;

  // translate: extract the English text and wrap in target-language instruction
  if (type === "translate") {
    const m = rawQ.match(/Translate to [^:]+:\s*["']?(.+?)["']?\s*$/i);
    const english = m ? m[1].trim() : rawQ;
    return lang.translateFmt(english);
  }

  // fill: strip the English "Complete the sentence:" prefix, add target-language one
  if (type === "fill") {
    const sentence = rawQ.replace(/^Complete the sentence:\s*/i, "").trim();
    return `${lang.fillPrefix} ${sentence}`;
  }

  // mcq / scenario: question text is already in the target language
  return rawQ || null;
}

// ── ElevenLabs TTS call ────────────────────────────────────────────────────────
async function generateAudio(text, outPath, voiceId) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key":   API_KEY,
        "Content-Type": "application/json",
        Accept:         "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id:       "eleven_multilingual_v2",
        voice_settings: { stability: 0.50, similarity_boost: 0.75 },
      }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  if (!API_KEY) {
    console.error("❌  Set ELEVENLABS_API_KEY first:\n    export ELEVENLABS_API_KEY=sk_...");
    process.exit(1);
  }

  const toGenerate = [];

  for (const lang of LANGUAGES) {
    const examDir    = path.join(__dirname, `../public/audio/exam/${lang.code}`);
    const numbersDir = path.join(examDir, "numbers");
    const banksDir   = path.join(__dirname, `../public/data/exams/${lang.code}`);

    fs.mkdirSync(examDir,    { recursive: true });
    fs.mkdirSync(numbersDir, { recursive: true });

    // ── correct.mp3 — one shared "Correct!" clip per language ────────────────
    const correctPath = path.join(examDir, "correct.mp3");
    if (!fs.existsSync(correctPath)) {
      toGenerate.push({
        label:      `[${lang.code}] correct`,
        speechText: lang.correctWord,
        outPath:    correctPath,
        voiceId:    lang.voice,
      });
    }

    // ── "Question 1." … "Question 30." — read by this language's voice ──────
    for (let n = 1; n <= MAX_QUESTION; n++) {
      const outPath = path.join(numbersDir, `${n}.mp3`);
      if (!fs.existsSync(outPath)) {
        toGenerate.push({
          label:      `[${lang.code}] number clip ${n}`,
          speechText: `Question ${n}.`,
          outPath,
          voiceId:    lang.voice,
        });
      }
    }

    // ── Question audio + wrong-answer feedback ───────────────────────────────
    for (const level of LEVELS) {
      const bankFile = path.join(banksDir, level, `${lang.bankName}_${level}_exam_bank.json`);
      if (!fs.existsSync(bankFile)) {
        console.warn(`⚠️  Missing: ${bankFile} — skipping`);
        continue;
      }
      const bank = JSON.parse(fs.readFileSync(bankFile, "utf8"));

      for (const q of bank.questions || []) {
        // Question audio
        const speechText = getSpeechText(q, lang);
        if (speechText) {
          const outPath = path.join(examDir, `${level}_${q.id}.mp3`);
          if (!fs.existsSync(outPath)) {
            toGenerate.push({
              label:      `[${lang.code}] ${level} ${q.id}`,
              speechText,
              outPath,
              voiceId:    lang.voice,
            });
          }
        }

        // ── Option A / B / C / D — tap-to-hear ─────────────────────────────
        // translate-en and listen have English options → use EN_VOICE
        // all other types have target-language options → use lang.voice
        const isEnglishOptions = ["translate-en", "listen"].includes(q.exercise_type);
        const optVoice = isEnglishOptions ? EN_VOICE : lang.voice;
        (q.options || []).forEach((optText, i) => {
          const letter  = String.fromCharCode(65 + i); // A B C D
          const outPath = path.join(examDir, `${level}_${q.id}_${letter}.mp3`);
          if (!fs.existsSync(outPath)) {
            toGenerate.push({
              label:      `[${lang.code}] ${level} ${q.id} opt${letter}`,
              speechText: optText,
              outPath,
              voiceId:    optVoice,
            });
          }
        });

        // ── Wrong-answer feedback ────────────────────────────────────────────
        // Use target-language prefix for target-lang answers, English for EN answers
        if (q.correct_answer) {
          const wrongText = isEnglishOptions
            ? `Incorrect. The correct answer is: ${q.correct_answer}`
            : `${lang.wrongPrefix} ${q.correct_answer}.`;
          const outPath   = path.join(examDir, `${level}_${q.id}_wrong.mp3`);
          const wrongVoice = isEnglishOptions ? EN_VOICE : lang.voice;
          if (!fs.existsSync(outPath)) {
            toGenerate.push({
              label:      `[${lang.code}] ${level} ${q.id} wrong`,
              speechText: wrongText,
              outPath,
              voiceId:    wrongVoice,
            });
          }
        }
      }
    }
  }

  const totalFiles = toGenerate.length;
  const estMins    = Math.ceil((totalFiles * 0.6) / 60);
  console.log(`\n🎙️  ${totalFiles} files to generate across 10 languages`);
  console.log(`⏱️  Estimated time: ~${estMins} minutes\n`);

  if (totalFiles === 0) {
    console.log("✅  All audio already exists. Nothing to do.");
    return;
  }

  let done = 0, failed = 0;

  for (const { label, speechText, outPath, voiceId } of toGenerate) {
    const n = done + failed + 1;
    process.stdout.write(`  [${n}/${totalFiles}] ${label}: "${speechText.slice(0, 48)}" ... `);
    try {
      await generateAudio(speechText, outPath, voiceId);
      console.log("✅");
      done++;
    } catch (e) {
      console.log(`❌  ${e.message}`);
      failed++;
    }
    // 600ms between calls — stays within ElevenLabs rate limits
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\n🎉  Done! Generated: ${done}   Failed: ${failed}`);
  if (failed > 0) console.log("    Re-run the script to retry failed files.");
  console.log("\nNow commit:\n");
  console.log("  git add public/audio/exam/");
  console.log('  git commit -m "Add pre-recorded exam audio for all 10 languages"');
  console.log("  git push");
}

main();
