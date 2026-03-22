// Exam bank loading, formatting, audio playback, and scoring utilities.

import { stopAllAudio, playWordAudio, getTutorVoiceId } from "./audioPlayer";

// ── Helpers ────────────────────────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
  const unique = (bank?.questions || []).filter((q) => {
    const key = `${q?.question || ""}__${(q?.options || []).join("|")}__${q?.correct_answer || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Interleave question types so user gets variety (not 6 translate-en in a row)
  const byType = {};
  unique.forEach(q => {
    const t = q.exercise_type || "other";
    if (!byType[t]) byType[t] = [];
    byType[t].push(q);
  });
  const types = Object.keys(byType);
  types.forEach(t => { byType[t] = shuffleArray(byType[t]); });

  const interleaved = [];
  let i = 0;
  while (interleaved.length < unique.length && i < unique.length * 10) {
    const pool = byType[types[i % types.length]];
    if (pool?.length) interleaved.push(pool.shift());
    i++;
  }

  const questions = interleaved.map((q, idx) => ({ ...q, question_number: idx + 1 }));
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
 * Returns the text that should be spoken aloud for a given exam question.
 * Each exercise_type has a specific "what to say" rule.
 */
export function buildExamSpeechText(question, index = 1, total = 20, langCode = "de") {
  if (!question) return "";
  const raw  = String(question.question || "").trim();
  const type = question.exercise_type || "";

  // translate-en / listen → speak the target-language word or phrase
  if ((type === "translate-en" || type === "listen") && question.audio) return question.audio;

  // fill → read the complete sentence with the blank filled in
  if (type === "fill") {
    const sentence = raw.replace(/^Complete the sentence:\s*/i, "").trim();
    return sentence.replace(/___+/g, question.correct_answer || "");
  }

  // translate (English → target language) → speak the English source phrase
  if (type === "translate") {
    return raw
      .replace(/^Translate to [^:]+:\s*/i, "")
      .replace(/^["'\u201c\u201d]|["'\u201c\u201d]$/g, "")
      .trim();
  }

  // mcq → return the raw question text (usually in target language)
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
    score >= Math.ceil(total * 0.8)
      ? "Ready"
      : score >= Math.ceil(total * 0.6)
      ? "Nearly Ready"
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
 * Play exam question audio — always TTS, never static files.
 * The pre-recorded static question files (.mp3) have been found to contain
 * mismatched recordings and are not used here.
 */
export async function playExamQuestionAudio(question, level, langCode, qIndex = 1, total = 25) {
  if (!question) return;
  stopAllAudio();

  // ① Play the question-number announcement (e.g. "Question 3") — these are reliable
  const numUrl = `/audio/exam/${langCode}/numbers/${qIndex}.mp3`;
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

  const type = question.exercise_type || "";

  // ② For translate (English → target language): speak the English phrase in English voice
  //    so the user knows what they need to translate.
  if (type === "translate") {
    const phrase = String(question.question || "")
      .replace(/^Translate to [^:]+:\s*/i, "")
      .replace(/^["'\u201c\u201d]|["'\u201c\u201d]$/g, "")
      .trim();
    if (phrase) playWordAudio(phrase, "en", { voiceId: getTutorVoiceId("en") });
    return;
  }

  // ③ For all other types: build the correct speech text and TTS in the target language.
  //    translate-en / listen → the target-language word/phrase
  //    fill → complete sentence with answer filled in
  //    mcq → the question text
  const speechText = buildExamSpeechText(question, qIndex, total, langCode);
  if (speechText) {
    playWordAudio(speechText, langCode, { voiceId: getTutorVoiceId(langCode) });
  }
}

/**
 * Play exam feedback audio then chain to the next question.
 * Correct: tries richtig.mp3 / correct.mp3, falls back to TTS "Correct!"
 * Incorrect: always TTS — static _wrong.mp3 files are mismatched.
 */
export async function playExamFeedbackAndNext(isCorrect, currentQuestion, nextQuestion, level, langCode, nextIndex, total) {
  stopAllAudio();

  if (isCorrect) {
    // Try the language-specific "correct" clip, fall back to TTS
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
    // For wrong answers: always TTS the correct answer (static _wrong.mp3 files are mismatched)
    const correctText = `Incorrect. The correct answer is: ${currentQuestion?.correct_answer || ""}`;
    playWordAudio(correctText, "en", { voiceId: getTutorVoiceId(langCode) });
    await new Promise(res => setTimeout(res, 3200));
  }

  if (nextQuestion) {
    await new Promise(res => setTimeout(res, 300));
    playExamQuestionAudio(nextQuestion, level, langCode, nextIndex, total);
  }
}
