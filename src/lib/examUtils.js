// Exam bank loading, formatting, audio playback, and scoring utilities.

import { stopAllAudio, playWordAudio, playAndWait, getTutorVoiceId, notifySpeaking } from "./audioPlayer";

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
        // keep audio field so playExamQuestionAudio knows to speak the target word
      };
    }

    // 3. translate: "Translate to target language: ..." → "Translate to German: ..."
    if (type === "translate") {
      const fixedQ = q.question.replace(
        /Translate to target language/gi,
        `Translate to ${langName}`
      );
      // Shuffle options so correct isn't always D
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
 * Returns the English text to speak for a question.
 * For "listen" type, returns null — caller should instead play q.audio in target language.
 */
export function buildExamSpeechText(question, index = 1, total = 20, langCode = "de") {
  if (!question) return "";
  const raw  = String(question.question || "").trim();
  const type = question.exercise_type || "";

  // listen: we play the target language word, not the English instruction
  if (type === "listen") return null;

  if (type === "fill") {
    // Just say the instruction in English — the German sentence is visible on screen
    return "Complete the sentence";
  }

  if (type === "translate") {
    // Read the English word/phrase to be translated, not the full instruction
    const inner = raw
      .replace(/^Translate to [^:]+:\s*/i, "")
      .replace(/^["'\u201c\u201d]|["'\u201c\u201d]$/g, "")
      .trim();
    return inner || raw;
  }

  // translate-en (EN→DE), mcq — read question text in English
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
  const pct = Math.round((score / total) * 100);

  const verdict =
    score >= Math.ceil(total * 0.8) ? "Ready to advance! 🚀"
    : score >= Math.ceil(total * 0.6) ? "Almost there! 💪"
    : "Keep practicing! 🔥";

  const stars =
    score >= Math.ceil(total * 0.8) ? "⭐⭐⭐"
    : score >= Math.ceil(total * 0.6) ? "⭐⭐"
    : "⭐";

  const bar = (() => {
    const filled = Math.round((score / total) * 10);
    return "█".repeat(filled) + "░".repeat(10 - filled);
  })();

  const tip =
    score >= Math.ceil(total * 0.8)
      ? "Excellent work — you've mastered this level! Try the next one."
      : score >= Math.ceil(total * 0.6)
      ? "You're close to passing. Focus on vocabulary precision and reading."
      : "Keep going — review grammar patterns and practice listening daily.";

  return [
    "🏔️  EXAM COMPLETE",
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    `   ${stars}  ${verdict}`,
    "",
    `   Score:  ${score} / ${total}  (${pct}%)`,
    `   ${bar}`,
    "",
    `💡 ${tip}`,
    "",
    "Your fox guide is proud of you. Keep climbing! 🦊",
  ].join("\n");
}

// ── Audio playback ─────────────────────────────────────────────────────────────

/**
 * Play question audio.
 * - listen type: speaks q.audio in target language (the word to identify)
 * - all others: speaks question text in English via TTS
 */
export async function playExamQuestionAudio(question, level, langCode, qIndex = 1, total = 25) {
  if (!question) return;
  stopAllAudio();

  const type = question.exercise_type || "";

  // listen: play the target-language word — that IS the question
  if (type === "listen" && question.audio) {
    playWordAudio(String(question.audio), langCode, { voiceId: getTutorVoiceId(langCode) });
    return;
  }

  // fill: just say "Complete the sentence" in English — German text is on screen
  if (type === "fill") {
    playWordAudio("Complete the sentence", "en", { voiceId: getTutorVoiceId("en") });
    return;
  }

  // mcq: question text is in the target language — use target language voice
  if (type === "mcq") {
    const speechText = buildExamSpeechText(question, qIndex, total, langCode);
    if (speechText) playWordAudio(speechText, langCode, { voiceId: getTutorVoiceId(langCode) });
    return;
  }

  // translate / translate-en: read the English phrase in English
  const speechText = buildExamSpeechText(question, qIndex, total, langCode);
  if (speechText) playWordAudio(speechText, "en", { voiceId: getTutorVoiceId("en") });
}

/**
 * Play audio for a single answer option when the user taps it.
 */
export async function playExamOptionAudio(question, level, langCode, optionIndex, optionText) {
  if (!question || optionIndex < 0) return;
  stopAllAudio();
  if (optionText) playWordAudio(String(optionText), langCode, { voiceId: getTutorVoiceId(langCode) });
}

/**
 * Play feedback audio, then chain to next question.
 * Waits for audio to actually finish (onended) before advancing — no more cutoff.
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
          notifySpeaking(true, "Correct!");
          await fb.play().catch(() => {});
          await new Promise(res => {
            fb.onended = () => { notifySpeaking(false); res(); };
            fb.onerror = () => { notifySpeaking(false); res(); };
            setTimeout(() => { notifySpeaking(false); res(); }, 2500);
          });
          played = true;
          break;
        }
      } catch {}
    }
    if (!played) {
      await playAndWait("Correct!", "en", { voiceId: getTutorVoiceId("en"), fallbackMs: 1000 });
    }
  } else {
    const answer = currentQuestion?.correct_answer || "";
    const correctText = `Incorrect. The correct answer is: ${answer}`;

    // playAndWait properly awaits TTS audio completion — no more cut-off feedback
    await playAndWait(correctText, "en", { voiceId: getTutorVoiceId("en"), maxMs: 12000 });
  }

  if (nextQuestion) {
    await new Promise(res => setTimeout(res, 300));
    playExamQuestionAudio(nextQuestion, level, langCode, nextIndex, total);
  }
}
