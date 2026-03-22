// Exam bank loading, formatting, audio playback, and scoring utilities.

import { stopAllAudio, playWordAudio, getTutorVoiceId } from "./audioPlayer";

// ── Bank loading ───────────────────────────────────────────────────────────────
// Questions are loaded in their original bank order (consistent for all users).
// Static audio files are keyed by question ID — same ID = same audio for every user.
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

  // Deduplicate only — preserve original order for consistent audio file mapping
  const seen = new Set();
  const deduped = (bank?.questions || []).filter((q) => {
    const key = `${q?.question || ""}__${(q?.options || []).join("|")}__${q?.correct_answer || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // ── Transform translate-en questions from DE→EN to EN→DE ──────────────────
  // Original: "What does 'danke' mean in English?" with English options
  // Transformed: "What does 'thank you' mean in German?" with German options
  const langName = bankNameMap[langCode] || "German";
  const allAudioWords = deduped
    .filter(q => q.exercise_type === "translate-en" && q.audio)
    .map(q => q.audio);

  const transformed = deduped.map(q => {
    if (q.exercise_type !== "translate-en" || !q.audio || !q.correct_answer) return q;
    const engWord = q.correct_answer;   // e.g. "thank you"
    const targetWord = q.audio;         // e.g. "danke"
    const pool = [...new Set(allAudioWords.filter(w => w !== targetWord))];
    // shuffle pool, take 3 distractors
    const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 3);
    if (distractors.length < 3) return q; // not enough distractors, leave as-is
    const options = [...distractors, targetWord].sort(() => Math.random() - 0.5);
    return {
      ...q,
      question: `What does "${engWord}" mean in ${langName}?`,
      correct_answer: targetWord,
      options,
      correct_index: options.indexOf(targetWord),
    };
  });

  const questions = transformed.map((q, idx) => ({ ...q, question_number: idx + 1 }));

  return { ...bank, question_count: questions.length || bank?.question_count || 20, questions };
}

// ── Formatting ─────────────────────────────────────────────────────────────────
export function formatLocalExamQuestion(question, total = 20, index = null) {
  if (!question) return "";
  const qn = index || question.question_number || 1;
  const lines = [
    `Question ${qn}/${total}`,
    question.question,
    "",
    ...(question.options || []).map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`)
  ];
  return lines.join("\n");
}

/**
 * Returns the text to speak for a given question.
 * After the EN→DE transform, all translate-en questions are English instructions
 * ("What does 'thank you' mean in German?"), so we just read the question text.
 */
export function buildExamSpeechText(question, index = 1, total = 20, langCode = "de") {
  if (!question) return "";
  const raw  = String(question.question || "").trim();
  const type = question.exercise_type || "";

  if (type === "fill") {
    const sentence = raw.replace(/^Complete the sentence:\s*/i, "").trim();
    return sentence.replace(/___+/g, question.correct_answer || "");
  }

  if (type === "translate") {
    return raw
      .replace(/^Translate to [^:]+:\s*/i, "")
      .replace(/^["'\u201c\u201d]|["'\u201c\u201d]$/g, "")
      .trim();
  }

  // translate-en (now EN→DE), listen, mcq — all read the question text in English
  return raw;
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

export function buildLocalExamReport(examBank, score) {
  const total = examBank?.questions?.length || 20;
  const verdict =
    score >= Math.ceil(total * 0.8) ? "Ready"
    : score >= Math.ceil(total * 0.6) ? "Nearly Ready"
    : "Needs More Practice";

  return [
    "\u{1f4ca} EXAM REPORT",
    "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
    `Total Score: ${score}/${total}`,
    `Verdict: ${verdict}`,
    "Top areas to improve: Vocabulary precision, grammar control, and reading accuracy.",
    "Keep going \u2014 you're making good progress."
  ].join("\n");
}

// ── Audio playback ─────────────────────────────────────────────────────────────
/**
 * Play question audio — always uses live TTS so audio 100% matches displayed text.
 * No pre-recorded files are used: bank updates change question content but not
 * file names, causing mismatches. TTS is the only source of truth.
 * The number announcement is intentionally omitted — the full question text
 * already contains the question number and avoids the jarring voice mismatch.
 */
export async function playExamQuestionAudio(question, level, langCode, qIndex = 1, total = 25) {
  if (!question) return;
  stopAllAudio();

  // Always use TTS — guaranteed to match what the user sees on screen.
  // After the EN→DE transform all translate-en questions are English instructions.
  const speechText = buildExamSpeechText(question, qIndex, total, langCode);
  if (speechText) playWordAudio(speechText, "en", { voiceId: getTutorVoiceId("en") });
}

/**
 * Play audio for a single answer option when the user taps it.
 * Static file: public/audio/exam/{langCode}/{level}_{question.id}_{letter}.mp3
 *   where letter = A | B | C | D
 * Falls back to TTS using the option text.
 *
 * Usage: playExamOptionAudio(question, level, langCode, optionIndex, optionText)
 *   optionIndex = 0–3 (maps to A–D)
 */
export async function playExamOptionAudio(question, level, langCode, optionIndex, optionText) {
  if (!question || optionIndex < 0) return;
  stopAllAudio();

  // After the EN→DE transform, translate-en options are German words → speak in target language.
  // All other types (mcq, fill, translate) are also in the target language.
  if (optionText) playWordAudio(String(optionText), langCode, { voiceId: getTutorVoiceId(langCode) });
}

/**
 * Play feedback audio, then chain to next question audio.
 *
 * Correct:   tries  public/audio/{langCode}/correct.mp3  →  public/audio/de/richtig.mp3  →  TTS
 * Incorrect: tries  public/audio/exam/{langCode}/{level}_{question.id}_wrong.mp3  →  TTS
 *
 * To eliminate TTS costs entirely, provide:
 *   • public/audio/de/correct.mp3  (or richtig.mp3 — already exists)
 *   • public/audio/exam/de/A1_Q01_wrong.mp3 … A1_Q30_wrong.mp3  per question
 *     Content: "Incorrect. The correct answer is: <answer>"
 */
export async function playExamFeedbackAndNext(isCorrect, currentQuestion, nextQuestion, level, langCode, nextIndex, total) {
  stopAllAudio();

  if (isCorrect) {
    const candidates = [
      `/audio/${langCode}/correct.mp3`,
      `/audio/${langCode}/richtig.mp3`,
      "/audio/de/richtig.mp3",
    ];
    let played = false;
    for (const url of candidates) {
      try {
        const r = await fetch(url, { method: "HEAD", cache: "force-cache" });
        if (r.ok) {
          const fb = new Audio(url);
          fb.preload = "auto";
          await fb.play().catch(() => {});
          await new Promise(res => { fb.onended = res; setTimeout(res, 2500); });
          played = true;
          break;
        }
      } catch {}
    }
    if (!played) {
      playWordAudio("Correct!", "en", { voiceId: getTutorVoiceId(langCode) });
      await new Promise(res => setTimeout(res, 1500));
    }
  } else {
    // Always use TTS — pre-recorded wrong files are keyed by question.id and go out
    // of sync whenever the bank is updated, producing wrong feedback (e.g. "die richtige
    // antwort ist: guten abend" for a question about "danke").
    const correctText = `Incorrect. The correct answer is: ${currentQuestion?.correct_answer || ""}`;
    playWordAudio(correctText, "en", { voiceId: getTutorVoiceId("en") });
    await new Promise(res => setTimeout(res, 3200));
  }

  if (nextQuestion) {
    await new Promise(res => setTimeout(res, 300));
    playExamQuestionAudio(nextQuestion, level, langCode, nextIndex, total);
  }
}
