import React, { useState, useEffect, useRef } from 'react';
import { supabase, canUseAISession, startAISession, incrementAISessionMessage, incrementDailyAI } from '../lib/appState';
import { findPrerecordedAnswer, getTopicAnswer } from '../lib/prerecorded';
import {
  setAudioLang, stopAllAudio, queueSpeech,
  normalizeTextForSpeech, getTutorVoiceId, getLessonWordText, playWordAudio,
} from '../lib/audioPlayer';
import {
  isRealReviewMistake, getMistakes, saveMistakes,
  pushMistake, pushLessonMistake,
  getWeekKey, getWeekEnd, formatTimeLeft,
  getChallengeData, saveChallengeData, awardChallengeXP,
} from '../lib/progressUtils';
import {
  loadLocalExamBank, formatLocalExamQuestion,
  playExamQuestionAudio, playExamFeedbackAudio, playExamOptionAudio,
  extractOptionChoice, buildLocalExamReport,
} from '../lib/examUtils';
import { parseMistakes, normalizeTutorSpeechText } from '../lib/tutorUtils';
import FoxTutorCard from './FoxTutorCard';
import { GLOBAL_CSS } from '../config/theme';
import { getAIChatLangConfig } from '../config/langConfig';
import { LANGUAGES, VISUAL_QUERY_MAP, NUMBER_VALUE_MAP } from '../config/languages';
import { SITUATIONS } from '../data/situations';
import { AI_SCENARIOS } from '../data/aiScenarios';
import { useProgress, getLevelColor, getCompletedModuleIds, getCachedProgress } from '../lib/progressHooks';

function renderFingerString(num) {
  const map = {0:"✊",1:"☝️",2:"✌️",3:"☝️☝️☝️",4:"☝️☝️☝️☝️",5:"🖐️",6:"🖐️☝️",7:"🖐️✌️",8:"🖐️☝️☝️☝️",9:"🖐️☝️☝️☝️☝️",10:"🖐️🖐️"};
  return map[num] || null;
}

function getNumberValue(source) {
  if (source == null) return null;
  const raw = (typeof source === "object"
    ? (source.en || source.target || Object.values(source).find(v => typeof v === "string") || "")
    : String(source)
  ).trim().toLowerCase();
  if (raw in NUMBER_VALUE_MAP) return NUMBER_VALUE_MAP[raw];
  // Also try individual words in a phrase (e.g. "the number five")
  for (const word of raw.split(/\s+/)) {
    if (word in NUMBER_VALUE_MAP) return NUMBER_VALUE_MAP[word];
  }
  return null;
}

function NumberVisual({ source, langCode = "en" }) {
  const value = getNumberValue(source);
  const fingerText = value !== null ? renderFingerString(value) : null;
  if (!fingerText) return null;
  return (
    <div style={{
      width: 320, maxWidth: "86%", borderRadius: 18, padding: "16px 14px", margin: "0 auto 16px",
      background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
      border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 12px 28px rgba(0,0,0,0.18)"
    }}>
      <div style={{ fontSize: 16, color: "var(--muted)", marginBottom: 8 }}>Count it</div>
      <div style={{ fontSize: value >= 8 ? 32 : 40, lineHeight: 1.2, wordBreak: "break-word" }}>{fingerText}</div>
    </div>
  );
}

function getConcreteImageQuery(source, langCode = "en") {
  if (!source) return "";
  if (typeof source === "object") {
    if (typeof source.image_query === "string" && source.image_query.trim()) return source.image_query.trim();
    const choices = [source.en, source[langCode], source.word, source.target, source.corrected, source.original].filter(Boolean);
    for (const choice of choices) {
      const q = getConcreteImageQuery(choice, langCode);
      if (q) return q;
    }
    return "";
  }
  const raw = String(source).trim();
  if (!raw) return "";
  const lower = raw.toLowerCase();
  if (VISUAL_QUERY_MAP[lower]) return VISUAL_QUERY_MAP[lower];
  for (const [k, v] of Object.entries(VISUAL_QUERY_MAP)) {
    if (lower.includes(k)) return v;
  }
  const meanMatch = raw.match(/what does ['"]?(.+?)['"]? mean/i);
  if (meanMatch?.[1]) return getConcreteImageQuery(meanMatch[1], langCode);
  const sayMatch = raw.match(/how do you say ['"]?(.+?)['"]? in /i);
  if (sayMatch?.[1]) return getConcreteImageQuery(sayMatch[1], langCode);
  if (raw.split(/\s+/).length <= 2 && /^[\p{L}\s-]+$/u.test(raw)) return raw;
  return "";
}

async function fetchVisualAid(query) {
  if (!query || typeof window === "undefined") return null;
  const cacheKey = `lp_visual_${query.toLowerCase()}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch {}
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const out = data?.thumbnail?.source ? { image: data.thumbnail.source, title: data.title || query, description: data.description || "" } : null;
    try { localStorage.setItem(cacheKey, JSON.stringify(out)); } catch {}
    return out;
  } catch {
    try { localStorage.setItem(cacheKey, "null"); } catch {}
    return null;
  }
}

function useVisualAid(source, langCode = "en") {
  const [visual, setVisual] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const query = getConcreteImageQuery(source, langCode);
    if (!query) { setVisual(null); return; }
    fetchVisualAid(query).then((result) => { if (!cancelled) setVisual(result); });
    return () => { cancelled = true; };
  }, [typeof source === "object" ? JSON.stringify(source) : String(source || ""), langCode]);
  return visual;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function StarRating({ score, total }) {
  const pct = score / total;
  const stars = pct >= 0.9 ? 3 : pct >= 0.65 ? 2 : 1;
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3].map(i => (
        <span key={i} style={{ fontSize: 24, filter: i <= stars ? "none" : "grayscale(1) opacity(0.3)" }}>⭐</span>
      ))}
    </div>
  );
}

function XPBadge({ xp }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(245,200,66,0.15)",
      border: "1px solid rgba(245,200,66,0.3)", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#f5c842" }}>
      ⚡ +{xp} XP
    </div>
  );
}

// ─── EXERCISE COMPONENT ───
function Exercise({ exercises, onComplete, accent, userId, langCode, moduleName }) {
  const langName = (langCode && getAIChatLangConfig) ? getAIChatLangConfig(langCode).name : "target language";
  const [order] = useState(() => shuffle(exercises.map((_, i) => i)));
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const safeExercises = Array.isArray(exercises) ? exercises.filter(Boolean) : [];
  const q = safeExercises[order[idx]] || safeExercises[0] || { q: "No exercise available.", options: ["OK"], answer: "OK", type: "translate-en" };
  const opts = shuffle(Array.isArray(q.options) && q.options.length ? q.options : [String(q.answer || "OK")]);

  function pick(opt) {
    if (chosen) return;
    const isCorrect = opt === q.answer;
    setChosen(opt);
    setCorrect(isCorrect);
    if (isCorrect) setScore(s => s + 1);
    else pushLessonMistake(userId, langCode, q.q, q.answer, moduleName);
    setTimeout(() => {
      if (idx + 1 >= safeExercises.length) setDone(true);
      else { setIdx(i => i + 1); setChosen(null); setCorrect(null); }
    }, 1200);
  }

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }} className="pop-in">
        <div style={{ fontSize: 56, marginBottom: 12 }}>{score === safeExercises.length ? "🏆" : score >= safeExercises.length * 0.6 ? "🌟" : "💪"}</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 8 }}>
          {score === safeExercises.length ? "Perfect!" : "Well done!"}
        </h3>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>{score}/{safeExercises.length} correct</p>
        <StarRating score={score} total={safeExercises.length} />
        <button className="btn btn-gold" style={{ marginTop: 24 }} onClick={() => onComplete(score)}>
          Continue →
        </button>
      </div>
    );
  }

  return (
    <div className="fade-up">
      {/* Progress */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
          <span>Exercise {idx + 1} of {safeExercises.length}</span>
          <span style={{ color: accent || "#f5c842", fontWeight: 700 }}>{score} ✓</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${safeExercises.length > 0 ? (idx / safeExercises.length) * 100 : 0}%`, background: accent || "var(--gold)" }} />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
          {q.type === "fill"
            ? "Fill in the blank"
            : (String(q.type || "").startsWith("translate-") && q.type !== "translate-en")
              ? ("Translate to " + (langName || "target language"))
              : "Translate to English"}
        </div>
        <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, color: "var(--text)" }}>{q.q}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {opts.map(opt => (
          <button key={opt} className={`choice-btn ${chosen ? (opt === q.answer ? "choice-correct" : opt === chosen ? "choice-wrong" : "") : ""}`}
            disabled={!!chosen} onClick={() => pick(opt)}>
            {opt}
            {chosen && opt === q.answer && <span style={{ marginLeft: "auto" }}>✓</span>}
          </button>
        ))}
      </div>

      {chosen && (
        <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 12,
          background: correct ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          border: `1px solid ${correct ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
          fontSize: 14, color: correct ? "var(--green)" : "var(--red)" }} className="fade-in">
          {correct ? "✓ Correct!" : `✗ Correct answer: ${q.answer}`}
        </div>
      )}
    </div>
  );
}

// ─── VOCAB CARD ───


function VocabCard({ word, onNext, total, current, langCode }) {
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(null);
  const targetWord = getLessonWordText(word, langCode);
  const visual = useVisualAid(word, langCode);

  useEffect(() => { 
    setFlipped(false); 
    setKnown(null); 
    // Auto-play pronunciation when card loads
    setTimeout(() => { if (targetWord) playWordAudio(targetWord, langCode || _currentAudioLang); }, 300);
  }, [word, targetWord, langCode]);

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
        <span>Word {current + 1} of {total}</span>
        <span style={{ color: "var(--text)", opacity: 0.5 }}>Tap card to reveal</span>
      </div>

      <div className="vocab-card" style={{ cursor: "pointer" }} onClick={() => setFlipped(f => !f)}>
        <div style={{ background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 20,
          minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: 32, textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120,
            borderRadius: "50%", background: "rgba(255,255,255,0.02)" }} />

          {!flipped ? (
            <div className="fade-in">
              <NumberVisual source={word} langCode={langCode} />
              {visual?.image && (
                <img
                  src={visual.image}
                  alt={visual.title || targetWord}
                  style={{
                    width: 320,
                    maxWidth: "86%",
                    height: 210,
                    objectFit: "cover",
                    borderRadius: 14,
                    margin: "0 auto 18px",
                    display: "block",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.22)"
                  }}
                />
              )}
              <div style={{
                fontSize: "clamp(22px, 4.2vw, 36px)",
                fontWeight: 800,
                fontFamily: "var(--font-display)",
                marginBottom: 12,
                color: "#f0f0f5",
                textAlign:"center",
                lineHeight: 1.05,
                maxWidth: "100%",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                hyphens: "auto"
              }}>{targetWord || word.word || word.target || "—"}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", textAlign:"center" }}>{word.phonetic}</div>
              <div style={{ width:"100%", display:"flex", justifyContent:"center", alignItems:"center", marginTop:18 }}>
                <button
                  onClick={e => { e.stopPropagation(); playWordAudio(targetWord, langCode || _currentAudioLang); }}
                  aria-label="Play pronunciation"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    border: "1px solid rgba(245,200,66,0.35)",
                    background: "rgba(245,200,66,0.12)",
                    color: "var(--gold)",
                    fontSize: 26,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
                    margin: "0 auto"
                  }}>
                  🔊
                </button>
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)", opacity: 0.72 }}>Tap speaker to listen</div>
              <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)", opacity: 0.6 }}>tap card to reveal →</div>
            </div>
          ) : (
            <div className="pop-in" style={{ width:"100%" }}>
              <NumberVisual source={word} langCode={langCode} />
              {visual?.image && (
                <img
                  src={visual.image}
                  alt={visual.title || word.en}
                  style={{
                    width: 320,
                    maxWidth: "86%",
                    height: 210,
                    objectFit: "cover",
                    borderRadius: 14,
                    margin: "0 auto 16px",
                    display: "block",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.22)"
                  }}
                />
              )}
              <div style={{ fontSize:13, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Translation</div>
              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 10, color: "var(--text)" }}>{word.en}</div>
              <div style={{ fontSize: 20, color: "var(--gold)", fontWeight: 700, marginBottom: 8 }}>{targetWord}</div>
              {word.phonetic && <div style={{ fontSize:13, color:"var(--muted)", marginBottom:10 }}>/{word.phonetic}/</div>}
              {word.example && <div style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic", marginBottom: 14 }}>"{word.example}"</div>}
              <button onClick={e => { e.stopPropagation(); playWordAudio(targetWord, _currentAudioLang); }}
                style={{ background: "rgba(245,200,66,0.12)", border: "1px solid rgba(245,200,66,0.3)",
                  borderRadius: 20, padding: "8px 20px", color: "var(--gold)", fontSize: 13, cursor: "pointer", display:"flex", alignItems:"center", gap:6, margin:"0 auto" }}>
                🔊 Hear pronunciation
              </button>
            </div>
          )}
        </div>
      </div>

      {flipped && (
        <div style={{ display: "flex", gap: 12, marginTop: 16 }} className="fade-in">
          <button className="btn btn-ghost" style={{ flex: 1, background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", color: "var(--red)" }}
            onClick={() => { setKnown(false); setTimeout(onNext, 100); }}>
            😕 Still learning
          </button>
          <button className="btn btn-ghost" style={{ flex: 1, background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", color: "var(--green)" }}
            onClick={() => { setKnown(true); setTimeout(onNext, 100); }}>
            ✓ Got it!
          </button>
        </div>
      )}
    </div>
  );
}

// ─── AI CHAT COMPONENT ───────────────────────────────────────────────────────

// ── Mistake storage (localStorage → Review tab) ──────────────────────────────

// ── Language config for AI chat ───────────────────────────────────────────────
// ── Mode opening messages per language ────────────────────────────────────────
function getModeOpening(mode, langCode, scenario, cefrLevel) {
  const langName = getAIChatLangConfig(langCode).name;
  const scenarioId = scenario?.id || scenario?.scenarioId;

  if (mode === "conversation") {
    const msgs = {
      es:"¡Hola! ¿De qué quieres hablar hoy?", fr:"Bonjour ! De quoi veux-tu parler aujourd'hui ?",
      de:"Hallo! Worüber möchtest du heute sprechen?", it:"Ciao! Di cosa vuoi parlare oggi?",
      pt:"Olá! Sobre o que você quer falar hoje?", zh:"你好！今天想聊什么？",
      ja:"こんにちは！今日は何について話しましょうか？", ko:"안녕하세요! 오늘 무엇에 대해 이야기할까요?",
      pl:"Cześć! O czym chcesz dzisiaj porozmawiać?", en:"Hello! What would you like to talk about today?"
    };
    return msgs[langCode] || msgs.en;
  }

  if (mode === "tutor") {
    // Grammar topic or custom question — serve the actual answer immediately
    if (scenarioId === "grammar-topic" || scenarioId === "custom-question") {
      const topicLabel = scenario?.title || "";
      const userQuestion = scenario?.userQuestion || topicLabel;

      // Try pre-recorded topic answer first
      if (scenarioId === "grammar-topic") {
        const prerecorded = getTopicAnswer(langCode, topicLabel);
        if (prerecorded) return prerecorded;
      }

      // Try pre-recorded common QA match
      if (scenarioId === "custom-question" && userQuestion) {
        const { answer, matched } = findPrerecordedAnswer(langCode, userQuestion);
        if (matched) return answer;
      }

      // Fallback: prompt the AI to answer immediately (no intro fluff)
      return `_(Loading your answer about "${userQuestion || topicLabel}"…)_`;
    }

    if (scenarioId) {
      const situation = SITUATIONS.find(s => s.id === scenarioId);
      const tutorName = scenario?.tutorName || "Fox";
      const situTitle = scenario?.scenarioTitle || situation?.title || scenarioId;
      const aiRole    = situation?.aiRole || scenario?.aiRole || "a local";
      const stageMap = {
        airport: "check-in and boarding",
        restaurant: "ordering and paying",
        hotel: "check-in and requests",
        doctor: "symptoms and getting help",
        pharmacy: "medicine and dosage questions",
        taxi: "destination and directions",
        cafe: "ordering and small talk",
        shopping: "finding items and trying things on",
        bank: "simple bank requests",
        directions: "asking for and understanding directions",
        emergency: "getting urgent help",
      };
      const startersByLang = {
        de: {
          restaurant:["Guten Abend. Haben Sie eine Reservierung?","Hallo, ich bin Ihr Kellner. Was möchten Sie zuerst bestellen?","Guten Abend. Ein Tisch für eine Person oder für zwei?"],
          hotel:["Guten Tag. Willkommen im Hotel. Haben Sie eine Reservierung?","Hallo. Auf welchen Namen läuft die Reservierung?","Willkommen. Soll ich Ihnen beim Check-in helfen?"],
          airport:["Guten Tag. Haben Sie Ihren Reisepass und Ihr Ticket dabei?","Der Nächste bitte. Wohin fliegen Sie heute?","Hallo. Möchten Sie heute Gepäck aufgeben?"],
          doctor:["Hallo, nehmen Sie bitte Platz. Was fehlt Ihnen heute?","Guten Tag. Welche Beschwerden haben Sie?","Seit wann fühlen Sie sich so?"],
          pharmacy:["Hallo. Was brauchen Sie heute?","Suchen Sie etwas gegen Schmerzen oder eine Erkältung?","Beschreiben Sie bitte kurz Ihre Symptome."],
          taxi:["Hallo. Wohin möchten Sie fahren?","Guten Abend. Was ist Ihr Ziel?","Steigen Sie ein. Zu welcher Adresse soll ich fahren?"],
          cafe:["Hallo. Was darf ich Ihnen bringen?","Möchten Sie einen Kaffee oder etwas zu essen?","Haben Sie sich schon entschieden?"],
          shopping:["Hallo. Kann ich Ihnen helfen?","Was suchen Sie heute?","Welche Größe brauchen Sie?"],
          bank:["Guten Tag. Womit kann ich Ihnen helfen?","Möchten Sie ein Konto eröffnen oder ein Kartenproblem lösen?","Welchen Bankservice brauchen Sie heute?"],
          directions:["Hallo. Wohin möchten Sie?","Suchen Sie einen Bahnhof oder einen bestimmten Ort?","Natürlich. Wohin müssen Sie genau?"],
          emergency:["Notruf. Was ist passiert?","Bitte schildern Sie kurz den Notfall.","Brauchen Sie Polizei, Krankenwagen oder Feuerwehr?"]
        }
      };
      const starters = startersByLang[langCode] || startersByLang.de;
      const list = starters[scenarioId] || [langCode === "de" ? "Hallo. Sind Sie bereit?" : "Hello. Are you ready?"];
      const starter = list[Math.floor(Math.random() * list.length)];
      const stageText = stageMap[scenarioId] || "a real-life conversation";

      return `Hi, I'm ${tutorName}. Welcome to your ${situTitle} tutor session.

We'll keep this focused on ${stageText}. I will play the role of ${aiRole}, and you answer naturally in ${langName}.

If anything is unclear, you can say "what", "I don't understand", or "help". I will explain in English, give you 1-2 natural replies you can use, and then guide you back into the conversation.

Let's begin.

${starter}`;
    }
    return `Hi! I am Fox, your ${langName} guide. Let's dive into a focused tutor session together. You can ask me anything about situations like checking into a hotel, meeting a new friend, getting ready for a job interview, traveling, or other things you want to practice.`;
  }
  if (mode === "exam") {
    return `Starting ${langName} Exam Mode (${cefrLevel || "B1"}). Loading your local exam bank…`;
  }

  return `Hi! Let's practice ${langName}.`;
}



function buildSystemPrompt(mode, langCode, scenarioContext, cefrLevel, scenarioId) {
  const langName = getAIChatLangConfig(langCode).name;
  const lvl = cefrLevel || "B1";

  const mistakeFormat = `When the learner makes a grammar, vocabulary, conjugation, gender, preposition or spelling mistake, append a correction block at the END of your reply using EXACTLY this format (one per mistake):
⚠️ CORRECTION: "[original]" → "[corrected]" | [brief rule explanation in English]`;

  // Grammar topic or custom question — pure teaching, no roleplay
  if (mode === "tutor" && (scenarioId === "grammar-topic" || scenarioId === "custom-question")) {
    return `You are a patient, expert ${langName} tutor in a focused grammar/topic teaching session.

CONTEXT: ${scenarioContext || `Teach the learner about a specific ${langName} topic.`}

CRITICAL — YOUR FIRST RESPONSE:
- Do NOT say "Let's talk about X" or "I'll explain..."
- IMMEDIATELY give a full, structured explanation of the topic. Start teaching right away.
- Structure: clear heading → explanation → numbered rules → ${langName} examples WITH English translations → common mistakes → a practice challenge at the end.
- Write 15-25 lines minimum for the first response. Be thorough.
- Use **bold** for key terms and important rules.
- Every ${langName} example MUST have an English translation right next to it.

TEACHING STYLE:
- Explain primarily in English — the learner is here to understand, not to guess.
- Use ${langName} only for examples and practice prompts.
- When the learner tries a sentence, give specific feedback: what's correct, what to fix, and why.
- Keep a warm, encouraging tone throughout.
- After the learner gets something right, give a slightly harder variation.

WHEN LEARNER SAYS "help", "I don't understand", "explain", or writes in English because confused:
- Switch to 80% English explanation, 20% ${langName} examples.
- Break down exactly what they're struggling with.
- Give 2-3 very simple examples building up gradually.
- NEVER keep speaking mostly in ${langName} when someone asks for help.

${mistakeFormat}`;
  }

  if (mode === "conversation") {
    return `You are an expert ${langName} language tutor running an Open Conversation session.
RULES:
- Speak ONLY in ${langName} at all times.
- Focus on natural, engaging conversation. Prioritise fluency and confidence.
- Ask follow-up questions to keep the conversation going.
- Only correct mistakes that seriously impede understanding — do not interrupt the flow constantly.
- At the end of the session (when the user says goodbye/finish), provide a brief summary in English: strengths, common mistakes, 2-3 improvement suggestions.
${mistakeFormat}`;
  }

  if (mode === "tutor") {
    return `You are LingoTrailz AI Tutor, a premium private ${langName} teacher and guided roleplay coach.
CONTEXT: ${scenarioContext || `You are helping the learner practice a real-life ${langName} conversation scenario.`}

CORE TEACHING BEHAVIOR:
- This is a focused scenario session. Do NOT ask which scenario the learner wants. It is already selected.
- Do NOT begin by dumping vocabulary lists or quick phrases. The quick mode handles that elsewhere.
- Open with a warm 1-3 sentence tutor introduction in English, then transition directly into the selected scenario.
- Act as the other person in the scenario and keep the conversation moving naturally.
- Keep most roleplay lines in ${langName}.
- Keep replies short, natural, and practical. Avoid long monologues.
- Stay inside the selected scenario unless the learner explicitly asks to switch or exit.

WHEN THE LEARNER IS CONFUSED:
- If the learner says things like "what", "I don't understand", "english please", "help", or writes in English because they are confused, IMMEDIATELY switch to English tutor mode.
- Respond 80% in English — explain what the last ${langName} phrase meant, why it was said, and what they should reply.
- Give 1-2 simple ${langName} reply options with English translations right next to them.
- Keep the explanation short and clear — don't lecture, just help them get unstuck.
- Then return gently to the scenario: "Ready to try? Here's the line again: [repeat line]"
- NEVER continue mostly in ${langName} when someone has asked for help.

CORRECTION STYLE:
- Correct naturally and supportively.
- Prefer brief in-flow corrections over harsh interruption.
- If the learner makes a meaningful mistake, praise the attempt, show the better sentence, explain briefly in English, and invite another try.
- Keep explanations short and practical.

QUALITY BAR:
- Prefer natural, polite, high-frequency phrasing over textbook phrasing.
- Adapt difficulty to the learner's responses.
- Ask follow-up questions that keep the scenario alive.
- Sound like a calm private tutor, not a generic assistant.
- Never overwhelm the learner with long grammar lectures.

${mistakeFormat}`;
  }

  if (mode === "exam") {
    return `You are administering a structured ${langName} CEFR proficiency exam at level ${lvl}.

EXAM PROTOCOL — follow EXACTLY:
1. The learner answered whether they can type special characters. Adapt: YES = typed responses OK; NO = prefer multiple choice.
2. Ask exactly 20 questions, ONE at a time. Always prefix with "Question X/20".
3. CRITICAL LANGUAGE RULE: Write ALL question instructions in ENGLISH so the learner understands them. Only the ${langName} content itself (words/sentences to translate, passages to read, things to write) should be in ${langName}. Use patterns like:
   - "What does [${langName} word] mean in English?"
   - "Which of these is the correct ${langName} word for '[English word]'?"
   - "Translate into ${langName}: '[English sentence]'"
   - "Read this ${langName} passage, then answer: [English question]"
   - "Write 2-3 sentences in ${langName} about: [English topic]"
4. Question distribution:
   - Q1-4: Vocabulary (What does X mean? / Which ${langName} word means Y?)
   - Q5-8: Grammar (Which sentence is correct? / Fill in the blank with the right form)
   - Q9-11: Reading comprehension (short ${langName} passage + English comprehension questions)
   - Q12-14: Translation (Translate this English sentence into ${langName})
   - Q15-17: Writing prompt in ${langName} on an English-described topic
   - Q18-20: Open response in ${langName} on an English-described prompt
5. Multiple choice: put EACH option on its OWN LINE:
A) option
B) option
C) option
D) option
6. After every answer: mark with ✅ Correct, ⚠️ Partially correct, or ❌ Incorrect + brief English explanation.
7. After Q20 output this exact report:

📊 EXAM REPORT
━━━━━━━━━━━━━━
Total Score: X/20
Vocabulary: X/4 | Grammar: X/4 | Comprehension: X/3 | Writing: X/6 | Fluency: X/3
Verdict: [Ready / Nearly Ready / Needs More Practice] for ${lvl}
Top areas to improve: [2-3 specific points in English]
[One encouraging sentence in ${langName}]

${mistakeFormat}`;
  }

  return `You are a helpful ${langName} language assistant. Speak in ${langName}.`;
}

// ── Parse correction blocks from AI reply ────────────────────────────────────

// ── Inline markdown renderer (bold / italic) ──────────────────────────────────
function parseInlineMarkdown(text) {
  const segments = [];
  const regex = /(\*\*[^*\n]+\*\*|_[^_\n]+_)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type:"text", content: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith("**")) {
      segments.push({ type:"bold", content: raw.slice(2, -2) });
    } else {
      segments.push({ type:"italic", content: raw.slice(1, -1) });
    }
    lastIndex = match.index + raw.length;
  }
  if (lastIndex < text.length) {
    segments.push({ type:"text", content: text.slice(lastIndex) });
  }
  return segments.map((seg, i) => {
    if (seg.type === "bold")   return <strong key={i} style={{ fontWeight:700 }}>{seg.content}</strong>;
    if (seg.type === "italic") return <em key={i}>{seg.content}</em>;
    return <span key={i}>{seg.content}</span>;
  });
}

// ── Main AIChat component ─────────────────────────────────────────────────────


// AI Conversation Scenarios
function AIChat({ scenario, onClose, langCode = "es", userId, onGoReview, onBack, isPro = false }) {
  const mode    = scenario.mode || "tutor";
  const cfg     = getAIChatLangConfig(langCode);
  const modeColors  = { conversation:"#22c55e", tutor:"var(--gold)", exam:"#8b5cf6" };
  const modeLabels  = { conversation:"Open Conversation", tutor:"Tutor Mode", exam:"Exam Mode" };

  const [cefrLevel, setCefrLevel]     = useState("B1");
  const [examReady, setExamReady]     = useState(mode !== "exam");
  const [messages,  setMessages]      = useState([]);
  const [input,     setInput]         = useState("");
  const [loading,   setLoading]       = useState(false);
  const [tipVisible,setTipVisible]    = useState(true);
  const [showTrans, setShowTrans]     = useState(false);
  const [xpToast,   setXpToast]       = useState(null);
  const bottomRef = useRef(null);
  const didSpeakOpeningRef = useRef(false);
  const lastSpokenAssistantRef = useRef("");
  const [localExamBank, setLocalExamBank] = useState(null);
  const [localExamIndex, setLocalExamIndex] = useState(0);
  const [localExamScore, setLocalExamScore] = useState(0);
  const [localExamFinished, setLocalExamFinished] = useState(false);
  const [examWrongQuestions, setExamWrongQuestions] = useState([]);
  const [aiLimitNotice, setAiLimitNotice] = useState("");
  const modeKey = `${mode}_${scenario?.id || scenario?.scenarioId || "general"}`;

    // Init messages whenever the active AI scenario / language / exam state changes
  useEffect(() => {
    if (!examReady) return;

    if (mode !== "exam") {
      const gate = canUseAISession(userId, modeKey);
      if (!gate.allowed) {
        const msgLimit = gate.isPro ? 15 : 10;
        const limitMsg = gate.reason === "daily_ai_limit"
          ? (gate.isPro
            ? `Pro plan: you've used all 5 AI sessions for today. Come back tomorrow!`
            : `Free plan limit reached: you've used your 1 AI session for today. Upgrade to Pro for 5 sessions/day, or come back tomorrow.`)
          : (gate.isPro
            ? `You've used all ${msgLimit} messages in this session. Start a new session or come back tomorrow.`
            : `Free plan limit reached: you've used all ${msgLimit} AI messages for today. Upgrade to Pro for more, or come back tomorrow.`);
        setAiLimitNotice(limitMsg);
        setMessages([{ role:"assistant", content: limitMsg, translation:null }]);
        return;
      }
      if (!gate.sessionStarted) {
        startAISession(userId, modeKey);
        incrementDailyAI(userId);
      }
    }

    if (mode === "exam") {
      didSpeakOpeningRef.current = false;
      lastSpokenAssistantRef.current = "";
      setLoading(true);
      setLocalExamBank(null);
      setLocalExamIndex(0);
      setLocalExamScore(0);
      setLocalExamFinished(false);

      loadLocalExamBank(langCode, cefrLevel)
        .then((bank) => {
          const first = bank?.questions?.[0];
          setLocalExamBank(bank);
          if (!first) {
            setMessages([{ role: "assistant", content: "I couldn't load the exam questions for this level.", translation: null }]);
            return;
          }
          const opening = formatLocalExamQuestion(first, bank?.question_count || 20, 1);
          setMessages([{ role: "assistant", content: opening, translation: null,
            listenAudio: first.exercise_type === "listen" ? first.audio : null }]);
          // Play static pre-recorded question audio; fall back to live TTS
          playExamQuestionAudio(first, cefrLevel, langCode, 1, bank?.question_count || 25);
        })
        .catch(() => {
          setMessages([{ role: "assistant", content: "I couldn't load the local exam bank right now.", translation: null }]);
        })
        .finally(() => setLoading(false));

      return;
    }

    const opening = getModeOpening(mode, langCode, scenario, cefrLevel);
    didSpeakOpeningRef.current = false;
    lastSpokenAssistantRef.current = "";
    setMessages([{ role:"assistant", content: opening, translation: null }]);

    // If no prerecorded answer available, auto-fetch from AI immediately
    if (opening.startsWith("_(Loading")) {
      const topicLabel = scenario?.title || "";
      const userQuestion = scenario?.userQuestion || topicLabel;
      const cfg2 = getAIChatLangConfig(langCode);
      const scenarioCtx = scenario.systemPrompt
        ? scenario.systemPrompt.replace(/the target language/g, cfg2.name)
        : null;
      const sId = scenario?.id || scenario?.scenarioId;
      const sysPrompt = buildSystemPrompt(mode, langCode, scenarioCtx, cefrLevel, sId);

      // Fire auto first-message
      setLoading(true);
      fetch("/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          system: sysPrompt,
          messages: [{ role:"user", content: `Please explain: "${userQuestion}"` }]
        })
      }).then(r => r.json()).then(data => {
        const reply = data.reply || cfg2.fallback;
        setMessages([{ role:"assistant", content: reply, translation: null }]);
        playWordAudio(normalizeTextForSpeech(reply, langCode), langCode, { voiceId: getTutorVoiceId(langCode) });
      }).catch(() => {
        setMessages([{ role:"assistant", content: `I couldn't load the answer right now. Please type your question and I'll help you!`, translation: null }]);
      }).finally(() => setLoading(false));
    }
  }, [examReady, scenario.id, langCode, mode, cefrLevel, scenario.icon]);

  // Cancel speech when component unmounts or user leaves the page / tab
  useEffect(() => {
    const stop = () => stopAllAudio();
    window.addEventListener("blur", stop);
    window.addEventListener("pagehide", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      window.removeEventListener("blur", stop);
      window.removeEventListener("pagehide", stop);
      document.removeEventListener("visibilitychange", stop);
      stopAllAudio();
    };
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  // Auto-read only the initial assistant opening; later replies are spoken immediately in send()
  useEffect(() => {
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    if (last.role !== "assistant") return;
    if (messages.length !== 1) return;
    if (didSpeakOpeningRef.current) return;

    didSpeakOpeningRef.current = true;

    // For situation sessions, try to play the pre-recorded fox intro first
    const situationId = scenario?.id || scenario?.scenarioId || null;
    if (situationId && mode !== "exam" && mode !== "conversation") {
      const introUrl = `/audio/intros/${situationId}.mp3`;
      fetch(introUrl, { method: "HEAD" })
        .then(r => {
          if (r.ok) {
            stopAllAudio();
            const audio = new Audio(introUrl);
            audio.preload = "auto";
            audio.play().catch(() => {
              // fallback to TTS if playback fails
              const clean = normalizeTextForSpeech(last.content, langCode);
              if (clean) playWordAudio(clean, langCode, { voiceId: getTutorVoiceId(langCode) });
            });
          } else {
            const clean = normalizeTextForSpeech(last.content, langCode);
            if (clean) playWordAudio(clean, langCode, { voiceId: getTutorVoiceId(langCode) });
          }
        })
        .catch(() => {
          const clean = normalizeTextForSpeech(last.content, langCode);
          if (clean) playWordAudio(clean, langCode, { voiceId: getTutorVoiceId(langCode) });
        });
      return;
    }

    const clean = normalizeTextForSpeech(last.content, langCode);
    if (!clean) return;
    playWordAudio(clean, langCode, { voiceId: getTutorVoiceId(langCode) });
  }, [messages, langCode]);

  useEffect(() => {
    if (!showTrans) return;
    messages.forEach((msg, i) => {
      if (msg.role === "assistant" && !msg.translation) fetchTranslation(msg.content, i);
    });
  }, [showTrans]); // eslint-disable-line

  async function fetchTranslation(text, idx) {
    try {
      const res = await fetch("/api/chat", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ system:"Translate the following to English. Reply with ONLY the translation.", messages:[{ role:"user", content:text }] })
      });
      const data = await res.json();
      if (data.reply) setMessages(m => m.map((msg, i) => i === idx ? { ...msg, translation:data.reply } : msg));
    } catch {}
  }

  function showXPToast(amount, reason) {
    setXpToast({ amount, reason });
    setTimeout(() => setXpToast(null), 2500);
  }

  async function send(overrideText) {
    const userText = (overrideText || input).trim();
    if (!userText || loading) return;
    setInput("");
    setLoading(true);
    if (mode !== "exam") {
      const gate = canUseAISession(userId, modeKey);
      if (!gate.allowed || gate.remainingMessages <= 0) {
        const msgLimit = gate.isPro ? 15 : 10;
        const limitMsg = gate.isPro
          ? `You've used all ${msgLimit} messages in this Pro session. Start a new session or come back tomorrow.`
          : `You've reached today's free message limit (${msgLimit} messages). Come back tomorrow, or upgrade to Pro for more AI conversations.`;
        setAiLimitNotice(limitMsg);
        setMessages(m => [...m, { role:"assistant", content: limitMsg, translation:null }]);
        setLoading(false);
        return;
      }
      incrementAISessionMessage(userId, modeKey);
      const remaining = gate.remainingMessages - 1;
      if (remaining <= 3 && remaining > 0) {
        const upgradeHint = gate.isPro ? "" : " Upgrade to Pro for more AI.";
        setAiLimitNotice(`⚠️ Only ${remaining} message${remaining === 1 ? "" : "s"} left in this session.${upgradeHint}`);
      } else {
        setAiLimitNotice("");
      }
    }
    const userMsg = { role:"user", content:userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    if (mode === "exam" && localExamBank && !localExamFinished) {
      const currentQuestion = localExamBank.questions?.[localExamIndex];
      if (!currentQuestion) {
        setLoading(false);
        return;
      }

      const choice = extractOptionChoice(userText, currentQuestion.options || []);
      const isCorrect =
        choice.index >= 0 &&
        (choice.index === currentQuestion.correct_index ||
          (currentQuestion.options?.[choice.index] === currentQuestion.correct_answer));

      if (!isCorrect) {
        pushMistake(userId, langCode, choice.normalized || userText,
          currentQuestion.correct_answer, "Exam multiple-choice correction", "Exam Mode");
        setExamWrongQuestions(prev => [...prev, currentQuestion]);
      }

      const nextScore = localExamScore + (isCorrect ? 1 : 0);
      setLocalExamScore(nextScore);

      const feedbackText = isCorrect
        ? `✅ Correct`
        : `❌ Incorrect — the right answer is: ${currentQuestion.correct_answer}`;

      const isLast = localExamIndex >= ((localExamBank.questions?.length || 1) - 1);

      // Show feedback message immediately
      setMessages(m => [...m, { role:"assistant", content: feedbackText, translation:null }]);

      // Sequence: feedback audio → show next question → play question audio
      // All in an async IIFE so audio never plays before the message is visible
      const wrongSoFar = isCorrect ? examWrongQuestions : [...examWrongQuestions, currentQuestion];

      if (isLast) {
        setLocalExamFinished(true);
        (async () => {
          await playExamFeedbackAudio(isCorrect, currentQuestion, langCode);
          const report = buildLocalExamReport(localExamBank, nextScore, wrongSoFar);
          setMessages(m => [...m, { role:"assistant", content: report, translation:null }]);
        })();
      } else {
        const nextQuestionIndex = localExamIndex + 1;
        const nextQuestion = localExamBank.questions[nextQuestionIndex];
        setLocalExamIndex(nextQuestionIndex);

        (async () => {
          // 1. Play feedback audio (awaited — finishes before anything else)
          await playExamFeedbackAudio(isCorrect, currentQuestion, langCode);

          // 2. Show next question message
          setMessages(m => [...m, {
            role: "assistant",
            content: formatLocalExamQuestion(nextQuestion, localExamBank?.question_count || 20),
            translation: null,
            listenAudio: nextQuestion.exercise_type === "listen" ? nextQuestion.audio : null,
          }]);

          // 3. Brief pause so message renders, then play question audio
          await new Promise(r => setTimeout(r, 400));
          await playExamQuestionAudio(nextQuestion, cefrLevel, langCode,
            nextQuestionIndex + 1, localExamBank?.question_count || 25);
        })();
      }

      setLoading(false);
      return;
    }

    const cfg2 = getAIChatLangConfig(langCode);
    const scenarioCtx = scenario.systemPrompt
      ? scenario.systemPrompt.replace(/the target language/g, cfg2.name)
      : null;
    const systemPrompt = buildSystemPrompt(mode, langCode, scenarioCtx, cefrLevel, scenario?.id || scenario?.scenarioId);
    const apiMessages  = updatedMessages
      .filter((m,i) => !(i === 0 && m.role === "assistant")) // skip opening (in system)
      .map(m => ({ role:m.role, content:m.content }));

    if (mode !== "exam" && /^help$/i.test(userText.trim())) {
      // Replace the "help" user message with a proper English explanation request
      const helpInstruction = `[Respond entirely in English for this message] The learner typed "help". Please: 1) Briefly explain in plain English what you said in your last message. 2) Give 1-2 natural ${cfg.name} replies they could use, numbered as options. 3) Then invite them to try responding.`;
      const helpApiMessages = apiMessages.map((m, i) =>
        (i === apiMessages.length - 1 && m.role === "user")
          ? { ...m, content: helpInstruction }
          : m
      );
      try {
        const res = await fetch("/api/chat", {
          method:"POST", headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({
            system: systemPrompt + `\n\nYou started the conversation with: "${updatedMessages[0]?.content}"`,
            messages: helpApiMessages
          })
        });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || `API error ${res.status}`);
        const reply = data.reply || cfg.fallback;
        setMessages(m => [...m, { role:"assistant", content: reply, translation:null }]);
        playWordAudio(normalizeTextForSpeech(reply, "en"), "en", { voiceId: getTutorVoiceId("en") });
      } catch {
        setMessages(m => [...m, { role:"assistant", content: cfg.fallback, translation:null }]);
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          system: systemPrompt + `\n\nYou started the conversation with: "${updatedMessages[0]?.content}"`,
          messages: apiMessages
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        console.error("[AI tutor] /api/chat error:", data?.error || `HTTP ${res.status}`);
        throw new Error(data?.error || `API error ${res.status}`);
      }
      const reply = data.reply || cfg.fallback;

      // Save mistakes to Review
      const mistakeSource = mode === "exam" ? "Exam Mode" : mode === "conversation" ? "Open Conversation" : mode === "tutor" ? ("Tutor: " + (scenario.scenarioTitle || scenario.title || scenario.id || "Session")) : "AI Tutor";
      parseMistakes(reply).forEach(({ original, corrected, explanation }) => {
        pushMistake(userId, langCode, original, corrected, explanation, mistakeSource);
      });

      // Award XP based on mode
      const xpAmount = mode === "exam" ? 0 : mode === "tutor" ? 3 : 2; // per message; bulk on close
      if (xpAmount) awardChallengeXP(userId, xpAmount);

      const spokenReply = normalizeTextForSpeech(reply, langCode);
      lastSpokenAssistantRef.current = spokenReply;
      playWordAudio(spokenReply, langCode, { voiceId: getTutorVoiceId(langCode) });

      const newMsg = { role:"assistant", content:reply, translation:null };
      setMessages(m => {
        const next = [...m, newMsg];
        if (showTrans) setTimeout(() => fetchTranslation(reply, next.length-1), 300);
        return next;
      });
    } catch(err) {
      console.error("[AIChat]", err);
      setMessages(m => [...m, { role:"assistant", content:cfg.fallback, translation:null }]);
    }
    setLoading(false);
  }

  function handleClose() {
    // STOP ALL AUDIO IMMEDIATELY — kills in-flight fetch + playing audio
    stopAllAudio();
    // Award session XP on exit
    const turns = messages.filter(m => m.role === "user").length;
    if (turns > 0) {
      const sessionXP = mode === "exam" ? 80 : mode === "tutor" ? 45 : 30;
      awardChallengeXP(userId, sessionXP);
      showXPToast(sessionXP, mode === "exam" ? "Exam session" : mode === "tutor" ? "Tutor session" : "Conversation");
    }
    setTimeout(() => { onClose?.(); }, xpToast ? 1800 : 0);
  }

  // ── Exam level picker — trail-themed with animals ─────────────────────────
  if (mode === "exam" && !examReady) {
    // Fixed warm daytime theme for exam picker
    const eT = { bg:"linear-gradient(180deg,#fff7ea,#ffe7c2)", panel:"rgba(255,255,255,0.78)", text:"#4a2800", muted:"rgba(74,40,0,0.52)", border:"rgba(245,165,36,0.28)", path:"#f5a524", card:"rgba(255,255,255,0.6)", isDark:false };

    const LEVEL_ANIMALS = [
      { lvl:"A1", label:"Beginner",     animal:"🐇", animalName:"Mira",  color:"#e8b4b8", desc:"First steps on the trail" },
      { lvl:"A2", label:"Elementary",   animal:"🐿️", animalName:"Pip",   color:"#c47c3a", desc:"Finding your footing" },
      { lvl:"B1", label:"Intermediate", animal:"🦉", animalName:"Sage",  color:"#7a5c2e", desc:"Climbing higher" },
      { lvl:"B2", label:"Upper-Int.",   animal:"🐺", animalName:"Grey",  color:"#666688", desc:"The mountain calls" },
      { lvl:"C1", label:"Advanced",     animal:"🦁", animalName:"Rex",   color:"#c49a28", desc:"Near the summit" },
      { lvl:"C2", label:"Mastery",      animal:"🦊", animalName:"Fox",   color:"#e8730a", desc:"The trail is yours" },
    ];
    const selected = LEVEL_ANIMALS.find(l => l.lvl === cefrLevel) || LEVEL_ANIMALS[2];

    return (
      <div style={{ position:"fixed", inset:0, overflowY:"auto", background:eT.bg, fontFamily:"var(--font-body)", color:eT.text }}>
        <style>{GLOBAL_CSS}</style>
        <div style={{ padding:"13px 18px", borderBottom:`1px solid ${eT.border}`,
          background:eT.panel, backdropFilter:"blur(16px)",
          display:"flex", alignItems:"center", gap:12 }}>
          <button style={{ background:"none", border:"none", color:eT.muted, cursor:"pointer", fontSize:22 }}
            onClick={() => { stopAllAudio(); onClose?.(); }}>←</button>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, color:eT.text }}>📝 Exam Mode</div>
            <div style={{ fontSize:11, color:eT.muted }}>Choose your CEFR level</div>
          </div>
        </div>

        <div style={{ padding:"24px 20px 40px", maxWidth:440, margin:"0 auto" }}>
          <p style={{ color:eT.muted, textAlign:"center", marginBottom:20, fontSize:13, lineHeight:1.65 }}>
            Pick your level for the <strong style={{color:eT.text}}>{cfg.name}</strong> exam.{" "}
            Questions are in <strong style={{color:eT.path}}>English</strong> — your answers in {cfg.name}.
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:9, marginBottom:20 }}>
            {LEVEL_ANIMALS.map(({ lvl, label, animal, color }) => {
              const active = cefrLevel === lvl;
              return (
                <div key={lvl} onClick={() => setCefrLevel(lvl)}
                  style={{
                    padding:"16px 8px 14px", textAlign:"center", cursor:"pointer", borderRadius:18,
                    background: active ? (eT.isDark ? `${color}22` : `${color}18`) : eT.card,
                    border:`${active?"2px":"1px"} solid ${active ? color+"88" : eT.border}`,
                    boxShadow: active ? `0 4px 20px ${color}28` : "none",
                    transition:"all 0.18s ease",
                    transform: active ? "translateY(-2px)" : "none",
                  }}>
                  <div style={{ fontSize:26, marginBottom:4,
                    filter: active ? `drop-shadow(0 3px 8px ${color}66)` : "none" }}>{animal}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:19,
                    color: active ? color : eT.text, marginBottom:1 }}>{lvl}</div>
                  <div style={{ fontSize:9, color: active ? color : eT.muted, fontWeight:700 }}>{label}</div>
                </div>
              );
            })}
          </div>

          <div style={{
            borderRadius:16, padding:"14px 16px", marginBottom:18,
            background: eT.isDark ? `${selected.color}14` : `${selected.color}10`,
            border:`1px solid ${selected.color}35`,
            display:"flex", alignItems:"center", gap:14,
          }}>
            <div style={{ fontSize:42, flexShrink:0, filter:`drop-shadow(0 4px 10px ${selected.color}55)` }}>
              {selected.animal}
            </div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13,
                color:selected.color, marginBottom:3 }}>
                {selected.animalName} · {selected.lvl} {selected.label}
              </div>
              <div style={{ fontSize:11, color:eT.muted, lineHeight:1.55 }}>
                {selected.desc} · vocab · grammar · comprehension · writing
              </div>
              <div style={{ fontSize:10, color:eT.muted, marginTop:3, opacity:0.65 }}>
                Mistakes saved to Review flashcards automatically.
              </div>
            </div>
          </div>

          <button
            style={{
              width:"100%", padding:"15px", borderRadius:16, border:"none",
              background:`linear-gradient(135deg,${eT.path},${eT.path}bb)`,
              color: eT.isDark ? "#120d00" : "#fff",
              fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, cursor:"pointer",
              boxShadow:`0 4px 20px ${eT.path}40`,
            }}
            onClick={() => setExamReady(true)}>
            Start {cefrLevel} Exam →
          </button>
        </div>
      </div>
    );
  }

  // ── Main chat UI ──────────────────────────────────────────────────────────
  // Use animal theme if provided, otherwise fall back to trail time-of-day theme
  const tutorAnimalKey = scenario?.animalKey || (scenario?.icon && ["🦊","🐇","🦉","🐺","🦁","🦅"].includes(scenario.icon) ? scenario.icon : "🦊");
  const tutorAnimalName = scenario?.animalName || scenario?.tutorName || "Fox";
  const tutorAnimalColor = scenario?.animalColor || null;
  const tutorAnimalBg = scenario?.animalBg || null;

  // Animal SVG inline definitions for the chat sidebar
  const CHAT_ANIMAL_SVGS = {
    "🦊": (<svg viewBox="0 0 120 130" width="100%" height="100%"><ellipse cx="92" cy="100" rx="24" ry="36" fill="#e8730a" transform="rotate(15,92,100)"/><ellipse cx="92" cy="100" rx="14" ry="24" fill="#f0a050" transform="rotate(15,92,100)"/><ellipse cx="97" cy="118" rx="10" ry="12" fill="#f5f5f0" transform="rotate(15,97,118)"/><ellipse cx="54" cy="100" rx="28" ry="26" fill="#e8730a"/><ellipse cx="54" cy="65" rx="26" ry="26" fill="#e8730a"/><path d="M36 45 L28 22 L52 40 Z" fill="#e8730a"/><path d="M72 45 L80 22 L58 40 Z" fill="#e8730a"/><path d="M38 43 L32 26 L50 40 Z" fill="#c84a08"/><path d="M70 43 L76 26 L60 40 Z" fill="#c84a08"/><ellipse cx="54" cy="74" rx="18" ry="14" fill="#f5f0e8"/><ellipse cx="42" cy="62" rx="7" ry="6" fill="#d4a820"/><circle cx="42" cy="62" r="4" fill="#1a1a00"/><circle cx="44" cy="60" r="1.5" fill="white"/><ellipse cx="66" cy="62" rx="7" ry="6" fill="#d4a820"/><circle cx="66" cy="62" r="4" fill="#1a1a00"/><circle cx="68" cy="60" r="1.5" fill="white"/><ellipse cx="54" cy="72" rx="4" ry="3" fill="#2a1800"/><ellipse cx="35" cy="120" rx="12" ry="8" fill="#e8730a"/><ellipse cx="73" cy="120" rx="12" ry="8" fill="#e8730a"/></svg>),
    "🐇": (<svg viewBox="0 0 120 140" width="100%" height="100%"><ellipse cx="38" cy="28" rx="12" ry="32" fill="#f0f0f0" stroke="#ccc" strokeWidth="1.5"/><ellipse cx="82" cy="28" rx="12" ry="32" fill="#f0f0f0" stroke="#ccc" strokeWidth="1.5"/><ellipse cx="38" cy="28" rx="7" ry="24" fill="#ffb3c6"/><ellipse cx="82" cy="28" rx="7" ry="24" fill="#ffb3c6"/><ellipse cx="60" cy="105" rx="36" ry="32" fill="#f5f5f5" stroke="#ddd" strokeWidth="1.5"/><circle cx="60" cy="68" r="30" fill="#f5f5f5" stroke="#ddd" strokeWidth="1.5"/><circle cx="47" cy="63" r="8" fill="#1a1a1a"/><circle cx="49" cy="61" r="2.5" fill="white"/><circle cx="73" cy="63" r="8" fill="#1a1a1a"/><circle cx="75" cy="61" r="2.5" fill="white"/><ellipse cx="40" cy="72" rx="8" ry="5" fill="#ffb3c6" opacity="0.5"/><ellipse cx="80" cy="72" rx="8" ry="5" fill="#ffb3c6" opacity="0.5"/><ellipse cx="60" cy="74" rx="4" ry="3" fill="#ffb3c6"/><ellipse cx="38" cy="130" rx="14" ry="10" fill="#f0f0f0" stroke="#ddd" strokeWidth="1.5"/><ellipse cx="82" cy="130" rx="14" ry="10" fill="#f0f0f0" stroke="#ddd" strokeWidth="1.5"/></svg>),
    "🦉": (<svg viewBox="0 0 120 130" width="100%" height="100%"><ellipse cx="60" cy="95" rx="34" ry="32" fill="#7a5c2e"/><ellipse cx="32" cy="95" rx="16" ry="24" fill="#6a4c1e" transform="rotate(-10,32,95)"/><ellipse cx="88" cy="95" rx="16" ry="24" fill="#6a4c1e" transform="rotate(10,88,95)"/><circle cx="60" cy="54" r="32" fill="#8b6c3a"/><path d="M42 30 L38 18 L48 26 Z" fill="#7a5c2e"/><path d="M78 30 L82 18 L72 26 Z" fill="#7a5c2e"/><ellipse cx="60" cy="58" rx="24" ry="22" fill="#d4b474" opacity="0.4"/><circle cx="46" cy="52" r="12" fill="#e8d080"/><circle cx="46" cy="52" r="8" fill="#2a1800"/><circle cx="49" cy="49" r="3" fill="white"/><circle cx="74" cy="52" r="12" fill="#e8d080"/><circle cx="74" cy="52" r="8" fill="#2a1800"/><circle cx="77" cy="49" r="3" fill="white"/><path d="M56 66 L64 66 L60 74 Z" fill="#c4841a"/></svg>),
    "🐺": (<svg viewBox="0 0 120 130" width="100%" height="100%"><path d="M36 36 L26 14 L50 30 Z" fill="#6a6a80"/><path d="M84 36 L94 14 L70 30 Z" fill="#6a6a80"/><path d="M38 34 L30 18 L48 30 Z" fill="#d4d0e8"/><path d="M82 34 L90 18 L72 30 Z" fill="#d4d0e8"/><ellipse cx="60" cy="100" rx="34" ry="26" fill="#8a8a9a"/><ellipse cx="60" cy="62" rx="30" ry="28" fill="#8a8a9a"/><ellipse cx="60" cy="76" rx="18" ry="12" fill="#c4c0d8"/><ellipse cx="46" cy="58" rx="8" ry="7" fill="#d4a820"/><circle cx="46" cy="58" r="5" fill="#2a1a00"/><circle cx="48" cy="56" r="2" fill="white"/><ellipse cx="74" cy="58" rx="8" ry="7" fill="#d4a820"/><circle cx="74" cy="58" r="5" fill="#2a1a00"/><circle cx="76" cy="56" r="2" fill="white"/><ellipse cx="60" cy="73" rx="5" ry="3.5" fill="#2a2a3a"/></svg>),
    "🦁": (<svg viewBox="0 0 130 130" width="100%" height="100%"><circle cx="65" cy="65" r="48" fill="#c4841a" opacity="0.8"/><circle cx="65" cy="65" r="42" fill="#d49a2a"/><circle cx="65" cy="65" r="34" fill="#e8b84a"/><ellipse cx="65" cy="78" rx="18" ry="13" fill="#d4a040"/><circle cx="50" cy="60" r="9" fill="#8b6010"/><circle cx="50" cy="60" r="6" fill="#2a1800"/><circle cx="52" cy="58" r="2.5" fill="white"/><circle cx="80" cy="60" r="9" fill="#8b6010"/><circle cx="80" cy="60" r="6" fill="#2a1800"/><circle cx="82" cy="58" r="2.5" fill="white"/><path d="M60 76 L70 76 L65 80 Z" fill="#8b4010"/></svg>),
    "🦅": (<svg viewBox="0 0 120 110" width="100%" height="100%"><path d="M60 60 Q30 40 8 50 Q20 55 30 65 Q45 60 60 60 Z" fill="#5a4010"/><path d="M60 60 Q90 40 112 50 Q100 55 90 65 Q75 60 60 60 Z" fill="#5a4010"/><ellipse cx="60" cy="72" rx="20" ry="24" fill="#5a4010"/><ellipse cx="60" cy="44" rx="18" ry="20" fill="#f0ede0"/><circle cx="52" cy="40" r="5" fill="#d4a820"/><circle cx="52" cy="40" r="3" fill="#1a1a00"/><circle cx="53" cy="39" r="1.5" fill="white"/><circle cx="68" cy="40" r="5" fill="#d4a820"/><circle cx="68" cy="40" r="3" fill="#1a1a00"/><circle cx="69" cy="39" r="1.5" fill="white"/><path d="M53 50 L67 50 L60 60 Z" fill="#d4a820"/></svg>),
  };

  // Build theme from animal or time-of-day
  const buildAnimalChatTheme = (animalBg, animalColor) => {
    const isDark = animalBg && (animalBg.includes("#1") || animalBg.includes("#2") || animalBg.includes("#0"));
    const textColor = isDark ? "#fff8f0" : "#3a2000";
    const mutedColor = isDark ? "rgba(255,240,220,0.55)" : "rgba(58,32,0,0.55)";
    return {
      bg: animalBg,
      panel: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.82)",
      text: textColor,
      muted: mutedColor,
      border: `${animalColor}40`,
      path: animalColor,
      bubbleAI: isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.92)",
      bubbleUser: `linear-gradient(135deg,${animalColor},${animalColor}cc)`,
      userText: "#fff",
      isDark,
    };
  };

  // Fixed warm daytime theme for chat — consistent regardless of time
  const timeTheme = {bg:"linear-gradient(180deg,#fff7ea,#ffe7c2)",panel:"rgba(255,255,255,0.82)",text:"#6b3d10",muted:"rgba(107,61,16,0.55)",border:"rgba(245,165,36,0.28)",path:"#f5a524",bubbleAI:"rgba(255,255,255,0.92)",bubbleUser:"linear-gradient(135deg,#f5a524,#e8730a)",userText:"#fff",isDark:false};

  const chatTheme = (tutorAnimalBg && tutorAnimalColor)
    ? buildAnimalChatTheme(tutorAnimalBg, tutorAnimalColor)
    : timeTheme;

  return (
    <div style={{ position:"fixed", inset:0, display:"flex", flexDirection:"column", background:chatTheme.bg, fontFamily:"var(--font-body)", color:chatTheme.text, zIndex:500, overflowY:"auto" }}>
      <style>{GLOBAL_CSS + `
        @keyframes chatFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes animalBob{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-5px) rotate(1deg)}}
        @keyframes tipSlide{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        body,html{background:${chatTheme.bg} !important;}
        :root{--chat-ai-bg:${chatTheme.bubbleAI};--chat-user-bg:${chatTheme.bubbleUser};--chat-text:${chatTheme.text};--chat-border:${chatTheme.border};--chat-user-text:${chatTheme.userText || "#fff"};}
      `}</style>

      {/* XP toast */}
      {xpToast && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", zIndex:9999,
          background:"var(--gold)", color:"#000", borderRadius:20, padding:"10px 20px",
          fontFamily:"var(--font-display)", fontWeight:800, fontSize:16, boxShadow:"0 4px 20px rgba(245,200,66,0.4)",
          animation:"fadeIn 0.3s" }}>
          +{xpToast.amount} XP — {xpToast.reason}!
        </div>
      )}

      {/* Trail-themed header */}
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${chatTheme.border}`, background:chatTheme.panel,
        backdropFilter:"blur(12px)", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <button style={{ background:"none", border:"none", color:chatTheme.muted, cursor:"pointer", fontSize:22, padding:"2px 6px", borderRadius:8, flexShrink:0 }}
          onClick={handleClose}>←</button>
        {/* Header avatar — CEFR emoji for exam, fox card for chat/tutor */}
        <div style={{ flexShrink:0, width:52, overflow:"visible" }}>
          {mode === "exam" ? (
            <div style={{ width:52, height:52, borderRadius:14, background:"rgba(249,115,22,0.12)",
              border:"1px solid rgba(249,115,22,0.25)", display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:28 }}>
              {{"A1":"🐇","A2":"🐿️","B1":"🦉","B2":"🐺","C1":"🦁","C2":"🦊"}[cefrLevel] || "🦊"}
            </div>
          ) : (
            <FoxTutorCard size={52} compact style={{ borderRadius:14, width:52 }} />
          )}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", color:chatTheme.text }}>
            {scenario.title || modeLabels[mode]}
          </div>
          <div style={{ fontSize:11, color:chatTheme.muted }}>
            <span style={{ color:chatTheme.path, fontWeight:700 }}>{tutorAnimalName}</span>
            {" · "}{cfg.name}
          </div>
        </div>
        <button onClick={() => setShowTrans(t => !t)}
          style={{ background: showTrans ? `${chatTheme.path}22` : "rgba(255,255,255,0.08)",
            border:`1px solid ${showTrans ? chatTheme.path+"55" : chatTheme.border}`,
            borderRadius:20, padding:"5px 10px", fontSize:11, fontWeight:700,
            color: showTrans ? chatTheme.path : chatTheme.muted, cursor:"pointer", whiteSpace:"nowrap" }}>
          🌐 {showTrans?"ON":"OFF"}
        </button>
      </div>

      {/* Tip banner — trail themed */}
      {aiLimitNotice && (<div style={{ margin:"10px 14px 0", padding:"9px 13px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:10, fontSize:12, color:"#b91c1c" }}>{aiLimitNotice}</div>)}
      {tipVisible && (
        <div style={{ margin:"10px 14px 0", padding:"9px 13px", background:`${chatTheme.path}14`,
          border:`1px solid ${chatTheme.path}30`, borderRadius:10, fontSize:12, color:chatTheme.path,
          display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, animation:"tipSlide 0.3s ease both" }}>
          <span>{tutorAnimalName} · Speak in {cfg.name}. Say <strong>"help"</strong> if stuck.</span>
          <button style={{ background:"none", border:"none", color:chatTheme.muted, cursor:"pointer", marginLeft:8, fontSize:16 }}
            onClick={() => setTipVisible(false)}>✕</button>
        </div>
      )}

      {/* Messages — full width, mascot floats in corner */}
      <div style={{ flex:1, display:"flex", flexDirection:"row", overflow:"hidden" }}>

        {/* ── Scrollable messages column ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 18px", display:"flex", flexDirection:"column", gap:12, position:"relative" }}>
        {/* Floating mascot — emoji for exam (all CEFR levels), SVG for chat/tutor */}
        {(() => {
          const CEFR_EMOJI = { A1:"🐇", A2:"🐿️", B1:"🦉", B2:"🐺", C1:"🦁", C2:"🦊" };
          if (mode === "exam") {
            const emoji = CEFR_EMOJI[cefrLevel] || "🦊";
            return (
              <div style={{
                position:"sticky", top:0, float:"right", width:90, height:90,
                marginLeft:8, marginBottom:-90, marginRight:0,
                flexShrink:0, pointerEvents:"none", zIndex:1,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:72, lineHeight:1,
                filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
                animation:"animalBob 3.5s ease-in-out infinite",
              }}>
                {emoji}
              </div>
            );
          }
          // Chat/tutor: use SVG
          const svg = CHAT_ANIMAL_SVGS[tutorAnimalKey || "🦊"];
          if (!svg) return null;
          return (
            <div style={{
              position:"sticky", top:0, float:"right", width:100, height:120,
              marginLeft:8, marginBottom:-120, marginRight:-4,
              flexShrink:0, pointerEvents:"none", zIndex:1,
              filter:`drop-shadow(0 6px 16px rgba(249,115,22,0.3))`,
              animation:"animalBob 3.5s ease-in-out infinite",
              opacity:0.92,
            }}>
              {svg}
            </div>
          );
        })()}
        <div style={{ width:"100%", maxWidth:980, margin:"0 auto", flex:1, display:"flex", flexDirection:"column", gap:12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", alignItems:"flex-end", gap:8 }}>
            {msg.role === "assistant" && (
              <div style={{ flexShrink:0, width:34, height:34, overflow:"visible" }}>
                {mode === "exam" ? (
                  <div style={{ width:34, height:34, borderRadius:10, background:"rgba(249,115,22,0.1)",
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                    {{"A1":"🐇","A2":"🐿️","B1":"🦉","B2":"🐺","C1":"🦁","C2":"🦊"}[cefrLevel] || "🦊"}
                  </div>
                ) : (
                  <FoxTutorCard size={34} compact style={{ borderRadius:10, width:34 }} />
                )}
              </div>
            )}
            <div style={{ maxWidth:"82%", display:"flex", flexDirection:"column", gap:4,
              alignItems:msg.role==="user"?"flex-end":"flex-start" }}>
              <div className={`chat-bubble ${msg.role==="assistant"?"chat-ai":"chat-user"}`}
                style={{ whiteSpace: "pre-wrap" }}>
                {(() => {
                  const content = msg.content;
                  const parts = content.split(/(⚠️ CORRECTION:[^\n]+)/g);
                  // Check if this message has A) B) C) D) options
                  const hasOptions = /^[A-D][)] /.test(content);
                  return parts.map((part, pi) => {
                    if (part.startsWith("⚠️ CORRECTION:")) {
                      return (
                        <div key={pi} style={{ marginTop:8, padding:"6px 10px",
                          background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)",
                          borderRadius:8, fontSize:12, color:"#fca5a5" }}>{part}</div>
                      );
                    }
                    if (hasOptions && msg.role === "assistant") {
                      // Split into lines, render option lines as buttons
                      const lines = part.split("\n");
                      // Get current exam question for option audio
                      const examQ = (mode === "exam" && localExamBank)
                        ? localExamBank.questions?.[localExamIndex]
                        : null;
                      return (
                        <span key={pi}>
                          {lines.map((line, li) => {
                            const optMatch = line.match(/^([A-D])[)] (.+)/);
                            if (optMatch) {
                              const [, letter, text] = optMatch;
                              const optIdx = letter.charCodeAt(0) - 65; // A→0, B→1 …
                              return (
                                <div key={li} style={{ marginTop:8, display:"flex", gap:6, alignItems:"stretch" }}>
                                  {/* 🔊 tap-to-hear button — plays without submitting */}
                                  <button
                                    onClick={() => examQ && playExamOptionAudio(examQ, cefrLevel, langCode, optIdx, text)}
                                    title="Tap to hear"
                                    style={{ flexShrink:0, width:34, borderRadius:8, border:"1px solid rgba(255,255,255,0.15)",
                                      background:"rgba(255,255,255,0.04)", color:"var(--muted)", cursor:"pointer",
                                      fontSize:14, display:"flex", alignItems:"center", justifyContent:"center",
                                      transition:"all 0.15s" }}
                                    onMouseOver={e => { e.currentTarget.style.background="rgba(245,200,66,0.1)"; e.currentTarget.style.color="var(--gold)"; }}
                                    onMouseOut={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="var(--muted)"; }}>
                                    🔊
                                  </button>
                                  {/* Main option button — submits the answer */}
                                  <button
                                    onClick={() => send(letter + ") " + text)}
                                    style={{ flex:1, display:"flex", alignItems:"center", gap:10,
                                      background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.15)",
                                      borderRadius:10, padding:"10px 14px", cursor:"pointer", textAlign:"left",
                                      color:"var(--text)", fontSize:14, fontFamily:"var(--font-body)",
                                      transition:"all 0.15s" }}
                                    onMouseOver={e => { e.currentTarget.style.background="rgba(245,200,66,0.12)"; e.currentTarget.style.borderColor="rgba(245,200,66,0.4)"; }}
                                    onMouseOut={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; }}>
                                    <span style={{ minWidth:26, height:26, borderRadius:6,
                                      background:"rgba(245,200,66,0.15)", color:"var(--gold)",
                                      fontWeight:800, fontSize:13, display:"flex", alignItems:"center",
                                      justifyContent:"center", flexShrink:0 }}>{letter}</span>
                                    <span>{text}</span>
                                  </button>
                                </div>
                              );
                            }
                            return line ? <span key={li}>{parseInlineMarkdown(line)}{li < lines.length-1 ? "\n" : ""}</span> : <span key={li}>{"\n"}</span>;
                          })}
                        </span>
                      );
                    }
                    return <span key={pi}>{parseInlineMarkdown(part)}</span>;
                  });
                })()}
              </div>
              {msg.role==="assistant" && msg.listenAudio && (
                <button
                  onClick={() => playWordAudio(String(msg.listenAudio), langCode, { voiceId: getTutorVoiceId(langCode) })}
                  title="Replay audio"
                  style={{
                    display:"flex", alignItems:"center", gap:6,
                    background:"rgba(249,115,22,0.12)", border:"1.5px solid rgba(249,115,22,0.35)",
                    borderRadius:20, padding:"5px 14px", cursor:"pointer",
                    fontSize:13, fontWeight:700, color:"#f97316",
                    marginTop:4, alignSelf:"flex-start",
                    transition:"all 0.15s",
                  }}
                  onMouseOver={e => { e.currentTarget.style.background="rgba(249,115,22,0.22)"; }}
                  onMouseOut={e => { e.currentTarget.style.background="rgba(249,115,22,0.12)"; }}>
                  🔊 Replay
                </button>
              )}
              {msg.role==="assistant" && showTrans && (
                <div style={{ fontSize:12, color:"var(--muted)", fontStyle:"italic",
                  borderLeft:"2px solid rgba(245,200,66,0.3)", paddingLeft:8 }}>
                  {msg.translation || "Translating…"}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ flexShrink:0, width:34, overflow:"visible" }}>
              <FoxTutorCard size={34} compact style={{ borderRadius:10, width:34 }} />
            </div>
            <div className="chat-bubble chat-ai" style={{ display:"flex", gap:5, padding:"10px 14px" }}>
              {[0,0.2,0.4].map(d => (
                <span key={d} style={{ width:7, height:7, borderRadius:"50%", background:"var(--muted)",
                  animation:`pulse 1s infinite ${d}s`, display:"inline-block" }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
        </div>
        </div>{/* end scrollable messages column */}
      </div>{/* end two-column row */}

      {/* End-of-session quick links */}
      {messages.length >= 6 && mode !== "exam" && getMistakes(userId, langCode).length > 0 && (
        <div style={{ padding:"8px 14px 14px", borderTop:`1px solid ${chatTheme.border}`, background:chatTheme.panel,
          backdropFilter:"blur(12px)", display:"flex", gap:8, flexShrink:0 }}>
          {onGoReview && (
            <button onClick={() => { stopAllAudio(); onGoReview(); }}
              style={{ flex:1, background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.3)",
                borderRadius:20, padding:"7px 12px", color:"var(--purple)", fontSize:13, cursor:"pointer" }}>
              📝 Review
            </button>
          )}
          {onBack && (
            <button onClick={() => { stopAllAudio(); onBack(); }}
              style={{ flex:1, background:"var(--surface2)", border:"1px solid var(--border2)",
                borderRadius:20, padding:"7px 12px", color:"var(--muted)", fontSize:13, cursor:"pointer" }}>
              ← Exit
            </button>
          )}
        </div>
      )}

      {/* Input bar */}
      <div style={{ padding:"12px 14px", borderTop:`1px solid ${chatTheme.border}`, display:"flex",
        gap:8, background:chatTheme.panel, backdropFilter:"blur(12px)", flexShrink:0 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={cfg.placeholder}
          style={{ flex:1,
            background: chatTheme.isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.7)",
            border:`1px solid ${chatTheme.border}`,
            borderRadius:24, padding:"11px 18px",
            color: chatTheme.text,
            fontSize:14, outline:"none",
            caretColor: chatTheme.path,
          }} />
        <button type="button" className="btn btn-gold btn-sm" onClick={() => send()} disabled={!input.trim()||loading}
          style={{ background:`linear-gradient(135deg,${chatTheme.path},${chatTheme.path}cc)`,
            color: chatTheme.isDark ? "#120d00" : "#fff", border:"none" }}>
          {loading ? <span className="loader" /> : "Send"}
        </button>
      </div>
    </div>
  );
}

// ─── FRIENDS LADDER & CHALLENGE SYSTEM ───────────────────────────────────────
const BADGE_DEFS = [
  { id:"xp-1k",     icon:"⚡", name:"1K Club",       desc:"Earned 1,000 total XP" },
  { id:"xp-5k",     icon:"🔥", name:"High Achiever", desc:"Earned 5,000 total XP" },
  { id:"first-win", icon:"🏆", name:"Champion",      desc:"Won a weekly challenge" },
  { id:"streak-7",  icon:"🌟", name:"On Fire",       desc:"7-day learning streak" },
  { id:"streak-30", icon:"💎", name:"Diamond Mind",  desc:"30-day learning streak" },
  { id:"exam-ace",  icon:"🎓", name:"Exam Ace",      desc:"Scored 18+/20 on an exam" },
  { id:"social",    icon:"🤝", name:"Team Player",   desc:"Added your first friend" },
];

function Leaderboard({ userId, onClose }) {
  const [view,        setView]        = useState("ladder");
  const [entries,     setEntries]     = useState([]);
  const [globalLoad,  setGlobalLoad]  = useState(true);
  const [friendCode,  setFriendCode]  = useState("");
  const [friendMsg,   setFriendMsg]   = useState("");
  const [challengeMsg,setChallengeMsg]= useState("");
  const weekEnd  = getWeekEnd();
  const myData   = getChallengeData(userId);
  const myBadges = myData.badges  || [];
  const myFriends= myData.friends || [];
  // Use Supabase XP (from global entries) for display — localStorage weekXP is a bonus tracker
  const myEntry  = entries.find(e => e.isYou);
  const myTotal  = myEntry?.xp || myData.totalXP || 0;
  // Week XP: sum from entries (we store week start in challenge data; use total for now until week tracking is DB-backed)
  const myWeekXP = myEntry?.xp || myData.weekXP || 0;

  useEffect(() => {
    async function load() {
      setGlobalLoad(true);
      try {
        const { data } = await supabase.from("progress").select("user_id, xp");
        if (data) {
          const byUser = {};
          data.forEach(r => { byUser[r.user_id] = (byUser[r.user_id]||0) + (r.xp||0); });
          const topIds = Object.entries(byUser).sort((a,b)=>b[1]-a[1]).slice(0,25).map(([id])=>id);
          const { data: profiles } = await supabase.from("profiles").select("id,username,name").in("id", topIds);
          const pm = {};
          (profiles||[]).forEach(p => { pm[p.id] = p; });
          const ranked = Object.entries(byUser).sort((a,b)=>b[1]-a[1]).slice(0,25).map(([uid,xp],i) => ({
            rank:i+1, userId:uid, name:pm[uid]?.username||pm[uid]?.name||"Learner", xp, isYou:uid===userId
          }));
          setEntries(ranked);
        }
      } catch {}
      setGlobalLoad(false);
    }
    load();
  }, [userId]);

  const myRankObj  = entries.find(e => e.isYou);
  const myRank     = myRankObj ? myRankObj.rank : null;
  const nextEntry  = myRank && myRank > 1 ? entries[myRank-2] : null;
  const xpToNext   = nextEntry && myRankObj ? nextEntry.xp - myRankObj.xp : 0;
  const medals     = ["🥇","🥈","🥉"];

  function addFriend() {
    if (!friendCode.trim()) return;
    const d = getChallengeData(userId);
    if ((d.friends||[]).includes(friendCode.trim())) { setFriendMsg("Already added!"); return; }
    d.friends = [...(d.friends||[]), friendCode.trim()];
    if (!d.badges?.includes("social")) d.badges = [...(d.badges||[]), "social"];
    saveChallengeData(userId, d);
    setFriendMsg(`✓ Added! Share your code: ${userId?.slice(0,8)?.toUpperCase()}`);
    setFriendCode("");
  }

  function sendChallenge(type) {
    const msgs = {
      xp500:  `🏆 LingoTrailz Challenge: First to earn 500 XP today wins! Add me: ${userId?.slice(0,8)?.toUpperCase()}`,
      lesson3:`📚 LingoTrailz Challenge: Complete 3 lessons before midnight! Add me: ${userId?.slice(0,8)?.toUpperCase()}`,
      exam:   `🎓 LingoTrailz Challenge: Take an exam and beat my score! Add me: ${userId?.slice(0,8)?.toUpperCase()}`,
    };
    navigator.clipboard?.writeText(msgs[type]||"").catch(()=>{});
    setChallengeMsg("Copied! Send it to your friend 🎉");
    setTimeout(()=>setChallengeMsg(""), 3000);
  }

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", flexDirection:"column" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Header */}
      <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)", background:"var(--surface)", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--muted)", cursor:"pointer", fontSize:22 }}>←</button>
        <div style={{ flex:1 }}>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:800 }}>🏆 Challenge Ladder</h1>
          <p style={{ color:"var(--muted)", fontSize:11 }}>Weekly competition · {formatTimeLeft(weekEnd)}</p>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:18, color:"var(--gold)" }}>{myTotal.toLocaleString()} XP</div>
          <div style={{ fontSize:10, color:"var(--muted)" }}>total earned</div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display:"flex", borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
        {[["ladder","🏅 Ladder"],["friends","👥 Friends"],["badges","🎖️ Badges"],["challenges","⚔️ Challenges"]].map(([v,label]) => (
          <button key={v} onClick={()=>setView(v)} style={{ flex:1, padding:"10px 4px", background:"none", border:"none",
            borderBottom:view===v?"2px solid var(--gold)":"2px solid transparent",
            color:view===v?"var(--gold)":"var(--muted)", cursor:"pointer", fontSize:11, fontWeight:700 }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"16px 20px 32px" }}>

        {/* ── LADDER ── */}
        {view === "ladder" && (
          <div>
            {myRank && (
              <div style={{ background:"linear-gradient(135deg,rgba(245,200,66,0.15),rgba(245,200,66,0.04))",
                border:"1px solid rgba(245,200,66,0.3)", borderRadius:16, padding:"18px", marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:11, color:"var(--gold)", fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Your Position</div>
                    <div style={{ fontFamily:"var(--font-display)", fontSize:42, fontWeight:900, lineHeight:1 }}>#{myRank}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:800, color:"var(--gold)" }}>{myTotal.toLocaleString()}</div>
                    <div style={{ fontSize:11, color:"var(--muted)" }}>total XP</div>
                  </div>
                </div>
                {nextEntry && myRankObj && (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--muted)", marginBottom:5 }}>
                      <span><strong style={{color:"var(--gold)"}}>{xpToNext} more XP</strong> to pass {nextEntry.name}</span>
                      <span>#{myRank-1}</span>
                    </div>
                    <div style={{ height:6, background:"var(--surface2)", borderRadius:4, overflow:"hidden" }}>
                      <div style={{ height:"100%", background:"linear-gradient(90deg,var(--gold),var(--gold2))", borderRadius:4,
                        width:`${Math.min(100, Math.round((myRankObj.xp / (nextEntry.xp||1))*100))}%`, transition:"width 0.5s" }} />
                    </div>
                  </div>
                )}
                {myRank === 1 && <div style={{ fontSize:13, color:"var(--gold)", marginTop:6 }}>🥇 You're leading the pack! Keep it up!</div>}
              </div>
            )}

            <div style={{ fontSize:11, color:"var(--muted)", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>
              Global Top 25 — {getWeekKey()}
            </div>
            {globalLoad ? (
              <div style={{ textAlign:"center", padding:40, color:"var(--muted)" }}>Loading…</div>
            ) : entries.length === 0 ? (
              <div style={{ textAlign:"center", padding:40, color:"var(--muted)", fontSize:13 }}>
                No one on the ladder yet.<br/>Complete lessons to earn XP and get ranked!
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {entries.map((e,i) => (
                  <div key={e.userId} style={{ background:e.isYou?"linear-gradient(135deg,rgba(245,200,66,0.12),rgba(245,200,66,0.04))":"var(--surface)",
                    border:e.isYou?"1px solid rgba(245,200,66,0.35)":"1px solid var(--border)",
                    borderRadius:14, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:30, textAlign:"center", fontFamily:"var(--font-display)", fontWeight:800, fontSize:15,
                      color:i<3?["#ffd700","#c0c0c0","#cd7f32"][i]:"var(--muted)" }}>
                      {i<3 ? medals[i] : `#${e.rank}`}
                    </div>
                    <div style={{ flex:1 }}>
                      <span style={{ fontWeight:700, fontSize:14 }}>{e.name}</span>
                      {e.isYou && <span style={{ fontSize:11, color:"var(--gold)", marginLeft:6 }}>(You)</span>}
                    </div>
                    <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:15,
                      color:e.isYou?"var(--gold)":"var(--text)" }}>
                      {e.xp.toLocaleString()} XP
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── FRIENDS ── */}
        {view === "friends" && (
          <div>
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:18, marginBottom:20 }}>
              <div style={{ fontSize:12, color:"var(--muted)", marginBottom:4 }}>Your Friend Code</div>
              <div style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:900, color:"var(--gold)", letterSpacing:3 }}>
                {userId?.slice(0,8)?.toUpperCase() || "LOGIN REQUIRED"}
              </div>
              <div style={{ fontSize:12, color:"var(--muted)", marginTop:6 }}>Share this so friends can add you</div>
            </div>

            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:8 }}>Add a Friend</div>
              <div style={{ display:"flex", gap:8 }}>
                <input value={friendCode} onChange={e=>setFriendCode(e.target.value)}
                  placeholder="Enter their friend code…"
                  style={{ flex:1, background:"var(--surface2)", border:"1px solid var(--border2)",
                    borderRadius:12, padding:"10px 14px", color:"var(--text)", fontSize:13, outline:"none" }} />
                <button className="btn btn-gold btn-sm" onClick={addFriend}>Add</button>
              </div>
              {friendMsg && <div style={{ fontSize:12, color:"var(--gold)", marginTop:6 }}>{friendMsg}</div>}
            </div>

            <div style={{ fontSize:13, fontWeight:700, marginBottom:8 }}>Your Friends ({myFriends.length})</div>
            {myFriends.length === 0 ? (
              <div style={{ textAlign:"center", padding:"32px 0", color:"var(--muted)", fontSize:13 }}>
                No friends yet. Share your code to start competing! 🤝
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {myFriends.map((code,i) => (
                  <div key={i} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13 }}>Friend #{i+1}</div>
                      <div style={{ fontSize:11, color:"var(--muted)" }}>Code: {code.toUpperCase()}</div>
                    </div>
                    <span style={{ fontSize:22 }}>👤</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BADGES ── */}
        {view === "badges" && (
          <div>
            <div style={{ fontSize:13, color:"var(--muted)", marginBottom:16 }}>
              {myBadges.length}/{BADGE_DEFS.length} badges earned
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {BADGE_DEFS.map(b => {
                const earned = myBadges.includes(b.id);
                return (
                  <div key={b.id} style={{ background:earned?"linear-gradient(135deg,rgba(245,200,66,0.12),rgba(245,200,66,0.04))":"var(--surface)",
                    border:earned?"1px solid rgba(245,200,66,0.3)":"1px solid var(--border)",
                    borderRadius:14, padding:18, opacity:earned?1:0.42, textAlign:"center" }}>
                    <div style={{ fontSize:34, marginBottom:8 }}>{earned?b.icon:"🔒"}</div>
                    <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:13, marginBottom:4 }}>{b.name}</div>
                    <div style={{ fontSize:11, color:"var(--muted)", lineHeight:1.4 }}>{b.desc}</div>
                    {earned && <div style={{ marginTop:8, fontSize:10, color:"var(--gold)", fontWeight:700 }}>✓ EARNED</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CHALLENGES ── */}
        {view === "challenges" && (
          <div>
            {/* Stats row */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
              {[
                { label:"Your XP",  value:`${myTotal.toLocaleString()} XP`, icon:"⚡", color:"var(--gold)" },
                { label:"All Time",  value:`${myTotal.toLocaleString()} XP`,  icon:"⚡", color:"var(--blue)" },
                { label:"Wins",      value:myData.wins||0,                    icon:"🏆", color:"var(--green)" },
              ].map(s => (
                <div key={s.label} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:14, textAlign:"center" }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
                  <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:16, color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:10, color:"var(--muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Time remaining */}
            <div style={{ background:"rgba(245,200,66,0.08)", border:"1px solid rgba(245,200,66,0.2)",
              borderRadius:14, padding:16, marginBottom:20, textAlign:"center" }}>
              <div style={{ fontSize:28 }}>⏱️</div>
              <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:20, marginTop:4 }}>{formatTimeLeft(weekEnd)}</div>
              <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>until weekly challenge resets</div>
            </div>

            {/* Send challenges */}
            <div style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>Send a Challenge</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
              {[
                { type:"xp500",  icon:"⚡", title:"500 XP Race",     desc:"First to earn 500 XP today wins!" },
                { type:"lesson3",icon:"📚", title:"3 Lessons Today",  desc:"Complete 3 lessons before midnight" },
                { type:"exam",   icon:"🎓", title:"Exam Duel",        desc:"Take an exam and compare your scores" },
              ].map(c => (
                <div key={c.type} className="card card-hover" style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}
                  onClick={()=>sendChallenge(c.type)}>
                  <div style={{ fontSize:26, width:36, textAlign:"center" }}>{c.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13 }}>{c.title}</div>
                    <div style={{ fontSize:11, color:"var(--muted)" }}>{c.desc}</div>
                  </div>
                  <span style={{ fontSize:12, color:"var(--gold)", fontWeight:700 }}>Copy →</span>
                </div>
              ))}
            </div>
            {challengeMsg && (
              <div style={{ padding:"10px 14px", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)",
                borderRadius:10, fontSize:13, color:"var(--green)", textAlign:"center", marginBottom:16 }}>
                {challengeMsg}
              </div>
            )}

            {/* XP guide */}
            <div style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>How to Earn XP</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[["📚","Complete a lesson","50 XP"],["🎯","Perfect lesson","75 XP"],["💬","AI conversation","30 XP"],
                ["🎓","Tutor scenario","45 XP"],["📝","Complete an exam","80 XP"],["🔥","Daily streak","20 XP"],["🌟","7-day streak","50 bonus XP"]].map(([icon,act,xp]) => (
                <div key={act} style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px",
                  background:"var(--surface)", borderRadius:10, fontSize:13 }}>
                  <span>{icon} {act}</span>
                  <span style={{ fontWeight:700, color:"var(--gold)" }}>{xp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── LESSON VIEW ───


export default AIChat;
