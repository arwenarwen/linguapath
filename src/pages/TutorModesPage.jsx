import React, { useState } from "react";
import { getTopicAnswer, findPrerecordedAnswer } from "../lib/prerecorded";

// ── Time-of-day theme — exact same system as trail map & situations ────────────
function getTheme() {
  // Fixed warm daytime theme — consistent regardless of time of day
  return { bg:"linear-gradient(180deg,#fff7ea,#ffe7c2)", panel:"rgba(255,255,255,0.78)", path:"#f5a524", text:"#6b3d10", muted:"rgba(107,61,16,0.6)", border:"rgba(245,165,36,0.25)", card:"rgba(255,255,255,0.6)", cardBorder:"rgba(245,165,36,0.22)", chip:"rgba(245,165,36,0.12)", isDark:false };
}

// ── Grammar topic suggestions per language ────────────────────────────────────
const GRAMMAR_TOPICS = {
  de: [
    { icon:"🔤", label:"Der, Die, Das",     prompt:"Explain when to use der, die and das in German with examples" },
    { icon:"📐", label:"Akkusativ vs Dativ", prompt:"Explain the difference between Akkusativ and Dativ in German with clear examples" },
    { icon:"🔀", label:"Word Order",         prompt:"Explain German sentence word order — main clauses, questions and verb-second rule" },
    { icon:"⏰", label:"Verb Tenses",        prompt:"Explain the main German verb tenses: Präsens, Perfekt, Präteritum and when to use each" },
    { icon:"🔗", label:"Separable Verbs",    prompt:"Explain German separable verbs with examples of how they split in sentences" },
    { icon:"📝", label:"Adjective Endings",  prompt:"Explain German adjective endings and how they change with gender and case" },
  ],
  es: [
    { icon:"⏰", label:"Ser vs Estar",       prompt:"Explain the difference between ser and estar in Spanish with practical examples" },
    { icon:"🔀", label:"Por vs Para",        prompt:"Explain when to use por vs para in Spanish with clear examples" },
    { icon:"📐", label:"Subjunctive Mood",   prompt:"Explain the Spanish subjunctive — when to use it and how to form it" },
    { icon:"🔤", label:"Gender Rules",       prompt:"Explain how to determine the gender of nouns in Spanish" },
    { icon:"⏳", label:"Preterite vs Imperfect", prompt:"Explain the difference between preterite and imperfect past tenses in Spanish" },
    { icon:"🔗", label:"Reflexive Verbs",    prompt:"Explain Spanish reflexive verbs with common examples" },
  ],
  fr: [
    { icon:"🔤", label:"Le, La, Les",        prompt:"Explain French definite articles le, la, les and when to use each" },
    { icon:"⏰", label:"Passé Composé",      prompt:"Explain the French passé composé — how to form it and when to use it" },
    { icon:"📐", label:"Subjunctive",        prompt:"Explain the French subjunctive mood with common triggers and examples" },
    { icon:"🔀", label:"Gender Agreement",   prompt:"Explain French gender and adjective agreement rules with examples" },
    { icon:"🔗", label:"Verb Groups",        prompt:"Explain the three French verb groups and their conjugation patterns" },
    { icon:"⏳", label:"Imparfait vs Passé", prompt:"Explain the difference between imparfait and passé composé in French" },
  ],
  default: [
    { icon:"🔤", label:"Grammar Basics",     prompt:"Explain the most important grammar rules I should know as a beginner" },
    { icon:"⏰", label:"Verb Tenses",        prompt:"Explain the main verb tenses and when to use each one" },
    { icon:"📐", label:"Sentence Structure", prompt:"Explain how to build correct sentences step by step" },
    { icon:"🔀", label:"Common Mistakes",    prompt:"What are the most common mistakes learners make and how to avoid them?" },
    { icon:"🔗", label:"Pronouns",           prompt:"Explain the pronoun system — subject, object, and possessive" },
    { icon:"📝", label:"Prepositions",       prompt:"Explain the most important prepositions and how to use them correctly" },
  ],
};

function getTopics(langCode) {
  return GRAMMAR_TOPICS[langCode] || GRAMMAR_TOPICS.default;
}

export default function TutorModesPage({ langCode, langName, onStartAI }) {
  const C = getTheme();
  const topics = getTopics(langCode);

  function startMode(mode) {
    onStartAI({ mode, id: null, title: mode === "conversation" ? "Free Chat" : mode === "tutor" ? "Grammar Tutor" : "Exam", icon: mode === "conversation" ? "💬" : mode === "tutor" ? "🎓" : "📝" });
  }

  function startTopicTutor(topic) {
    onStartAI({
      mode: "tutor",
      id: "grammar-topic",
      title: topic.label,
      icon: topic.icon,
      userQuestion: topic.label,
      systemPrompt: `You are a patient, expert ${langName} tutor. ${topic.prompt}. Start immediately with a full structured explanation — no intro. Use English to explain, use ${langName} for all examples with translations beside them. End with a practice challenge.`,
    });
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"var(--font-body)", paddingBottom:90, color:C.text }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lanternPulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes foxFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes modeGlow { 0%,100%{box-shadow:0 0 0 0 transparent} 50%{box-shadow:0 0 18px 2px rgba(245,165,36,0.18)} }
        .tm-mode-btn { transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease; cursor:pointer; border:none; }
        .tm-mode-btn:hover { transform:translateY(-3px); }
        .tm-mode-btn:active { transform:scale(0.97); }
        .tm-topic-btn { transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease; cursor:pointer; border:none; }
        .tm-topic-btn:hover { transform:translateY(-2px); }
        .tm-topic-btn:active { transform:scale(0.96); }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{ padding:"22px 18px 0", position:"relative", overflow:"hidden" }}>
        {/* Glow halo */}
        <div style={{ position:"absolute", top:-40, left:"50%", transform:"translateX(-50%)", width:260, height:160, background:`radial-gradient(circle,${C.path}18,transparent 70%)`, pointerEvents:"none" }}/>

        <div style={{ position:"relative", animation:"fadeUp 0.4s ease both" }}>
          {/* Eyebrow */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ width:18, height:2, borderRadius:99, background:`${C.path}66` }}/>
            <span style={{ fontSize:10, fontWeight:800, letterSpacing:2.5, textTransform:"uppercase", color:C.path }}>AI Tutor</span>
            <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${C.path}30,transparent)` }}/>
          </div>

          {/* Title row */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <div style={{ fontSize:26, animation:"lanternPulse 3s ease-in-out infinite" }}>🎓</div>
            <div>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:21, fontWeight:900, color:C.text, lineHeight:1.1, margin:0 }}>
                Training Ground
              </h1>
              <p style={{ fontSize:12, color:C.muted, margin:"3px 0 0", fontWeight:400 }}>
                Grammar, conversation and exam practice
              </p>
            </div>
          </div>

          {/* Fox helper */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10, padding:"8px 12px", background:`${C.path}12`, border:`1px solid ${C.path}28`, borderRadius:12 }}>
            <span style={{ fontSize:16, display:"inline-block", animation:"foxFloat 3s ease-in-out infinite" }}>🦊</span>
            <span style={{ fontSize:12, color:C.muted, fontStyle:"italic" }}>
              Pick a mode or ask me to explain something specific.
            </span>
          </div>
        </div>

        <div style={{ margin:"14px 0 0", height:1, background:`linear-gradient(90deg,transparent,${C.path}25,transparent)` }}/>
      </div>

      {/* ── THREE MODES ─────────────────────────────────────────────────── */}
      <div style={{ padding:"18px 18px 0", animation:"fadeUp 0.4s 0.07s ease both" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:9 }}>

          {/* Free Chat */}
          <ModeCard
            C={C}
            icon="💬"
            title="Free Chat"
            desc={"Talk freely in " + langName}
            accent="#40a9a0"
            onClick={() => startMode("conversation")}
          />

          {/* Grammar Tutor — primary */}
          <ModeCard
            C={C}
            icon="🧠"
            title="Tutor"
            desc="Grammar, topics & feedback"
            accent={C.path}
            isPrimary
            onClick={() => startMode("tutor")}
          />

          {/* Exam */}
          <ModeCard
            C={C}
            icon="📝"
            title="Exam"
            desc="30-question test"
            accent="#8b5cf6"
            onClick={() => startMode("exam")}
          />
        </div>
      </div>

      {/* ── DIVIDER ─────────────────────────────────────────────────────── */}
      <div style={{ padding:"22px 18px 0", animation:"fadeUp 0.4s 0.12s ease both" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:18, height:2, borderRadius:99, background:`${C.path}55` }}/>
          <span style={{ fontSize:10, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:C.path, whiteSpace:"nowrap" }}>
            Quick Grammar Topics
          </span>
          <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${C.path}30,transparent)` }}/>
        </div>
        <p style={{ fontSize:12, color:C.muted, marginTop:6 }}>
          Tap any topic and your tutor will explain it clearly with examples.
        </p>
      </div>

      {/* ── GRAMMAR TOPIC GRID ──────────────────────────────────────────── */}
      <div style={{ padding:"12px 18px 0", animation:"fadeUp 0.4s 0.16s ease both" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
          {topics.map((topic, i) => (
            <TopicCard
              key={topic.label}
              topic={topic}
              index={i}
              C={C}
              onClick={() => startTopicTutor(topic)}
            />
          ))}
        </div>
      </div>

      {/* ── CUSTOM QUESTION BOX ─────────────────────────────────────────── */}
      <div style={{ padding:"18px 18px 0", animation:"fadeUp 0.4s 0.22s ease both" }}>
        <CustomAskBox C={C} langName={langName} langCode={langCode} onStartAI={onStartAI} />
      </div>
    </div>
  );
}

// ── Mode Card ─────────────────────────────────────────────────────────────────
function ModeCard({ C, icon, title, desc, accent, isPrimary, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      className="tm-mode-btn"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:18, padding:"16px 10px 14px",
        textAlign:"center", width:"100%",
        background: hov
          ? `${accent}20`
          : isPrimary
          ? `${accent}15`
          : C.card,
        border:`1px solid ${hov ? accent+"55" : isPrimary ? accent+"38" : C.cardBorder}`,
        boxShadow: hov
          ? `0 8px 24px rgba(0,0,0,0.15), 0 0 0 1px ${accent}28`
          : isPrimary
          ? `0 4px 16px rgba(0,0,0,0.1), 0 0 12px ${accent}15`
          : "none",
        position:"relative", overflow:"hidden",
        animation: isPrimary && !hov ? "modeGlow 3s ease-in-out infinite" : "none",
      }}
    >
      {isPrimary && (
        <div style={{
          position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
          background:`linear-gradient(135deg,${accent},${accent}bb)`,
          color: C.isDark ? "#0d0d00" : "#fff",
          fontSize:8, fontWeight:900, letterSpacing:1.5,
          padding:"2px 9px", borderRadius:"0 0 8px 8px",
          textTransform:"uppercase", whiteSpace:"nowrap",
          opacity: C.isDark ? 1 : 0.9,
        }}>✦ Main</div>
      )}
      <div style={{ fontSize:22, marginBottom:7,
        filter: C.isDark ? "none" : "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
        transition:"transform 0.18s ease",
        transform: hov ? "scale(1.12)" : "scale(1)",
      }}>{icon}</div>
      <div style={{
        fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:12.5,
        color: hov ? accent : C.isDark ? `${accent}cc` : accent,
        marginBottom:3, transition:"color 0.15s",
      }}>{title}</div>
      <div style={{ fontSize:10, color:C.muted, lineHeight:1.4, fontWeight:500 }}>{desc}</div>
    </button>
  );
}

// ── Topic Card ────────────────────────────────────────────────────────────────
function TopicCard({ topic, index, C, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      className="tm-topic-btn"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:16, padding:"13px 14px",
        display:"flex", alignItems:"center", gap:11,
        width:"100%", textAlign:"left",
        background: hov ? `${C.path}18` : C.card,
        border:`1px solid ${hov ? C.path+"45" : C.cardBorder}`,
        boxShadow: hov ? `0 6px 18px rgba(0,0,0,0.12), 0 0 0 1px ${C.path}18` : "none",
        animation:`fadeUp 0.3s ${index * 0.04}s ease both`,
        color: C.text,
      }}
    >
      <div style={{
        width:36, height:36, borderRadius:11, flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:17,
        background: hov ? `${C.path}22` : `${C.path}12`,
        border:`1px solid ${C.path}${hov ? "45" : "22"}`,
        transition:"all 0.15s ease",
        transform: hov ? "scale(1.08) rotate(-4deg)" : "scale(1)",
      }}>
        {topic.icon}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{
          fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12.5,
          color: C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
        }}>
          {topic.label}
        </div>
        <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>
          Tap to learn →
        </div>
      </div>
    </button>
  );
}

// ── Custom Ask Box ────────────────────────────────────────────────────────────
// ── Custom question placeholder examples per language ──────────────────────
const CUSTOM_QUESTION_EXAMPLES = {
  de: `e.g. "When do I use der, die or das?" or "What's the difference between Akkusativ and Dativ?"`,
  es: `e.g. "When do I use ser vs estar?" or "How does the subjunctive work in Spanish?"`,
  fr: `e.g. "When do I use passé composé vs imparfait?" or "How does gender agreement work in French?"`,
  it: `e.g. "What's the difference between essere and avere?" or "How do I use the congiuntivo?"`,
  pt: `e.g. "When do I use ser vs estar in Portuguese?" or "How does the subjunctive work?"`,
  zh: `e.g. "How do measure words work in Chinese?" or "What's the difference between 了 and 过?"`,
  ja: `e.g. "When do I use は vs が in Japanese?" or "How do て-form verbs work?"`,
  ko: `e.g. "What's the difference between 이/가 and 은/는 in Korean?" or "How does honorific speech work?"`,
  pl: `e.g. "How do Polish cases work?" or "When do I use perfective vs imperfective verbs?"`,
  en: `e.g. "When do I use present perfect vs simple past?" or "How do conditionals work in English?"`,
};

function CustomAskBox({ C, langName, langCode, onStartAI }) {
  const [val, setVal] = React.useState("");
  const exampleHint = CUSTOM_QUESTION_EXAMPLES[langCode] || `e.g. "How does the subjunctive work?" or "Explain the case system"`;

  function submit() {
    const q = val.trim();
    if (!q) return;
    onStartAI({
      mode: "tutor",
      id: "custom-question",
      title: q.length > 40 ? q.slice(0, 40) + "…" : q,
      icon: "🧠",
      userQuestion: q,
      systemPrompt: `You are a patient, expert ${langName} tutor. The learner asked: "${q}". Answer immediately and thoroughly. Do NOT say "I'll explain" or "Let me explain" — just start the explanation. Use English primarily, with ${langName} examples and translations. Structure clearly, give examples, note common mistakes, end with a practice challenge.`,
    });
    setVal("");
  }

  return (
    <div style={{
      borderRadius:18, padding:"16px",
      background: C.card,
      border:`1px solid ${C.cardBorder}`,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span style={{ fontSize:16 }}>💡</span>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:C.text }}>
          Ask your own question
        </span>
      </div>
      <p style={{ fontSize:11.5, color:C.muted, marginBottom:10, lineHeight:1.55 }}>
        {exampleHint}
      </p>
      <div style={{ display:"flex", gap:8 }}>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") submit(); }}
          placeholder={`Ask anything about ${langName}…`}
          style={{
            flex:1, padding:"10px 14px", borderRadius:12, fontSize:13,
            background: C.isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.65)",
            border:`1px solid ${C.border}`,
            color: C.text, outline:"none",
            fontFamily:"var(--font-body)",
          }}
        />
        <button
          onClick={submit}
          disabled={!val.trim()}
          style={{
            padding:"10px 16px", borderRadius:12, border:"none", cursor:"pointer",
            background: val.trim() ? `linear-gradient(135deg,${C.path},${C.path}bb)` : `${C.path}30`,
            color: val.trim() ? (C.isDark ? "#0d0d00" : "#fff") : C.muted,
            fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13,
            transition:"all 0.15s ease",
            flexShrink:0,
          }}
        >
          Ask →
        </button>
      </div>
    </div>
  );
}
