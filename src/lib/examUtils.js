// Exam bank loading, formatting, audio playback, and scoring utilities.
// Extracted from AIChat.jsx.

import { tryPlayStaticAudio } from "./staticAudio";
import { stopAllAudio, playWordAudio, getTutorVoiceId } from "./audioPlayer";

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

export function buildExamSpeechText(question, index = 1, total = 20, langCode = "de") {
  if (!question) return "";
  const raw  = String(question.question || "").trim();
  const type = question.exercise_type || "";

  if ((type === "translate-en" || type === "listen") && question.audio) return question.audio;

  const sentence = raw
    .replace(/^Complete the sentence:\s*/i, "")
    .replace(/^Translate to [^:]+:\s*/i, "")
    .replace(/^What does ['"]?(.+?)['"]? mean in English\??/i, "$1")
    .replace(/^Listen and choose what you heard\.?\s*/i, "")
    .trim();

  return sentence || raw;
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
 * Play exam question audio — static first, live TTS fallback.
 */
export async function playExamQuestionAudio(question, level, langCode, qIndex = 1, total = 25) {
  if (!question) return;
  stopAllAudio();

  const numUrl = `/audio/exam/${langCode}/numbers/${qIndex}.mp3`;
  try {
    const nr = await fetch(numUrl, { method: "HEAD", cache: "force-cache" });
    if (nr.ok) {
      const numAudio = new Audio(numUrl);
      numAudio.preload = "auto";
      await numAudio.play().catch(() => {});
      await new Promise(res => { numAudio.onended = res; setTimeout(res, 2000); });
      await new Promise(res => setTimeout(res, 120));
    }
  } catch {}

  // For translate-en questions: always TTS the target word directly from question.audio.
  // Static files for these questions have been found to contain mismatched recordings.
  if (question.exercise_type === "translate-en" && question.audio) {
    playWordAudio(question.audio, langCode, { voiceId: getTutorVoiceId(langCode) });
    return;
  }

  // For listen-type: try static pre-recorded file first (these are intentional listen exercises).
  if (question.exercise_type === "listen" && question.audio) {
    const examListenUrl = `/audio/exam/${langCode}/${level}_${question.id}.mp3`;
    try {
      const r = await fetch(examListenUrl, { method: "HEAD", cache: "force-cache" });
      if (r.ok) {
        const audio = new Audio(examListenUrl);
        audio.preload = "auto";
        audio.play().catch(() => playWordAudio(question.audio, langCode, { voiceId: getTutorVoiceId(langCode) }));
        return;
      }
    } catch {}
    const played = await tryPlayStaticAudio({ text: question.audio, langCode, stopAllAudio });
    if (!played) playWordAudio(question.audio, langCode, { voiceId: getTutorVoiceId(langCode) });
    return;
  }

  // For fill/translate/mcq: try static file, fall back to TTS of sentence.
  const url = `/audio/exam/${langCode}/${level}_${question.id}.mp3`;
  try {
    const r = await fetch(url, { method: "HEAD", cache: "force-cache" });
    if (r.ok) {
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.play().catch(() =>
        playWordAudio(buildExamSpeechText(question, qIndex, total, langCode), langCode, { voiceId: getTutorVoiceId(langCode) })
      );
      return;
    }
  } catch {}

  playWordAudio(buildExamSpeechText(question, qIndex, total, langCode), langCode, { voiceId: getTutorVoiceId(langCode) });
}

/**
 * Play exam feedback audio then chain to the next question.
 */
export async function playExamFeedbackAndNext(isCorrect, currentQuestion, nextQuestion, level, langCode, nextIndex, total) {
  let feedbackUrl;
  if (isCorrect) {
    const candidates = [`/audio/${langCode}/correct.mp3`, `/audio/${langCode}/richtig.mp3`, "/audio/de/richtig.mp3"];
    feedbackUrl = "/audio/de/richtig.mp3";
    for (const url of candidates) {
      try { const r = await fetch(url, { method: "HEAD", cache: "force-cache" }); if (r.ok) { feedbackUrl = url; break; } } catch {}
    }
  } else {
    // For translate-en questions, skip per-question wrong clips (may be mismatched).
    // Use TTS to speak the correct answer clearly instead.
    if (currentQuestion?.exercise_type === "translate-en") {
      stopAllAudio();
      const correctText = `Incorrect. The correct answer is: ${currentQuestion?.correct_answer || ""}`;
      playWordAudio(correctText, "en", { voiceId: getTutorVoiceId(langCode) });
      await new Promise(res => setTimeout(res, 3000));
      if (nextQuestion) {
        await new Promise(res => setTimeout(res, 350));
        playExamQuestionAudio(nextQuestion, level, langCode, nextIndex, total);
      }
      return;
    }
    const perQWrong = `/audio/exam/${langCode}/${level}_${currentQuestion?.id}_wrong.mp3`;
    try {
      const r = await fetch(perQWrong, { method: "HEAD", cache: "force-cache" });
      if (r.ok) { feedbackUrl = perQWrong; }
      else {
        const genericCandidates = [`/audio/${langCode}/incorrect.mp3`, `/audio/${langCode}/falsch.mp3`, "/audio/de/falsch.mp3"];
        feedbackUrl = "/audio/de/falsch.mp3";
        for (const url of genericCandidates) {
          try { const r2 = await fetch(url, { method: "HEAD", cache: "force-cache" }); if (r2.ok) { feedbackUrl = url; break; } } catch {}
        }
      }
    } catch {
      feedbackUrl = "/audio/de/falsch.mp3";
    }
  }

  try {
    const r = await fetch(feedbackUrl, { method: "HEAD", cache: "force-cache" });
    if (r.ok) {
      stopAllAudio();
      const fb = new Audio(feedbackUrl);
      fb.preload = "auto";
      await fb.play().catch(() => {});
      await new Promise(res => { fb.onended = res; setTimeout(res, 3500); });
    } else {
      const fallbackText = isCorrect
        ? "Correct!"
        : `Incorrect. The correct answer is: ${currentQuestion?.correct_answer || ""}.`;
      playWordAudio(fallbackText, langCode, { voiceId: getTutorVoiceId(langCode) });
      await new Promise(res => setTimeout(res, 2000));
    }
  } catch {
    await new Promise(res => setTimeout(res, 1500));
  }

  if (nextQuestion) {
    await new Promise(res => setTimeout(res, 350));
    playExamQuestionAudio(nextQuestion, level, langCode, nextIndex, total);
  }
}
