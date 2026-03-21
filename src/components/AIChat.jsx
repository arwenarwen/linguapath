import React, { useState, useEffect, useRef } from 'react';
import { tryPlayStaticAudio } from '../lib/staticAudio';
import { supabase, canUseAISession, startAISession, incrementAISessionMessage, incrementDailyAI } from '../lib/appState';
import { findPrerecordedAnswer, getTopicAnswer } from '../lib/prerecorded';

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a24;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --text: #f0f0f5;
    --muted: #6b6b80;
    --gold: #f5c842;
    --gold2: #e8a020;
    --green: #22c55e;
    --red: #ef4444;
    --blue: #38bdf8;
    --purple: #a78bfa;
    --orange: #fb923c;
    --font-display: 'Syne', sans-serif;
    --font-body: 'Lato', sans-serif;
    --radius: 14px;
    --radius-lg: 20px;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .app-root { min-height: 100vh; display: flex; flex-direction: column; max-width: 860px; margin: 0 auto; }

  /* Animations */
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
  @keyframes pop { 0%{transform:scale(0.85);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px #f5c84230} 50%{box-shadow:0 0 40px #f5c84260} }
  @keyframes streakBounce { 0%{transform:translateY(0) scale(1)} 40%{transform:translateY(-12px) scale(1.2)} 100%{transform:translateY(0) scale(1)} }
  @keyframes confetti-fall { 0%{transform:translateY(-20px) rotate(0)} 100%{transform:translateY(100vh) rotate(720deg); opacity:0} }
  @keyframes slide-in-right { from{transform:translateX(40px);opacity:0} to{transform:translateX(0);opacity:1} }

  .fade-up { animation: fadeUp 0.4s cubic-bezier(.16,1,.3,1) both; }
  .fade-in { animation: fadeIn 0.3s ease both; }
  .pop-in { animation: pop 0.35s cubic-bezier(.34,1.56,.64,1) both; }
  .slide-right { animation: slide-in-right 0.3s cubic-bezier(.16,1,.3,1) both; }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    border: none; cursor: pointer; font-family: var(--font-body); font-weight: 700;
    border-radius: var(--radius); transition: all 0.15s ease; user-select: none; }
  .btn:active { transform: scale(0.97); }
  .btn-gold { background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: #1a1000; padding: 14px 28px; font-size: 15px; letter-spacing: 0.5px;
    box-shadow: 0 4px 20px rgba(245,200,66,0.3); }
  .btn-gold:hover { box-shadow: 0 6px 28px rgba(245,200,66,0.5); transform: translateY(-1px); }
  .btn-ghost { background: var(--surface2); color: var(--text); padding: 12px 22px;
    font-size: 14px; border: 1px solid var(--border2); }
  .btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
  .btn-danger { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.3); padding: 10px 20px; font-size: 13px; }
  .btn-sm { padding: 8px 16px; font-size: 13px; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  /* Cards */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); }
  .card-hover { transition: all 0.2s ease; cursor: pointer; }
  .card-hover:hover { background: var(--surface2); border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); }

  /* Progress bar */
  .progress-bar { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }

  /* Chips */
  .chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px;
    border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
  .chip-a1 { background: rgba(34,197,94,0.15); color: var(--green); border: 1px solid rgba(34,197,94,0.3); }
  .chip-a2 { background: rgba(56,189,248,0.15); color: var(--blue); border: 1px solid rgba(56,189,248,0.3); }
  .chip-b1 { background: rgba(167,139,250,0.15); color: var(--purple); border: 1px solid rgba(167,139,250,0.3); }
  .chip-b2 { background: rgba(249,115,22,0.15); color: #f97316; border: 1px solid rgba(249,115,22,0.3); }
  .chip-c1 { background: rgba(236,72,153,0.15); color: #ec4899; border: 1px solid rgba(236,72,153,0.3); }
  .chip-c2 { background: rgba(245,200,66,0.15); color: #f5c842; border: 1px solid rgba(245,200,66,0.3); }

  /* Nav */
  .bottom-nav { display: flex; background: var(--surface); border-top: 1px solid var(--border);
    padding: 8px 0 4px; position: sticky; bottom: 0; z-index: 50; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 8px 4px; cursor: pointer; transition: all 0.15s; color: var(--muted); font-size: 10px;
    font-family: var(--font-body); font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; border: none; background: none; }
  .nav-item.active { color: var(--gold); }
  .nav-item:hover { color: var(--text); }
  .nav-icon { font-size: 20px; }

  /* AI Chat */
  .chat-bubble { max-width: 80%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.6; animation: chatFadeUp 0.3s both; }
  .chat-ai { background: var(--chat-ai-bg, rgba(255,255,255,0.06)); border: 1px solid var(--chat-border, rgba(255,255,255,0.1)); border-bottom-left-radius: 4px; color: var(--chat-text, #f8ead0); }
  .chat-user { background: var(--chat-user-bg, linear-gradient(135deg,#ffb84d,#f97316)); border-bottom-right-radius: 4px; align-self: flex-end; color: #fff; }

  /* Exercise */
  .choice-btn { width: 100%; padding: 14px 18px; background: var(--surface); border: 2px solid var(--border2);
    border-radius: var(--radius); color: var(--text); font-family: var(--font-body); font-size: 14px;
    text-align: left; cursor: pointer; transition: all 0.15s; font-weight: 400; }
  .choice-btn:hover:not(:disabled) { background: var(--surface2); border-color: rgba(255,255,255,0.25); }
  .choice-correct { background: rgba(34,197,94,0.15) !important; border-color: var(--green) !important; color: var(--green) !important; animation: pop 0.3s both; }
  .choice-wrong { background: rgba(239,68,68,0.1) !important; border-color: var(--red) !important; color: var(--red) !important; animation: shake 0.4s both; }

  /* Vocab card */
  .vocab-card { perspective: 1000px; }
  .vocab-inner { transition: transform 0.5s; transform-style: preserve-3d; position: relative; }
  .vocab-inner.flipped { transform: rotateY(180deg); }
  .vocab-face { backface-visibility: hidden; }
  .vocab-back { backface-visibility: hidden; transform: rotateY(180deg); }

  /* Tooltip */
  .tooltip { position: relative; }
  .tooltip-text { position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%);
    background: #1a1a2e; border: 1px solid var(--border2); border-radius: 8px; padding: 6px 10px;
    font-size: 12px; white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity 0.2s; z-index: 100; }
  .tooltip:hover .tooltip-text { opacity: 1; }

  /* Loader */
  .loader { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }

  /* Side Menu */
  @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  @keyframes slideOutLeft { from { transform: translateX(0); } to { transform: translateX(-100%); } }
  .side-menu { position: fixed; top: 0; left: 0; height: 100vh; width: 300px; max-width: 88vw;
    background: #0e0e16; border-right: 1px solid rgba(255,255,255,0.1);
    z-index: 200; display: flex; flex-direction: column; overflow: hidden;
    box-shadow: 8px 0 40px rgba(0,0,0,0.6); }
  .side-menu.open { animation: slideInLeft 0.28s cubic-bezier(.16,1,.3,1) both; }
  .side-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 199;
    backdrop-filter: blur(2px); animation: fadeIn 0.2s ease both; cursor: pointer; }
  .lang-pill { display: flex; align-items: center; gap: 10px; padding: 10px 14px;
    border-radius: 12px; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
  .lang-pill:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08); }
  .lang-pill.active { background: rgba(245,200,66,0.1); border-color: rgba(245,200,66,0.25); }
  .level-jump { display: flex; align-items: center; gap: 12px; padding: 11px 14px;
    border-radius: 12px; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
  .level-jump:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.07); }
  .menu-section { padding: 0 12px 12px; }
  .menu-section-title { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    color: #3d3d50; padding: 10px 14px 6px; }
  .menu-scroll { flex: 1; overflow-y: auto; }
  .menu-scroll::-webkit-scrollbar { width: 3px; }
  .menu-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); }
  .hamburger { display: flex; flex-direction: column; gap: 5px; cursor: pointer; padding: 6px;
    border-radius: 8px; transition: background 0.15s; background: none; border: none; }
  .hamburger:hover { background: rgba(255,255,255,0.08); }
  .hamburger span { display: block; width: 20px; height: 2px; background: var(--text); border-radius: 2px; transition: all 0.2s; }

/* mountain overrides placeholder */
`;

// ─────────────────────────────────────────────
// 20 LANGUAGES
// ─────────────────────────────────────────────
const LANGUAGES = [
  { code: "es", name: "Spanish",    native: "Español",   flag: "🇪🇸", region: "Romance",      status: "full", maxLevel: "C2" },
  { code: "zh", name: "Mandarin",   native: "普通话",     flag: "🇨🇳", region: "Sino-Tibetan", status: "full", maxLevel: "C2" },
  { code: "ja", name: "Japanese",   native: "日本語",     flag: "🇯🇵", region: "Japonic",      status: "full", maxLevel: "C2" },
  { code: "ko", name: "Korean",     native: "한국어",     flag: "🇰🇷", region: "Koreanic",     status: "full", maxLevel: "C2" },
  { code: "fr", name: "French",     native: "Français",  flag: "🇫🇷", region: "Romance",      status: "full", maxLevel: "B1" },
  { code: "de", name: "German",     native: "Deutsch",   flag: "🇩🇪", region: "Germanic",     status: "full", maxLevel: "B1" },
  { code: "it", name: "Italian",    native: "Italiano",  flag: "🇮🇹", region: "Romance",      status: "full", maxLevel: "B1" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇧🇷", region: "Romance",      status: "full", maxLevel: "B1" },
  { code: "pl", name: "Polish",     native: "Polski",    flag: "🇵🇱", region: "Slavic",       status: "full", maxLevel: "B1" },
  { code: "en", name: "English",    native: "English",   flag: "🇬🇧", region: "Germanic",     status: "full", maxLevel: "B1" },
  { code: "ar", name: "Arabic",     native: "العربية",   flag: "🇸🇦", region: "Semitic",      status: "soon" },
  { code: "ru", name: "Russian",    native: "Русский",   flag: "🇷🇺", region: "Slavic",       status: "soon" },
  { code: "hi", name: "Hindi",      native: "हिन्दी",    flag: "🇮🇳", region: "Indo-Aryan",   status: "soon" },
  { code: "tr", name: "Turkish",    native: "Türkçe",    flag: "🇹🇷", region: "Turkic",       status: "soon" },
  { code: "sv", name: "Swedish",    native: "Svenska",   flag: "🇸🇪", region: "Germanic",     status: "soon" },
];



const VISUAL_QUERY_MAP = {
  "calendar": "Calendar",
  "kalender": "Calendar",
  "calendario": "Calendar",
  "calendrier": "Calendar",
  "bus": "Bus",
  "hotel": "Hotel",
  "server": "Waiter",
  "waiter": "Waiter",
  "waitress": "Waitress",
  "station": "Railway station",
  "bahnhof": "Railway station",
  "u-bahn": "Rapid transit",
  "airport": "Airport",
  "museum": "Museum",
  "bank": "Bank",
  "pharmacy": "Pharmacy",
  "supermarket": "Supermarket",
  "park": "Park",
  "hospital": "Hospital",
  "bridge": "Bridge",
  "ticket": "Ticket",
  "fahrkarte": "Ticket",
  "billet": "Ticket",
  "billete": "Ticket",
  "biglietto": "Ticket",
  "车票": "Ticket",
  "passport": "Passport",
  "menu": "Menu",
  "restaurant": "Restaurant",
  "coffee": "Coffee",
  "tea": "Tea",
  "bread": "Bread",
  "rice": "Rice",
  "soup": "Soup",
  "salad": "Salad",
  "apple": "Apple",
  "cheese": "Cheese",
  "shirt": "Shirt",
  "pants": "Trousers",
  "trousers": "Trousers",
  "hose": "Trousers",
  "shoes": "Shoes",
  "dress": "Dress",
  "jacket": "Jacket",
  "bag": "Bag",
  "gift": "Gift",
  "souvenir": "Souvenir",
  "postcard": "Postcard",
  "flowers": "Flowers",
  "book": "Book",
  "perfume": "Perfume",
  "toy": "Toy",
  "mother": "Mother",
  "father": "Father",
  "brother": "Brother",
  "sister": "Sister",
  "tram": "Tram",
  "subway": "Rapid transit",
  "taxi": "Taxi",
  "bicycle": "Bicycle",
  "car": "Car",
  "airplane": "Airplane",
  "train": "Train",
  "zug": "Train",
  "map": "Map",
  "umbrella": "Umbrella",
  "clock": "Clock",
  "breakfast": "Breakfast",
  "dinner": "Dinner",
  "phone": "Mobile phone",
  "water": "Water",
  "fahrplan": "Timetable"
};

const NUMBER_VALUE_MAP = {
  "0": 0, "zero": 0, "null": 0, "cero": 0, "zéro": 0, "零": 0,
  "1": 1, "one": 1, "eins": 1, "uno": 1, "un": 1, "une": 1, "一": 1,
  "2": 2, "two": 2, "zwei": 2, "dos": 2, "deux": 2, "due": 2, "二": 2,
  "3": 3, "three": 3, "drei": 3, "tres": 3, "trois": 3, "tre": 3, "三": 3,
  "4": 4, "four": 4, "vier": 4, "cuatro": 4, "quatre": 4, "quattro": 4, "四": 4,
  "5": 5, "five": 5, "fünf": 5, "cinco": 5, "cinq": 5, "cinque": 5, "五": 5,
  "6": 6, "six": 6, "sechs": 6, "seis": 6, "sei": 6, "六": 6,
  "7": 7, "seven": 7, "sieben": 7, "siete": 7, "sept": 7, "sette": 7, "七": 7,
  "8": 8, "eight": 8, "acht": 8, "ocho": 8, "huit": 8, "otto": 8, "八": 8,
  "9": 9, "nine": 9, "neun": 9, "nueve": 9, "neuf": 9, "nove": 9, "九": 9,
  "10": 10, "ten": 10, "zehn": 10, "diez": 10, "dix": 10, "dieci": 10, "十": 10
};



function getNumberValue(source, langCode = "en") {
  if (!source) return null;
  if (typeof source === "object") {
    const choices = [source[langCode], source.en, source.word, source.target, source.corrected, source.original].filter(Boolean);
    for (const choice of choices) {
      const n = getNumberValue(choice, langCode);
      if (n !== null) return n;
    }
    return null;
  }
  const raw = String(source).trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(NUMBER_VALUE_MAP, raw) ? NUMBER_VALUE_MAP[raw] : null;
}

function renderFingerString(num) {
  const map = {0:"✊",1:"☝️",2:"✌️",3:"☝️☝️☝️",4:"☝️☝️☝️☝️",5:"🖐️",6:"🖐️☝️",7:"🖐️✌️",8:"🖐️☝️☝️☝️",9:"🖐️☝️☝️☝️☝️",10:"🖐️🖐️"};
  return map[num] || null;
}

function NumberVisual({ source, langCode = "en" }) {
  const value = getNumberValue(source, langCode);
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
const _LANG_BCP47 = {
  es:"es-ES", fr:"fr-FR", de:"de-DE", it:"it-IT", pt:"pt-PT",
  zh:"zh-CN", ja:"ja-JP", ko:"ko-KR", pl:"pl-PL", en:"en-US"
};
let _currentAudioLang = "es";
let _activeHtmlAudio = null;
let _speechTimeouts = [];
let _ttsAbortController = null;
function setAudioLang(code) { _currentAudioLang = code || "es"; }

function stopAllAudio() {
  // Cancel any in-flight TTS fetch immediately
  try {
    if (_ttsAbortController) {
      _ttsAbortController.abort();
      _ttsAbortController = null;
    }
  } catch (e) {}
  try {
    _speechTimeouts.forEach(id => clearTimeout(id));
    _speechTimeouts = [];
  } catch (e) {}
  try {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch (e) {}
  try {
    if (_activeHtmlAudio) {
      _activeHtmlAudio.pause();
      _activeHtmlAudio.currentTime = 0;
      _activeHtmlAudio.src = "";
      _activeHtmlAudio = null;
    }
  } catch (e) {}
}

function queueSpeech(fn, delay = 0) {
  const id = setTimeout(() => {
    _speechTimeouts = _speechTimeouts.filter(x => x !== id);
    fn();
  }, delay);
  _speechTimeouts.push(id);
  return id;
}

function normalizeTextForSpeech(rawText, langCode = _currentAudioLang) {
  if (!rawText) return "";
  let text = String(rawText);

  const ordinalMap = {
    en: {1:"first",2:"second",3:"third",4:"fourth",5:"fifth",6:"sixth",7:"seventh",8:"eighth",9:"ninth",10:"tenth"},
    de: {1:"erstens",2:"zweitens",3:"drittens",4:"viertens",5:"fünftens",6:"sechstens",7:"siebtens",8:"achtens",9:"neuntens",10:"zehntens"},
    zh: {1:"第一",2:"第二",3:"第三",4:"第四",5:"第五",6:"第六",7:"第七",8:"第八",9:"第九",10:"第十"}
  };
  const ords = ordinalMap[langCode] || ordinalMap.en;

  text = text
    .replace(/⚠️ CORRECTION:[^\n]*/g, "")
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/[_~`]/g, "");

  text = text
    .replace(/Question\s+(\d+)\s*\/\s*(\d+)\s*:/gi, "Question $1 out of $2. ")
    .replace(/Question\s+(\d+)\s*\/\s*(\d+)/gi, "Question $1 out of $2")
    .replace(/\bQ(\d+)\s*-\s*Q(\d+)\b/g, "Questions $1 to $2")
    .replace(/\bQ(\d+)\b/g, "Question $1");

  text = text
    .replace(/^\s*(\d+)\)\s+/gm, "Option $1. ")
    .replace(/^\s*([A-D])\)\s+/gm, "Option $1. ")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/^\s*(\d{1,2})\.\s+/gm, (_, n) => `${ords[Number(n)] || n}. `);

  text = text
    .replace(/\s*→\s*/g, " to ")
    .replace(/\s*\|\s*/g, ". ")
    .replace(/\s*\/\s*/g, " slash ")
    .replace(/\s*&\s*/g, " and ")
    .replace(/\bvs\.\b/gi, "versus")
    .replace(/[📊⭐⚡✅❌⚠️•]/g, " ")
    .replace(/[:;]\s*$/gm, ".")
    .replace(/\s{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();

  text = text.replace(/\b(Why|Hint|Better sentence|Key change|Now you try|Translation|Flow)\s*:/gi, "$1. ");

  return text.slice(0, 900);
}


function getTutorVoiceId(langCode) {
  const VOICES = {
    de: "kUqnjA18C6ISqjtKOpsJ",  // German man
    es: "zdzXtQ5BTOYMDG04sR8R",  // Spanish man
    it: "BUAZlX1JYGONhOQdurfl",  // Italian man
    fr: "ttrVUBHgC9AEENt2kGi6",  // French man
    zh: "RrYpxumYIVoc5NKCTGOg",  // Chinese man
    ko: "FNrsMcVkTfKeSyL1UYXS",  // Korean man
    ja: "9XG6vvb5sQYWawDizIlo",  // Japanese man
    ru: "1iQuCymkuonZDnoteVZT",  // Russian man
    el: "8C0RosTo9KZhAz8UmM7c",  // Greek man
    pt: "CImjz27snHwe55ik6hke",  // Portuguese man
  };
  return VOICES[langCode] || null;
}

function getLessonWordText(word, langCode = _currentAudioLang) {
  if (!word || typeof word !== "object") return "";
  const preferredKeys = [langCode, "es", "de", "fr", "it", "pt", "zh", "ja", "ko", "pl", "en"];
  for (const key of preferredKeys) {
    if (typeof word[key] === "string" && word[key].trim()) return word[key];
  }
  for (const [k, v] of Object.entries(word)) {
    if (!["en", "phonetic", "example"].includes(k) && typeof v === "string" && v.trim()) return v;
  }
  return word.word || word.target || "";
}


async function playWordAudio(text, langCode, opts = {}) {
  if (!text || typeof window === "undefined") return;
  const resolvedLang = langCode || _currentAudioLang || "en";

  try {
    const usedStatic = await tryPlayStaticAudio({
      text,
      langCode: resolvedLang,
      stopAllAudio,
      setActiveAudio: (audio) => { _activeHtmlAudio = audio; }
    });

    if (usedStatic) return;

    stopAllAudio();

    // Create a new abort controller for this TTS request
    _ttsAbortController = new AbortController();
    const signal = _ttsAbortController.signal;

    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        text: normalizeTextForSpeech(text, resolvedLang),
        langCode: resolvedLang,
        ...(opts.voiceId ? { voiceId: opts.voiceId } : {})
      })
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      let message = errText || `TTS HTTP ${res.status}`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed?.error) message = parsed.error;
      } catch {}
      throw new Error(message);
    }

    const blob = await res.blob();
    if (!blob || blob.size === 0) throw new Error("Empty audio response");

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.preload = "auto";
    _activeHtmlAudio = audio;

    audio.onended = () => {
      try { URL.revokeObjectURL(url); } catch(e) {}
      if (_activeHtmlAudio === audio) _activeHtmlAudio = null;
    };
    audio.onerror = () => {
      try { URL.revokeObjectURL(url); } catch(e) {}
      if (_activeHtmlAudio === audio) _activeHtmlAudio = null;
    };

    await audio.play();
  } catch (e) {
    // Ignore abort errors — these are intentional (user exited)
    if (e?.name === "AbortError") return;
    console.error("[TTS] Static/ElevenLabs playWordAudio failed:", e);
    if (typeof window !== "undefined") {
      window.__LP_LAST_TTS_ERROR__ = String(e?.message || e || "Unknown TTS error");
    }
  }
}

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
function isRealReviewMistake(m) {
  const text = `${m?.original || ""} ${m?.corrected || ""}`.toLowerCase();
  if (!text.trim()) return false;
  const banned = [
    "goal of this speaking task",
    "best strategy after a mistake",
    "choose the best word to complete a sentence about",
    "switch to another language",
    "avoid complete sentences",
    "use only one word",
    "repeat and correct it",
    "skip dialogue",
  ];
  return !banned.some((b) => text.includes(b));
}

function getMistakes(userId, langCode) {
  try {
    const globalList = JSON.parse(localStorage.getItem(`lp_mistakes_global_${langCode}`) || "[]");
    const scopedList = userId ? JSON.parse(localStorage.getItem(`lp_mistakes_${userId}_${langCode}`) || "[]") : [];
    const merged = [...globalList, ...scopedList].filter(isRealReviewMistake);
    const seen = new Set();
    return merged.filter((m) => {
      const key = `${m.original}→${m.corrected}→${m.source || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return [];
  }
}
function saveMistakes(userId, langCode, list) {
  try {
    const clean = (list || []).filter(isRealReviewMistake);
    localStorage.setItem(`lp_mistakes_global_${langCode}`, JSON.stringify(clean));
    if (userId) localStorage.setItem(`lp_mistakes_${userId}_${langCode}`, JSON.stringify(clean));
  } catch {}
}
function pushMistake(userId, langCode, original, corrected, explanation, source) {
  if (!original || !corrected || original.trim() === corrected.trim()) return;
  const list = getMistakes(userId, langCode);
  // Deduplicate: skip if same original+corrected already in last 10
  if (list.slice(0,10).some(m => m.original === original.trim() && m.corrected === corrected.trim())) return;
  list.unshift({ id: Date.now(), original: original.trim(), corrected: corrected.trim(), explanation, source: source || "AI Tutor", date: new Date().toISOString().slice(0,10) });
  saveMistakes(userId, langCode, list.slice(0, 500));
}

// Push a vocab/lesson mistake (wrong answer in exercise)
function pushLessonMistake(userId, langCode, question, correctAnswer, lessonTitle) {
  if (!question || !correctAnswer) return;
  const list = getMistakes(userId, langCode);
  list.unshift({ id: Date.now(), original: question, corrected: correctAnswer, explanation: "Correct answer from lesson exercise", source: "Lesson: " + (lessonTitle || "Practice"), date: new Date().toISOString().slice(0,10), isLesson: true });
  saveMistakes(userId, langCode, list.slice(0, 500));
}

// ── XP helpers ────────────────────────────────────────────────────────────────
function getWeekKey() {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}
function getWeekEnd() {
  const now = new Date();
  const daysUntilSun = now.getDay() === 0 ? 7 : 7 - now.getDay();
  const end = new Date(now);
  end.setDate(now.getDate() + daysUntilSun);
  end.setHours(23, 59, 59, 0);
  return end;
}
function formatTimeLeft(endDate) {
  const ms = endDate - new Date();
  if (ms <= 0) return "Ended";
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h ${mins}m left`;
}
function getChallengeData(userId) {
  try {
    const raw = localStorage.getItem(`lp_challenge_${userId}`);
    if (!raw) return { weekKey: getWeekKey(), weekXP: 0, totalXP: 0, badges: [], wins: 0, friends: [] };
    const d = JSON.parse(raw);
    if (d.weekKey !== getWeekKey()) { d.weekKey = getWeekKey(); d.weekXP = 0; }
    return d;
  } catch { return { weekKey: getWeekKey(), weekXP: 0, totalXP: 0, badges: [], wins: 0, friends: [] }; }
}
function saveChallengeData(userId, data) {
  try { localStorage.setItem(`lp_challenge_${userId}`, JSON.stringify(data)); } catch {}
}
function awardChallengeXP(userId, amount) {
  if (!userId || !amount) return;
  const d = getChallengeData(userId);
  d.weekXP = (d.weekXP || 0) + amount;
  d.totalXP = (d.totalXP || 0) + amount;
  const newBadges = [];
  if (d.totalXP >= 1000 && !d.badges?.includes("xp-1k")) { d.badges = [...(d.badges||[]), "xp-1k"]; newBadges.push("xp-1k"); }
  if (d.totalXP >= 5000 && !d.badges?.includes("xp-5k")) { d.badges = [...(d.badges||[]), "xp-5k"]; newBadges.push("xp-5k"); }
  saveChallengeData(userId, d);
  return newBadges;
}

// ── Language config for AI chat ───────────────────────────────────────────────
function getAIChatLangConfig(langCode) {
  const configs = {
    es: { name:"Spanish",    placeholder:"Escribe en español...",       tip:"Speak only in Spanish. The AI will correct mistakes naturally.",    fallback:"Lo siento, hay un problema técnico. ¡Intenta de nuevo!" },
    fr: { name:"French",     placeholder:"Écris en français...",         tip:"Speak only in French. The AI will correct mistakes naturally.",     fallback:"Désolé, il y a un problème technique. Réessaie !" },
    de: { name:"German",     placeholder:"Schreib auf Deutsch...",       tip:"Speak only in German. The AI will correct mistakes naturally.",     fallback:"Entschuldigung, technisches Problem. Bitte versuche es erneut!" },
    it: { name:"Italian",    placeholder:"Scrivi in italiano...",        tip:"Speak only in Italian. The AI will correct mistakes naturally.",    fallback:"Scusa, problema tecnico. Riprova!" },
    pt: { name:"Portuguese", placeholder:"Escreve em português...",      tip:"Speak only in Portuguese. The AI will correct mistakes naturally.", fallback:"Desculpe, há um problema técnico. Tente de novo!" },
    zh: { name:"Chinese",    placeholder:"用中文输入...",                tip:"Speak only in Chinese. The AI will correct mistakes naturally.",    fallback:"抱歉，出现技术问题，请重试！" },
    ja: { name:"Japanese",   placeholder:"日本語で入力してください...",  tip:"Speak only in Japanese. The AI will correct mistakes naturally.",   fallback:"申し訳ありません、技術的な問題があります。もう一度お試しください。" },
    ko: { name:"Korean",     placeholder:"한국어로 입력하세요...",        tip:"Speak only in Korean. The AI will correct mistakes naturally.",     fallback:"죄송합니다, 기술적인 문제가 있습니다. 다시 시도해 주세요." },
    pl: { name:"Polish",     placeholder:"Pisz po polsku...",            tip:"Speak only in Polish. The AI will correct mistakes naturally.",     fallback:"Przepraszam, problem techniczny. Spróbuj ponownie!" },
    en: { name:"English",    placeholder:"Write in English...",          tip:"Speak only in English. The AI will correct mistakes naturally.",    fallback:"Sorry, there's a technical issue. Please try again!" },
  };
  return configs[langCode] || configs.en;
}

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


async function loadLocalExamBank(langCode, level) {
  const bankNameMap = { de: "German" };
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

function formatLocalExamQuestion(question, total = 20, index = null) {
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

function buildExamSpeechText(question, index = 1, total = 20, langCode = "de") {
  if (!question) return "";
  const raw = String(question.question || "").trim();
  if (langCode === "de") {
    const m = raw.match(/['“"]([^'”"]+)['”"]/);
    const term = m?.[1];
    if (term) return `Frage ${index}. Was bedeutet ${term}?`;
  }
  return `Question ${index}. ${raw}`;
}

/**
 * Play exam question audio — static first, live TTS fallback.
 * - listen questions: plays the German phrase from public/audio/de/
 * - all others: plays public/audio/exam/de/<LEVEL>_<ID>.mp3
 * @param {object} question  - exam bank question object
 * @param {string} level     - CEFR level e.g. "A1"
 * @param {string} langCode  - language code e.g. "de"
 * @param {number} qIndex    - 1-based index for TTS fallback
 * @param {number} total     - total question count for TTS fallback
 */
async function playExamQuestionAudio(question, level, langCode, qIndex = 1, total = 25) {
  if (!question) return;
  stopAllAudio();

  // ── 1. "Question N." number clip — per-language voice, falls back to shared Rachel clips ──
  const numUrl = `/audio/exam/${langCode}/numbers/${qIndex}.mp3`;
  try {
    const nr = await fetch(numUrl, { method: "HEAD", cache: "force-cache" });
    if (nr.ok) {
      const numAudio = new Audio(numUrl);
      numAudio.preload = "auto";
      await numAudio.play().catch(() => {});
      await new Promise(res => { numAudio.onended = res; setTimeout(res, 2000); });
      await new Promise(res => setTimeout(res, 120)); // tiny gap before question
    }
  } catch {}

  // ── 2. Question content ───────────────────────────────────────────────────
  // LISTEN questions: try pre-generated exam audio first, then static vocab audio, then TTS
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
    // Fallback: static vocab audio (e.g. public/audio/de/<slug>.mp3 for German)
    const played = await tryPlayStaticAudio({ text: question.audio, langCode, stopAllAudio });
    if (!played) playWordAudio(question.audio, langCode, { voiceId: getTutorVoiceId(langCode) });
    return;
  }

  // All other questions: try the pre-generated exam audio file
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

  // TTS fallback
  playWordAudio(buildExamSpeechText(question, qIndex, total, langCode), langCode, { voiceId: getTutorVoiceId(langCode) });
}

/**
 * Play exam feedback then (optionally) the next question after a short pause.
 *
 * Correct:  /audio/<lang>/richtig.mp3  (or /audio/de/richtig.mp3 as fallback)
 * Wrong:    /audio/exam/<lang>/<LEVEL>_<ID>_wrong.mp3
 *           Falls back to /audio/<lang>/falsch.mp3 → /audio/de/falsch.mp3.
 *
 * After feedback finishes, chains the next question audio automatically.
 */
async function playExamFeedbackAndNext(isCorrect, currentQuestion, nextQuestion, level, langCode, nextIndex, total) {
  // ── 1. Pick feedback URL ───────────────────────────────────────────────────
  let feedbackUrl;
  if (isCorrect) {
    // Try language-specific "correct" clip, fall back to German
    const correctUrl = `/audio/${langCode}/richtig.mp3`;
    try {
      const r = await fetch(correctUrl, { method: "HEAD", cache: "force-cache" });
      feedbackUrl = r.ok ? correctUrl : "/audio/de/richtig.mp3";
    } catch {
      feedbackUrl = "/audio/de/richtig.mp3";
    }
  } else {
    // Try per-question wrong clip first, then language generic, then German generic
    const perQWrong = `/audio/exam/${langCode}/${level}_${currentQuestion?.id}_wrong.mp3`;
    try {
      const r = await fetch(perQWrong, { method: "HEAD", cache: "force-cache" });
      if (r.ok) { feedbackUrl = perQWrong; }
      else {
        const genericWrong = `/audio/${langCode}/falsch.mp3`;
        const r2 = await fetch(genericWrong, { method: "HEAD", cache: "force-cache" });
        feedbackUrl = r2.ok ? genericWrong : "/audio/de/falsch.mp3";
      }
    } catch {
      feedbackUrl = "/audio/de/falsch.mp3";
    }
  }

  // ── 2. Play feedback, wait for it to finish ────────────────────────────────
  try {
    const r = await fetch(feedbackUrl, { method: "HEAD", cache: "force-cache" });
    if (r.ok) {
      stopAllAudio();
      const fb = new Audio(feedbackUrl);
      fb.preload = "auto";
      await fb.play().catch(() => {});
      await new Promise(res => { fb.onended = res; setTimeout(res, 3500); }); // safety cap
    } else {
      const fallbackText = isCorrect
        ? "Richtig."
        : `Falsch. Die richtige Antwort ist: ${currentQuestion?.correct_answer || ""}.`;
      playWordAudio(fallbackText, langCode, { voiceId: getTutorVoiceId(langCode) });
      await new Promise(res => setTimeout(res, 2000));
    }
  } catch {
    await new Promise(res => setTimeout(res, 1500));
  }

  // ── 3. Brief pause then play the next question ─────────────────────────────
  if (nextQuestion) {
    await new Promise(res => setTimeout(res, 350));
    playExamQuestionAudio(nextQuestion, level, langCode, nextIndex, total);
  }
}

function extractOptionChoice(userText, options = []) {
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

function buildLocalExamReport(examBank, score) {
  const total = examBank?.questions?.length || 20;
  const verdict =
    score >= Math.ceil(total * 0.8)
      ? "Ready"
      : score >= Math.ceil(total * 0.6)
      ? "Nearly Ready"
      : "Needs More Practice";

  return [
    "📊 EXAM REPORT",
    "━━━━━━━━━━━━━━",
    `Total Score: ${score}/${total}`,
    `Verdict: ${verdict}`,
    "Top areas to improve: Vocabulary precision, grammar control, and reading accuracy.",
    "Keep going — you're making good progress."
  ].join("\n");
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
function parseMistakes(reply) {
  const regex = /⚠️ CORRECTION:\s*"([^"]+)"\s*→\s*"([^"]+)"\s*\|\s*([^\n]+)/g;
  const out = [];
  let m;
  while ((m = regex.exec(reply)) !== null) {
    out.push({ original: m[1].trim(), corrected: m[2].trim(), explanation: m[3].trim() });
  }
  return out;
}

function normalizeTutorSpeechText(text, langCode = "en") {
  if (!text) return "";
  let out = String(text);

  const ordinalMap = {
    en: {1:"first",2:"second",3:"third",4:"fourth",5:"fifth",6:"sixth",7:"seventh",8:"eighth",9:"ninth",10:"tenth"},
    de: {1:"erstens",2:"zweitens",3:"drittens",4:"viertens",5:"fünftens",6:"sechstens",7:"siebtens",8:"achtens",9:"neuntens",10:"zehntens"},
    zh: {1:"第一",2:"第二",3:"第三",4:"第四",5:"第五",6:"第六",7:"第七",8:"第八",9:"第九",10:"第十"}
  };
  const ords = ordinalMap[langCode] || ordinalMap.en;

  // Make exam counters sound natural
  out = out.replace(/Question\s+(\d+)\s*\/\s*(\d+)/gi, (_, a, b) => `Question ${a} out of ${b}`);
  out = out.replace(/Questions\s+(\d+)\s*-\s*(\d+)/gi, (_, a, b) => `Questions ${a} to ${b}`);

  // Numbered lists at the start of lines: 1. / 2. / 3)
  out = out.replace(/(^|\n)\s*(\d{1,2})[\.)]\s+/g, (m, prefix, n) => {
    const num = Number(n);
    const word = ords[num] || `${n}.`;
    return `${prefix}${word}: `;
  });

  // Option labels
  out = out.replace(/(^|\n)\s*([A-D])[\)]\s+/g, (_, prefix, letter) => `${prefix}Option ${letter}. `);

  // Clean symbols so TTS doesn't read them awkwardly
  out = out
    .replace(/→/g, " to ")
    .replace(/\|/g, ". ")
    .replace(/…/g, " ... ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return out;
}

// ── Main AIChat component ─────────────────────────────────────────────────────


const SITUATIONS = [
  { id:"restaurant",    title:"Restaurant",          icon:"🍽️", color:"#f97316", desc:"Order food, ask for the bill, handle dietary needs", aiRole:"waiter",
    quickPhrases:[
      { en:"A table for two, please", es:"Una mesa para dos, por favor", fr:"Une table pour deux", de:"Einen Tisch für zwei, bitte", it:"Un tavolo per due", pt:"Uma mesa para dois", zh:"两位，请。", ja:"二人です。", ko:"두 명이요.", pl:"Stolik dla dwóch" },
      { en:"The menu, please", es:"La carta, por favor", fr:"La carte, s'il vous plaît", de:"Die Speisekarte, bitte", it:"Il menù, per favore", pt:"O cardápio, por favor", zh:"菜单，谢谢。", ja:"メニューをください。", ko:"메뉴 주세요.", pl:"Kartę dań, proszę" },
      { en:"The bill, please", es:"La cuenta, por favor", fr:"L'addition, s'il vous plaît", de:"Die Rechnung, bitte", it:"Il conto, per favore", pt:"A conta, por favor", zh:"买单，谢谢。", ja:"お会計をお願いします。", ko:"계산서 주세요.", pl:"Poproszę o rachunek" },
      { en:"What do you recommend?", es:"¿Qué recomienda?", fr:"Que recommandez-vous?", de:"Was empfehlen Sie?", it:"Cosa consiglia?", pt:"O que você recomenda?", zh:"你有什么推荐？", ja:"おすすめは何ですか？", ko:"추천해 주실 게 있나요?", pl:"Co poleca?" },
      { en:"I'm allergic to...", es:"Soy alérgico/a a...", fr:"Je suis allergique à...", de:"Ich bin allergisch gegen...", it:"Sono allergico a...", pt:"Sou alérgico a...", zh:"我对……过敏。", ja:"アレルギーがあります。", ko:"알레르기가 있어요.", pl:"Jestem uczulony na..." },
    ]},
  { id:"cafe", title:"Café", icon:"☕", color:"#a16207", desc:"Order coffee and pastries", aiRole:"barista",
    quickPhrases:[
      { en:"One coffee, please", es:"Un café, por favor", fr:"Un café, s'il vous plaît", de:"Einen Kaffee, bitte", it:"Un caffè, per favore", pt:"Um café, por favor", zh:"一杯咖啡，谢谢。", ja:"コーヒーを一つください。", ko:"커피 한 잔 주세요.", pl:"Jedną kawę, proszę" },
      { en:"To take away, please", es:"Para llevar", fr:"À emporter", de:"Zum Mitnehmen", it:"Da asporto", pt:"Para levar", zh:"打包，谢谢。", ja:"テイクアウトで。", ko:"포장이요.", pl:"Na wynos" },
      { en:"Do you have oat milk?", es:"¿Tienen leche de avena?", fr:"Vous avez du lait d'avoine?", de:"Haben Sie Hafermilch?", it:"Avete latte d'avena?", pt:"Tem leite de aveia?", zh:"有燕麦奶吗？", ja:"オーツミルクはありますか？", ko:"귀리 우유 있나요?", pl:"Czy macie mleko owsiane?" },
    ]},
  { id:"hotel", title:"Hotel", icon:"🏨", color:"#06b6d4", desc:"Check in, request amenities, handle problems", aiRole:"receptionist",
    quickPhrases:[
      { en:"I have a reservation", es:"Tengo una reserva", fr:"J'ai une réservation", de:"Ich habe eine Reservierung", it:"Ho una prenotazione", pt:"Tenho uma reserva", zh:"我有预订。", ja:"予約があります。", ko:"예약했어요.", pl:"Mam rezerwację" },
      { en:"What time is check-out?", es:"¿A qué hora es el check-out?", fr:"À quelle heure est le départ?", de:"Wann ist der Check-out?", it:"A che ora è il check-out?", pt:"Qual é o horário de check-out?", zh:"退房时间是几点？", ja:"チェックアウトは何時ですか？", ko:"체크아웃은 몇 시예요?", pl:"O której jest wymeldowanie?" },
      { en:"The key doesn't work", es:"La llave no funciona", fr:"La clé ne fonctionne pas", de:"Der Schlüssel funktioniert nicht", it:"La chiave non funziona", pt:"A chave não funciona", zh:"钥匙坏了。", ja:"鍵が壊れています。", ko:"키가 안 돼요.", pl:"Klucz nie działa" },
      { en:"The WiFi password, please", es:"La contraseña del wifi", fr:"Le mot de passe WiFi", de:"Das WLAN-Passwort", it:"La password del WiFi", pt:"A senha do WiFi", zh:"WiFi密码是多少？", ja:"Wi-Fiのパスワードは？", ko:"와이파이 비밀번호요.", pl:"Hasło do WiFi" },
    ]},
  { id:"airport", title:"Airport", icon:"✈️", color:"#8b5cf6", desc:"Check-in, boarding, lost luggage", aiRole:"airline staff",
    quickPhrases:[
      { en:"Where is the check-in desk?", es:"¿Dónde está el mostrador?", fr:"Où est le comptoir?", de:"Wo ist der Check-in-Schalter?", it:"Dov'è il banco del check-in?", pt:"Onde fica o balcão?", zh:"值机柜台在哪里？", ja:"チェックインカウンターは？", ko:"체크인 카운터가 어디예요?", pl:"Gdzie jest lada odpraw?" },
      { en:"I've lost my suitcase", es:"He perdido mi maleta", fr:"J'ai perdu ma valise", de:"Ich habe meinen Koffer verloren", it:"Ho perso la mia valigia", pt:"Perdi a minha mala", zh:"我的行李丢了。", ja:"スーツケースをなくしました。", ko:"가방을 잃어버렸어요.", pl:"Zgubiłem walizkę" },
      { en:"The flight is delayed", es:"El vuelo está retrasado", fr:"Le vol est retardé", de:"Der Flug hat Verspätung", it:"Il volo è in ritardo", pt:"O voo está atrasado", zh:"航班延误了。", ja:"フライトが遅延しています。", ko:"비행기가 지연됐어요.", pl:"Lot jest opóźniony" },
    ]},
  { id:"doctor", title:"Doctor", icon:"🏥", color:"#ef4444", desc:"Describe symptoms, get medical help", aiRole:"doctor",
    quickPhrases:[
      { en:"I need a doctor", es:"Necesito un médico", fr:"J'ai besoin d'un médecin", de:"Ich brauche einen Arzt", it:"Ho bisogno di un medico", pt:"Preciso de um médico", zh:"我需要看医生。", ja:"医者が必要です。", ko:"의사가 필요해요.", pl:"Potrzebuję lekarza" },
      { en:"My head hurts", es:"Me duele la cabeza", fr:"J'ai mal à la tête", de:"Ich habe Kopfschmerzen", it:"Ho mal di testa", pt:"Minha cabeça dói", zh:"我头疼。", ja:"頭が痛いです。", ko:"머리가 아파요.", pl:"Boli mnie głowa" },
      { en:"I have a fever", es:"Tengo fiebre", fr:"J'ai de la fièvre", de:"Ich habe Fieber", it:"Ho la febbre", pt:"Estou com febre", zh:"我发烧了。", ja:"熱があります。", ko:"열이 나요.", pl:"Mam gorączkę" },
      { en:"I'm allergic to penicillin", es:"Soy alérgico a la penicilina", fr:"Je suis allergique à la pénicilline", de:"Ich bin allergisch auf Penizillin", it:"Sono allergico alla penicillina", pt:"Sou alérgico à penicilina", zh:"我对青霉素过敏。", ja:"ペニシリンアレルギーです。", ko:"페니실린 알레르기가 있어요.", pl:"Jestem uczulony na penicylinę" },
    ]},
  { id:"pharmacy", title:"Pharmacy", icon:"💊", color:"#10b981", desc:"Buy medicine, ask about dosage", aiRole:"pharmacist",
    quickPhrases:[
      { en:"Do I need a prescription?", es:"¿Necesito receta?", fr:"Il me faut une ordonnance?", de:"Brauche ich ein Rezept?", it:"Ho bisogno di una ricetta?", pt:"Preciso de receita?", zh:"我需要处方吗？", ja:"処方箋が必要ですか？", ko:"처방전이 필요한가요?", pl:"Czy potrzebuję recepty?" },
      { en:"How many times a day?", es:"¿Cuántas veces al día?", fr:"Combien de fois par jour?", de:"Wie oft am Tag?", it:"Quante volte al giorno?", pt:"Quantas vezes por dia?", zh:"每天几次？", ja:"1日何回ですか？", ko:"하루에 몇 번이요?", pl:"Ile razy dziennie?" },
    ]},
  { id:"shopping", title:"Shopping", icon:"🛒", color:"#22c55e", desc:"Buy clothes, negotiate prices, returns", aiRole:"shop assistant",
    quickPhrases:[
      { en:"How much is this?", es:"¿Cuánto cuesta?", fr:"Combien ça coûte?", de:"Wie viel kostet das?", it:"Quanto costa?", pt:"Quanto custa?", zh:"这个多少钱？", ja:"いくらですか？", ko:"이거 얼마예요?", pl:"Ile to kosztuje?" },
      { en:"Can I try it on?", es:"¿Puedo probármelo?", fr:"Puis-je l'essayer?", de:"Kann ich das anprobieren?", it:"Posso provarlo?", pt:"Posso experimentar?", zh:"可以试穿吗？", ja:"試着できますか？", ko:"입어봐도 되나요?", pl:"Czy mogę to przymierzyć?" },
      { en:"Do you have a larger size?", es:"¿Lo tiene en talla más grande?", fr:"Vous l'avez en plus grand?", de:"Haben Sie das größer?", it:"Ce l'ha più grande?", pt:"Tem num tamanho maior?", zh:"有大一码的吗？", ja:"大きいサイズはありますか？", ko:"더 큰 사이즈 있나요?", pl:"Czy ma pan/pani w większym rozmiarze?" },
      { en:"Can I return this?", es:"¿Puedo devolverlo?", fr:"Puis-je le retourner?", de:"Kann ich das zurückgeben?", it:"Posso restituirlo?", pt:"Posso devolver?", zh:"可以退货吗？", ja:"返品できますか？", ko:"반품 가능한가요?", pl:"Czy mogę to zwrócić?" },
    ]},
  { id:"supermarket", title:"Supermarket", icon:"🏪", color:"#84cc16", desc:"Find products, checkout", aiRole:"store employee",
    quickPhrases:[
      { en:"Where is the bread?", es:"¿Dónde está el pan?", fr:"Où est le pain?", de:"Wo ist das Brot?", it:"Dov'è il pane?", pt:"Onde fica o pão?", zh:"面包在哪里？", ja:"パンはどこですか？", ko:"빵이 어디 있어요?", pl:"Gdzie jest chleb?" },
      { en:"Do you have this in stock?", es:"¿Tiene esto en stock?", fr:"Vous avez ça en stock?", de:"Ist das vorrätig?", it:"Ce l'avete?", pt:"Tem isso em estoque?", zh:"这个有货吗？", ja:"在庫はありますか？", ko:"재고 있나요?", pl:"Czy to jest w magazynie?" },
    ]},
  { id:"taxi", title:"Taxi & Transport", icon:"🚕", color:"#fbbf24", desc:"Taxis, buses, trains, directions", aiRole:"taxi driver",
    quickPhrases:[
      { en:"Take me to the airport", es:"Lléveme al aeropuerto", fr:"À l'aéroport, s'il vous plaît", de:"Zum Flughafen, bitte", it:"All'aeroporto, per favore", pt:"Para o aeroporto, por favor", zh:"去机场，谢谢。", ja:"空港までお願いします。", ko:"공항으로 가주세요.", pl:"Na lotnisko, proszę" },
      { en:"How much to the centre?", es:"¿Cuánto al centro?", fr:"Combien pour le centre?", de:"Was kostet es bis ins Zentrum?", it:"Quanto per il centro?", pt:"Quanto para o centro?", zh:"去市中心多少钱？", ja:"中心部までいくらですか？", ko:"시내까지 얼마예요?", pl:"Ile do centrum?" },
      { en:"Stop here, please", es:"Pare aquí, por favor", fr:"Arrêtez-vous ici", de:"Halten Sie hier an", it:"Si fermi qui", pt:"Pare aqui", zh:"在这里停。", ja:"ここで止めてください。", ko:"여기서 세워주세요.", pl:"Proszę tu się zatrzymać" },
    ]},
  { id:"making-friends", title:"Meeting People", icon:"🤝", color:"#f472b6", desc:"Introductions, small talk, making friends", aiRole:"new friend",
    quickPhrases:[
      { en:"What's your name?", es:"¿Cómo te llamas?", fr:"Comment tu t'appelles?", de:"Wie heißt du?", it:"Come ti chiami?", pt:"Como você se chama?", zh:"你叫什么名字？", ja:"お名前は？", ko:"이름이 뭐예요?", pl:"Jak masz na imię?" },
      { en:"Where are you from?", es:"¿De dónde eres?", fr:"Tu es d'où?", de:"Woher kommst du?", it:"Di dove sei?", pt:"De onde você é?", zh:"你是哪里人？", ja:"どこの出身ですか？", ko:"어디서 왔어요?", pl:"Skąd jesteś?" },
      { en:"Nice to meet you!", es:"¡Encantado!", fr:"Enchanté(e)!", de:"Schön, dich kennenzulernen!", it:"Piacere di conoscerti!", pt:"Prazer em conhecê-lo!", zh:"很高兴认识你！", ja:"よろしくお願いします！", ko:"만나서 반가워요!", pl:"Miło mi cię poznać!" },
    ]},
  { id:"bank", title:"Bank", icon:"🏦", color:"#6366f1", desc:"Open accounts, transfers, card problems", aiRole:"bank teller",
    quickPhrases:[
      { en:"I'd like to open an account", es:"Quisiera abrir una cuenta", fr:"Je voudrais ouvrir un compte", de:"Ich möchte ein Konto eröffnen", it:"Vorrei aprire un conto", pt:"Gostaria de abrir uma conta", zh:"我想开户。", ja:"口座を開設したいです。", ko:"계좌를 개설하고 싶어요.", pl:"Chciałbym otworzyć konto" },
      { en:"My card has been blocked", es:"Mi tarjeta está bloqueada", fr:"Ma carte a été bloquée", de:"Meine Karte wurde gesperrt", it:"La mia carta è stata bloccata", pt:"Meu cartão foi bloqueado", zh:"我的卡被锁了。", ja:"カードがブロックされました。", ko:"카드가 차단됐어요.", pl:"Moja karta została zablokowana" },
    ]},
  { id:"job-interview", title:"Job Interview", icon:"💼", color:"#0ea5e9", desc:"Interview practice, professional language", aiRole:"HR manager",
    quickPhrases:[
      { en:"I have 3 years of experience", es:"Tengo 3 años de experiencia", fr:"J'ai 3 ans d'expérience", de:"Ich habe 3 Jahre Erfahrung", it:"Ho 3 anni di esperienza", pt:"Tenho 3 anos de experiência", zh:"我有3年工作经验。", ja:"3年の経験があります。", ko:"3년의 경험이 있어요.", pl:"Mam 3 lata doświadczenia" },
      { en:"What are the next steps?", es:"¿Cuáles son los próximos pasos?", fr:"Quelles sont les prochaines étapes?", de:"Was sind die nächsten Schritte?", it:"Quali sono i prossimi passi?", pt:"Quais são os próximos passos?", zh:"接下来的步骤是什么？", ja:"次のステップは何ですか？", ko:"다음 단계는 무엇인가요?", pl:"Jakie są następne kroki?" },
    ]},
  { id:"apartment", title:"Renting an Apartment", icon:"🏠", color:"#f59e0b", desc:"Viewings, contracts, deposits", aiRole:"landlord",
    quickPhrases:[
      { en:"Is the rent negotiable?", es:"¿El alquiler es negociable?", fr:"Le loyer est négociable?", de:"Ist die Miete verhandelbar?", it:"L'affitto è trattabile?", pt:"O aluguel é negociável?", zh:"租金可以商量吗？", ja:"家賃は交渉できますか？", ko:"임대료 협상 가능한가요?", pl:"Czy czynsz jest do negocjacji?" },
      { en:"Are bills included?", es:"¿Los gastos están incluidos?", fr:"Les charges sont incluses?", de:"Sind Nebenkosten inklusive?", it:"Le spese sono incluse?", pt:"As contas estão incluídas?", zh:"包含水电费吗？", ja:"光熱費込みですか？", ko:"공과금 포함인가요?", pl:"Czy rachunki są wliczone?" },
    ]},
  { id:"phone-call", title:"Phone Call", icon:"📞", color:"#64748b", desc:"Making appointments, formal calls", aiRole:"receptionist",
    quickPhrases:[
      { en:"I'd like to make an appointment", es:"Quisiera hacer una cita", fr:"Je voudrais prendre rendez-vous", de:"Ich möchte einen Termin machen", it:"Vorrei fissare un appuntamento", pt:"Gostaria de marcar uma consulta", zh:"我想预约。", ja:"予約したいのですが。", ko:"예약하고 싶어요.", pl:"Chciałbym umówić wizytę" },
      { en:"Can I speak to...?", es:"¿Puedo hablar con...?", fr:"Puis-je parler à...?", de:"Kann ich mit ... sprechen?", it:"Posso parlare con...?", pt:"Posso falar com...?", zh:"我可以和……说话吗？", ja:"…様はいらっしゃいますか？", ko:"…와 통화할 수 있나요?", pl:"Czy mogę rozmawiać z...?" },
    ]},
  { id:"gym", title:"Gym & Fitness", icon:"💪", color:"#dc2626", desc:"Sign up, equipment, fitness classes", aiRole:"gym instructor",
    quickPhrases:[
      { en:"How much is a monthly membership?", es:"¿Cuánto cuesta la mensualidad?", fr:"Combien coûte un abonnement mensuel?", de:"Was kostet eine Monatsmitgliedschaft?", it:"Quanto costa un abbonamento mensile?", pt:"Quanto custa uma mensalidade?", zh:"月会员费多少钱？", ja:"月会費はいくらですか？", ko:"월 회원권 얼마예요?", pl:"Ile kosztuje miesięczny karnet?" },
      { en:"Where are the changing rooms?", es:"¿Dónde están los vestuarios?", fr:"Où sont les vestiaires?", de:"Wo sind die Umkleidekabinen?", it:"Dove sono gli spogliatoi?", pt:"Onde ficam os vestiários?", zh:"更衣室在哪里？", ja:"更衣室はどこですか？", ko:"탈의실이 어디예요?", pl:"Gdzie są szatnie?" },
    ]},
  { id:"bar", title:"Bar & Nightlife", icon:"🍻", color:"#7c3aed", desc:"Order drinks, socialise", aiRole:"bartender",
    quickPhrases:[
      { en:"What beers do you have on tap?", es:"¿Qué cervezas tienen de barril?", fr:"Quelles bières avez-vous à la pression?", de:"Welche Biere haben Sie vom Fass?", it:"Quali birre avete alla spina?", pt:"Quais cervejas têm no barril?", zh:"你们有什么生啤？", ja:"生ビールは何がありますか？", ko:"생맥주 뭐 있어요?", pl:"Jakie macie piwa z beczki?" },
      { en:"Same again please", es:"Lo mismo de nuevo", fr:"La même chose, s'il vous plaît", de:"Das gleiche nochmal, bitte", it:"Lo stesso ancora", pt:"O mesmo de novo", zh:"再来一杯。", ja:"同じものをもう一つ。", ko:"같은 거 하나 더요.", pl:"To samo jeszcze raz" },
    ]},
  { id:"travel", title:"Travel & Tourism", icon:"🗺️", color:"#0891b2", desc:"Sightseeing, tourist info, travel tips", aiRole:"tourist guide",
    quickPhrases:[
      { en:"What are the must-see sights?", es:"¿Qué lugares no hay que perderse?", fr:"Quels sont les incontournables?", de:"Was sind die Sehenswürdigkeiten?", it:"Quali sono i luoghi da non perdere?", pt:"O que não pode deixar de ver?", zh:"必看景点有哪些？", ja:"必見の観光スポットは？", ko:"꼭 봐야 할 명소가 어디예요?", pl:"Co warto zobaczyć?" },
      { en:"How do I get to the old town?", es:"¿Cómo llego al casco antiguo?", fr:"Comment aller à la vieille ville?", de:"Wie komme ich in die Altstadt?", it:"Come arrivo al centro storico?", pt:"Como chego ao centro histórico?", zh:"怎么去老城区？", ja:"旧市街へはどう行けば？", ko:"구시가지에 어떻게 가요?", pl:"Jak dojść do starego miasta?" },
    ]},
  { id:"directions", title:"Asking for Directions", icon:"🧭", color:"#059669", desc:"Getting around, asking locals", aiRole:"local",
    quickPhrases:[
      { en:"Excuse me, how do I get to...?", es:"Perdone, ¿cómo llego a...?", fr:"Excusez-moi, comment aller à...?", de:"Entschuldigung, wie komme ich zu...?", it:"Scusi, come si arriva a...?", pt:"Com licença, como chego a...?", zh:"打扰一下，怎么去……？", ja:"すみません、…にはどう行けば？", ko:"실례합니다, …에 어떻게 가요?", pl:"Przepraszam, jak dojść do...?" },
      { en:"Is it far from here?", es:"¿Está lejos de aquí?", fr:"C'est loin d'ici?", de:"Ist es weit von hier?", it:"È lontano da qui?", pt:"É longe daqui?", zh:"离这里远吗？", ja:"ここから遠いですか？", ko:"여기서 멀어요?", pl:"Czy to daleko stąd?" },
    ]},
  { id:"university", title:"University / School", icon:"🎓", color:"#4f46e5", desc:"Academic life, professors, exams", aiRole:"professor",
    quickPhrases:[
      { en:"When is the deadline?", es:"¿Cuándo es la fecha límite?", fr:"Quelle est la date limite?", de:"Wann ist die Frist?", it:"Qual è la scadenza?", pt:"Qual é o prazo?", zh:"截止日期是什么时候？", ja:"締め切りはいつですか？", ko:"마감 기한이 언제예요?", pl:"Kiedy jest termin?" },
      { en:"Can I get an extension?", es:"¿Puedo pedir una prórroga?", fr:"Je peux avoir une prolongation?", de:"Kann ich eine Verlängerung bekommen?", it:"Posso avere una proroga?", pt:"Posso ter uma prorrogação?", zh:"可以延期吗？", ja:"延長できますか？", ko:"연장 가능할까요?", pl:"Czy mogę dostać przedłużenie?" },
    ]},
  { id:"emergency", title:"Emergency", icon:"🚨", color:"#b91c1c", desc:"Emergency phrases, calling for help", aiRole:"emergency operator",
    quickPhrases:[
      { en:"Call an ambulance!", es:"¡Llame a una ambulancia!", fr:"Appelez une ambulance!", de:"Rufen Sie einen Krankenwagen!", it:"Chiami un'ambulanza!", pt:"Chame uma ambulância!", zh:"叫救护车！", ja:"救急車を呼んでください！", ko:"구급차 불러주세요!", pl:"Proszę zadzwonić po karetkę!" },
      { en:"Call the police!", es:"¡Llame a la policía!", fr:"Appelez la police!", de:"Rufen Sie die Polizei!", it:"Chiami la polizia!", pt:"Chame a polícia!", zh:"报警！", ja:"警察を呼んでください！", ko:"경찰 불러주세요!", pl:"Proszę zadzwonić na policję!" },
      { en:"I've been robbed", es:"Me han robado", fr:"On m'a volé", de:"Ich wurde bestohlen", it:"Mi hanno derubato", pt:"Fui roubado", zh:"我被抢了。", ja:"盗難に遭いました。", ko:"도난당했어요.", pl:"Zostałem okradziony" },
    ]},
  { id:"post-office", title:"Post Office", icon:"📮", color:"#d97706", desc:"Sending parcels, stamps, services", aiRole:"post office clerk",
    quickPhrases:[
      { en:"I'd like to send this to...", es:"Quisiera enviar esto a...", fr:"Je voudrais envoyer ça à...", de:"Ich möchte das nach ... schicken", it:"Vorrei spedire questo a...", pt:"Gostaria de enviar isso para...", zh:"我想把这个寄到……", ja:"これを…に送りたいです。", ko:"이걸 …로 보내고 싶어요.", pl:"Chciałbym to wysłać do..." },
      { en:"How long will it take?", es:"¿Cuánto tardará?", fr:"Combien de temps ça prend?", de:"Wie lange dauert das?", it:"Quanto tempo ci vuole?", pt:"Quanto tempo demora?", zh:"需要多长时间？", ja:"どのくらいかかりますか？", ko:"얼마나 걸려요?", pl:"Ile to potrwa?" },
    ]},
  { id:"date", title:"First Date", icon:"❤️", color:"#e11d48", desc:"Romantic conversation, getting to know someone", aiRole:"date",
    quickPhrases:[
      { en:"You look great!", es:"¡Estás muy bien!", fr:"Tu es superbe!", de:"Du siehst toll aus!", it:"Stai benissimo!", pt:"Você está ótimo/a!", zh:"你看起来太好了！", ja:"素敵ですね！", ko:"정말 멋지네요!", pl:"Świetnie wyglądasz!" },
      { en:"What kind of music do you like?", es:"¿Qué tipo de música te gusta?", fr:"Quel genre de musique tu aimes?", de:"Welche Musik magst du?", it:"Che tipo di musica ti piace?", pt:"Que tipo de música você gosta?", zh:"你喜欢什么音乐？", ja:"どんな音楽が好きですか？", ko:"어떤 음악 좋아해요?", pl:"Jaką muzykę lubisz?" },
    ]},
  { id:"office", title:"Office / Work", icon:"🏢", color:"#475569", desc:"Meetings, colleagues, workplace talk", aiRole:"colleague",
    quickPhrases:[
      { en:"Let's schedule a meeting", es:"Vamos a programar una reunión", fr:"Planifions une réunion", de:"Lass uns ein Meeting planen", it:"Pianifichiamo una riunione", pt:"Vamos agendar uma reunião", zh:"我们安排一次会议吧。", ja:"ミーティングを設定しましょう。", ko:"회의를 잡읍시다.", pl:"Zaplanujmy spotkanie" },
      { en:"Can you send me the report?", es:"¿Puedes enviarme el informe?", fr:"Peux-tu m'envoyer le rapport?", de:"Kannst du mir den Bericht schicken?", it:"Puoi mandarmi il rapporto?", pt:"Pode me mandar o relatório?", zh:"你能把报告发给我吗？", ja:"レポートを送ってもらえますか？", ko:"보고서 보내줄 수 있어요?", pl:"Czy możesz mi wysłać raport?" },
    ]},
  { id:"weather", title:"Weather & Small Talk", icon:"☀️", color:"#eab308", desc:"Casual conversation, weather, daily life", aiRole:"local",
    quickPhrases:[
      { en:"What's the weather like today?", es:"¿Qué tiempo hace hoy?", fr:"Quel temps fait-il aujourd'hui?", de:"Wie ist das Wetter heute?", it:"Com'è il tempo oggi?", pt:"Como está o tempo hoje?", zh:"今天天气怎么样？", ja:"今日の天気は？", ko:"오늘 날씨 어때요?", pl:"Jaka jest dziś pogoda?" },
      { en:"It's beautiful today!", es:"¡Hace un día precioso!", fr:"Il fait beau aujourd'hui!", de:"Heute ist schönes Wetter!", it:"Oggi è una bella giornata!", pt:"Hoje está lindo!", zh:"今天天气真好！", ja:"今日はいい天気ですね！", ko:"오늘 날씨 좋죠!", pl:"Dzisiaj jest pięknie!" },
    ]},
  { id:"cooking", title:"Food & Cooking", icon:"🍳", color:"#16a34a", desc:"Recipes, ingredients, food culture", aiRole:"chef",
    quickPhrases:[
      { en:"What's your favourite dish?", es:"¿Cuál es tu plato favorito?", fr:"Quel est ton plat préféré?", de:"Was ist dein Lieblingsessen?", it:"Qual è il tuo piatto preferito?", pt:"Qual é o seu prato favorito?", zh:"你最喜欢的菜是什么？", ja:"好きな料理は何ですか？", ko:"가장 좋아하는 음식이 뭐예요?", pl:"Jakie jest twoje ulubione danie?" },
    ]},
];

const EXTRA_SITUATION_PHRASES = {
  restaurant: [
    {
      en: "I would like to order now",
      es: "Quisiera pedir ahora",
      fr: "Je voudrais commander maintenant",
      de: "Ich möchte jetzt bestellen",
      it: "Vorrei ordinare adesso",
      pt: "Gostaria de pedir agora",
      zh: "我现在想点餐。",
      ja: "今注文したいです。",
      ko: "지금 주문하고 싶어요.",
      pl: "Chciałbym teraz zamówić"
    },
    {
      en: "What is today's special?",
      es: "¿Cuál es el plato del día?",
      fr: "Quel est le plat du jour ?",
      de: "Was ist das Tagesgericht?",
      it: "Qual è il piatto del giorno?",
      pt: "Qual é o prato do dia?",
      zh: "今天的特色菜是什么？",
      ja: "本日のおすすめは何ですか？",
      ko: "오늘의 추천 메뉴가 뭐예요?",
      pl: "Jakie jest danie dnia?"
    },
    {
      en: "No onions, please",
      es: "Sin cebolla, por favor",
      fr: "Sans oignons, s'il vous plaît",
      de: "Keine Zwiebeln, bitte",
      it: "Senza cipolla, per favore",
      pt: "Sem cebola, por favor",
      zh: "不要洋葱，谢谢。",
      ja: "玉ねぎ抜きでお願いします。",
      ko: "양파 빼 주세요.",
      pl: "Bez cebuli, proszę"
    },
    {
      en: "Can we have some water?",
      es: "¿Nos trae agua?",
      fr: "On peut avoir de l'eau ?",
      de: "Können wir Wasser haben?",
      it: "Possiamo avere dell'acqua?",
      pt: "Pode trazer água?",
      zh: "可以给我们一些水吗？",
      ja: "お水をもらえますか？",
      ko: "물 좀 주시겠어요?",
      pl: "Czy możemy dostać wodę?"
    },
    {
      en: "That was delicious",
      es: "Estaba delicioso",
      fr: "C'était délicieux",
      de: "Das war lecker",
      it: "Era delizioso",
      pt: "Estava delicioso",
      zh: "很好吃。",
      ja: "とてもおいしかったです。",
      ko: "정말 맛있었어요.",
      pl: "To było pyszne"
    }
  ],
  cafe: [
    {
      en: "A cappuccino, please",
      es: "Un capuchino, por favor",
      fr: "Un cappuccino, s'il vous plaît",
      de: "Einen Cappuccino, bitte",
      it: "Un cappuccino, per favore",
      pt: "Um cappuccino, por favor",
      zh: "一杯卡布奇诺，谢谢。",
      ja: "カプチーノを一つお願いします。",
      ko: "카푸치노 한 잔 주세요.",
      pl: "Poproszę cappuccino"
    },
    {
      en: "Can I get it iced?",
      es: "¿Puede ser con hielo?",
      fr: "Je peux l'avoir glacé ?",
      de: "Kann ich es eisgekühlt bekommen?",
      it: "Posso averlo freddo?",
      pt: "Pode ser gelado?",
      zh: "可以做成冰的吗？",
      ja: "アイスにできますか？",
      ko: "아이스로 가능할까요?",
      pl: "Czy może być na zimno?"
    },
    {
      en: "With soy milk, please",
      es: "Con leche de soja, por favor",
      fr: "Avec du lait de soja, s'il vous plaît",
      de: "Mit Sojamilch, bitte",
      it: "Con latte di soia, per favore",
      pt: "Com leite de soja, por favor",
      zh: "请加豆奶。",
      ja: "豆乳でお願いします。",
      ko: "두유로 해 주세요.",
      pl: "Z mlekiem sojowym, proszę"
    },
    {
      en: "Anything sweet?",
      es: "¿Tienen algo dulce?",
      fr: "Vous avez quelque chose de sucré ?",
      de: "Haben Sie etwas Süßes?",
      it: "Avete qualcosa di dolce?",
      pt: "Vocês têm algo doce?",
      zh: "有甜点吗？",
      ja: "甘いものはありますか？",
      ko: "달콤한 거 있어요?",
      pl: "Macie coś słodkiego?"
    },
    {
      en: "Can I pay by card?",
      es: "¿Puedo pagar con tarjeta?",
      fr: "Je peux payer par carte ?",
      de: "Kann ich mit Karte zahlen?",
      it: "Posso pagare con la carta?",
      pt: "Posso pagar com cartão?",
      zh: "可以刷卡吗？",
      ja: "カードで払えますか？",
      ko: "카드로 결제할 수 있나요?",
      pl: "Czy mogę zapłacić kartą?"
    },
    {
      en: "One croissant, please",
      es: "Un cruasán, por favor",
      fr: "Un croissant, s'il vous plaît",
      de: "Ein Croissant, bitte",
      it: "Un cornetto, per favore",
      pt: "Um croissant, por favor",
      zh: "一个牛角包，谢谢。",
      ja: "クロワッサンを一つください。",
      ko: "크루아상 하나 주세요.",
      pl: "Jednego croissanta, proszę"
    },
    {
      en: "For here, please",
      es: "Para tomar aquí",
      fr: "Sur place, s'il vous plaît",
      de: "Zum Hiertrinken, bitte",
      it: "Da consumare qui",
      pt: "Para consumir aqui",
      zh: "在这里喝。",
      ja: "店内でお願いします。",
      ko: "매장에서 먹을게요.",
      pl: "Na miejscu, proszę"
    }
  ],
  hotel: [
    {
      en: "Can I check in now?",
      es: "¿Puedo hacer el check-in ahora?",
      fr: "Je peux m'enregistrer maintenant ?",
      de: "Kann ich jetzt einchecken?",
      it: "Posso fare il check-in adesso?",
      pt: "Posso fazer o check-in agora?",
      zh: "我现在可以办理入住吗？",
      ja: "今チェックインできますか？",
      ko: "지금 체크인할 수 있나요?",
      pl: "Czy mogę się teraz zameldować?"
    },
    {
      en: "Is breakfast included?",
      es: "¿El desayuno está incluido?",
      fr: "Le petit-déjeuner est-il inclus ?",
      de: "Ist das Frühstück inklusive?",
      it: "La colazione è inclusa?",
      pt: "O café da manhã está incluído?",
      zh: "含早餐吗？",
      ja: "朝食は含まれていますか？",
      ko: "조식이 포함돼 있나요?",
      pl: "Czy śniadanie jest wliczone?"
    },
    {
      en: "Can I have another towel?",
      es: "¿Me puede traer otra toalla?",
      fr: "Je peux avoir une autre serviette ?",
      de: "Kann ich noch ein Handtuch bekommen?",
      it: "Posso avere un altro asciugamano?",
      pt: "Pode me trazer outra toalha?",
      zh: "可以再给我一条毛巾吗？",
      ja: "タオルをもう一枚もらえますか？",
      ko: "수건 하나 더 주실 수 있나요?",
      pl: "Czy mogę dostać jeszcze jeden ręcznik?"
    },
    {
      en: "The room is too cold",
      es: "La habitación está demasiado fría",
      fr: "La chambre est trop froide",
      de: "Das Zimmer ist zu kalt",
      it: "La stanza è troppo fredda",
      pt: "O quarto está muito frio",
      zh: "房间太冷了。",
      ja: "部屋が寒すぎます。",
      ko: "방이 너무 추워요.",
      pl: "W pokoju jest za zimno"
    },
    {
      en: "Could you call a taxi?",
      es: "¿Puede llamar un taxi?",
      fr: "Pouvez-vous appeler un taxi ?",
      de: "Können Sie ein Taxi rufen?",
      it: "Può chiamare un taxi?",
      pt: "Pode chamar um táxi?",
      zh: "您可以帮我叫辆出租车吗？",
      ja: "タクシーを呼んでもらえますか？",
      ko: "택시 불러 주실 수 있나요?",
      pl: "Czy może pan/pani zamówić taksówkę?"
    },
    {
      en: "Which room number?",
      es: "¿Qué número de habitación?",
      fr: "Quel est le numéro de chambre ?",
      de: "Welche Zimmernummer?",
      it: "Qual è il numero della camera?",
      pt: "Qual é o número do quarto?",
      zh: "房间号是多少？",
      ja: "部屋番号は何ですか？",
      ko: "객실 번호가 뭐예요?",
      pl: "Jaki jest numer pokoju?"
    }
  ],
  airport: [
    {
      en: "Where is security?",
      es: "¿Dónde está el control de seguridad?",
      fr: "Où est le contrôle de sécurité ?",
      de: "Wo ist die Sicherheitskontrolle?",
      it: "Dov'è il controllo di sicurezza?",
      pt: "Onde fica o controle de segurança?",
      zh: "安检在哪里？",
      ja: "保安検査場はどこですか？",
      ko: "보안 검색대가 어디예요?",
      pl: "Gdzie jest kontrola bezpieczeństwa?"
    },
    {
      en: "Which gate is it?",
      es: "¿Qué puerta es?",
      fr: "C'est quelle porte ?",
      de: "Welches Gate ist es?",
      it: "Qual è il gate?",
      pt: "Qual é o portão?",
      zh: "是几号登机口？",
      ja: "何番ゲートですか？",
      ko: "몇 번 게이트예요?",
      pl: "Która to bramka?"
    },
    {
      en: "Can I take this bag as hand luggage?",
      es: "¿Puedo llevar esta bolsa como equipaje de mano?",
      fr: "Je peux prendre ce sac en bagage cabine ?",
      de: "Kann ich diese Tasche als Handgepäck mitnehmen?",
      it: "Posso portare questa borsa come bagaglio a mano?",
      pt: "Posso levar esta bolsa como bagagem de mão?",
      zh: "这个包可以当随身行李吗？",
      ja: "このバッグは機内持ち込みできますか？",
      ko: "이 가방은 기내 반입 되나요?",
      pl: "Czy mogę wziąć tę torbę jako bagaż podręczny?"
    },
    {
      en: "Where is passport control?",
      es: "¿Dónde está el control de pasaportes?",
      fr: "Où est le contrôle des passeports ?",
      de: "Wo ist die Passkontrolle?",
      it: "Dov'è il controllo passaporti?",
      pt: "Onde fica o controle de passaporte?",
      zh: "护照检查在哪里？",
      ja: "パスポートコントロールはどこですか？",
      ko: "출입국 심사는 어디예요?",
      pl: "Gdzie jest kontrola paszportowa?"
    },
    {
      en: "I missed my flight",
      es: "He perdido mi vuelo",
      fr: "J'ai raté mon vol",
      de: "Ich habe meinen Flug verpasst",
      it: "Ho perso il mio volo",
      pt: "Perdi meu voo",
      zh: "我误机了。",
      ja: "飛行機に乗り遅れました。",
      ko: "비행기를 놓쳤어요.",
      pl: "Spóźniłem się na lot"
    },
    {
      en: "I need help with my boarding pass",
      es: "Necesito ayuda con mi tarjeta de embarque",
      fr: "J'ai besoin d'aide avec ma carte d'embarquement",
      de: "Ich brauche Hilfe mit meiner Bordkarte",
      it: "Ho bisogno di aiuto con la mia carta d'imbarco",
      pt: "Preciso de ajuda com meu cartão de embarque",
      zh: "我的登机牌需要帮助。",
      ja: "搭乗券で助けが必要です。",
      ko: "탑승권 때문에 도움이 필요해요.",
      pl: "Potrzebuję pomocy z kartą pokładową"
    },
    {
      en: "Where can I collect my luggage?",
      es: "¿Dónde recojo mi equipaje?",
      fr: "Où puis-je récupérer mes bagages ?",
      de: "Wo kann ich mein Gepäck abholen?",
      it: "Dove posso ritirare il bagaglio?",
      pt: "Onde posso pegar minha bagagem?",
      zh: "我在哪里取行李？",
      ja: "荷物はどこで受け取れますか？",
      ko: "짐은 어디서 찾나요?",
      pl: "Gdzie mogę odebrać bagaż?"
    }
  ],
  doctor: [
    {
      en: "My stomach hurts",
      es: "Me duele el estómago",
      fr: "J'ai mal à l'estomac",
      de: "Ich habe Bauchschmerzen",
      it: "Mi fa male lo stomaco",
      pt: "Meu estômago dói",
      zh: "我胃疼。",
      ja: "お腹が痛いです。",
      ko: "배가 아파요.",
      pl: "Boli mnie brzuch"
    },
    {
      en: "I have been sick since yesterday",
      es: "Estoy enfermo desde ayer",
      fr: "Je suis malade depuis hier",
      de: "Ich bin seit gestern krank",
      it: "Sto male da ieri",
      pt: "Estou doente desde ontem",
      zh: "我从昨天开始就不舒服。",
      ja: "昨日から具合が悪いです。",
      ko: "어제부터 아파요.",
      pl: "Jestem chory od wczoraj"
    },
    {
      en: "Do I need medicine?",
      es: "¿Necesito medicina?",
      fr: "J'ai besoin d'un médicament ?",
      de: "Brauche ich Medikamente?",
      it: "Ho bisogno di medicine?",
      pt: "Preciso de remédio?",
      zh: "我需要吃药吗？",
      ja: "薬が必要ですか？",
      ko: "약이 필요할까요?",
      pl: "Czy potrzebuję lekarstwa?"
    },
    {
      en: "I feel dizzy",
      es: "Me siento mareado",
      fr: "Je me sens étourdi",
      de: "Mir ist schwindelig",
      it: "Mi sento stordito",
      pt: "Estou tonto",
      zh: "我头晕。",
      ja: "めまいがします。",
      ko: "어지러워요.",
      pl: "Kręci mi się w głowie"
    },
    {
      en: "It hurts here",
      es: "Me duele aquí",
      fr: "J'ai mal ici",
      de: "Es tut hier weh",
      it: "Mi fa male qui",
      pt: "Dói aqui",
      zh: "这里疼。",
      ja: "ここが痛いです。",
      ko: "여기가 아파요.",
      pl: "Boli tutaj"
    },
    {
      en: "How often should I take this?",
      es: "¿Con qué frecuencia debo tomar esto?",
      fr: "À quelle fréquence dois-je le prendre ?",
      de: "Wie oft soll ich das nehmen?",
      it: "Quanto spesso devo prenderlo?",
      pt: "Com que frequência devo tomar isso?",
      zh: "这个药多久吃一次？",
      ja: "これはどのくらいの頻度で飲めばいいですか？",
      ko: "이 약은 얼마나 자주 먹어야 해요?",
      pl: "Jak często mam to brać?"
    }
  ],
  pharmacy: [
    {
      en: "I need something for a cold",
      es: "Necesito algo para un resfriado",
      fr: "J'ai besoin de quelque chose contre le rhume",
      de: "Ich brauche etwas gegen eine Erkältung",
      it: "Ho bisogno di qualcosa per il raffreddore",
      pt: "Preciso de algo para resfriado",
      zh: "我需要治感冒的药。",
      ja: "風邪薬が必要です。",
      ko: "감기약이 필요해요.",
      pl: "Potrzebuję czegoś na przeziębienie"
    },
    {
      en: "Does this have side effects?",
      es: "¿Tiene efectos secundarios?",
      fr: "Y a-t-il des effets secondaires ?",
      de: "Hat das Nebenwirkungen?",
      it: "Ha effetti collaterali?",
      pt: "Tem efeitos colaterais?",
      zh: "这个有副作用吗？",
      ja: "副作用はありますか？",
      ko: "부작용이 있나요?",
      pl: "Czy to ma skutki uboczne?"
    },
    {
      en: "Should I take it with food?",
      es: "¿Debo tomarlo con comida?",
      fr: "Dois-je le prendre avec de la nourriture ?",
      de: "Soll ich es mit Essen einnehmen?",
      it: "Devo prenderlo con il cibo?",
      pt: "Devo tomar com comida?",
      zh: "要和饭一起吃吗？",
      ja: "食事と一緒に飲むべきですか？",
      ko: "식사와 함께 먹어야 하나요?",
      pl: "Czy mam to brać z jedzeniem?"
    },
    {
      en: "Can children take this?",
      es: "¿Los niños pueden tomar esto?",
      fr: "Les enfants peuvent prendre ça ?",
      de: "Können Kinder das nehmen?",
      it: "I bambini possono prenderlo?",
      pt: "Crianças podem tomar isso?",
      zh: "孩子可以吃这个吗？",
      ja: "子どもでも飲めますか？",
      ko: "아이들도 먹을 수 있나요?",
      pl: "Czy dzieci mogą to brać?"
    },
    {
      en: "I have a headache",
      es: "Tengo dolor de cabeza",
      fr: "J'ai mal à la tête",
      de: "Ich habe Kopfschmerzen",
      it: "Ho mal di testa",
      pt: "Estou com dor de cabeça",
      zh: "我头疼。",
      ja: "頭痛があります。",
      ko: "두통이 있어요.",
      pl: "Boli mnie głowa"
    },
    {
      en: "Can you explain the dosage?",
      es: "¿Puede explicar la dosis?",
      fr: "Pouvez-vous expliquer la posologie ?",
      de: "Können Sie die Dosierung erklären?",
      it: "Può spiegare il dosaggio?",
      pt: "Pode explicar a dosagem?",
      zh: "您能解释一下剂量吗？",
      ja: "用量を説明してもらえますか？",
      ko: "복용량을 설명해 주실 수 있나요?",
      pl: "Czy może pan/pani wyjaśnić dawkowanie?"
    },
    {
      en: "I need pain relief",
      es: "Necesito algo para el dolor",
      fr: "J'ai besoin d'un antidouleur",
      de: "Ich brauche etwas gegen Schmerzen",
      it: "Ho bisogno di un antidolorifico",
      pt: "Preciso de algo para dor",
      zh: "我需要止痛药。",
      ja: "痛み止めが必要です。",
      ko: "진통제가 필요해요.",
      pl: "Potrzebuję czegoś przeciwbólowego"
    },
    {
      en: "Is this medicine strong?",
      es: "¿Es fuerte este medicamento?",
      fr: "Ce médicament est fort ?",
      de: "Ist dieses Medikament stark?",
      it: "Questo medicinale è forte?",
      pt: "Esse remédio é forte?",
      zh: "这个药效强吗？",
      ja: "この薬は強いですか？",
      ko: "이 약은 강한가요?",
      pl: "Czy ten lek jest mocny?"
    }
  ],
  shopping: [
    {
      en: "I'm just looking, thank you",
      es: "Solo estoy mirando, gracias",
      fr: "Je regarde seulement, merci",
      de: "Ich schaue mich nur um, danke",
      it: "Sto solo guardando, grazie",
      pt: "Só estou olhando, obrigado",
      zh: "我只是看看，谢谢。",
      ja: "見ているだけです、ありがとう。",
      ko: "그냥 보고 있어요, 감사합니다.",
      pl: "Tylko się rozglądam, dziękuję"
    },
    {
      en: "Do you have this in black?",
      es: "¿Lo tiene en negro?",
      fr: "Vous l'avez en noir ?",
      de: "Haben Sie das in Schwarz?",
      it: "Ce l'ha in nero?",
      pt: "Tem isso em preto?",
      zh: "这个有黑色的吗？",
      ja: "黒はありますか？",
      ko: "검은색 있어요?",
      pl: "Czy mają to w czarnym kolorze?"
    },
    {
      en: "Where is the fitting room?",
      es: "¿Dónde está el probador?",
      fr: "Où est la cabine d'essayage ?",
      de: "Wo ist die Umkleidekabine?",
      it: "Dov'è il camerino?",
      pt: "Onde fica o provador?",
      zh: "试衣间在哪里？",
      ja: "試着室はどこですか？",
      ko: "탈의실이 어디예요?",
      pl: "Gdzie jest przymierzalnia?"
    },
    {
      en: "It's too expensive",
      es: "Es demasiado caro",
      fr: "C'est trop cher",
      de: "Das ist zu teuer",
      it: "È troppo caro",
      pt: "É muito caro",
      zh: "太贵了。",
      ja: "高すぎます。",
      ko: "너무 비싸요.",
      pl: "To jest za drogie"
    },
    {
      en: "Do you have a smaller size?",
      es: "¿Lo tiene en una talla más pequeña?",
      fr: "Vous l'avez en plus petit ?",
      de: "Haben Sie das kleiner?",
      it: "Ce l'ha più piccolo?",
      pt: "Tem num tamanho menor?",
      zh: "有小一码的吗？",
      ja: "小さいサイズはありますか？",
      ko: "더 작은 사이즈 있나요?",
      pl: "Czy jest mniejszy rozmiar?"
    },
    {
      en: "I'll take it",
      es: "Me lo llevo",
      fr: "Je le prends",
      de: "Ich nehme es",
      it: "Lo prendo",
      pt: "Vou levar",
      zh: "我要这个。",
      ja: "これにします。",
      ko: "이걸로 할게요.",
      pl: "Wezmę to"
    },
    {
      en: "Can I get a receipt?",
      es: "¿Me da el recibo?",
      fr: "Je peux avoir le reçu ?",
      de: "Kann ich eine Quittung bekommen?",
      it: "Posso avere lo scontrino?",
      pt: "Posso pegar o recibo?",
      zh: "可以给我收据吗？",
      ja: "レシートをもらえますか？",
      ko: "영수증 받을 수 있나요?",
      pl: "Czy mogę dostać paragon?"
    }
  ],
  supermarket: [
    {
      en: "Where can I find milk?",
      es: "¿Dónde puedo encontrar leche?",
      fr: "Où puis-je trouver du lait ?",
      de: "Wo finde ich Milch?",
      it: "Dove posso trovare il latte?",
      pt: "Onde posso encontrar leite?",
      zh: "牛奶在哪里？",
      ja: "牛乳はどこですか？",
      ko: "우유는 어디에 있어요?",
      pl: "Gdzie znajdę mleko?"
    },
    {
      en: "Is this fresh?",
      es: "¿Está fresco?",
      fr: "C'est frais ?",
      de: "Ist das frisch?",
      it: "È fresco?",
      pt: "Está fresco?",
      zh: "这个新鲜吗？",
      ja: "これは新鮮ですか？",
      ko: "이거 신선해요?",
      pl: "Czy to jest świeże?"
    },
    {
      en: "Which aisle is it in?",
      es: "¿En qué pasillo está?",
      fr: "C'est dans quel rayon ?",
      de: "In welchem Gang ist das?",
      it: "In quale corsia si trova?",
      pt: "Em qual corredor fica?",
      zh: "在第几排？",
      ja: "何番通路ですか？",
      ko: "몇 번 통로에 있어요?",
      pl: "W którym alejce to jest?"
    },
    {
      en: "Do you sell fruit here?",
      es: "¿Venden fruta aquí?",
      fr: "Vous vendez des fruits ici ?",
      de: "Verkaufen Sie hier Obst?",
      it: "Vendete frutta qui?",
      pt: "Vocês vendem fruta aqui?",
      zh: "这里卖水果吗？",
      ja: "ここで果物を売っていますか？",
      ko: "여기 과일 팔아요?",
      pl: "Czy sprzedajecie tu owoce?"
    },
    {
      en: "I need a basket",
      es: "Necesito una cesta",
      fr: "J'ai besoin d'un panier",
      de: "Ich brauche einen Korb",
      it: "Ho bisogno di un cestino",
      pt: "Preciso de uma cesta",
      zh: "我需要一个篮子。",
      ja: "かごが必要です。",
      ko: "바구니가 필요해요.",
      pl: "Potrzebuję koszyka"
    },
    {
      en: "Is there a self-checkout?",
      es: "¿Hay caja automática?",
      fr: "Il y a une caisse automatique ?",
      de: "Gibt es eine Selbstbedienungskasse?",
      it: "C'è una cassa automatica?",
      pt: "Tem caixa de autoatendimento?",
      zh: "有自助结账吗？",
      ja: "セルフレジはありますか？",
      ko: "셀프 계산대가 있나요?",
      pl: "Czy jest kasa samoobsługowa?"
    },
    {
      en: "Can I pay cash?",
      es: "¿Puedo pagar en efectivo?",
      fr: "Je peux payer en espèces ?",
      de: "Kann ich bar bezahlen?",
      it: "Posso pagare in contanti?",
      pt: "Posso pagar em dinheiro?",
      zh: "可以付现金吗？",
      ja: "現金で払えますか？",
      ko: "현금으로 결제할 수 있나요?",
      pl: "Czy mogę zapłacić gotówką?"
    },
    {
      en: "I only need one bag",
      es: "Solo necesito una bolsa",
      fr: "J'ai seulement besoin d'un sac",
      de: "Ich brauche nur eine Tasche",
      it: "Mi serve solo una busta",
      pt: "Só preciso de uma sacola",
      zh: "我只需要一个袋子。",
      ja: "袋は一つだけで大丈夫です。",
      ko: "봉투 하나만 필요해요.",
      pl: "Potrzebuję tylko jednej torby"
    }
  ],
  taxi: [
    {
      en: "Please use the meter",
      es: "Use el taxímetro, por favor",
      fr: "Mettez le compteur, s'il vous plaît",
      de: "Bitte benutzen Sie das Taxameter",
      it: "Usi il tassametro, per favore",
      pt: "Use o taxímetro, por favor",
      zh: "请打表。",
      ja: "メーターを使ってください。",
      ko: "미터기 켜 주세요.",
      pl: "Proszę włączyć taksometr"
    },
    {
      en: "How long will it take?",
      es: "¿Cuánto tardará?",
      fr: "Combien de temps cela prendra-t-il ?",
      de: "Wie lange dauert es?",
      it: "Quanto ci vorrà?",
      pt: "Quanto tempo vai levar?",
      zh: "要多久？",
      ja: "どれくらいかかりますか？",
      ko: "얼마나 걸려요?",
      pl: "Ile to zajmie?"
    },
    {
      en: "Can you take the fastest route?",
      es: "¿Puede tomar la ruta más rápida?",
      fr: "Pouvez-vous prendre l'itinéraire le plus rapide ?",
      de: "Können Sie die schnellste Route nehmen?",
      it: "Può prendere la strada più veloce?",
      pt: "Pode pegar o caminho mais rápido?",
      zh: "可以走最快的路线吗？",
      ja: "一番早いルートでお願いします。",
      ko: "가장 빠른 길로 가 주세요.",
      pl: "Czy może pan/pani jechać najszybszą trasą?"
    },
    {
      en: "Please wait here",
      es: "Espere aquí, por favor",
      fr: "Attendez ici, s'il vous plaît",
      de: "Bitte warten Sie hier",
      it: "Aspetti qui, per favore",
      pt: "Espere aqui, por favor",
      zh: "请在这里等一下。",
      ja: "ここで待ってください。",
      ko: "여기서 기다려 주세요.",
      pl: "Proszę tu poczekać"
    },
    {
      en: "Can I pay by card?",
      es: "¿Puedo pagar con tarjeta?",
      fr: "Je peux payer par carte ?",
      de: "Kann ich mit Karte zahlen?",
      it: "Posso pagare con la carta?",
      pt: "Posso pagar com cartão?",
      zh: "可以刷卡吗？",
      ja: "カードで払えますか？",
      ko: "카드로 결제할 수 있나요?",
      pl: "Czy mogę zapłacić kartą?"
    },
    {
      en: "I'm in a hurry",
      es: "Tengo prisa",
      fr: "Je suis pressé",
      de: "Ich habe es eilig",
      it: "Ho fretta",
      pt: "Estou com pressa",
      zh: "我很赶时间。",
      ja: "急いでいます。",
      ko: "저 급해요.",
      pl: "Spieszę się"
    },
    {
      en: "Can you help with my bags?",
      es: "¿Puede ayudarme con mis maletas?",
      fr: "Pouvez-vous m'aider avec mes bagages ?",
      de: "Können Sie mir mit meinem Gepäck helfen?",
      it: "Può aiutarmi con i bagagli?",
      pt: "Pode me ajudar com as malas?",
      zh: "您可以帮我拿行李吗？",
      ja: "荷物を手伝ってもらえますか？",
      ko: "짐 좀 도와주실 수 있나요?",
      pl: "Czy może pan/pani pomóc mi z bagażami?"
    }
  ],
  "making-friends": [
    {
      en: "What do you do?",
      es: "¿A qué te dedicas?",
      fr: "Qu'est-ce que tu fais dans la vie ?",
      de: "Was machst du beruflich?",
      it: "Che lavoro fai?",
      pt: "O que você faz?",
      zh: "你是做什么工作的？",
      ja: "お仕事は何ですか？",
      ko: "무슨 일 하세요?",
      pl: "Czym się zajmujesz?"
    },
    {
      en: "Do you live here?",
      es: "¿Vives aquí?",
      fr: "Tu habites ici ?",
      de: "Wohnst du hier?",
      it: "Abiti qui?",
      pt: "Você mora aqui?",
      zh: "你住在这里吗？",
      ja: "ここに住んでいますか？",
      ko: "여기 살아요?",
      pl: "Mieszkasz tutaj?"
    },
    {
      en: "What do you like to do?",
      es: "¿Qué te gusta hacer?",
      fr: "Qu'est-ce que tu aimes faire ?",
      de: "Was machst du gern?",
      it: "Cosa ti piace fare?",
      pt: "O que você gosta de fazer?",
      zh: "你喜欢做什么？",
      ja: "何をするのが好きですか？",
      ko: "뭐 하는 걸 좋아해요?",
      pl: "Co lubisz robić?"
    },
    {
      en: "Would you like to grab coffee?",
      es: "¿Quieres tomar un café?",
      fr: "Tu veux prendre un café ?",
      de: "Willst du einen Kaffee trinken gehen?",
      it: "Ti va di prendere un caffè?",
      pt: "Quer tomar um café?",
      zh: "想一起喝咖啡吗？",
      ja: "コーヒーでもどうですか？",
      ko: "커피 한잔할래요?",
      pl: "Masz ochotę na kawę?"
    },
    {
      en: "That sounds fun",
      es: "Eso suena divertido",
      fr: "Ça a l'air sympa",
      de: "Das klingt lustig",
      it: "Sembra divertente",
      pt: "Parece divertido",
      zh: "听起来很有趣。",
      ja: "楽しそうですね。",
      ko: "재미있겠네요.",
      pl: "Brzmi fajnie"
    },
    {
      en: "Can I add you on WhatsApp?",
      es: "¿Puedo agregarte en WhatsApp?",
      fr: "Je peux t'ajouter sur WhatsApp ?",
      de: "Kann ich dich auf WhatsApp hinzufügen?",
      it: "Posso aggiungerti su WhatsApp?",
      pt: "Posso te adicionar no WhatsApp?",
      zh: "我可以加你的WhatsApp吗？",
      ja: "WhatsAppを交換してもいいですか？",
      ko: "왓츠앱 추가해도 될까요?",
      pl: "Czy mogę dodać cię na WhatsAppie?"
    },
    {
      en: "See you soon",
      es: "Nos vemos pronto",
      fr: "À bientôt",
      de: "Bis bald",
      it: "A presto",
      pt: "Até logo",
      zh: "很快见。",
      ja: "また近いうちに。",
      ko: "곧 또 봐요.",
      pl: "Do zobaczenia wkrótce"
    }
  ],
  bank: [
    {
      en: "I need to withdraw cash",
      es: "Necesito sacar efectivo",
      fr: "J'ai besoin de retirer de l'argent",
      de: "Ich muss Bargeld abheben",
      it: "Ho bisogno di prelevare contanti",
      pt: "Preciso sacar dinheiro",
      zh: "我需要取现金。",
      ja: "現金を引き出したいです。",
      ko: "현금을 인출해야 해요.",
      pl: "Muszę wypłacić gotówkę"
    },
    {
      en: "Can I make a transfer?",
      es: "¿Puedo hacer una transferencia?",
      fr: "Je peux faire un virement ?",
      de: "Kann ich eine Überweisung machen?",
      it: "Posso fare un bonifico?",
      pt: "Posso fazer uma transferência?",
      zh: "我可以转账吗？",
      ja: "振り込みできますか？",
      ko: "송금할 수 있나요?",
      pl: "Czy mogę zrobić przelew?"
    },
    {
      en: "What are the fees?",
      es: "¿Cuáles son las comisiones?",
      fr: "Quels sont les frais ?",
      de: "Welche Gebühren gibt es?",
      it: "Quali sono le commissioni?",
      pt: "Quais são as taxas?",
      zh: "手续费是多少？",
      ja: "手数料はいくらですか？",
      ko: "수수료가 얼마예요?",
      pl: "Jakie są opłaty?"
    },
    {
      en: "I forgot my PIN",
      es: "Olvidé mi PIN",
      fr: "J'ai oublié mon code PIN",
      de: "Ich habe meine PIN vergessen",
      it: "Ho dimenticato il PIN",
      pt: "Esqueci meu PIN",
      zh: "我忘记密码了。",
      ja: "暗証番号を忘れました。",
      ko: "비밀번호를 잊어버렸어요.",
      pl: "Zapomniałem PIN-u"
    },
    {
      en: "Can you help me with online banking?",
      es: "¿Puede ayudarme con la banca en línea?",
      fr: "Pouvez-vous m'aider avec la banque en ligne ?",
      de: "Können Sie mir beim Online-Banking helfen?",
      it: "Può aiutarmi con l'online banking?",
      pt: "Pode me ajudar com o banco online?",
      zh: "您能帮我处理网上银行吗？",
      ja: "オンラインバンキングを手伝ってもらえますか？",
      ko: "온라인 뱅킹 좀 도와주실 수 있나요?",
      pl: "Czy może mi pan/pani pomóc z bankowością internetową?"
    },
    {
      en: "My card was declined",
      es: "Mi tarjeta fue rechazada",
      fr: "Ma carte a été refusée",
      de: "Meine Karte wurde abgelehnt",
      it: "La mia carta è stata rifiutata",
      pt: "Meu cartão foi recusado",
      zh: "我的卡被拒了。",
      ja: "カードが使えませんでした。",
      ko: "카드가 거절됐어요.",
      pl: "Moja karta została odrzucona"
    },
    {
      en: "I need a bank statement",
      es: "Necesito un extracto bancario",
      fr: "J'ai besoin d'un relevé bancaire",
      de: "Ich brauche einen Kontoauszug",
      it: "Ho bisogno di un estratto conto",
      pt: "Preciso de um extrato bancário",
      zh: "我需要银行流水。",
      ja: "銀行明細が必要です。",
      ko: "거래 내역서가 필요해요.",
      pl: "Potrzebuję wyciągu bankowego"
    },
    {
      en: "Can I speak to an advisor?",
      es: "¿Puedo hablar con un asesor?",
      fr: "Je peux parler à un conseiller ?",
      de: "Kann ich mit einem Berater sprechen?",
      it: "Posso parlare con un consulente?",
      pt: "Posso falar com um consultor?",
      zh: "我可以和顾问谈谈吗？",
      ja: "担当者と話せますか？",
      ko: "상담원과 이야기할 수 있나요?",
      pl: "Czy mogę porozmawiać z doradcą?"
    }
  ],
  "job-interview": [
    {
      en: "Tell me about yourself",
      es: "Hábleme de usted",
      fr: "Parlez-moi de vous",
      de: "Erzählen Sie mir etwas über sich",
      it: "Mi parli di lei",
      pt: "Fale sobre você",
      zh: "请介绍一下你自己。",
      ja: "自己紹介をお願いします。",
      ko: "자기소개 부탁드립니다.",
      pl: "Proszę opowiedzieć coś o sobie"
    },
    {
      en: "Why do you want this job?",
      es: "¿Por qué quiere este trabajo?",
      fr: "Pourquoi voulez-vous ce poste ?",
      de: "Warum möchten Sie diesen Job?",
      it: "Perché vuole questo lavoro?",
      pt: "Por que você quer este emprego?",
      zh: "你为什么想要这份工作？",
      ja: "なぜこの仕事を希望するのですか？",
      ko: "왜 이 일을 원하시나요?",
      pl: "Dlaczego chce pan/pani tę pracę?"
    },
    {
      en: "What are your strengths?",
      es: "¿Cuáles son sus puntos fuertes?",
      fr: "Quels sont vos points forts ?",
      de: "Was sind Ihre Stärken?",
      it: "Quali sono i suoi punti di forza?",
      pt: "Quais são seus pontos fortes?",
      zh: "你的优点是什么？",
      ja: "あなたの強みは何ですか？",
      ko: "당신의 강점은 무엇인가요?",
      pl: "Jakie są pana/pani mocne strony?"
    },
    {
      en: "I work well in teams",
      es: "Trabajo bien en equipo",
      fr: "Je travaille bien en équipe",
      de: "Ich arbeite gut im Team",
      it: "Lavoro bene in squadra",
      pt: "Trabalho bem em equipe",
      zh: "我很擅长团队合作。",
      ja: "チームでうまく働けます。",
      ko: "팀으로 잘 일합니다.",
      pl: "Dobrze pracuję w zespole"
    },
    {
      en: "I am available from next month",
      es: "Estoy disponible a partir del próximo mes",
      fr: "Je suis disponible à partir du mois prochain",
      de: "Ich bin ab nächstem Monat verfügbar",
      it: "Sono disponibile dal prossimo mese",
      pt: "Estou disponível a partir do próximo mês",
      zh: "我下个月开始可以入职。",
      ja: "来月から勤務可能です。",
      ko: "다음 달부터 가능합니다.",
      pl: "Jestem dostępny/a od przyszłego miesiąca"
    },
    {
      en: "Thank you for your time",
      es: "Gracias por su tiempo",
      fr: "Merci pour votre temps",
      de: "Vielen Dank für Ihre Zeit",
      it: "Grazie per il suo tempo",
      pt: "Obrigado pelo seu tempo",
      zh: "感谢您的时间。",
      ja: "お時間をいただきありがとうございます。",
      ko: "시간 내주셔서 감사합니다.",
      pl: "Dziękuję za poświęcony czas"
    },
    {
      en: "Can you tell me more about the role?",
      es: "¿Puede contarme más sobre el puesto?",
      fr: "Pouvez-vous m'en dire plus sur le poste ?",
      de: "Können Sie mir mehr über die Stelle sagen?",
      it: "Può dirmi di più sul ruolo?",
      pt: "Pode me falar mais sobre o cargo?",
      zh: "您能多介绍一下这个职位吗？",
      ja: "この役割についてもう少し教えていただけますか？",
      ko: "이 역할에 대해 더 설명해 주실 수 있나요?",
      pl: "Czy może pan/pani powiedzieć więcej o stanowisku?"
    },
    {
      en: "I am excited about this opportunity",
      es: "Estoy entusiasmado con esta oportunidad",
      fr: "Je suis enthousiaste à propos de cette opportunité",
      de: "Ich freue mich über diese Gelegenheit",
      it: "Sono entusiasta di questa opportunità",
      pt: "Estou animado com essa oportunidade",
      zh: "我对这个机会很期待。",
      ja: "この機会にとてもわくわくしています。",
      ko: "이 기회가 정말 기대됩니다.",
      pl: "Cieszę się z tej możliwości"
    }
  ],
  apartment: [
    {
      en: "Can I see the apartment?",
      es: "¿Puedo ver el apartamento?",
      fr: "Je peux voir l'appartement ?",
      de: "Kann ich die Wohnung besichtigen?",
      it: "Posso vedere l'appartamento?",
      pt: "Posso ver o apartamento?",
      zh: "我可以看看公寓吗？",
      ja: "アパートを見てもいいですか？",
      ko: "집을 볼 수 있을까요?",
      pl: "Czy mogę obejrzeć mieszkanie?"
    },
    {
      en: "How much is the deposit?",
      es: "¿Cuánto es el depósito?",
      fr: "Quel est le montant de la caution ?",
      de: "Wie hoch ist die Kaution?",
      it: "Quanto costa il deposito?",
      pt: "Qual é o valor do depósito?",
      zh: "押金是多少？",
      ja: "敷金はいくらですか？",
      ko: "보증금이 얼마예요?",
      pl: "Ile wynosi kaucja?"
    },
    {
      en: "Is it furnished?",
      es: "¿Está amueblado?",
      fr: "Il est meublé ?",
      de: "Ist sie möbliert?",
      it: "È arredato?",
      pt: "É mobiliado?",
      zh: "带家具吗？",
      ja: "家具付きですか？",
      ko: "가구가 포함돼 있나요?",
      pl: "Czy jest umeblowane?"
    },
    {
      en: "When is it available?",
      es: "¿Cuándo está disponible?",
      fr: "Quand est-il disponible ?",
      de: "Wann ist sie verfügbar?",
      it: "Quando è disponibile?",
      pt: "Quando está disponível?",
      zh: "什么时候可以入住？",
      ja: "いつから入居できますか？",
      ko: "언제부터 입주 가능해요?",
      pl: "Kiedy jest dostępne?"
    },
    {
      en: "Are pets allowed?",
      es: "¿Se permiten mascotas?",
      fr: "Les animaux sont-ils autorisés ?",
      de: "Sind Haustiere erlaubt?",
      it: "Gli animali sono ammessi?",
      pt: "Animais são permitidos?",
      zh: "可以养宠物吗？",
      ja: "ペットは大丈夫ですか？",
      ko: "반려동물 가능해요?",
      pl: "Czy zwierzęta są dozwolone?"
    },
    {
      en: "Is there a washing machine?",
      es: "¿Hay lavadora?",
      fr: "Il y a une machine à laver ?",
      de: "Gibt es eine Waschmaschine?",
      it: "C'è una lavatrice?",
      pt: "Tem máquina de lavar?",
      zh: "有洗衣机吗？",
      ja: "洗濯機はありますか？",
      ko: "세탁기 있어요?",
      pl: "Czy jest pralka?"
    },
    {
      en: "How long is the contract?",
      es: "¿Cuánto dura el contrato?",
      fr: "Combien de temps dure le contrat ?",
      de: "Wie lange läuft der Vertrag?",
      it: "Quanto dura il contratto?",
      pt: "Quanto tempo dura o contrato?",
      zh: "合同多长时间？",
      ja: "契約期間はどのくらいですか？",
      ko: "계약 기간이 얼마나 되나요?",
      pl: "Jak długo trwa umowa?"
    },
    {
      en: "The location is perfect",
      es: "La ubicación es perfecta",
      fr: "L'emplacement est parfait",
      de: "Die Lage ist perfekt",
      it: "La posizione è perfetta",
      pt: "A localização é perfeita",
      zh: "位置非常好。",
      ja: "立地が完璧です。",
      ko: "위치가 완벽해요.",
      pl: "Lokalizacja jest idealna"
    }
  ],
  "phone-call": [
    {
      en: "Could you repeat that, please?",
      es: "¿Podría repetirlo, por favor?",
      fr: "Pouvez-vous répéter, s'il vous plaît ?",
      de: "Könnten Sie das bitte wiederholen?",
      it: "Potrebbe ripetere, per favore?",
      pt: "Pode repetir, por favor?",
      zh: "您可以再说一遍吗？",
      ja: "もう一度言っていただけますか？",
      ko: "다시 말씀해 주시겠어요?",
      pl: "Czy może pan/pani powtórzyć?"
    },
    {
      en: "The line is bad",
      es: "La línea está mal",
      fr: "La ligne est mauvaise",
      de: "Die Verbindung ist schlecht",
      it: "La linea è disturbata",
      pt: "A linha está ruim",
      zh: "信号不好。",
      ja: "回線が悪いです。",
      ko: "통화 상태가 안 좋아요.",
      pl: "Połączenie jest słabe"
    },
    {
      en: "Can you speak more slowly?",
      es: "¿Puede hablar más despacio?",
      fr: "Pouvez-vous parler plus lentement ?",
      de: "Können Sie langsamer sprechen?",
      it: "Può parlare più lentamente?",
      pt: "Pode falar mais devagar?",
      zh: "您可以说慢一点吗？",
      ja: "もう少しゆっくり話していただけますか？",
      ko: "조금 더 천천히 말씀해 주실 수 있나요?",
      pl: "Czy może pan/pani mówić wolniej?"
    },
    {
      en: "Could you call me back later?",
      es: "¿Podría llamarme más tarde?",
      fr: "Pouvez-vous me rappeler plus tard ?",
      de: "Könnten Sie mich später zurückrufen?",
      it: "Potrebbe richiamarmi più tardi?",
      pt: "Pode me ligar mais tarde?",
      zh: "您可以晚点再打给我吗？",
      ja: "後でかけ直してもらえますか？",
      ko: "나중에 다시 전화해 주실 수 있나요?",
      pl: "Czy może pan/pani oddzwonić później?"
    },
    {
      en: "I'm calling about...",
      es: "Llamo por...",
      fr: "J'appelle au sujet de...",
      de: "Ich rufe wegen ... an",
      it: "Chiamo per...",
      pt: "Estou ligando por causa de...",
      zh: "我打电话是关于……",
      ja: "…についてお電話しています。",
      ko: "… 때문에 전화드렸습니다.",
      pl: "Dzwonię w sprawie..."
    },
    {
      en: "Can you hear me clearly?",
      es: "¿Me oye bien?",
      fr: "Vous m'entendez bien ?",
      de: "Können Sie mich gut hören?",
      it: "Mi sente bene?",
      pt: "Você me ouve bem?",
      zh: "您能听清吗？",
      ja: "よく聞こえますか？",
      ko: "제 말 잘 들리세요?",
      pl: "Czy dobrze mnie słychać?"
    },
    {
      en: "Please leave a message",
      es: "Por favor, deje un mensaje",
      fr: "Veuillez laisser un message",
      de: "Bitte hinterlassen Sie eine Nachricht",
      it: "Per favore, lasci un messaggio",
      pt: "Por favor, deixe uma mensagem",
      zh: "请留言。",
      ja: "メッセージを残してください。",
      ko: "메시지를 남겨 주세요.",
      pl: "Proszę zostawić wiadomość"
    },
    {
      en: "I'll send an email too",
      es: "También enviaré un correo",
      fr: "J'enverrai aussi un e-mail",
      de: "Ich schicke auch eine E-Mail",
      it: "Manderò anche un'e-mail",
      pt: "Também vou enviar um e-mail",
      zh: "我也会发一封邮件。",
      ja: "メールも送ります。",
      ko: "이메일도 보내겠습니다.",
      pl: "Wyślę też e-mail"
    }
  ],
  gym: [
    {
      en: "I want to sign up",
      es: "Quiero inscribirme",
      fr: "Je veux m'inscrire",
      de: "Ich möchte mich anmelden",
      it: "Voglio iscrivermi",
      pt: "Quero me inscrever",
      zh: "我想报名。",
      ja: "入会したいです。",
      ko: "등록하고 싶어요.",
      pl: "Chcę się zapisać"
    },
    {
      en: "Do you have a day pass?",
      es: "¿Tienen pase diario?",
      fr: "Vous avez un pass à la journée ?",
      de: "Haben Sie eine Tageskarte?",
      it: "Avete un pass giornaliero?",
      pt: "Vocês têm passe diário?",
      zh: "有日票吗？",
      ja: "1日券はありますか？",
      ko: "일일권 있나요?",
      pl: "Czy macie karnet jednodniowy?"
    },
    {
      en: "Where are the lockers?",
      es: "¿Dónde están las taquillas?",
      fr: "Où sont les casiers ?",
      de: "Wo sind die Schließfächer?",
      it: "Dove sono gli armadietti?",
      pt: "Onde ficam os armários?",
      zh: "储物柜在哪里？",
      ja: "ロッカーはどこですか？",
      ko: "사물함이 어디예요?",
      pl: "Gdzie są szafki?"
    },
    {
      en: "How do I use this machine?",
      es: "¿Cómo uso esta máquina?",
      fr: "Comment utiliser cette machine ?",
      de: "Wie benutze ich dieses Gerät?",
      it: "Come si usa questa macchina?",
      pt: "Como uso essa máquina?",
      zh: "这个器械怎么用？",
      ja: "このマシンはどう使いますか？",
      ko: "이 기구는 어떻게 사용해요?",
      pl: "Jak używać tej maszyny?"
    },
    {
      en: "Is there a yoga class today?",
      es: "¿Hay clase de yoga hoy?",
      fr: "Il y a un cours de yoga aujourd'hui ?",
      de: "Gibt es heute einen Yogakurs?",
      it: "C'è un corso di yoga oggi?",
      pt: "Tem aula de yoga hoje?",
      zh: "今天有瑜伽课吗？",
      ja: "今日はヨガのクラスがありますか？",
      ko: "오늘 요가 수업 있나요?",
      pl: "Czy jest dziś joga?"
    },
    {
      en: "Do you have showers?",
      es: "¿Tienen duchas?",
      fr: "Vous avez des douches ?",
      de: "Gibt es Duschen?",
      it: "Avete docce?",
      pt: "Vocês têm chuveiros?",
      zh: "有淋浴吗？",
      ja: "シャワーはありますか？",
      ko: "샤워실 있나요?",
      pl: "Czy są prysznice?"
    },
    {
      en: "I need help with my workout",
      es: "Necesito ayuda con mi entrenamiento",
      fr: "J'ai besoin d'aide pour mon entraînement",
      de: "Ich brauche Hilfe beim Training",
      it: "Ho bisogno di aiuto con il mio allenamento",
      pt: "Preciso de ajuda com meu treino",
      zh: "我需要训练方面的帮助。",
      ja: "トレーニングを手伝ってほしいです。",
      ko: "운동 도움 좀 필요해요.",
      pl: "Potrzebuję pomocy z treningiem"
    },
    {
      en: "What time do you close?",
      es: "¿A qué hora cierran?",
      fr: "À quelle heure fermez-vous ?",
      de: "Wann schließen Sie?",
      it: "A che ora chiudete?",
      pt: "Que horas vocês fecham?",
      zh: "你们几点关门？",
      ja: "何時に閉まりますか？",
      ko: "몇 시에 닫아요?",
      pl: "O której zamykacie?"
    }
  ],
  bar: [
    {
      en: "A beer, please",
      es: "Una cerveza, por favor",
      fr: "Une bière, s'il vous plaît",
      de: "Ein Bier, bitte",
      it: "Una birra, per favore",
      pt: "Uma cerveja, por favor",
      zh: "一杯啤酒，谢谢。",
      ja: "ビールを一つお願いします。",
      ko: "맥주 한 잔 주세요.",
      pl: "Jedno piwo, proszę"
    },
    {
      en: "What cocktails do you have?",
      es: "¿Qué cócteles tienen?",
      fr: "Quels cocktails avez-vous ?",
      de: "Welche Cocktails haben Sie?",
      it: "Che cocktail avete?",
      pt: "Que coquetéis vocês têm?",
      zh: "你们有什么鸡尾酒？",
      ja: "どんなカクテルがありますか？",
      ko: "칵테일 뭐 있어요?",
      pl: "Jakie macie koktajle?"
    },
    {
      en: "Can I open a tab?",
      es: "¿Puedo abrir una cuenta?",
      fr: "Je peux ouvrir une note ?",
      de: "Kann ich einen Deckel aufmachen?",
      it: "Posso aprire un conto?",
      pt: "Posso abrir uma conta?",
      zh: "我可以记账吗？",
      ja: "ツケにできますか？",
      ko: "탭 열 수 있나요?",
      pl: "Czy mogę otworzyć rachunek?"
    },
    {
      en: "One more round",
      es: "Otra ronda",
      fr: "Une autre tournée",
      de: "Noch eine Runde",
      it: "Un altro giro",
      pt: "Mais uma rodada",
      zh: "再来一轮。",
      ja: "もう一杯ずつ。",
      ko: "한 잔 더요.",
      pl: "Jeszcze jedna kolejka"
    },
    {
      en: "Cheers!",
      es: "¡Salud!",
      fr: "Santé !",
      de: "Prost!",
      it: "Cin cin!",
      pt: "Saúde!",
      zh: "干杯！",
      ja: "乾杯！",
      ko: "건배!",
      pl: "Na zdrowie!"
    },
    {
      en: "Can I have the check?",
      es: "¿Me trae la cuenta?",
      fr: "L'addition, s'il vous plaît",
      de: "Kann ich die Rechnung haben?",
      it: "Posso avere il conto?",
      pt: "Pode trazer a conta?",
      zh: "可以买单吗？",
      ja: "お会計をお願いします。",
      ko: "계산서 주세요.",
      pl: "Czy mogę prosić rachunek?"
    },
    {
      en: "What do you recommend?",
      es: "¿Qué recomienda?",
      fr: "Que recommandez-vous ?",
      de: "Was empfehlen Sie?",
      it: "Cosa consiglia?",
      pt: "O que você recomenda?",
      zh: "你推荐什么？",
      ja: "おすすめは何ですか？",
      ko: "추천해 주실 거 있나요?",
      pl: "Co poleca pan/pani?"
    },
    {
      en: "Is there live music tonight?",
      es: "¿Hay música en vivo esta noche?",
      fr: "Il y a de la musique live ce soir ?",
      de: "Gibt es heute Abend Livemusik?",
      it: "C'è musica dal vivo stasera?",
      pt: "Tem música ao vivo hoje à noite?",
      zh: "今晚有现场音乐吗？",
      ja: "今夜はライブ音楽がありますか？",
      ko: "오늘 밤 라이브 음악 있어요?",
      pl: "Czy dziś wieczorem jest muzyka na żywo?"
    }
  ],
  travel: [
    {
      en: "Can you recommend a place to visit?",
      es: "¿Puede recomendarme un lugar para visitar?",
      fr: "Pouvez-vous me recommander un endroit à visiter ?",
      de: "Können Sie mir einen Ort empfehlen?",
      it: "Può consigliarmi un posto da visitare?",
      pt: "Pode me recomendar um lugar para visitar?",
      zh: "您能推荐一个值得去的地方吗？",
      ja: "おすすめの場所はありますか？",
      ko: "추천할 만한 곳이 있나요?",
      pl: "Czy może pan/pani polecić jakieś miejsce do odwiedzenia?"
    },
    {
      en: "How much is the ticket?",
      es: "¿Cuánto cuesta la entrada?",
      fr: "Combien coûte le billet ?",
      de: "Wie viel kostet die Eintrittskarte?",
      it: "Quanto costa il biglietto?",
      pt: "Quanto custa o ingresso?",
      zh: "门票多少钱？",
      ja: "入場券はいくらですか？",
      ko: "입장권 얼마예요?",
      pl: "Ile kosztuje bilet?"
    },
    {
      en: "What time does it open?",
      es: "¿A qué hora abre?",
      fr: "À quelle heure ça ouvre ?",
      de: "Wann öffnet es?",
      it: "A che ora apre?",
      pt: "Que horas abre?",
      zh: "几点开门？",
      ja: "何時に開きますか？",
      ko: "몇 시에 열어요?",
      pl: "O której otwierają?"
    },
    {
      en: "Is there a guided tour?",
      es: "¿Hay una visita guiada?",
      fr: "Y a-t-il une visite guidée ?",
      de: "Gibt es eine Führung?",
      it: "C'è una visita guidata?",
      pt: "Tem visita guiada?",
      zh: "有导览吗？",
      ja: "ガイドツアーはありますか？",
      ko: "가이드 투어 있나요?",
      pl: "Czy jest zwiedzanie z przewodnikiem?"
    },
    {
      en: "Can I take photos here?",
      es: "¿Puedo tomar fotos aquí?",
      fr: "Je peux prendre des photos ici ?",
      de: "Darf ich hier Fotos machen?",
      it: "Posso fare foto qui?",
      pt: "Posso tirar fotos aqui?",
      zh: "这里可以拍照吗？",
      ja: "ここで写真を撮ってもいいですか？",
      ko: "여기서 사진 찍어도 되나요?",
      pl: "Czy mogę tu robić zdjęcia?"
    },
    {
      en: "Where is the tourist office?",
      es: "¿Dónde está la oficina de turismo?",
      fr: "Où est l'office de tourisme ?",
      de: "Wo ist die Touristeninformation?",
      it: "Dov'è l'ufficio turistico?",
      pt: "Onde fica o posto de turismo?",
      zh: "游客中心在哪里？",
      ja: "観光案内所はどこですか？",
      ko: "관광 안내소가 어디예요?",
      pl: "Gdzie jest informacja turystyczna?"
    },
    {
      en: "Is this nearby?",
      es: "¿Está cerca?",
      fr: "C'est à proximité ?",
      de: "Ist das in der Nähe?",
      it: "È vicino?",
      pt: "É perto?",
      zh: "离这里近吗？",
      ja: "近いですか？",
      ko: "가까워요?",
      pl: "Czy to jest blisko?"
    },
    {
      en: "Do I need to book in advance?",
      es: "¿Necesito reservar con antelación?",
      fr: "Dois-je réserver à l'avance ?",
      de: "Muss ich im Voraus buchen?",
      it: "Devo prenotare in anticipo?",
      pt: "Preciso reservar com antecedência?",
      zh: "需要提前预约吗？",
      ja: "事前予約が必要ですか？",
      ko: "미리 예약해야 하나요?",
      pl: "Czy muszę zarezerwować wcześniej?"
    }
  ],
  directions: [
    {
      en: "Turn left at the corner",
      es: "Gire a la izquierda en la esquina",
      fr: "Tournez à gauche au coin",
      de: "Biegen Sie an der Ecke links ab",
      it: "Giri a sinistra all'angolo",
      pt: "Vire à esquerda na esquina",
      zh: "在拐角处左转。",
      ja: "角を左に曲がってください。",
      ko: "모퉁이에서 왼쪽으로 도세요.",
      pl: "Skręć w lewo na rogu"
    },
    {
      en: "Go straight ahead",
      es: "Siga todo recto",
      fr: "Allez tout droit",
      de: "Gehen Sie geradeaus",
      it: "Vada dritto",
      pt: "Siga em frente",
      zh: "一直往前走。",
      ja: "まっすぐ行ってください。",
      ko: "쭉 가세요.",
      pl: "Idź prosto"
    },
    {
      en: "It's next to the bank",
      es: "Está al lado del banco",
      fr: "C'est à côté de la banque",
      de: "Es ist neben der Bank",
      it: "È accanto alla banca",
      pt: "Fica ao lado do banco",
      zh: "它在银行旁边。",
      ja: "銀行の隣です。",
      ko: "은행 옆에 있어요.",
      pl: "To jest obok banku"
    },
    {
      en: "It's across from the station",
      es: "Está enfrente de la estación",
      fr: "C'est en face de la gare",
      de: "Es ist gegenüber vom Bahnhof",
      it: "È di fronte alla stazione",
      pt: "Fica em frente à estação",
      zh: "它在车站对面。",
      ja: "駅の向かいです。",
      ko: "역 맞은편에 있어요.",
      pl: "To jest naprzeciwko stacji"
    },
    {
      en: "You can't miss it",
      es: "No tiene pérdida",
      fr: "Vous ne pouvez pas le manquer",
      de: "Sie können es nicht verfehlen",
      it: "Non può sbagliarsi",
      pt: "Não tem erro",
      zh: "你不会错过的。",
      ja: "すぐわかります。",
      ko: "바로 찾을 수 있을 거예요.",
      pl: "Nie da się tego ominąć"
    },
    {
      en: "How far is it on foot?",
      es: "¿Qué tan lejos está caminando?",
      fr: "C'est à quelle distance à pied ?",
      de: "Wie weit ist es zu Fuß?",
      it: "Quanto dista a piedi?",
      pt: "Fica a que distância a pé?",
      zh: "走路有多远？",
      ja: "歩くとどのくらいですか？",
      ko: "걸어서 얼마나 걸려요?",
      pl: "Jak daleko jest pieszo?"
    },
    {
      en: "Take the second street on the right",
      es: "Tome la segunda calle a la derecha",
      fr: "Prenez la deuxième rue à droite",
      de: "Nehmen Sie die zweite Straße rechts",
      it: "Prenda la seconda strada a destra",
      pt: "Pegue a segunda rua à direita",
      zh: "走第二个路口右转。",
      ja: "二つ目の角を右に曲がってください。",
      ko: "두 번째 길에서 오른쪽으로 가세요.",
      pl: "Skręć w drugą ulicę w prawo"
    },
    {
      en: "Is there a bus stop nearby?",
      es: "¿Hay una parada de autobús cerca?",
      fr: "Y a-t-il un arrêt de bus à proximité ?",
      de: "Gibt es hier in der Nähe eine Bushaltestelle?",
      it: "C'è una fermata dell'autobus qui vicino?",
      pt: "Tem um ponto de ônibus por perto?",
      zh: "附近有公交站吗？",
      ja: "近くにバス停はありますか？",
      ko: "근처에 버스 정류장 있나요?",
      pl: "Czy w pobliżu jest przystanek autobusowy?"
    }
  ],
  university: [
    {
      en: "Which classroom is it in?",
      es: "¿En qué aula es?",
      fr: "Dans quelle salle est-ce ?",
      de: "In welchem Raum ist es?",
      it: "In quale aula si trova?",
      pt: "Em qual sala é?",
      zh: "在哪个教室？",
      ja: "どの教室ですか？",
      ko: "어느 강의실이에요?",
      pl: "W której sali to jest?"
    },
    {
      en: "I have a question about the assignment",
      es: "Tengo una pregunta sobre la tarea",
      fr: "J'ai une question sur le devoir",
      de: "Ich habe eine Frage zur Aufgabe",
      it: "Ho una domanda sul compito",
      pt: "Tenho uma pergunta sobre a tarefa",
      zh: "我有一个关于作业的问题。",
      ja: "課題について質問があります。",
      ko: "과제에 대해 질문이 있어요.",
      pl: "Mam pytanie dotyczące zadania"
    },
    {
      en: "Can you explain this again?",
      es: "¿Puede explicarlo otra vez?",
      fr: "Pouvez-vous l'expliquer encore une fois ?",
      de: "Können Sie das noch einmal erklären?",
      it: "Può spiegarlo di nuovo?",
      pt: "Pode explicar isso de novo?",
      zh: "您能再解释一遍吗？",
      ja: "もう一度説明していただけますか？",
      ko: "다시 설명해 주실 수 있나요?",
      pl: "Czy może pan/pani wyjaśnić to jeszcze raz?"
    },
    {
      en: "When is the exam?",
      es: "¿Cuándo es el examen?",
      fr: "Quand est l'examen ?",
      de: "Wann ist die Prüfung?",
      it: "Quando è l'esame?",
      pt: "Quando é a prova?",
      zh: "考试是什么时候？",
      ja: "試験はいつですか？",
      ko: "시험이 언제예요?",
      pl: "Kiedy jest egzamin?"
    },
    {
      en: "Can I borrow your notes?",
      es: "¿Puedo tomar prestados tus apuntes?",
      fr: "Je peux emprunter tes notes ?",
      de: "Kann ich mir deine Notizen ausleihen?",
      it: "Posso prendere in prestito i tuoi appunti?",
      pt: "Posso pegar seus apontamentos emprestados?",
      zh: "我可以借你的笔记吗？",
      ja: "ノートを借りてもいいですか？",
      ko: "노트 빌려도 될까요?",
      pl: "Czy mogę pożyczyć twoje notatki?"
    },
    {
      en: "I need help studying",
      es: "Necesito ayuda para estudiar",
      fr: "J'ai besoin d'aide pour étudier",
      de: "Ich brauche Hilfe beim Lernen",
      it: "Ho bisogno di aiuto per studiare",
      pt: "Preciso de ajuda para estudar",
      zh: "我需要学习上的帮助。",
      ja: "勉強の助けが必要です。",
      ko: "공부하는 데 도움이 필요해요.",
      pl: "Potrzebuję pomocy w nauce"
    },
    {
      en: "Where is the library?",
      es: "¿Dónde está la biblioteca?",
      fr: "Où est la bibliothèque ?",
      de: "Wo ist die Bibliothek?",
      it: "Dov'è la biblioteca?",
      pt: "Onde fica a biblioteca?",
      zh: "图书馆在哪里？",
      ja: "図書館はどこですか？",
      ko: "도서관이 어디예요?",
      pl: "Gdzie jest biblioteka?"
    },
    {
      en: "Is attendance mandatory?",
      es: "¿La asistencia es obligatoria?",
      fr: "La présence est-elle obligatoire ?",
      de: "Ist Anwesenheit Pflicht?",
      it: "La presenza è obbligatoria?",
      pt: "A presença é obrigatória?",
      zh: "必须出勤吗？",
      ja: "出席は必須ですか？",
      ko: "출석이 필수인가요?",
      pl: "Czy obecność jest obowiązkowa?"
    }
  ],
  emergency: [
    {
      en: "I need help right now",
      es: "Necesito ayuda ahora mismo",
      fr: "J'ai besoin d'aide tout de suite",
      de: "Ich brauche sofort Hilfe",
      it: "Ho bisogno di aiuto subito",
      pt: "Preciso de ajuda agora mesmo",
      zh: "我现在就需要帮助。",
      ja: "今すぐ助けが必要です。",
      ko: "지금 당장 도움이 필요해요.",
      pl: "Potrzebuję pomocy natychmiast"
    },
    {
      en: "There has been an accident",
      es: "Ha habido un accidente",
      fr: "Il y a eu un accident",
      de: "Es gab einen Unfall",
      it: "C'è stato un incidente",
      pt: "Houve um acidente",
      zh: "发生了事故。",
      ja: "事故がありました。",
      ko: "사고가 났어요.",
      pl: "Był wypadek"
    },
    {
      en: "Someone is injured",
      es: "Alguien está herido",
      fr: "Quelqu'un est blessé",
      de: "Jemand ist verletzt",
      it: "Qualcuno è ferito",
      pt: "Alguém está ferido",
      zh: "有人受伤了。",
      ja: "けが人がいます。",
      ko: "다친 사람이 있어요.",
      pl: "Ktoś jest ranny"
    },
    {
      en: "What is the emergency number?",
      es: "¿Cuál es el número de emergencia?",
      fr: "Quel est le numéro d'urgence ?",
      de: "Wie lautet die Notrufnummer?",
      it: "Qual è il numero di emergenza?",
      pt: "Qual é o número de emergência?",
      zh: "紧急电话是多少？",
      ja: "緊急番号は何ですか？",
      ko: "긴급 전화번호가 뭐예요?",
      pl: "Jaki jest numer alarmowy?"
    },
    {
      en: "I lost my passport",
      es: "Perdí mi pasaporte",
      fr: "J'ai perdu mon passeport",
      de: "Ich habe meinen Pass verloren",
      it: "Ho perso il passaporto",
      pt: "Perdi meu passaporte",
      zh: "我把护照丢了。",
      ja: "パスポートをなくしました。",
      ko: "여권을 잃어버렸어요.",
      pl: "Zgubiłem paszport"
    },
    {
      en: "Please come quickly",
      es: "Por favor, venga rápido",
      fr: "Venez vite, s'il vous plaît",
      de: "Kommen Sie bitte schnell",
      it: "Per favore, venga presto",
      pt: "Por favor, venha rápido",
      zh: "请快点来。",
      ja: "早く来てください。",
      ko: "빨리 와 주세요.",
      pl: "Proszę przyjechać szybko"
    },
    {
      en: "I need the police",
      es: "Necesito a la policía",
      fr: "J'ai besoin de la police",
      de: "Ich brauche die Polizei",
      it: "Ho bisogno della polizia",
      pt: "Preciso da polícia",
      zh: "我需要警察。",
      ja: "警察が必要です。",
      ko: "경찰이 필요해요.",
      pl: "Potrzebuję policji"
    },
    {
      en: "Where is the nearest hospital?",
      es: "¿Dónde está el hospital más cercano?",
      fr: "Où est l'hôpital le plus proche ?",
      de: "Wo ist das nächste Krankenhaus?",
      it: "Dov'è l'ospedale più vicino?",
      pt: "Onde fica o hospital mais próximo?",
      zh: "最近的医院在哪里？",
      ja: "一番近い病院はどこですか？",
      ko: "가장 가까운 병원이 어디예요?",
      pl: "Gdzie jest najbliższy szpital?"
    }
  ],
  "post-office": [
    {
      en: "I need to send this letter",
      es: "Necesito enviar esta carta",
      fr: "Je dois envoyer cette lettre",
      de: "Ich muss diesen Brief verschicken",
      it: "Devo spedire questa lettera",
      pt: "Preciso enviar esta carta",
      zh: "我需要寄这封信。",
      ja: "この手紙を送りたいです。",
      ko: "이 편지를 보내야 해요.",
      pl: "Muszę wysłać ten list"
    },
    {
      en: "How much is a stamp?",
      es: "¿Cuánto cuesta un sello?",
      fr: "Combien coûte un timbre ?",
      de: "Wie viel kostet eine Briefmarke?",
      it: "Quanto costa un francobollo?",
      pt: "Quanto custa um selo?",
      zh: "邮票多少钱？",
      ja: "切手はいくらですか？",
      ko: "우표 얼마예요?",
      pl: "Ile kosztuje znaczek?"
    },
    {
      en: "I want to send a package",
      es: "Quiero enviar un paquete",
      fr: "Je veux envoyer un colis",
      de: "Ich möchte ein Paket verschicken",
      it: "Voglio spedire un pacco",
      pt: "Quero enviar um pacote",
      zh: "我想寄一个包裹。",
      ja: "荷物を送りたいです。",
      ko: "소포를 보내고 싶어요.",
      pl: "Chcę wysłać paczkę"
    },
    {
      en: "How long will it take?",
      es: "¿Cuánto tardará?",
      fr: "Combien de temps cela prendra-t-il ?",
      de: "Wie lange dauert es?",
      it: "Quanto ci vorrà?",
      pt: "Quanto tempo vai levar?",
      zh: "要多久？",
      ja: "どのくらいかかりますか？",
      ko: "얼마나 걸려요?",
      pl: "Ile to zajmie?"
    },
    {
      en: "Do I need to fill out a form?",
      es: "¿Necesito rellenar un formulario?",
      fr: "Dois-je remplir un formulaire ?",
      de: "Muss ich ein Formular ausfüllen?",
      it: "Devo compilare un modulo?",
      pt: "Preciso preencher um formulário?",
      zh: "我需要填写表格吗？",
      ja: "用紙に記入する必要がありますか？",
      ko: "양식을 작성해야 하나요?",
      pl: "Czy muszę wypełnić formularz?"
    },
    {
      en: "Can I track the package?",
      es: "¿Puedo rastrear el paquete?",
      fr: "Puis-je suivre le colis ?",
      de: "Kann ich das Paket verfolgen?",
      it: "Posso tracciare il pacco?",
      pt: "Posso rastrear o pacote?",
      zh: "我可以追踪包裹吗？",
      ja: "荷物を追跡できますか？",
      ko: "소포 추적이 가능한가요?",
      pl: "Czy mogę śledzić paczkę?"
    },
    {
      en: "Express shipping, please",
      es: "Envío urgente, por favor",
      fr: "Envoi express, s'il vous plaît",
      de: "Expressversand, bitte",
      it: "Spedizione espressa, per favore",
      pt: "Envio expresso, por favor",
      zh: "请用快递。",
      ja: "速達でお願いします。",
      ko: "빠른 배송으로 부탁해요.",
      pl: "Przesyłka ekspresowa, proszę"
    },
    {
      en: "Where do I write the address?",
      es: "¿Dónde escribo la dirección?",
      fr: "Où est-ce que j'écris l'adresse ?",
      de: "Wo schreibe ich die Adresse hin?",
      it: "Dove scrivo l'indirizzo?",
      pt: "Onde escrevo o endereço?",
      zh: "地址写在哪里？",
      ja: "住所はどこに書きますか？",
      ko: "주소는 어디에 적어요?",
      pl: "Gdzie mam napisać adres?"
    }
  ],
  date: [
    {
      en: "You look nice",
      es: "Te ves bien",
      fr: "Tu es très bien",
      de: "Du siehst gut aus",
      it: "Stai bene",
      pt: "Você está bonito/a",
      zh: "你看起来很好。",
      ja: "素敵ですね。",
      ko: "멋져 보여요.",
      pl: "Świetnie wyglądasz"
    },
    {
      en: "What do you like to do for fun?",
      es: "¿Qué te gusta hacer para divertirte?",
      fr: "Qu'est-ce que tu aimes faire pour t'amuser ?",
      de: "Was machst du gern zum Spaß?",
      it: "Cosa ti piace fare per divertirti?",
      pt: "O que você gosta de fazer por diversão?",
      zh: "你平时喜欢做什么？",
      ja: "趣味は何ですか？",
      ko: "취미가 뭐예요?",
      pl: "Co lubisz robić dla zabawy?"
    },
    {
      en: "Do you want another drink?",
      es: "¿Quieres otra bebida?",
      fr: "Tu veux encore à boire ?",
      de: "Möchtest du noch etwas trinken?",
      it: "Vuoi un'altra bevanda?",
      pt: "Quer outra bebida?",
      zh: "你还想喝点什么吗？",
      ja: "もう一杯どうですか？",
      ko: "한 잔 더 할래요?",
      pl: "Chcesz jeszcze coś do picia?"
    },
    {
      en: "I'm having a great time",
      es: "Lo estoy pasando muy bien",
      fr: "Je passe un très bon moment",
      de: "Ich habe eine tolle Zeit",
      it: "Mi sto divertendo molto",
      pt: "Estou me divertindo muito",
      zh: "我玩得很开心。",
      ja: "とても楽しいです。",
      ko: "정말 즐거워요.",
      pl: "Bardzo dobrze się bawię"
    },
    {
      en: "Would you like to meet again?",
      es: "¿Te gustaría vernos otra vez?",
      fr: "Tu voudrais qu'on se revoie ?",
      de: "Möchtest du dich noch einmal treffen?",
      it: "Ti andrebbe di rivederci?",
      pt: "Gostaria de nos encontrarmos de novo?",
      zh: "你想再见一次吗？",
      ja: "また会いたいですか？",
      ko: "또 만날래요?",
      pl: "Chciał(a)byś spotkać się jeszcze raz?"
    },
    {
      en: "I'd like to get to know you better",
      es: "Me gustaría conocerte mejor",
      fr: "J'aimerais mieux te connaître",
      de: "Ich würde dich gern besser kennenlernen",
      it: "Mi piacerebbe conoscerti meglio",
      pt: "Gostaria de te conhecer melhor",
      zh: "我想更了解你。",
      ja: "もっとあなたのことを知りたいです。",
      ko: "당신을 더 알고 싶어요.",
      pl: "Chciał(a)bym lepiej cię poznać"
    },
    {
      en: "Shall we share dessert?",
      es: "¿Compartimos postre?",
      fr: "On partage un dessert ?",
      de: "Wollen wir ein Dessert teilen?",
      it: "Condividiamo un dolce?",
      pt: "Vamos dividir uma sobremesa?",
      zh: "我们一起吃甜点吗？",
      ja: "デザートをシェアしませんか？",
      ko: "디저트 같이 먹을래요?",
      pl: "Podzielimy się deserem?"
    },
    {
      en: "It was lovely meeting you",
      es: "Fue un placer conocerte",
      fr: "C'était un plaisir de te rencontrer",
      de: "Es war schön, dich kennenzulernen",
      it: "È stato un piacere conoscerti",
      pt: "Foi um prazer te conhecer",
      zh: "很高兴认识你。",
      ja: "会えてよかったです。",
      ko: "만나서 정말 좋았어요.",
      pl: "Miło było cię poznać"
    }
  ],
  office: [
    {
      en: "Can we schedule a meeting?",
      es: "¿Podemos programar una reunión?",
      fr: "Peut-on programmer une réunion ?",
      de: "Können wir ein Meeting planen?",
      it: "Possiamo programmare una riunione?",
      pt: "Podemos marcar uma reunião?",
      zh: "我们可以安排一个会议吗？",
      ja: "会議を予定できますか？",
      ko: "회의를 잡을 수 있을까요?",
      pl: "Czy możemy zaplanować spotkanie?"
    },
    {
      en: "I sent you an email",
      es: "Le envié un correo",
      fr: "Je vous ai envoyé un e-mail",
      de: "Ich habe Ihnen eine E-Mail geschickt",
      it: "Le ho mandato un'e-mail",
      pt: "Enviei um e-mail para você",
      zh: "我给你发了邮件。",
      ja: "メールを送りました。",
      ko: "이메일 보냈어요.",
      pl: "Wysłałem/am ci e-mail"
    },
    {
      en: "Let's discuss the project",
      es: "Hablemos del proyecto",
      fr: "Discutons du projet",
      de: "Lassen Sie uns das Projekt besprechen",
      it: "Parliamo del progetto",
      pt: "Vamos discutir o projeto",
      zh: "我们讨论一下这个项目吧。",
      ja: "そのプロジェクトについて話し合いましょう。",
      ko: "프로젝트에 대해 이야기해 봅시다.",
      pl: "Omówmy projekt"
    },
    {
      en: "I need more time",
      es: "Necesito más tiempo",
      fr: "J'ai besoin de plus de temps",
      de: "Ich brauche mehr Zeit",
      it: "Ho bisogno di più tempo",
      pt: "Preciso de mais tempo",
      zh: "我需要更多时间。",
      ja: "もう少し時間が必要です。",
      ko: "시간이 더 필요해요.",
      pl: "Potrzebuję więcej czasu"
    },
    {
      en: "Can you send me the file?",
      es: "¿Puede enviarme el archivo?",
      fr: "Pouvez-vous m'envoyer le fichier ?",
      de: "Können Sie mir die Datei schicken?",
      it: "Può inviarmi il file?",
      pt: "Pode me enviar o arquivo?",
      zh: "您可以把文件发给我吗？",
      ja: "ファイルを送ってもらえますか？",
      ko: "파일 보내주실 수 있나요?",
      pl: "Czy może mi pan/pani wysłać plik?"
    },
    {
      en: "The deadline is tomorrow",
      es: "La fecha límite es mañana",
      fr: "La date limite est demain",
      de: "Die Frist ist morgen",
      it: "La scadenza è domani",
      pt: "O prazo é amanhã",
      zh: "截止日期是明天。",
      ja: "締め切りは明日です。",
      ko: "마감일은 내일이에요.",
      pl: "Termin jest jutro"
    },
    {
      en: "Thank you for the update",
      es: "Gracias por la actualización",
      fr: "Merci pour la mise à jour",
      de: "Danke für das Update",
      it: "Grazie per l'aggiornamento",
      pt: "Obrigado pela atualização",
      zh: "谢谢你的更新。",
      ja: "更新ありがとうございます。",
      ko: "업데이트 감사합니다.",
      pl: "Dziękuję za aktualizację"
    },
    {
      en: "I'm available this afternoon",
      es: "Estoy disponible esta tarde",
      fr: "Je suis disponible cet après-midi",
      de: "Ich bin heute Nachmittag verfügbar",
      it: "Sono disponibile questo pomeriggio",
      pt: "Estou disponível esta tarde",
      zh: "我今天下午有空。",
      ja: "今日の午後は空いています。",
      ko: "오늘 오후에 시간 돼요.",
      pl: "Jestem dostępny/a dziś po południu"
    }
  ],
  weather: [
    {
      en: "It's sunny today",
      es: "Hoy hace sol",
      fr: "Il fait beau aujourd'hui",
      de: "Heute ist es sonnig",
      it: "Oggi c'è il sole",
      pt: "Hoje está ensolarado",
      zh: "今天天气晴朗。",
      ja: "今日は晴れです。",
      ko: "오늘은 맑아요.",
      pl: "Dziś jest słonecznie"
    },
    {
      en: "It looks like rain",
      es: "Parece que va a llover",
      fr: "On dirait qu'il va pleuvoir",
      de: "Es sieht nach Regen aus",
      it: "Sembra che pioverà",
      pt: "Parece que vai chover",
      zh: "看起来要下雨了。",
      ja: "雨が降りそうです。",
      ko: "비가 올 것 같아요.",
      pl: "Wygląda na deszcz"
    },
    {
      en: "It's really cold outside",
      es: "Hace mucho frío afuera",
      fr: "Il fait très froid dehors",
      de: "Draußen ist es sehr kalt",
      it: "Fuori fa molto freddo",
      pt: "Está muito frio lá fora",
      zh: "外面很冷。",
      ja: "外はとても寒いです。",
      ko: "밖에 정말 추워요.",
      pl: "Na zewnątrz jest bardzo zimno"
    },
    {
      en: "Do you like this weather?",
      es: "¿Te gusta este clima?",
      fr: "Tu aimes ce temps ?",
      de: "Magst du dieses Wetter?",
      it: "Ti piace questo tempo?",
      pt: "Você gosta deste clima?",
      zh: "你喜欢这种天气吗？",
      ja: "この天気は好きですか？",
      ko: "이 날씨 좋아하세요?",
      pl: "Lubisz taką pogodę?"
    },
    {
      en: "I forgot my umbrella",
      es: "Olvidé mi paraguas",
      fr: "J'ai oublié mon parapluie",
      de: "Ich habe meinen Regenschirm vergessen",
      it: "Ho dimenticato l'ombrello",
      pt: "Esqueci meu guarda-chuva",
      zh: "我忘带伞了。",
      ja: "傘を忘れました。",
      ko: "우산을 두고 왔어요.",
      pl: "Zapomniałem/am parasola"
    },
    {
      en: "It's windy today",
      es: "Hace viento hoy",
      fr: "Il y a du vent aujourd'hui",
      de: "Heute ist es windig",
      it: "Oggi c'è vento",
      pt: "Hoje está ventando",
      zh: "今天风很大。",
      ja: "今日は風が強いです。",
      ko: "오늘 바람이 많이 불어요.",
      pl: "Dziś jest wietrznie"
    },
    {
      en: "The forecast says snow",
      es: "El pronóstico dice que nevará",
      fr: "La météo annonce de la neige",
      de: "Die Vorhersage sagt Schnee",
      it: "Le previsioni danno neve",
      pt: "A previsão diz neve",
      zh: "天气预报说会下雪。",
      ja: "天気予報では雪だそうです。",
      ko: "일기예보에 눈이 온대요.",
      pl: "Prognoza zapowiada śnieg"
    },
    {
      en: "Perfect weather for a walk",
      es: "Tiempo perfecto para pasear",
      fr: "Un temps parfait pour une promenade",
      de: "Perfektes Wetter für einen Spaziergang",
      it: "Tempo perfetto per una passeggiata",
      pt: "Tempo perfeito para uma caminhada",
      zh: "非常适合散步的天气。",
      ja: "散歩にぴったりの天気です。",
      ko: "산책하기 딱 좋은 날씨예요.",
      pl: "Idealna pogoda na spacer"
    }
  ],
  cooking: [
    {
      en: "I need onions and garlic",
      es: "Necesito cebollas y ajo",
      fr: "J'ai besoin d'oignons et d'ail",
      de: "Ich brauche Zwiebeln und Knoblauch",
      it: "Mi servono cipolle e aglio",
      pt: "Preciso de cebolas e alho",
      zh: "我需要洋葱和大蒜。",
      ja: "玉ねぎとにんにくが必要です。",
      ko: "양파와 마늘이 필요해요.",
      pl: "Potrzebuję cebuli i czosnku"
    },
    {
      en: "How much salt should I add?",
      es: "¿Cuánta sal debo añadir?",
      fr: "Combien de sel dois-je ajouter ?",
      de: "Wie viel Salz soll ich hinzufügen?",
      it: "Quanto sale devo aggiungere?",
      pt: "Quanto sal devo adicionar?",
      zh: "我要加多少盐？",
      ja: "塩はどれくらい入れればいいですか？",
      ko: "소금을 얼마나 넣어야 하나요?",
      pl: "Ile soli powinienem/powinnam dodać?"
    },
    {
      en: "Can you chop the vegetables?",
      es: "¿Puedes cortar las verduras?",
      fr: "Peux-tu couper les légumes ?",
      de: "Kannst du das Gemüse schneiden?",
      it: "Puoi tagliare le verdure?",
      pt: "Pode cortar os legumes?",
      zh: "你能切一下蔬菜吗？",
      ja: "野菜を切ってくれますか？",
      ko: "채소 좀 썰어줄래요?",
      pl: "Możesz pokroić warzywa?"
    },
    {
      en: "Boil the water first",
      es: "Hierve el agua primero",
      fr: "Fais bouillir l'eau d'abord",
      de: "Koche zuerst das Wasser",
      it: "Fai bollire l'acqua prima",
      pt: "Ferva a água primeiro",
      zh: "先把水烧开。",
      ja: "先にお湯を沸かしてください。",
      ko: "먼저 물을 끓이세요.",
      pl: "Najpierw zagotuj wodę"
    },
    {
      en: "It smells great",
      es: "Huele muy bien",
      fr: "Ça sent très bon",
      de: "Es riecht toll",
      it: "Ha un profumo fantastico",
      pt: "Está cheirando muito bem",
      zh: "闻起来很香。",
      ja: "いい匂いがします。",
      ko: "냄새가 정말 좋아요.",
      pl: "Pachnie świetnie"
    },
    {
      en: "Stir it slowly",
      es: "Remuévelo despacio",
      fr: "Remue-le doucement",
      de: "Rühre es langsam um",
      it: "Mescolalo lentamente",
      pt: "Mexa devagar",
      zh: "慢慢搅拌。",
      ja: "ゆっくり混ぜてください。",
      ko: "천천히 저어 주세요.",
      pl: "Mieszaj powoli"
    },
    {
      en: "Is it ready yet?",
      es: "¿Ya está listo?",
      fr: "C'est prêt ?",
      de: "Ist es schon fertig?",
      it: "È già pronto?",
      pt: "Já está pronto?",
      zh: "已经好了吗？",
      ja: "もうできましたか？",
      ko: "이제 다 됐나요?",
      pl: "Czy już gotowe?"
    },
    {
      en: "Let's cook together",
      es: "Cocinemos juntos",
      fr: "Cuisinons ensemble",
      de: "Lass uns zusammen kochen",
      it: "Cuciniamo insieme",
      pt: "Vamos cozinhar juntos",
      zh: "我们一起做饭吧。",
      ja: "一緒に料理しましょう。",
      ko: "같이 요리해요.",
      pl: "Ugotujmy coś razem"
    }
  ]
};



function getSituationPhrases(situation) {
  const base = Array.isArray(situation?.quickPhrases) ? situation.quickPhrases : [];
  const extra = EXTRA_SITUATION_PHRASES[situation?.id] || [];
  const merged = [...base, ...extra];
  const seen = new Set();
  return merged.filter((p) => {
    const key = `${p?.en || ""}__${p?.de || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, Math.max(10, merged.length));
}

function formatTutorPhraseList(situation, langCode) {
  const phrases = getSituationPhrases(situation || {}).slice(0, 10);
  return phrases.map((p, i) => {
    const target = p?.[langCode] || p?.de || p?.es || p?.fr || p?.it || p?.zh || p?.en || "";
    return `${i + 1}. ${target} — ${p?.en || ""}`;
  }).join("\n");
}


// AI Conversation Scenarios
const AI_SCENARIOS = [
  { id: "restaurant-order",  situationId: "restaurant",     aiRole: "waiter",              title: "Order at a Restaurant",   icon: "🍽️",
    systemPrompt: `You are a friendly waiter at a traditional local restaurant. The customer (the learner) is ordering food. Speak only in the target language. Be patient and helpful.` },
  { id: "cafe-order",        situationId: "cafe",            aiRole: "barista",             title: "At the Café",             icon: "☕",
    systemPrompt: `You are a friendly barista at a cozy café. Take the customer's order, ask about size and milk preferences, and make small talk. Speak only in the target language.` },
  { id: "hotel-checkin",     situationId: "hotel",           aiRole: "hotel receptionist",  title: "Hotel Check-in",          icon: "🏨",
    systemPrompt: `You are a professional hotel receptionist. Help the guest check in: confirm their reservation, explain amenities, and answer questions. Speak only in the target language.` },
  { id: "airport-help",      situationId: "airport",         aiRole: "airline staff member", title: "At the Airport",         icon: "✈️",
    systemPrompt: `You are helpful airline check-in staff at an international airport. Assist the traveler with check-in, boarding passes, and luggage queries. Speak only in the target language.` },
  { id: "doctor-visit",      situationId: "doctor",          aiRole: "doctor",              title: "Doctor's Appointment",    icon: "🏥",
    systemPrompt: `You are a calm, reassuring doctor. Ask the patient about their symptoms, duration, and medical history. Give simple advice. Speak only in the target language.` },
  { id: "pharmacy-visit",    situationId: "pharmacy",        aiRole: "pharmacist",          title: "At the Pharmacy",         icon: "💊",
    systemPrompt: `You are a knowledgeable pharmacist. Help the customer find the right medicine, explain dosage instructions, and answer health questions. Speak only in the target language.` },
  { id: "shopping-clothes",  situationId: "shopping",        aiRole: "shop assistant",      title: "Shopping for Clothes",    icon: "🛒",
    systemPrompt: `You are a helpful shop assistant in a clothing store. Help the customer find their size, suggest items, and handle the purchase. Speak only in the target language.` },
  { id: "supermarket-shop",  situationId: "supermarket",     aiRole: "supermarket employee", title: "At the Supermarket",     icon: "🏪",
    systemPrompt: `You are a friendly supermarket employee. Help the customer find products, answer questions about ingredients or prices, and handle checkout. Speak only in the target language.` },
  { id: "taxi-ride",         situationId: "taxi",            aiRole: "taxi driver",         title: "Taking a Taxi",           icon: "🚕",
    systemPrompt: `You are a chatty taxi driver. Ask the passenger where they're going, discuss the route, and make friendly small talk. Speak only in the target language.` },
  { id: "meet-new-friend",   situationId: "making-friends",  aiRole: "new acquaintance",    title: "Meeting Someone New",     icon: "🤝",
    systemPrompt: `You are a friendly local at a language exchange meetup. Introduce yourself, ask about the learner's interests, and keep the conversation flowing naturally. Speak only in the target language.` },
  { id: "bank-visit",        situationId: "bank",            aiRole: "bank teller",         title: "At the Bank",             icon: "🏦",
    systemPrompt: `You are a professional bank teller. Help the customer with their account, card queries, or a simple transaction. Be clear and formal. Speak only in the target language.` },
  { id: "job-interview",     situationId: "job-interview",   aiRole: "HR manager",          title: "Job Interview",           icon: "💼",
    systemPrompt: `You are an HR manager interviewing a candidate for a position. Ask about their experience, strengths, and motivations. Be professional but encouraging. Speak only in the target language.` },
  { id: "rent-apartment",    situationId: "apartment",       aiRole: "landlord",            title: "Renting an Apartment",    icon: "🏠",
    systemPrompt: `You are a landlord showing an apartment to a prospective tenant. Describe the flat, discuss rent and conditions, and answer questions. Speak only in the target language.` },
  { id: "phone-call-appt",   situationId: "phone-call",      aiRole: "receptionist",        title: "Making a Phone Call",     icon: "📞",
    systemPrompt: `You are an office receptionist receiving a phone call. Help the caller book an appointment or get information. Be formal and clear. Speak only in the target language.` },
  { id: "gym-signup",        situationId: "gym",             aiRole: "gym instructor",      title: "Gym & Fitness",           icon: "💪",
    systemPrompt: `You are an enthusiastic gym instructor. Help a new member sign up, explain the facilities, and discuss their fitness goals. Speak only in the target language.` },
  { id: "bar-drinks",        situationId: "bar",             aiRole: "bartender",           title: "At a Bar",                icon: "🍻",
    systemPrompt: `You are a friendly bartender. Take the customer's drink order, recommend cocktails or local beers, and have a casual chat. Use informal register. Speak only in the target language.` },
  { id: "travel-guide",      situationId: "travel",          aiRole: "local tour guide",    title: "Travel & Tourism",        icon: "🗺️",
    systemPrompt: `You are an enthusiastic local tour guide. Share sightseeing tips, recommend places to visit and eat, and help the tourist navigate. Speak only in the target language.` },
  { id: "ask-directions",    situationId: "directions",      aiRole: "helpful local",       title: "Ask for Directions",      icon: "🧭",
    systemPrompt: `You are a helpful local pedestrian. Give the learner clear directions to a nearby landmark, metro station, or shop. Use natural spatial language. Speak only in the target language.` },
  { id: "university-life",   situationId: "university",      aiRole: "university professor", title: "University Life",        icon: "🎓",
    systemPrompt: `You are a friendly university professor. Discuss a student's coursework, upcoming exam, or academic interests. Be encouraging and intellectually engaging. Speak only in the target language.` },
  { id: "emergency-help",    situationId: "emergency",       aiRole: "emergency operator",  title: "Emergency Situation",     icon: "🚨",
    systemPrompt: `You are a calm emergency operator. Help the caller describe their situation clearly, ask key questions, and guide them through next steps. Keep the tone reassuring. Speak only in the target language.` },
  { id: "post-office-errand",situationId: "post-office",     aiRole: "postal worker",       title: "At the Post Office",      icon: "📮",
    systemPrompt: `You are a helpful postal worker. Assist the customer sending a package or letter: discuss size, weight, destination, and cost. Speak only in the target language.` },
  { id: "first-date",        situationId: "date",            aiRole: "date",                title: "First Date",              icon: "❤️",
    systemPrompt: `You are on a first date at a relaxed restaurant or café. Make light, engaging conversation about hobbies, travel, and dreams. Be warm and curious. Speak only in the target language.` },
  { id: "office-meeting",    situationId: "office",          aiRole: "colleague",           title: "Office Meeting",          icon: "🏢",
    systemPrompt: `You are a friendly colleague in a team meeting. Discuss a project update, deadlines, and next steps. Use professional but natural workplace language. Speak only in the target language.` },
  { id: "weather-smalltalk", situationId: "weather",         aiRole: "friendly neighbour",  title: "Weather & Small Talk",    icon: "☀️",
    systemPrompt: `You are a friendly neighbour making casual small talk. Chat about the weather, the weekend, local events, and everyday life. Keep it relaxed and natural. Speak only in the target language.` },
  { id: "cooking-lesson",    situationId: "cooking",         aiRole: "cooking instructor",  title: "Cooking Class",           icon: "🍳",
    systemPrompt: `You are an enthusiastic cooking instructor. Walk the learner through a simple local recipe, explain ingredients and techniques, and encourage them to ask questions. Speak only in the target language.` },
];

// ─────────────────────────────────────────────
// UTILITY HOOKS & HELPERS
// ─────────────────────────────────────────────
function useProgress(userId, language = "es") {
  const lsKey = `lp_progress_${userId}_${language}`;

  const readLocalProgress = useCallback(() => {
    try {
      const cached = localStorage.getItem(lsKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          completed: Array.isArray(parsed?.completed) ? parsed.completed : [],
          xp: parsed?.xp || 0,
        };
      }
    } catch (e) {}
    return { completed: [], xp: 0 };
  }, [lsKey]);

  const [data, setData] = useState(() => readLocalProgress());

  useEffect(() => {
    setData(readLocalProgress());
  }, [readLocalProgress]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId)
      .eq("language", language)
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (cancelled) return;
        if (error) {
          console.warn("[useProgress] fetch warning:", error);
          return;
        }

        const local = readLocalProgress();
        const server = row
          ? {
              completed: Array.isArray(row.completed) ? row.completed : [],
              xp: row.xp || 0,
            }
          : { completed: [], xp: 0 };

        const merged = {
          completed: Array.from(new Set([...(local.completed || []), ...(server.completed || [])])),
          xp: Math.max(local.xp || 0, server.xp || 0),
        };

        setData(merged);
        try { localStorage.setItem(lsKey, JSON.stringify(merged)); } catch (e) {}

        const serverCompleted = JSON.stringify(server.completed || []);
        const mergedCompleted = JSON.stringify(merged.completed || []);
        if (!row || server.xp !== merged.xp || serverCompleted !== mergedCompleted) {
          supabase.from("progress").upsert({
            user_id: userId,
            language,
            completed: merged.completed,
            xp: merged.xp,
            updated_at: new Date().toISOString()
          }, { onConflict: "user_id,language" }).then(() => {}).catch(() => {});
        }
      })
      .catch((err) => {
        if (!cancelled) console.warn("[useProgress] fetch failed:", err);
      });

    return () => { cancelled = true; };
  }, [userId, language, lsKey, readLocalProgress]);

  const complete = useCallback(async (id, xp) => {
    setData(prev => {
      if (prev.completed.includes(id)) return prev;
      const next = { completed: [...prev.completed, id], xp: prev.xp + xp };
      try { localStorage.setItem(lsKey, JSON.stringify(next)); } catch (e) {}
      if (userId) {
        supabase.from("progress").upsert({
          user_id: userId,
          language,
          completed: next.completed,
          xp: next.xp,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id,language" }).then(() => {}).catch(() => {});
      }
      return next;
    });
  }, [userId, language, lsKey]);

  const isDone = (id) => data.completed.includes(id);
  return { data, complete, isDone };
}

function getLevelColor(level) {
  return level === "A1" ? "#22c55e" : level === "A2" ? "#38bdf8" : "#a78bfa";
}

function getCompletedModuleIds(curriculum = {}, completed = []) {
  const validIds = new Set(getAllModules(curriculum).map((m) => m.id));
  const unique = [];
  const seen = new Set();
  (completed || []).forEach((id) => {
    if (validIds.has(id) && !seen.has(id)) {
      seen.add(id);
      unique.push(id);
    }
  });
  return unique;
}

function getCachedProgress(userId, language) {
  if (!userId || !language || typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(`lp_progress_${userId}_${language}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      language,
      xp: parsed?.xp || 0,
      completed: Array.isArray(parsed?.completed) ? parsed.completed : [],
    };
  } catch (e) {
    return null;
  }
}






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
          setMessages([{ role: "assistant", content: opening, translation: null }]);
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
        pushMistake(
          userId,
          langCode,
          choice.normalized || userText,
          currentQuestion.correct_answer,
          "Exam multiple-choice correction",
          "Exam Mode"
        );
      }

      const nextScore = localExamScore + (isCorrect ? 1 : 0);
      setLocalExamScore(nextScore);

      const feedback = isCorrect
        ? `✅ Correct\nRichtig.`
        : `❌ Incorrect\nDie richtige Antwort ist: ${currentQuestion.correct_answer}`;

      const isLast = localExamIndex >= ((localExamBank.questions?.length || 1) - 1);

      let assistantReply = feedback;
      let nextQuestion = null;
      let nextQuestionIndex = 0;

      if (isLast) {
        const report = buildLocalExamReport(localExamBank, nextScore);
        assistantReply = `${feedback}\n\n${report}`;
        setLocalExamFinished(true);
      } else {
        nextQuestionIndex = localExamIndex + 1;
        nextQuestion = localExamBank.questions[nextQuestionIndex];
        assistantReply = `${feedback}\n\n${formatLocalExamQuestion(nextQuestion, localExamBank?.question_count || 20)}`;
        setLocalExamIndex(nextQuestionIndex);
      }

      // Play static feedback then chain next question audio
      playExamFeedbackAndNext(
        isCorrect,
        currentQuestion,   // needed for per-question wrong-feedback clip
        nextQuestion,
        cefrLevel,
        langCode,
        nextQuestionIndex + 1,
        localExamBank?.question_count || 25
      );

      const newMsg = { role:"assistant", content: assistantReply, translation:null };
      setMessages(m => [...m, newMsg]);
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
      const helper = `Here's a quick English explanation: I'll help you understand the last line, give you 1–2 natural ${cfg.name} replies, and then we'll continue.`;
      setMessages(m => [...m, { role:"assistant", content: helper, translation:null }]);
      playWordAudio(helper, "en", { voiceId: getTutorVoiceId("en") });
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
      <div style={{ minHeight:"100vh", background:eT.bg, fontFamily:"var(--font-body)", color:eT.text }}>
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
        :root{--chat-ai-bg:${chatTheme.bubbleAI};--chat-user-bg:${chatTheme.bubbleUser};--chat-text:${chatTheme.text};--chat-border:${chatTheme.border};}
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
        {/* Animal tutor avatar */}
        <div style={{ width:44, height:44, borderRadius:14, background:`${chatTheme.path}18`, border:`1px solid ${chatTheme.path}35`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, animation:"animalBob 3s ease-in-out infinite", overflow:"hidden", padding:2 }}>
          {CHAT_ANIMAL_SVGS[tutorAnimalKey]
            ? <div style={{width:40,height:40}}>{CHAT_ANIMAL_SVGS[tutorAnimalKey]}</div>
            : <span style={{fontSize:24}}>{tutorAnimalKey}</span>}
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

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 18px", display:"flex", flexDirection:"column", gap:12, position:"relative" }}>
        {/* Large decorative animal character — right side */}
        {tutorAnimalBg && CHAT_ANIMAL_SVGS[tutorAnimalKey] && (
          <div style={{
            position:"sticky", top:0, float:"right", width:110, height:130,
            marginLeft:8, marginBottom:-130, marginRight:-4,
            flexShrink:0, pointerEvents:"none", zIndex:1,
            filter:`drop-shadow(0 8px 20px ${tutorAnimalColor}44)`,
            animation:"animalBob 3.5s ease-in-out infinite",
            opacity:0.9,
          }}>
            {CHAT_ANIMAL_SVGS[tutorAnimalKey]}
          </div>
        )}
        <div style={{ width:"100%", maxWidth:980, margin:"0 auto", flex:1, display:"flex", flexDirection:"column", gap:12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", alignItems:"flex-end", gap:8 }}>
            {msg.role === "assistant" && (
              <div style={{ width:34, height:34, borderRadius:"50%", background:`${chatTheme.path}18`,
                border:`1px solid ${chatTheme.path}35`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:14, flexShrink:0, animation:"animalBob 3s ease-in-out infinite",
                overflow:"hidden", padding:2 }}>
                {CHAT_ANIMAL_SVGS[tutorAnimalKey]
                  ? <div style={{width:30,height:30}}>{CHAT_ANIMAL_SVGS[tutorAnimalKey]}</div>
                  : tutorAnimalKey}
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
                      return (
                        <span key={pi}>
                          {lines.map((line, li) => {
                            const optMatch = line.match(/^([A-D])[)] (.+)/);
                            if (optMatch) {
                              const [, letter, text] = optMatch;
                              return (
                                <div key={li} style={{ marginTop:8 }}>
                                  <button
                                    onClick={() => send(letter + ") " + text)}
                                    style={{ display:"flex", alignItems:"center", gap:10, width:"100%",
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
                                                        return line ? <span key={li}>{line + (li < lines.length-1 ? "\n" : "")}</span> : <span key={li}>{"\n"}</span>;
                          })}
                        </span>
                      );
                    }
                    return <span key={pi}>{part}</span>;
                  });
                })()}
              </div>
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
            <div style={{ width:34, height:34, borderRadius:"50%", background:`${chatTheme.path}18`,
              border:`1px solid ${chatTheme.path}35`, display:"flex", alignItems:"center",
              justifyContent:"center", flexShrink:0, overflow:"hidden", padding:2 }}>
              {CHAT_ANIMAL_SVGS[tutorAnimalKey]
                ? <div style={{width:30,height:30}}>{CHAT_ANIMAL_SVGS[tutorAnimalKey]}</div>
                : <span style={{fontSize:14}}>{scenario.icon || "🤖"}</span>}
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
      </div>

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
