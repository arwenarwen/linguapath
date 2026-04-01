import React, { useState, useEffect, useRef } from 'react';
import { tryPlayStaticAudio } from '../lib/staticAudio';
import { lookupLocalDictionary } from '../lib/localDictionary';
import { loadProgress, saveProgress } from '../lib/appState';

// ─── THEME (matches Trail / Situations exactly) ───────────────────────────────
const T = {
  bg:         "linear-gradient(180deg,#fff7ea 0%,#ffe7c2 100%)",
  panel:      "rgba(255,255,255,0.82)",
  panelBorder:"rgba(245,165,36,0.25)",
  path:       "#f5a524",
  pathDark:   "#c9840a",
  text:       "#4a2800",
  muted:      "rgba(74,40,0,0.5)",
  mutedLight: "rgba(74,40,0,0.32)",
  green:      "#16a34a",
  greenBg:    "rgba(22,163,74,0.1)",
  greenBorder:"rgba(22,163,74,0.28)",
  red:        "#b91c1c",
  redBg:      "rgba(185,28,28,0.08)",
  redBorder:  "rgba(185,28,28,0.22)",
  purple:     "#7c3aed",
  purpleBg:   "rgba(124,58,237,0.1)",
  purpleBorder:"rgba(124,58,237,0.28)",
  card:       "rgba(255,255,255,0.68)",
  cardBorder: "rgba(245,165,36,0.22)",
  chip:       "rgba(245,165,36,0.12)",
  inputBg:    "rgba(255,255,255,0.75)",
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  .rv-page { min-height: 100dvh; background: ${T.bg}; color: ${T.text}; font-family: var(--font-body, system-ui); }
  @keyframes rv-flip-in  { from{opacity:0;transform:rotateY(-10deg) scale(0.96)} to{opacity:1;transform:rotateY(0) scale(1)} }
  @keyframes rv-fade-up  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rv-float-xp { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-56px) scale(1.25)} }
  @keyframes rv-pulse-err{ 0%,100%{box-shadow:0 0 0 0 rgba(185,28,28,0)} 50%{box-shadow:0 0 16px 4px rgba(185,28,28,0.14)} }
  @keyframes rv-pulse-ok { 0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0)} 50%{box-shadow:0 0 16px 4px rgba(22,163,74,0.16)} }
  @keyframes rv-wave     { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
  @keyframes rv-shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes rv-dot-pop  { from{transform:scale(0.5);opacity:0.5} to{transform:scale(1);opacity:1} }
  @keyframes rv-bar-fill { from{width:0%} to{width:var(--tw)} }
  @keyframes rv-mascot   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }

  .rv-card   { transition: transform 0.18s ease, box-shadow 0.18s ease; cursor: pointer; }
  .rv-card:hover { transform: translateY(-2px); }
  .rv-btn    { transition: all 0.16s ease; cursor: pointer; border: none; font-family: inherit; }
  .rv-btn:hover  { transform: translateY(-2px); filter: brightness(1.05); }
  .rv-btn:active { transform: scale(0.97); }
  .rv-pill   { transition: all 0.16s ease; cursor: pointer; border: none; font-family: inherit; }
  .rv-tab    { transition: all 0.16s ease; cursor: pointer; border: none; font-family: inherit; }
  .rv-input:focus { outline: none; border-color: ${T.path} !important; box-shadow: 0 0 0 3px rgba(245,165,36,0.18) !important; }
  .rv-flip   { animation: rv-flip-in 0.32s cubic-bezier(0.34,1.56,0.64,1) both; }
  .rv-fade   { animation: rv-fade-up 0.35s ease both; }
  .rv-shimmer-btn {
    background: linear-gradient(90deg,${T.path} 0%,#fbbf24 35%,${T.path} 65%,#fbbf24 100%);
    background-size: 200% auto;
    animation: rv-shimmer 2.4s linear infinite;
  }
  .rv-pulse-err { animation: rv-pulse-err 2s ease-in-out infinite; }
  .rv-pulse-ok  { animation: rv-pulse-ok  2s ease-in-out infinite; }
  .rv-mascot-anim { animation: rv-mascot 3s ease-in-out infinite; display:inline-block; }
  .rv-bar { animation: rv-bar-fill 0.8s cubic-bezier(0.34,1.56,0.64,1) both; }
`;

// ─── AUDIO ────────────────────────────────────────────────────────────────────
let _audio = null;
function stopAllAudio() {
  try { window.speechSynthesis?.cancel(); } catch {}
  try { if (_audio) { _audio.pause(); _audio.currentTime = 0; _audio = null; } } catch {}
}
// Used ONLY in the dictionary — tries static audio then ElevenLabs TTS
async function playAudio(text, langCode) {
  if (!text || typeof window === "undefined") return;
  try {
    const used = await tryPlayStaticAudio({ text, langCode: langCode || "en", stopAllAudio, setActiveAudio: a => { _audio = a; } });
    if (used) return;
    stopAllAudio();
    const res = await fetch("/api/tts", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ text: String(text).slice(0,900), langCode }) });
    if (!res.ok) return;
    const blob = await res.blob();
    if (!blob || blob.size === 0) return;
    const url = URL.createObjectURL(blob);
    const a = new Audio(url);
    _audio = a;
    a.onended = () => { try { URL.revokeObjectURL(url); } catch {} if (_audio === a) _audio = null; };
    await a.play();
  } catch {}
}

// Used in flashcards — browser Web Speech only, no ElevenLabs
function playWebSpeech(text, langCode) {
  if (!text || typeof window === "undefined") return;
  try {
    stopAllAudio();
    const utter = new SpeechSynthesisUtterance(String(text).slice(0, 300));
    const langMap = { de:"de-DE", es:"es-ES", fr:"fr-FR", it:"it-IT", pt:"pt-BR", ja:"ja-JP", ko:"ko-KR", zh:"zh-CN", ru:"ru-RU", el:"el-GR", pl:"pl-PL", en:"en-US" };
    utter.lang = langMap[langCode] || langCode || "en-US";
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  } catch {}
}

// ─── MISTAKE STORE ────────────────────────────────────────────────────────────
function isReal(m) {
  const t = `${m?.original||""} ${m?.corrected||""}`.toLowerCase();
  if (!t.trim()) return false;
  return !["goal of this speaking task","best strategy after a mistake","choose the best word","switch to another language"].some(b => t.includes(b));
}
function getMistakes(userId, langCode) {
  try {
    const g = JSON.parse(localStorage.getItem(`lp_mistakes_global_${langCode}`) || "[]");
    const s = userId ? JSON.parse(localStorage.getItem(`lp_mistakes_${userId}_${langCode}`) || "[]") : [];
    const seen = new Set();
    return [...g, ...s].filter(isReal).filter(m => { const k=`${m.original}→${m.corrected}→${m.source||""}`; if(seen.has(k))return false; seen.add(k); return true; });
  } catch { return []; }
}
function saveMistakes(userId, langCode, list) {
  try {
    const c = (list||[]).filter(isReal);
    localStorage.setItem(`lp_mistakes_global_${langCode}`, JSON.stringify(c));
    if (userId) localStorage.setItem(`lp_mistakes_${userId}_${langCode}`, JSON.stringify(c));
  } catch {}
}
function pushMistake(userId, langCode, original, corrected, explanation, source) {
  if (!original || !corrected || original.trim() === corrected.trim()) return;
  const list = getMistakes(userId, langCode);
  if (list.slice(0,10).some(m => m.original===original.trim() && m.corrected===corrected.trim())) return;
  list.unshift({ id:Date.now(), original:original.trim(), corrected:corrected.trim(), explanation, source:source||"AI Tutor", date:new Date().toISOString().slice(0,10) });
  saveMistakes(userId, langCode, list.slice(0,500));
}
function getLangName(code) {
  return { es:"Spanish", fr:"French", de:"German", it:"Italian", pt:"Portuguese", zh:"Chinese", ja:"Japanese", ko:"Korean", pl:"Polish", ru:"Russian", el:"Greek", en:"English" }[code] || code?.toUpperCase() || "Language";
}
function getVocabBook(userId, langCode) {
  try {
    return JSON.parse(localStorage.getItem(`lp_vocab_${userId || "anon"}_${langCode}`) || "[]");
  } catch { return []; }
}
function getCardFrontTitle(m) {
  if (m?.source === "Exam Mode") return "❓ Exam review";
  return m?.question ? "❓ Review question" : (m?.isLesson ? "❓ Exercise" : "✗ You chose");
}
function getCardBackTitle(m) {
  if (m?.source === "Exam Mode") return "✓ Correct answer";
  return m?.isLesson ? "✓ Correct answer" : "✓ Correction";
}
function getRevealLabel(m) {
  return m?.source === "Exam Mode" || m?.isLesson ? "answer" : "correction";
}

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────

function XPFloat({ amount, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 950); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", zIndex:99, pointerEvents:"none",
      fontSize:20, fontWeight:900, color:T.pathDark, fontFamily:"'Syne',sans-serif",
      animation:"rv-float-xp 0.95s ease-out forwards",
      textShadow:`0 0 16px rgba(245,165,36,0.5)`,
    }}>+{amount} XP ⚡</div>
  );
}

function AudioBtn({ text, langCode, size = 44, playing, onPlay }) {
  return (
    <button className="rv-btn" onClick={e => { e.stopPropagation(); if (onPlay) onPlay(); else playAudio(text, langCode); }} style={{
      width:size, height:size, borderRadius:"50%",
      background:"rgba(245,165,36,0.12)", border:`1.5px solid rgba(245,165,36,0.35)`,
      color:T.pathDark, fontSize:size*0.42,
      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
    }}>
      {playing ? (
        <div style={{ display:"flex", gap:2, alignItems:"center", height:14 }}>
          {[0.35,0.7,1,0.7,0.35].map((h,i) => (
            <div key={i} style={{ width:3, borderRadius:2, background:T.pathDark, height:`${h*14}px`, animation:`rv-wave 0.6s ease-in-out ${i*0.1}s infinite` }} />
          ))}
        </div>
      ) : "🔊"}
    </button>
  );
}

function Mascot({ state }) {
  const face = { idle:"🦊", happy:"🦊", sad:"😔", thinking:"🤔" }[state] || "🦊";
  const msg  = { idle:"Ready to review!", happy:"Great job! Keep climbing! 🎉", sad:"Almost there — you'll get it!", thinking:"Think it through..." }[state] || "";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 13px", borderRadius:14,
      background:T.panel, border:`1px solid ${T.panelBorder}`, marginBottom:12,
      boxShadow:"0 2px 10px rgba(245,165,36,0.1)" }}>
      <span className="rv-mascot-anim" style={{ fontSize:24 }}>{face}</span>
      <span style={{ fontSize:13, color:T.muted, fontStyle:"italic" }}>{msg}</span>
    </div>
  );
}

function TrailBar({ done, total }) {
  const pct = total > 0 ? Math.min(100, Math.round(done/total*100)) : 0;
  return (
    <div style={{ position:"relative", height:9, background:"rgba(74,40,0,0.1)", borderRadius:999, marginBottom:5 }}>
      <div style={{ position:"absolute", left:0, top:0, height:"100%", borderRadius:999,
        background:`linear-gradient(90deg,${T.path},#fbbf24)`,
        boxShadow:`0 0 10px rgba(245,165,36,0.4)`,
        width:`${pct}%`, transition:"width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
      }} />
      {pct < 100 && (
        <div style={{ position:"absolute", top:"50%", transform:"translateY(-50%)",
          left:`calc(${pct}% - 9px)`, width:18, height:18, borderRadius:"50%",
          background:`linear-gradient(135deg,#fbbf24,${T.path})`,
          boxShadow:`0 0 10px rgba(245,165,36,0.5)`, transition:"left 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        }} />
      )}
    </div>
  );
}

function ProgressDots({ total, current, max = 10 }) {
  const show = Math.min(total, max);
  return (
    <div style={{ display:"flex", gap:5, justifyContent:"center", flexWrap:"wrap" }}>
      {Array.from({length:show}).map((_,i) => (
        <div key={i} style={{
          width:i <= current ? 10 : 8, height:i <= current ? 10 : 8, borderRadius:"50%",
          background: i < current ? T.path : i===current ? "rgba(245,165,36,0.45)" : "rgba(74,40,0,0.12)",
          boxShadow: i < current ? `0 0 6px rgba(245,165,36,0.45)` : "none",
          transition:"all 0.3s", animation: i===current ? "rv-dot-pop 0.4s ease both" : "none",
        }} />
      ))}
      {total > max && <span style={{ fontSize:10, color:T.mutedLight, alignSelf:"center" }}>+{total-max}</span>}
    </div>
  );
}

function StatChip({ icon, value, label, color }) {
  return (
    <div style={{ flex:1, textAlign:"center", padding:"11px 6px",
      background:T.panel, border:`1px solid ${T.panelBorder}`,
      borderRadius:14, boxShadow:"0 2px 8px rgba(245,165,36,0.08)" }}>
      <div style={{ fontSize:18, marginBottom:3 }}>{icon}</div>
      <div style={{ fontSize:20, fontWeight:900, color, fontFamily:"'Syne',sans-serif", lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:10, color:T.mutedLight, marginTop:3 }}>{label}</div>
    </div>
  );
}

function SrcColor(src) {
  if (!src) return T.purple;
  if (src.startsWith("Lesson:")) return "#0891b2";
  return { "AI Tutor":T.purple, "Open Conversation":T.green, "Tutor Mode":T.pathDark, "Exam Mode":"#ea580c", "Dictionary":"#0891b2" }[src] || T.purple;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
function VocabLessonCard({ lesson, langCode }) {
  const [expanded, setExpanded] = React.useState(false);
  const [playingWord, setPlayingWord] = React.useState(null);

  async function playWord(text) {
    if (!text || playingWord) return;
    setPlayingWord(text);
    try {
      const used = await tryPlayStaticAudio({ text, langCode, stopAllAudio, setActiveAudio: a => { _audio = a; } });
      if (!used) {
        // Fallback: ElevenLabs TTS
        const res = await fetch("/api/tts", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ text, langCode }) });
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = new Audio(url);
          _audio = a;
          a.onended = () => { URL.revokeObjectURL(url); if (_audio===a) _audio=null; };
          await a.play();
        }
      }
    } catch {}
    setTimeout(() => setPlayingWord(null), 1800);
  }

  return (
    <div style={{ background:T.panel, border:`1px solid ${T.panelBorder}`, borderRadius:16, marginBottom:10, overflow:"hidden" }}>
      <button className="rv-btn" onClick={()=>setExpanded(e=>!e)} style={{
        width:"100%", padding:"13px 16px", textAlign:"left",
        background:"transparent", display:"flex", alignItems:"center", gap:10,
      }}>
        <span style={{ fontSize:22 }}>{lesson.icon||"📖"}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:800, color:T.text, lineHeight:1.2 }}>{lesson.title}</div>
          <div style={{ fontSize:11, color:T.mutedLight, marginTop:2 }}>
            {lesson.unit ? `${lesson.unit} · ` : ""}{lesson.words?.length||0} words · {lesson.date||""}
          </div>
        </div>
        <span style={{ fontSize:12, color:T.muted, fontWeight:700 }}>{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div style={{ padding:"0 14px 14px", borderTop:`1px solid ${T.panelBorder}` }}>
          <div style={{ paddingTop:12, display:"flex", flexDirection:"column", gap:7 }}>
            {(lesson.words||[]).map((w, wi) => (
              <div key={wi} style={{
                display:"flex", alignItems:"center", gap:10,
                background:T.card, border:`1px solid ${T.cardBorder}`,
                borderRadius:12, padding:"9px 12px",
              }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:800, color:T.text }}>{w.target}</div>
                  <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{w.en}</div>
                </div>
                <button
                  className="rv-btn"
                  onClick={() => playWord(w.target)}
                  style={{
                    width:36, height:36, borderRadius:"50%", flexShrink:0,
                    background: playingWord===w.target ? "rgba(245,165,36,0.22)" : "rgba(245,165,36,0.10)",
                    border:`1.5px solid rgba(245,165,36,0.3)`,
                    color:T.pathDark, fontSize:15,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}
                >
                  {playingWord===w.target ? (
                    <div style={{ display:"flex", gap:2, alignItems:"center", height:12 }}>
                      {[0.35,0.7,1,0.7,0.35].map((h,i) => (
                        <div key={i} style={{ width:2.5, borderRadius:2, background:T.pathDark, height:`${h*12}px`, animation:`rv-wave 0.6s ease-in-out ${i*0.1}s infinite` }} />
                      ))}
                    </div>
                  ) : "🔊"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewPanel({ userId, langCode, langName: langNameProp, onMenuOpen }) {
  const langName = langNameProp || getLangName(langCode);
  const [view, setView]         = useState("flashcards");
  const [mistakes, setMistakes] = useState(() => getMistakes(userId, langCode));
  const [cardIdx, setCardIdx]   = useState(0);
  const [flipped, setFlipped]   = useState(false);
  const [dismissed, setDismissed] = useState({});
  const [filterMode, setFilterMode] = useState("all");
  const [mascot, setMascot]     = useState("idle");
  const [xpFloat, setXpFloat]   = useState(null);
  const [sessionXP, setSessionXP] = useState(0);
  const [playing, setPlaying]   = useState(false);

  // Dictionary
  const [dictInput, setDictInput]   = useState("");
  const [dictResult, setDictResult] = useState(null);
  const [dictLoading, setDictLoading] = useState(false);

  const cardRef = useRef(null);

  useEffect(() => {
    const refresh = () => { setMistakes(getMistakes(userId, langCode)); setCardIdx(0); setFlipped(false); };
    refresh();
    window.addEventListener("focus", refresh);
    const vis = () => { if (document.visibilityState==="visible") refresh(); };
    document.addEventListener("visibilitychange", vis);
    return () => { window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", vis); };
  }, [userId, langCode]);

  useEffect(() => {
    if (view==="flashcards") { setMistakes(getMistakes(userId, langCode)); setCardIdx(0); setFlipped(false); }
  }, [view, userId, langCode]);

  const allSources = Array.from(new Set(mistakes.map(m => m.source || "AI Tutor")));
  const filtered = filterMode==="mistakes" ? mistakes.filter(m=>!m.isLesson) : filterMode==="lesson" ? mistakes.filter(m=>m.isLesson) : mistakes;
  const active   = filtered.filter(m => !dismissed[m.id]);
  const current  = active[cardIdx] || null;

  const freq = {};
  mistakes.forEach(m => { const k=m.original+"→"+m.corrected; freq[k]=(freq[k]||0)+1; });
  const isPriority = current && (freq[current.original+"→"+current.corrected]||0) > 1;

  function goNext() { setFlipped(false); setTimeout(() => setCardIdx(i=>Math.min(active.length-1,i+1)),80); }
  function goPrev() { setFlipped(false); setTimeout(() => setCardIdx(i=>Math.max(0,i-1)),80); }

  function handleMastered() {
    if (!current) return;
    // No XP for marking a mistake as mastered — XP is earned during lessons/streaks/AI
    setMascot("happy"); setTimeout(()=>setMascot("idle"),2200);
    const updated = getMistakes(userId,langCode).filter(m=>m.id!==current.id);
    saveMistakes(userId,langCode,updated); setMistakes(updated);
    setDismissed(d=>({...d,[current.id]:true}));
    if (cardIdx>=active.length-1) setCardIdx(Math.max(0,active.length-2));
    else setFlipped(false);
  }

  function handleSkip() {
    setMascot("thinking"); setTimeout(()=>setMascot("idle"),1400);
    setFlipped(false);
    setCardIdx(i => (i + 1) % Math.max(1, active.length));
  }

  function handleListen() {
    if (!current) return;
    const text = current.corrected || current.original || "";
    setPlaying(true); playWebSpeech(text, langCode); setTimeout(()=>setPlaying(false),2200);
  }

  async function lookupDict(term) {
    const q = (term || dictInput).trim(); if (!q) return;
    setDictLoading(true); setDictResult(null);

    try {
      const local = await lookupLocalDictionary(q, langCode);
      if (local) {
        setDictResult(local);
        setDictLoading(false);
        return;
      }
    } catch {}

    const isEn = /^[A-Za-z0-9\s'".,!?-]+$/.test(q);
    const prompt = isEn
      ? `Translate English to ${langName}. JSON only: {"translation":"native","pronunciation":"phonetic","partOfSpeech":"type","example":"example in ${langName}","exampleTranslation":"English","notes":"tip"}
Query: ${q}`
      : `Translate ${langName} to English. JSON only: {"translation":"English","pronunciation":"phonetic","partOfSpeech":"type","example":"example in ${langName}","exampleTranslation":"English","notes":"tip"}
Query: ${q}`;
    try {
      const res = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({system:`Bilingual dictionary for English and ${langName}. JSON only.`,messages:[{role:"user",content:prompt}],expectJson:true,temperature:0.1,max_tokens:300})});
      const data = await res.json();
      const raw = (data.reply||"").replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/```\s*$/," ").trim();
      const p = JSON.parse(raw);
      setDictResult({translation:p.translation||"",pronunciation:p.pronunciation||"",partOfSpeech:p.partOfSpeech||"",example:p.example||"",exampleTranslation:p.exampleTranslation||"",notes:p.notes||""});
    } catch { setDictResult({translation:"Could not look up — check your connection.",pronunciation:"",partOfSpeech:"",example:"",exampleTranslation:"",notes:""}); }
    setDictLoading(false);
  }

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="rv-page" style={{ flex:1, overflowY:"auto", paddingBottom:90 }}>
      <style>{CSS}</style>

      <div style={{ padding:"18px 18px 0" }}>

        {/* HEADER */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
          <button className="hamburger" onClick={()=>onMenuOpen?.()}><span/><span/><span/></button>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:900, margin:0, color:T.text, lineHeight:1 }}>Review</h1>
            <div style={{ fontSize:11, color:T.mutedLight, marginTop:2 }}>{langName} · Training Session</div>
          </div>
          {/* Segmented switch */}
          <div style={{ display:"flex", background:T.panel, borderRadius:12, padding:3, border:`1px solid ${T.panelBorder}`, boxShadow:"0 2px 8px rgba(245,165,36,0.1)" }}>
            {[["flashcards","📇 Cards"],["dictionary","📖 Dict"],["vocab","📚 Vocab"]].map(([v,l])=>(
              <button key={v} className="rv-tab" onClick={()=>setView(v)} style={{
                padding:"6px 11px", fontSize:11, fontWeight:800, borderRadius:10,
                background: view===v ? T.path : "transparent",
                color: view===v ? "#fff" : T.muted,
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* ── FLASHCARDS ───────────────────────────────────────────────── */}
        {view==="flashcards" && (() => {

          if (mistakes.length===0) return (
            <div className="rv-fade" style={{ textAlign:"center", padding:"60px 20px" }}>
              <div style={{ fontSize:60, marginBottom:16 }}>🦊</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:T.text, marginBottom:8 }}>Nothing to review yet!</div>
              <div style={{ fontSize:14, color:T.muted, lineHeight:1.7, maxWidth:280, margin:"0 auto" }}>
                Complete lessons, talk to the AI tutor, or take an exam — mistakes will appear here as flashcards.
              </div>
            </div>
          );

          return (
            <div className="rv-fade">
              {/* Trail bar */}
              <div style={{ marginBottom:14 }}>
                <TrailBar done={Object.keys(dismissed).length} total={mistakes.length} />
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.mutedLight, marginTop:4 }}>
                  <span>Card {Math.min(cardIdx+1,active.length)} of {active.length}</span>
                  <span>{Object.keys(dismissed).length} mastered</span>
                </div>
              </div>

              {/* Stat chips */}
              <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                <StatChip icon="🔥" value={active.length}   label="To Review"    color={T.pathDark} />
                <StatChip icon="✅" value={Object.keys(dismissed).length} label="Mastered"  color="#22c55e" />
                <StatChip icon="📚" value={allSources.length} label="Sources"    color={T.purple} />
              </div>

              {/* Mode pills */}
              <div style={{ display:"flex", gap:6, marginBottom:14 }}>
                {[["all","🗂 All"],["mistakes","🔥 Mistakes"],["lesson","🧪 Lesson"]].map(([m,l])=>(
                  <button key={m} className="rv-pill" onClick={()=>{ setFilterMode(m); setCardIdx(0); setFlipped(false); }} style={{
                    padding:"6px 13px", borderRadius:20, fontSize:11, fontWeight:700,
                    background: filterMode===m ? T.purpleBg : "rgba(74,40,0,0.05)",
                    border:`1px solid ${filterMode===m ? T.purpleBorder : "rgba(74,40,0,0.1)"}`,
                    color: filterMode===m ? T.purple : T.muted,
                  }}>{l}</button>
                ))}
              </div>

              {active.length===0 ? (
                <div style={{ textAlign:"center", padding:"40px 20px" }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:T.text, marginBottom:8 }}>All caught up!</div>
                  <div style={{ fontSize:13, color:T.muted, lineHeight:1.6 }}>You've mastered all cards in this category.</div>
                  {filterMode!=="all" && (
                    <button className="rv-btn" onClick={()=>{ setFilterMode("all"); setCardIdx(0); }} style={{
                      marginTop:16, padding:"10px 22px",
                      background:T.chip, border:`1px solid ${T.panelBorder}`,
                      borderRadius:12, color:T.pathDark, fontSize:13, fontWeight:700,
                    }}>See all sources</button>
                  )}
                </div>
              ) : (
                <>
                  <Mascot state={mascot} />
                  <div style={{ marginBottom:12 }}><ProgressDots total={active.length} current={cardIdx} /></div>

                  {/* Source badges */}
                  <div style={{ display:"flex", gap:6, marginBottom:11, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20,
                      background:SrcColor(current?.source)+"18", color:SrcColor(current?.source),
                      border:`1px solid ${SrcColor(current?.source)}38` }}>
                      {current?.source||"AI Tutor"}
                    </span>
                    {isPriority && (
                      <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20,
                        background:T.redBg, color:T.red, border:`1px solid ${T.redBorder}` }}>
                        🔥 Repeated
                      </span>
                    )}
                    <span style={{ fontSize:10, color:T.mutedLight, marginLeft:"auto" }}>{current?.date}</span>
                  </div>

                  {/* THE CARD */}
                  <div ref={cardRef} style={{ position:"relative" }}>
                    {xpFloat && <XPFloat amount={xpFloat} onDone={()=>setXpFloat(null)} />}

                    <div className={`rv-card ${flipped ? "rv-pulse-ok" : "rv-pulse-err"}`}
                      onClick={()=>{ setFlipped(f=>!f); if(!flipped) setMascot("thinking"); }}
                      style={{
                        background:T.panel, backdropFilter:"blur(10px)",
                        border:`1.5px solid ${flipped ? T.greenBorder : T.redBorder}`,
                        borderRadius:22, minHeight:210,
                        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                        padding:"26px 22px", textAlign:"center", marginBottom:13,
                        position:"relative", overflow:"hidden",
                        boxShadow:`0 4px 20px ${flipped ? "rgba(22,163,74,0.1)" : "rgba(185,28,28,0.08)"}`,
                      }}>

                      {/* Subtle bg tint */}
                      <div style={{ position:"absolute", inset:0, borderRadius:22, pointerEvents:"none",
                        background: flipped
                          ? "radial-gradient(ellipse at 50% 90%, rgba(22,163,74,0.06), transparent 70%)"
                          : "radial-gradient(ellipse at 50% 90%, rgba(185,28,28,0.05), transparent 70%)",
                        transition:"background 0.4s",
                      }} />

                      {!flipped ? (
                        <div className="rv-flip" style={{ width:"100%" }}>
                          <div style={{ fontSize:10, fontWeight:700, color:T.red, textTransform:"uppercase", letterSpacing:1.5, marginBottom:13 }}>
                            {getCardFrontTitle(current)}
                          </div>
                          {/* Show the full question prominently */}
                          <div style={{ fontSize:"clamp(16px,3.5vw,22px)", fontWeight:800, fontFamily:"'Syne',sans-serif", color:T.text, lineHeight:1.3, marginBottom:10, wordBreak:"break-word", whiteSpace:"pre-line" }}>
                            {current?.explanation || `What does "${current?.corrected || ""}" mean?`}
                          </div>
                          {/* Show the German target word large */}
                          <div style={{ fontSize:"clamp(22px,4.5vw,32px)", fontWeight:900, color:T.pathDark, marginBottom:10 }}>
                            {current?.corrected || ""}
                          </div>
                          <div style={{ fontSize:12, color:T.red, marginBottom:14, fontWeight:600 }}>
                            ✗ You chose: <strong>"{current?.original || ""}"</strong>
                          </div>
                          <div style={{ fontSize:11, color:T.mutedLight, marginBottom:14 }}>Tap the card to see the correct answer</div>
                          {/* Speak the German word */}
                          <AudioBtn text={current?.corrected} langCode={langCode} size={44} playing={playing}
                            onPlay={()=>{ setPlaying(true); playWebSpeech(current?.corrected, langCode); setTimeout(()=>setPlaying(false),2000); }} />
                        </div>
                      ) : (
                        <div className="rv-flip" style={{ width:"100%" }}>
                          <div style={{ fontSize:10, fontWeight:700, color:T.green, textTransform:"uppercase", letterSpacing:1.5, marginBottom:13 }}>
                            ✓ Correct Answer
                          </div>
                          {/* Full explanation of what went wrong */}
                          <div style={{ fontSize:13, color:T.muted, lineHeight:1.6, marginBottom:8 }}>
                            {current?.explanation || `What does "${current?.corrected}" mean?`}
                          </div>
                          <div style={{ fontSize:"clamp(22px,4.5vw,32px)", fontWeight:900, fontFamily:"'Syne',sans-serif", color:T.green, lineHeight:1.2, marginBottom:10, wordBreak:"break-word" }}>
                            {current?.corrected}
                          </div>
                          {current?.original && (
                            <div style={{ fontSize:13, color:T.red, lineHeight:1.6, marginBottom:10, padding:"8px 12px", background:T.redBg, borderRadius:10, border:`1px solid ${T.redBorder}` }}>
                              You chose <strong>"{current.original}"</strong> — that is incorrect.
                            </div>
                          )}
                          {current?.explanation && (
                            <div style={{ fontSize:12, color:T.muted, lineHeight:1.6, marginBottom:14, fontStyle:"italic" }}>
                              💡 {current.explanation}
                            </div>
                          )}
                          <AudioBtn text={current?.corrected} langCode={langCode} size={44} playing={playing} onPlay={handleListen} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div style={{ display:"flex", gap:9, marginBottom:11 }}>
                    <button className="rv-btn" onClick={handleSkip} style={{
                      flex:1, padding:"13px 6px", borderRadius:14, fontSize:13, fontWeight:700,
                      background:"rgba(74,40,0,0.06)", border:`1px solid rgba(74,40,0,0.12)`, color:T.muted,
                    }}>➡️ Skip</button>

                    <button className="rv-btn" onClick={handleMastered} style={{
                      flex:1.4, padding:"13px 6px", borderRadius:14, fontSize:13, fontWeight:800,
                      background:T.greenBg, border:`1.5px solid ${T.greenBorder}`, color:T.green,
                      boxShadow:"0 0 14px rgba(22,163,74,0.08)",
                    }}>✅ Mastered</button>
                  </div>

                  {/* Nav row */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                    <button className="rv-btn" onClick={goPrev} disabled={cardIdx===0} style={{
                      padding:"8px 15px", borderRadius:10, fontSize:12,
                      background:T.chip, border:`1px solid ${T.panelBorder}`,
                      color:cardIdx===0?T.mutedLight:T.pathDark, fontWeight:700,
                    }}>← Prev</button>
                    <div style={{ fontSize:12, color:T.mutedLight }}>{cardIdx+1} / {active.length}</div>
                    <button className="rv-btn" onClick={goNext} disabled={cardIdx>=active.length-1} style={{
                      padding:"8px 15px", borderRadius:10, fontSize:12,
                      background:T.chip, border:`1px solid ${T.panelBorder}`,
                      color:cardIdx>=active.length-1?T.mutedLight:T.pathDark, fontWeight:700,
                    }}>Next →</button>
                  </div>

                  <button className="rv-btn" onClick={()=>{ if(window.confirm(`Clear all mistakes for ${langName}?`)) { saveMistakes(userId,langCode,[]); setMistakes([]); setDismissed({}); }}} style={{
                    width:"100%", padding:"10px", background:"transparent",
                    border:`1px solid rgba(74,40,0,0.1)`, borderRadius:12,
                    color:T.mutedLight, fontSize:12,
                  }}>🗑 Clear all mistake history</button>
                </>
              )}
            </div>
          );
        })()}

        {/* ── DICTIONARY ───────────────────────────────────────────────── */}
        {view==="dictionary" && (
          <div className="rv-fade">
            <div style={{ fontSize:13, color:T.muted, marginBottom:14 }}>
              Look up any word or phrase in {langName} or English.
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:18 }}>
              <input value={dictInput} onChange={e=>setDictInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&lookupDict()}
                placeholder={`Search in ${langName} or English…`}
                className="rv-input"
                style={{
                  flex:1, background:T.inputBg, border:`1.5px solid ${T.panelBorder}`,
                  borderRadius:14, padding:"12px 15px", color:T.text, fontSize:14,
                  fontFamily:"inherit", transition:"all 0.2s", boxShadow:"0 2px 8px rgba(245,165,36,0.08)",
                }}
              />
              <button className="rv-btn" onClick={()=>lookupDict()} disabled={dictLoading} style={{
                padding:"12px 17px", background:T.path, border:"none", borderRadius:14,
                color:"#fff", fontWeight:800, fontSize:13, flexShrink:0,
                boxShadow:"0 3px 12px rgba(245,165,36,0.3)",
              }}>{dictLoading?"…":"Search"}</button>
            </div>

            {/* Quick pills */}
            {!dictResult && !dictLoading && (
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:10, color:T.mutedLight, textTransform:"uppercase", letterSpacing:1.5, marginBottom:9 }}>Quick Lookup</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {["Hello","Thank you","How much?","Where is...?","Please","Excuse me","I don't understand"].map(p=>(
                    <button key={p} className="rv-pill" onClick={()=>{ setDictInput(p); lookupDict(p); }} style={{
                      padding:"6px 13px", borderRadius:20, fontSize:12,
                      background:T.chip, border:`1px solid ${T.panelBorder}`, color:T.pathDark, fontWeight:600,
                    }}>{p}</button>
                  ))}
                </div>
              </div>
            )}

            {dictLoading && (
              <div style={{ textAlign:"center", padding:"40px 20px" }}>
                <div style={{ fontSize:34, marginBottom:12 }}>🔍</div>
                <div style={{ color:T.muted, fontSize:14 }}>Looking up…</div>
              </div>
            )}

            {dictResult && !dictLoading && (
              <div className="rv-flip" style={{
                background:T.panel, border:`1.5px solid ${T.panelBorder}`,
                borderRadius:22, padding:20,
                boxShadow:"0 4px 20px rgba(245,165,36,0.1)",
              }}>
                {/* Header */}
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:15 }}>
                  <div>
                    <div style={{ fontSize:24, fontWeight:900, fontFamily:"'Syne',sans-serif", color:T.pathDark, lineHeight:1 }}>{dictInput}</div>
                    {dictResult.partOfSpeech && <div style={{ fontSize:11, color:T.mutedLight, marginTop:3, fontStyle:"italic" }}>{dictResult.partOfSpeech}</div>}
                    {dictResult.pronunciation && <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>/{dictResult.pronunciation}/</div>}
                  </div>
                  <AudioBtn text={dictResult.translation} langCode={langCode} size={46} playing={playing}
                    onPlay={async()=>{ setPlaying(true); await playAudio(dictResult.translation,langCode); setTimeout(()=>setPlaying(false),2200); }} />
                </div>

                {/* Translation box */}
                <div style={{ padding:"13px 15px", borderRadius:14, marginBottom:14,
                  background:T.chip, border:`1px solid ${T.panelBorder}` }}>
                  <div style={{ fontSize:10, color:T.mutedLight, textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>Translation</div>
                  <div style={{ fontSize:19, fontWeight:800, color:T.text }}>{dictResult.translation}</div>
                </div>

                {/* Example */}
                {dictResult.example && (
                  <div style={{ marginBottom:13 }}>
                    <div style={{ fontSize:10, color:T.mutedLight, textTransform:"uppercase", letterSpacing:1, marginBottom:7 }}>Example</div>
                    <div style={{ fontSize:14, fontStyle:"italic", color:T.text, marginBottom:3 }}>"{dictResult.example}"</div>
                    {dictResult.exampleTranslation && <div style={{ fontSize:12, color:T.muted }}>"{dictResult.exampleTranslation}"</div>}
                    <button className="rv-btn" onClick={()=>playAudio(dictResult.example,langCode)} style={{
                      marginTop:8, padding:"5px 13px", background:T.chip,
                      border:`1px solid ${T.panelBorder}`, borderRadius:20, color:T.pathDark, fontSize:11, fontWeight:600,
                    }}>🔊 Hear example</button>
                  </div>
                )}

                {/* Notes */}
                {dictResult.notes && (
                  <div style={{ padding:"9px 13px", background:"rgba(245,165,36,0.06)", borderRadius:10,
                    borderLeft:`3px solid ${T.path}`, fontSize:13, color:T.muted, marginBottom:14 }}>
                    💡 {dictResult.notes}
                  </div>
                )}

                {/* Save */}
                <button className="rv-btn" onClick={()=>{
                  pushMistake(userId,langCode,dictInput.trim(),dictResult.translation,"Looked up in dictionary","Dictionary");
                  setMistakes(getMistakes(userId,langCode));
                  alert("Saved to flashcards! ✓");
                }} style={{
                  width:"100%", padding:"12px", borderRadius:13,
                  background:T.chip, border:`1px solid ${T.panelBorder}`,
                  color:T.pathDark, fontWeight:700, fontSize:13,
                }}>📌 Add to Flashcards</button>
              </div>
            )}
          </div>
        )}

        {/* ── VOCAB BOOK ──────────────────────────────────────────────── */}
        {view==="vocab" && (() => {
          const vocabBook = getVocabBook(userId, langCode);

          if (vocabBook.length === 0) return (
            <div className="rv-fade" style={{ textAlign:"center", padding:"60px 20px" }}>
              <div style={{ fontSize:60, marginBottom:16 }}>📚</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:T.text, marginBottom:8 }}>Your vocab book is empty</div>
              <div style={{ fontSize:14, color:T.muted, lineHeight:1.7, maxWidth:280, margin:"0 auto" }}>
                Complete lessons to fill your vocab book — every word you learn will be saved here for review.
              </div>
            </div>
          );

          return (
            <div className="rv-fade">
              <div style={{ fontSize:11, color:T.mutedLight, textTransform:"uppercase", letterSpacing:1.5, fontWeight:700, marginBottom:14 }}>
                {vocabBook.reduce((s,l)=>s+(l.words?.length||0),0)} words across {vocabBook.length} lesson{vocabBook.length!==1?"s":""}
              </div>
              {vocabBook.map((lesson, li) => (
                <VocabLessonCard key={lesson.moduleId||li} lesson={lesson} langCode={langCode} />
              ))}
            </div>
          );
        })()}

      </div>
    </div>
  );
}
