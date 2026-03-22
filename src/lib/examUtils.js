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
  const questions = (bank?.questions || []).filter((q) => {
    const key = `${q?.question || ""}__${(q?.options || []).join("|")}__${q?.correct_answer || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map((q, idx) => ({ ...q, question_number: idx + 1 }));

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
 * Returns the text to speak for a given question type.
 * translate-en / listen → the target-language word/phrase (question.audio)
 * fill              → complete sentence with correct answer filled in
 * translate         → the English source phrase
 * mcq               → the question text in target language
 */
export function buildExamSpeechText(question, index = 1, total = 20, langCode = "de") {
  if (!question) return "";
  const raw  = String(question.question || "").trim();
  const type = question.exercise_type || "";

  if ((type === "translate-en" || type === "listen") && question.audio) return question.audio;

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

  return raw; // mcq — read question text
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
 * Pre-recorded static files are intentionally skipped: bank updates change question
 * content but not file names, causing mismatches (e.g. file says "good night" but
 * screen shows "danke"). TTS is the only source of truth.
 *
 * Only the number announcement (numbers/1.mp3 … numbers/30.mp3) uses static files
 * because those contain just a number and cannot go out of sync.
 */
export async function playExamQuestionAudio(question, level, langCode, qIndex = 1, total = 25) {
  if (!question) return;
  stopAllAudio();

  // ① Question-number announcement — these are just spoken numbers, always correct
  const numUrl = `/audio/exam/numbers/${qIndex}.mp3`;
  try {
    const nr = await fetch(numUrl, { method: "HEAD", cache: "force-cache" });
    if (nr.ok) {
      const numAudio = new Audio(numUrl);
      numAudio.preload = "auto";
      await numAudio.play().catch(() => {});
      await new Promise(res => { numAudio.onended = res; setTimeout(res, 2500); });
      await new Promise(res => setTimeout(res, 150));
    }
  } catch {}

  // ② Always use TTS — guaranteed to match what the user sees on screen
  const type = question.exercise_type || "";
  if (type === "translate") {
    // Translate questions: speak the English source phrase in English
    const phrase = String(question.question || "")
      .replace(/^Translate to [^:]+:\s*/i, "")
      .replace(/^["'\u201c\u201d]|["'\u201c\u201d]$/g, "")
      .trim();
    if (phrase) playWordAudio(phrase, "en", { voiceId: getTutorVoiceId("en") });
    return;
  }
  // For translate-en / listen: speak the target-language audio field if present
  if ((type === "translate-en" || type === "listen") && question.audio) {
    playWordAudio(question.audio, langCode, { voiceId: getTutorVoiceId(langCode) });
    return;
  }
  // Default: read the question text (MCQ, fill, etc.)
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

  // Always use TTS — static option files can be misaligned with bank updates
  const type = question.exercise_type || "";
  // translate-en / listen: options are English words/phrases → speak in English
  // everything else (mcq, fill, translate): options are in target language
  const isEnglishOption = type === "translate-en" || type === "listen";
  const speakLang = isEnglishOption ? "en" : langCode;
  if (optionText) playWordAudio(String(optionText), speakLang, { voiceId: getTutorVoiceId(speakLang) });
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
    // Try per-question wrong clip (pre-recorded, zero API cost)
    const wrongUrl = `/audio/exam/${langCode}/${level}_${currentQuestion?.id}_wrong.mp3`;
    let played = false;
    try {
      const r = await fetch(wrongUrl, { method: "HEAD", cache: "force-cache" });
      if (r.ok) {
        const fb = new Audio(wrongUrl);
        fb.preload = "auto";
        await fb.play().catch(() => {});
        await new Promise(res => { fb.onended = res; setTimeout(res, 4000); });
        played = true;
      }
    } catch {}

    if (!played) {
      // TTS fallback until pre-recorded wrong clips are provided
      const correctText = `Incorrect. The correct answer is: ${currentQuestion?.correct_answer || ""}`;
      playWordAudio(correctText, "en", { voiceId: getTutorVoiceId(langCode) });
      await new Promise(res => setTimeout(res, 3200));
    }
  }

  if (nextQuestion) {
    await new Promise(res => setTimeout(res, 300));
    playExamQuestionAudio(nextQuestion, level, langCode, nextIndex, total);
  }
}
