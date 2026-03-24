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

/**
 * Play the audio for a question.
 * All branches are properly awaitable — callers can await this to know when audio finishes.
 *
 * listen      → "Listen and choose what you heard." (EN) + target-lang word
 * fill        → "Complete the sentence." (EN)
 * translate   → full question text in English  e.g. "Translate to German: My name is Anna"
 * translate-en→ full question text in English  e.g. "What does 'danke' mean in German?"
 * mcq         → question text in target language (situational / real-life scenarios)
 */
export async function playExamQuestionAudio(question, level, langCode, qIndex = 1, total = 25) {
  if (!question) return;
  stopAllAudio();

  const type = question.exercise_type || "";

  // ── listen: English prompt first, then the target-language word ──────────
  if (type === "listen" && question.audio) {
    await playAndWait("Listen and choose what you heard.", "en", {
      voiceId: getTutorVoiceId("en"), maxMs: 4000, fallbackMs: 800,
    });
    await new Promise(r => setTimeout(r, 350));
    await playAndWait(String(question.audio), langCode, {
      voiceId: getTutorVoiceId(langCode), maxMs: 6000, fallbackMs: 1000,
    });
    return;
  }

  // ── fill: say the instruction in English only ────────────────────────────
  if (type === "fill") {
    await playAndWait("Complete the sentence.", "en", {
      voiceId: getTutorVoiceId("en"), maxMs: 4000, fallbackMs: 800,
    });
    return;
  }

  // ── mcq (situational/real-life): read the full question in target language ─
  if (type === "mcq") {
    const text = String(question.question || "").trim();
    if (text) {
      await playAndWait(text, langCode, {
        voiceId: getTutorVoiceId(langCode), maxMs: 10000, fallbackMs: 1000,
      });
    }
    return;
  }

  // ── translate + translate-en: read full question text in English ─────────
  const text = String(question.question || "").trim();
  if (text) {
    await playAndWait(text, "en", {
      voiceId: getTutorVoiceId("en"), maxMs: 10000, fallbackMs: 1000,
    });
  }
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
 * Play feedback audio only (correct chime or incorrect spoken feedback).
 * Returns a Promise that resolves when audio finishes.
 * Does NOT chain to the next question — caller is responsible for that.
 */
export async function playExamFeedbackAudio(isCorrect, currentQuestion, langCode) {
  stopAllAudio();

  if (isCorrect) {
    // Try a pre-recorded "Correct!" / "Richtig!" chime first
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
            fb.onended  = () => { notifySpeaking(false); res(); };
            fb.onerror  = () => { notifySpeaking(false); res(); };
            setTimeout(() => { notifySpeaking(false); res(); }, 2500);
          });
          played = true;
          break;
        }
      } catch {}
    }
    if (!played) {
      await playAndWait("Correct!", "en", { voiceId: getTutorVoiceId("en"), maxMs: 3000, fallbackMs: 800 });
    }
  } else {
    const answer = currentQuestion?.correct_answer || "";
    const text = `Incorrect. The correct answer is: ${answer}`;
    await playAndWait(text, "en", { voiceId: getTutorVoiceId("en"), maxMs: 10000, fallbackMs: 1500 });
  }
}

// Keep for backwards compat — now just wraps feedback + optional next question
export async function playExamFeedbackAndNext(isCorrect, currentQuestion, nextQuestion, level, langCode, nextIndex, total) {
  await playExamFeedbackAudio(isCorrect, currentQuestion, langCode);
  if (nextQuestion) {
    await new Promise(r => setTimeout(r, 300));
    await playExamQuestionAudio(nextQuestion, level, langCode, nextIndex, total);
  }
}
