// Exam bank loading, formatting, audio playback, and scoring utilities.

import { stopAllAudio, playExamAudio, speakText } from "./audioPlayer";
import { slugifyStaticAudio } from "./staticAudio";
import { getRom, getRomSync, NEEDS_ROM } from "./romanize";

// ── Bank loading ───────────────────────────────────────────────────────────────
export async function loadLocalExamBank(langCode, level) {
  const bankNameMap = {
    de: "German", fr: "French",  es: "Spanish",  it: "Italian",
    pt: "Portuguese", ru: "Russian", zh: "Chinese", ja: "Japanese",
    ko: "Korean",  el: "Greek",
  };
  const prefix = bankNameMap[langCode] || "German";
  const res = await fetch(`/data/exams/${langCode}/${level}/${prefix}_${level}_exam_bank.json`);
  if (!res.ok) throw new Error(`Failed to load local exam bank: HTTP ${res.status}`);
  const bank = await res.json();

  // Deduplicate
  const seen = new Set();
  const deduped = (bank?.questions || []).filter((q) => {
    const key = `${q?.question || ""}__${(q?.options || []).join("|")}__${q?.correct_answer || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const langName = bankNameMap[langCode] || "German";

  // ── Collect audio word pools for transforms ────────────────────────────────
  const translateAudioWords = deduped
    .filter(q => q.exercise_type === "translate-en" && q.audio)
    .map(q => q.audio);

  const listenAudioWords = deduped
    .filter(q => q.exercise_type === "listen" && q.audio)
    .map(q => q.audio);

  // ── Transform each question ────────────────────────────────────────────────
  const transformed = deduped.map(q => {
    const type = q.exercise_type;

    // 1. translate-en: "What does 'danke' mean in English?" → "What does 'thank you' mean in German?"
    if (type === "translate-en" && q.audio && q.correct_answer) {
      const engWord = q.correct_answer;   // "thank you"
      const targetWord = q.audio;         // "danke"
      const pool = [...new Set(translateAudioWords.filter(w => w !== targetWord))];
      const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 3);
      if (distractors.length < 3) return q;
      const options = [...distractors, targetWord].sort(() => Math.random() - 0.5);
      return {
        ...q,
        question: `What does "${engWord}" mean in ${langName}?`,
        correct_answer: targetWord,
        options,
        correct_index: options.indexOf(targetWord),
      };
    }

    // 2. listen: English options → target language options, correct = q.audio
    if (type === "listen" && q.audio) {
      const targetWord = q.audio;   // e.g. "Guten Morgen"
      const pool = [...new Set(listenAudioWords.filter(w => w !== targetWord))];
      const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 3);
      if (distractors.length < 3) return q;
      const options = [...distractors, targetWord].sort(() => Math.random() - 0.5);
      return {
        ...q,
        question: `Listen and choose what you heard.`,
        correct_answer: targetWord,
        options,
        correct_index: options.indexOf(targetWord),
      };
    }

    // 3. translate: "Translate to target language: ..." → "Translate to German: ..."
    if (type === "translate") {
      const fixedQ = q.question.replace(
        /Translate to target language/gi,
        `Translate to ${langName}`
      );
      const correct = q.correct_answer;
      const shuffled = [...(q.options || [])].sort(() => Math.random() - 0.5);
      return {
        ...q,
        question: fixedQ,
        options: shuffled,
        correct_index: shuffled.indexOf(correct),
      };
    }

    // 4. fill / mcq: shuffle options so correct isn't always D
    if (type === "fill" || type === "mcq") {
      const correct = q.correct_answer;
      const shuffled = [...(q.options || [])].sort(() => Math.random() - 0.5);
      return {
        ...q,
        options: shuffled,
        correct_index: shuffled.indexOf(correct),
      };
    }

    return q;
  });

  const questions = transformed.map((q, idx) => ({ ...q, question_number: idx + 1 }));
  return { ...bank, question_count: questions.length || bank?.question_count || 20, questions };
}

// ── Formatting ─────────────────────────────────────────────────────────────────
export async function formatLocalExamQuestion(question, total = 20, index = null, langCode = null) {
  if (!question) return "";
  const qn = index || question.question_number || 1;
  const opts = question.options || [];

  // For non-Latin languages, annotate each option with its romanization
  let optLines;
  if (langCode && NEEDS_ROM.has(langCode)) {
    optLines = await Promise.all(opts.map(async (opt, i) => {
      const letter = String.fromCharCode(65 + i);
      const rom = await getRom(opt, langCode);
      return rom ? `${letter}) ${opt}  (${rom})` : `${letter}) ${opt}`;
    }));
  } else {
    optLines = opts.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`);
  }

  const lines = [
    `Question ${qn}/${total}`,
    question.question,
    "",
    ...optLines
  ];
  return lines.join("\n");
}

export function extractOptionChoice(userText, options = []) {
  const raw = String(userText || "").trim();
  if (!raw) return { index: -1, normalized: "" };

  const letterMatch = raw.match(/^([A-Da-d])(?:[)\].:\s-]|\s|$)/);
  if (letterMatch) {
    return {
      index: letterMatch[1].toUpperCase().charCodeAt(0) - 65,
      normalized: raw
    };
  }

  const lowered = raw.toLowerCase().trim();
  const idx = options.findIndex(opt => String(opt || "").toLowerCase().trim() === lowered);
  return { index: idx, normalized: raw };
}

// ── Smart exam report ─────────────────────────────────────────────────────────
export function buildLocalExamReport(examBank, score, wrongQuestions = []) {
  const total = examBank?.questions?.length || 20;
  const pct = Math.round((score / total) * 100);

  const verdict =
    score >= Math.ceil(total * 0.8) ? "Ready to advance! 🚀"
    : score >= Math.ceil(total * 0.6) ? "Almost there! 💪"
    : "Keep practicing! 🔥";

  const stars =
    score >= Math.ceil(total * 0.8) ? "⭐⭐⭐"
    : score >= Math.ceil(total * 0.6) ? "⭐⭐"
    : "⭐";

  // ── Analyse mistakes by type ──────────────────────────────────────────────
  const typeCount = {};
  wrongQuestions.forEach(q => {
    const t = q.exercise_type || "mcq";
    typeCount[t] = (typeCount[t] || 0) + 1;
  });

  // ── Build specific recommendations ───────────────────────────────────────
  const recs = [];

  // Grammar (fill = sentence completion)
  if ((typeCount["fill"] || 0) >= 2) {
    recs.push("📝 Grammar — review verb forms and sentence patterns (e.g. conjugation exercises in the Grammar unit).");
  }

  // Vocabulary (translate-en = word → target lang)
  if ((typeCount["translate-en"] || 0) >= 1) {
    const words = wrongQuestions
      .filter(q => q.exercise_type === "translate-en")
      .map(q => q.correct_answer || q.audio)
      .filter(Boolean)
      .slice(0, 4)
      .join(", ");
    recs.push(`📖 Vocabulary — focus on words like: ${words}. Revisit the Vocabulary flashcard unit.`);
  }

  // Translation (translate = phrase → target lang)
  if ((typeCount["translate"] || 0) >= 1) {
    const examples = wrongQuestions
      .filter(q => q.exercise_type === "translate")
      .map(q => q.correct_answer)
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");
    recs.push(`🔄 Translation — practice full phrases like: ${examples}. Work through the Translation exercises.`);
  }

  // Listening
  if ((typeCount["listen"] || 0) >= 2) {
    recs.push("🎧 Listening — replay the audio clips in the Listening unit and try to distinguish similar-sounding phrases.");
  }

  // Conversational / situational (mcq)
  if ((typeCount["mcq"] || 0) >= 2) {
    const topics = wrongQuestions
      .filter(q => q.exercise_type === "mcq")
      .map(q => (q.question || "").replace(/\?.*/, "").trim())
      .filter(Boolean)
      .slice(0, 2);
    if (topics.length) {
      recs.push(`💬 Real-life situations — review scenarios like "${topics[0]}". Practice the Conversation & Situations unit.`);
    } else {
      recs.push("💬 Real-life situations — practice the Conversation & Situations unit for everyday phrases.");
    }
  }

  // Fallback if all went well or no pattern
  if (recs.length === 0) {
    if (pct >= 80) {
      recs.push("You're performing excellently across all categories — you're ready to move up!");
    } else {
      recs.push("📚 Review the units where you missed questions and retry the practice exercises.");
    }
  }

  const recsText = recs.map(r => `  • ${r}`).join("\n");

  return [
    "🏔️  EXAM COMPLETE",
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    `   ${stars}  ${verdict}`,
    "",
    `   Score: ${score} / ${total}  (${pct}%)`,
    "",
    wrongQuestions.length > 0
      ? `📌 We recommend focusing on:\n${recsText}`
      : "✅ Great work across the board!",
    "",
    "Your fox guide is proud of you. Keep climbing! 🦊",
  ].join("\n");
}

// ── Audio playback ─────────────────────────────────────────────────────────────
// All exam audio uses PRE-RECORDED files only.
// File naming: /audio/exam/{lang}/{LEVEL}_Q{NN}.mp3      ← question
//              /audio/exam/{lang}/{LEVEL}_Q{NN}_wrong.mp3 ← wrong feedback
//              /audio/exam/{lang}/correct.mp3              ← correct feedback
//              /audio/{lang}/{slug}.mp3                    ← individual words (options)

function _examQId(question, fallbackIndex = 1) {
  if (question.id) return question.id;
  const n = question.question_number || fallbackIndex;
  return `Q${String(n).padStart(2, "0")}`;
}

/**
 * Returns the audio text for a listen question's Replay button.
 * The replay button will call playExamQuestionAudio() which handles static→TTS fallback.
 * We return the question.audio text as a sentinel so AIChat knows audio exists.
 */
export function getExamQuestionAudioUrl(question, level, langCode, qIndex = 1) {
  if (!question || !langCode) return null;
  // Return the actual sentence text — replay button uses this to re-trigger audio
  return String(question.audio || "").trim() || null;
}

/**
 * Play exam question audio.
 * ONLY plays for "listen" type questions — all other types are silent.
 * For listen: plays question.audio (the actual target-language sentence to identify).
 *   1) Tries the pre-recorded static word file /audio/{lang}/{slug}.mp3
 *   2) Falls back to Web Speech in the target language
 * Never uses the generic question file (A1_Q13.mp3) which may have wrong content.
 */
export async function playExamQuestionAudio(question, level, langCode, qIndex = 1, total = 25) {
  if (!question) return;
  const type = question.exercise_type || "";
  // Only listening comprehension questions get auto-played audio
  if (type !== "listen") return;
  const audioText = String(question.audio || "").trim();
  if (!audioText) return;
  // Try static word audio file first
  const slug = slugifyStaticAudio(audioText);
  const staticUrl = `/audio/${langCode}/${slug}.mp3`;
  try {
    const head = await fetch(staticUrl, { method: "HEAD", cache: "force-cache" });
    if (head.ok) {
      await playExamAudio(staticUrl, { maxMs: 10000 });
      return;
    }
  } catch {}
  // Fallback: Web Speech in target language (guaranteed to say the correct sentence)
  await speakText(audioText, langCode);
}

/**
 * Play audio when the user taps an answer option on a listen question.
 * Lets them hear each option to compare — plays static word file or Web Speech.
 */
export async function playExamOptionAudio(question, level, langCode, optionIndex, optionText) {
  if (!question || optionIndex < 0 || !optionText) return;
  // Only play option audio for listen exercises
  if ((question.exercise_type || "") !== "listen") return;
  const slug = slugifyStaticAudio(String(optionText));
  const staticUrl = `/audio/${langCode}/${slug}.mp3`;
  try {
    const head = await fetch(staticUrl, { method: "HEAD", cache: "force-cache" });
    if (head.ok) {
      await playExamAudio(staticUrl, { maxMs: 8000 });
      return;
    }
  } catch {}
  // Fallback: Web Speech so user always hears the option
  await speakText(String(optionText), langCode);
}

/**
 * Feedback audio — silent.
 * Correct/wrong feedback is shown visually only; no audio to avoid wrong-language TTS.
 */
// eslint-disable-next-line no-unused-vars
export async function playExamFeedbackAudio(isCorrect, currentQuestion, langCode, level) {
  // Intentionally silent — feedback shown via ✅/❌ UI only
}
