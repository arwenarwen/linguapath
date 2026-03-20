import { useState, useEffect, useRef, Component } from "react";
import { tryPlayStaticAudio } from "../lib/staticAudio";

/* ─── Error Boundary ──────────────────────────────────────────────────────── */
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight:"100vh", background:"#0a0b10", color:"#f0ede6",
          display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", padding:32, textAlign:"center",
          fontFamily:"'DM Sans',system-ui,sans-serif" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>⚠️</div>
          <div style={{ fontSize:20, fontWeight:700, marginBottom:8 }}>Something went wrong</div>
          <div style={{ fontSize:14, color:"rgba(107,61,16,.48)", marginBottom:28, maxWidth:340 }}>
            {String(this.state.error?.message || this.state.error)}
          </div>
          <button onClick={this.props.onBack}
            style={{ padding:"13px 28px", borderRadius:12, border:"none",
              background:"linear-gradient(135deg,#c9a84c,#a8752e)", color:"#120d00",
              fontWeight:700, fontSize:15, cursor:"pointer" }}>
            ← Back to Course
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function getTarget(word, langCode) {
  if (!word) return "";
  return word[langCode] || word.de || word.es || word.fr || word.it ||
    word.pt || word.zh || word.ja || word.ko || word.pl || "";
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function saveMistake(userId, langCode, question, wrong, correct) {
  if (!wrong || !correct || wrong === correct) return;
  try {
    const key = `lp_mistakes_global_${langCode}`;
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    if (list.slice(0,10).some(m => m.original === wrong && m.corrected === correct)) return;
    list.unshift({ id: Date.now(), original: wrong, corrected: correct,
      explanation: question, source: "Lesson Quiz",
      date: new Date().toISOString().slice(0,10) });
    localStorage.setItem(key, JSON.stringify(list.slice(0,500)));
    if (userId) {
      localStorage.setItem(`lp_mistakes_${userId}_${langCode}`,
        JSON.stringify(list.slice(0,500)));
    }
  } catch {}
}

async function speak(text, langCode) {
  if (!text) return;

  // German lessons are locked to local/static audio only.
  // If no local file exists, fail silently instead of falling back to live TTS.
  if (langCode === "de") {
    await tryPlayStaticAudio({ text, langCode });
    return;
  }

  try {
    const played = await tryPlayStaticAudio({ text, langCode });
    if (played) return;

    const res = await fetch("/api/tts", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ text, langCode }),
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    audio.play().catch(() => {});
  } catch {}
}

/* ─── Build quiz questions from vocab + dialogue ──────────────────────────── */
function buildQuestions(module, langCode) {
  try {
    const vocab = Array.isArray(module?.vocab) ? module.vocab : [];
    const dialogue = Array.isArray(module?.dialogue) ? module.dialogue : [];
    const langName = { es:"Spanish",de:"German",fr:"French",it:"Italian",
      pt:"Portuguese",zh:"Mandarin",ja:"Japanese",ko:"Korean",
      pl:"Polish",en:"English" }[langCode] || "the language";

    const qs = [];

    vocab.forEach(w => {
      if (!w) return;
      const t = getTarget(w, langCode);
      if (!t || !w.en) return;
      const wrong = shuffle(vocab.filter(v => v && v.en !== w.en && v.en).map(v => v.en));
      if (wrong.length < 3) return;
      qs.push({ type:"en", q:`What does this mean? "${t}"`, subtext: t,
        opts: shuffle([w.en, ...wrong.slice(0,3)]), ans: w.en });
    });

    vocab.forEach(w => {
      if (!w) return;
      const t = getTarget(w, langCode);
      if (!t || !w.en) return;
      const wrong = shuffle(vocab
        .filter(v => v && getTarget(v,langCode) !== t && getTarget(v,langCode))
        .map(v => getTarget(v,langCode)));
      if (wrong.length < 3) return;
      qs.push({ type:"tgt", q:`Say this in ${langName}: "${w.en}"`, subtext: w.en,
        opts: shuffle([t, ...wrong.slice(0,3)]), ans: t });
    });

    dialogue.forEach(line => {
      if (!line?.text || line.text.length > 70) return;
      const match = vocab.find(w => {
        if (!w) return false;
        const t = getTarget(w, langCode);
        return t && t.length > 2 && line.text.includes(t);
      });
      if (!match) return;
      const t = getTarget(match, langCode);
      const wrong = shuffle(vocab
        .filter(v => v && getTarget(v,langCode) !== t && getTarget(v,langCode))
        .map(v => getTarget(v,langCode)));
      if (wrong.length < 3) return;
      qs.push({
        type:"response",
        q:`How do you say "${match.en}" in ${langName}?`,
        subtext: `Choose the correct ${langName} phrase:`,
        opts: shuffle([t, ...wrong.slice(0,3)]),
        ans: t
      });
    });

    // ── Type 4: Word tile sentence builder ──────────────────────────────────────
    // Use vocab words that have spaces (multi-word phrases) or combine 2-3 words
    // Show English as the prompt so the user knows what to translate
    const multiWord = vocab.filter(w => {
      const t = getTarget(w, langCode);
      return t && t.includes(" ") && w.en && t.split(" ").length >= 2 && t.split(" ").length <= 6;
    });
    
    // For single words, combine 2 consecutive vocab items to make a mini-phrase
    if (multiWord.length < 3 && vocab.length >= 4) {
      for (let vi = 0; vi < vocab.length - 1 && multiWord.length < 5; vi++) {
        const w1 = vocab[vi], w2 = vocab[vi + 1];
        const t1 = getTarget(w1, langCode), t2 = getTarget(w2, langCode);
        if (t1 && t2 && w1.en && w2.en && !t1.includes(" ") && !t2.includes(" ")) {
          // Create a combined "phrase" entry
          multiWord.push({
            de: t1 + " " + t2, es: t1 + " " + t2, fr: t1 + " " + t2,
            it: t1 + " " + t2, pt: t1 + " " + t2, zh: t1 + t2,
            ja: t1 + t2, ko: t1 + t2, pl: t1 + " " + t2,
            [langCode]: t1 + " " + t2,
            en: w1.en + " / " + w2.en,
          });
        }
      }
    }

    shuffle(multiWord).slice(0, 3).forEach(w => {
      const target = getTarget(w, langCode);
      if (!target || !w.en) return;
      const words = target.split(" ").filter(Boolean);
      if (words.length < 2) return;
      // Distractor tiles: other vocab words in target language
      const distractors = shuffle(
        vocab
          .map(v => getTarget(v, langCode))
          .filter(t => t && !target.includes(t) && !t.includes(" "))
      ).slice(0, Math.min(4, words.length + 1));
      const tiles = shuffle([...words, ...distractors]);
      qs.push({
        type: "tile",
        q: `Say this in ${langName}:`,
        hint: w.en,
        langName,
        tiles,
        ans: words.join(" "),
      });
    });

    // Interleave types, max 10
    const byType = {};
    qs.forEach(q => { if (!byType[q.type]) byType[q.type]=[]; byType[q.type].push(q); });
    const result = [];
    const types = Object.keys(byType);
    let i = 0;
    while (result.length < Math.min(10, qs.length) && i < 200) {
      const pool = byType[types[i % types.length]];
      if (pool?.length) result.push(pool.shift());
      i++;
    }
    return shuffle(result).slice(0,10);
  } catch (e) {
    console.error("buildQuestions error:", e);
    return [];
  }
}

/* ─── Trail time-of-day theme (matches trail map exactly) ────────────────── */
function getLessonTheme() {
  // Fixed warm daytime theme — consistent regardless of time of day
  return { bg:"linear-gradient(180deg,#fff7ea 0%,#ffe7c2 100%)", panel:"rgba(255,255,255,0.78)", path:"#f5a524", text:"#4a2800", muted:"rgba(74,40,0,0.52)", border:"rgba(245,165,36,0.28)", card:"rgba(255,255,255,0.6)", cardBorder:"rgba(245,165,36,0.25)", optIdle:"rgba(255,255,255,0.7)", topbar:"rgba(255,248,234,0.95)", isDark:false };
}

/* ─── Global lesson CSS injected once ───────────────────────────────────────── */
const LESSON_CSS = `
  @keyframes lv-fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lv-fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes lv-scaleIn  { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
  @keyframes lv-flip     { from{opacity:0;transform:rotateX(-12deg) scale(0.96)} to{opacity:1;transform:rotateX(0) scale(1)} }
  @keyframes lv-correct  { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0)} 50%{box-shadow:0 0 0 8px rgba(34,197,94,0.18)} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0)} }
  @keyframes lv-wrong    { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
  @keyframes lv-barFill  { from{width:0%} to{width:100%} }
  @keyframes lv-glow     { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
  @keyframes lv-ripple   { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.4);opacity:0} }
  @keyframes lv-pop      { 0%{transform:scale(0.8);opacity:0} 70%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
  @keyframes lv-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }

  .lv-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
  .lv-card:hover { transform: translateY(-2px); }
  .lv-opt { transition: all 0.15s ease; }
  .lv-opt:hover:not(:disabled) { transform: translateY(-1px); }
  .lv-opt:active:not(:disabled) { transform: scale(0.98); }
  .lv-primary { transition: all 0.15s ease; }
  .lv-primary:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.08); }
  .lv-primary:active:not(:disabled) { transform: scale(0.98); }
  .lv-speaker { transition: all 0.18s ease; }
  .lv-speaker:hover { transform: scale(1.1); }
  .lv-speaker:active { transform: scale(0.92); }
`;

/* ─── Shared styles ───────────────────────────────────────────────────────── */
const T = getLessonTheme();

const root = {
  minHeight:"100vh",
  background: T.bg,
  color: T.text,
  fontFamily:"'DM Sans','Lato',system-ui,sans-serif",
  display:"flex", flexDirection:"column",
};

const topbar = {
  display:"flex", alignItems:"center", gap:14, padding:"13px 18px",
  background: T.topbar,
  backdropFilter:"blur(16px)",
  borderBottom:`1px solid ${T.border}`,
  flexShrink:0,
};

const closeBtn = {
  width:36, height:36, borderRadius:"50%",
  background: T.isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
  border:`1px solid ${T.border}`,
  color: T.muted,
  cursor:"pointer", fontSize:17,
  display:"flex", alignItems:"center", justifyContent:"center",
  flexShrink:0,
  transition:"all 0.15s ease",
};

const screen = {
  flex:1, maxWidth:580, width:"100%",
  margin:"0 auto", padding:"26px 18px 48px",
};

const phaseLabel = (icon, label, sub) => null; // replaced by PhasePill component

const card = (flipped, T) => ({
  background: flipped
    ? T.isDark ? `rgba(255,179,64,0.07)` : "rgba(255,255,255,0.85)"
    : T.card,
  border: `1.5px solid ${flipped ? T.path+"55" : T.cardBorder}`,
  borderRadius:24, padding:"40px 28px", textAlign:"center", cursor:"pointer",
  marginBottom:16, minHeight:190,
  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
  boxShadow: flipped
    ? `0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px ${T.path}22`
    : T.isDark
    ? "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)"
    : "0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
  transition:"all 0.25s ease",
  animation: flipped ? "lv-flip 0.35s cubic-bezier(0.16,1,0.3,1) both" : "none",
});

const bigWord = {
  fontFamily:"'Playfair Display',Georgia,serif",
  fontSize:"clamp(28px,5.5vw,44px)",
  fontWeight:800, marginBottom:10, lineHeight:1.05,
  color: T.text,
  animation:"lv-fadeUp 0.4s ease both",
};

const muted = { fontSize:13, color:T.muted };

const primaryBtn = {
  width:"100%", padding:"15px 20px", borderRadius:16, border:"none",
  background:`linear-gradient(135deg, ${T.path}, ${T.path}bb)`,
  color: T.isDark ? "#120d00" : "#fff",
  fontSize:16, fontWeight:800, cursor:"pointer",
  fontFamily:"inherit", marginTop:16, display:"block",
  boxShadow:`0 4px 20px ${T.path}40`,
  letterSpacing:"0.2px",
};

const secondaryBtn = {
  width:"100%", padding:"13px 20px", borderRadius:16,
  background: T.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
  border:`1px solid ${T.border}`,
  color: T.muted, fontSize:14, fontWeight:600,
  cursor:"pointer", fontFamily:"inherit", marginTop:10, display:"block",
};

const optionStyle = (state, T) => ({
  width:"100%", padding:"15px 18px", borderRadius:16, textAlign:"left",
  fontSize:15, fontWeight:500, cursor:state==="idle"?"pointer":"default",
  fontFamily:"inherit", marginBottom:9, display:"flex",
  alignItems:"center", justifyContent:"space-between",
  border:`2px solid ${
    state==="correct" ? "#22c55e" :
    state==="wrong"   ? "#ef4444" :
    state==="dim"     ? T.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" :
    T.cardBorder}`,
  background:
    state==="correct" ? "rgba(34,197,94,0.12)" :
    state==="wrong"   ? "rgba(239,68,68,0.1)"  :
    state==="dim"     ? T.isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" :
    T.optIdle,
  color:
    state==="correct" ? "#22c55e" :
    state==="wrong"   ? "#ef4444" :
    state==="dim"     ? T.muted :
    T.text,
  animation:
    state==="correct" ? "lv-correct 0.6s ease" :
    state==="wrong"   ? "lv-wrong 0.4s ease" : "none",
  transition:"border-color 0.15s ease, background 0.15s ease",
  boxShadow:
    state==="correct" ? "0 0 0 0 rgba(34,197,94,0)" :
    state==="idle" ? T.isDark ? "none" : "0 1px 6px rgba(0,0,0,0.05)" : "none",
});

/* ─── PhasePill — elegant step indicator ────────────────────────────────────── */
function PhasePill({ icon, label, current, total, T }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:8, marginBottom:18,
      animation:"lv-fadeIn 0.35s ease both",
    }}>
      <div style={{
        display:"inline-flex", alignItems:"center", gap:6,
        padding:"5px 12px", borderRadius:20,
        background: T.isDark ? `${T.path}18` : `${T.path}18`,
        border:`1px solid ${T.path}38`,
      }}>
        <span style={{ fontSize:13 }}>{icon}</span>
        <span style={{ fontSize:11, fontWeight:800, letterSpacing:1.8, textTransform:"uppercase", color:T.path }}>
          {label}
        </span>
      </div>
      {total > 0 && (
        <span style={{ fontSize:12, color:T.muted, fontWeight:500 }}>
          {current} of {total}
        </span>
      )}
    </div>
  );
}

/* ─── INTRO ───────────────────────────────────────────────────────────────── */
function Intro({ module, onStart }) {
  const T = getLessonTheme();
  const vocab = module?.vocab || [];
  const hasGrammar = typeof module?.grammar === "string" && module.grammar.length > 0;
  const steps = [
    { icon:"📖", label:`${vocab.length} vocab words`, sub:"You're learning" },
    hasGrammar && { icon:"🧠", label:"Grammar tip", sub:"Key pattern" },
    { icon:"🎯", label:"Quick quiz", sub:"Let's check" },
    { icon:"✏️", label:"Practice", sub:"Now reinforce" },
  ].filter(Boolean);

  return (
    <div style={screen}>
      <style>{LESSON_CSS}</style>
      <div style={{ textAlign:"center", marginBottom:28, animation:"lv-fadeUp 0.4s ease both" }}>
        <div style={{ fontSize:54, marginBottom:16, lineHeight:1, display:"inline-block",
          animation:"lv-float 3s ease-in-out infinite",
          filter:`drop-shadow(0 8px 20px ${T.path}44)` }}>
          {module?.icon || "📖"}
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif",
          fontSize:"clamp(20px,4vw,26px)", fontWeight:900,
          marginBottom:8, lineHeight:1.2, color:T.text, letterSpacing:"-0.3px" }}>
          {module?.lesson_focus || module?.title || "Lesson"}
        </h1>
        <p style={{ fontSize:12, color:T.muted, letterSpacing:0.5 }}>
          {module?.unit} · {module?.section}
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:24,
        animation:"lv-fadeUp 0.4s 0.08s ease both" }}>
        {steps.map(({ icon, label, sub }, i) => (
          <div key={i} style={{
            background:T.card, border:`1px solid ${T.cardBorder}`,
            borderRadius:18, padding:"16px 14px", textAlign:"center",
            boxShadow: T.isDark
              ? "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)"
              : "0 2px 10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)",
            animation:`lv-pop 0.35s ${0.1+i*0.06}s ease both`,
          }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:2 }}>{label}</div>
            <div style={{ fontSize:10, color:T.muted, fontWeight:500 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px",
        background:`${T.path}14`, border:`1px solid ${T.path}30`, borderRadius:14,
        marginBottom:20, animation:"lv-fadeUp 0.4s 0.22s ease both" }}>
        <span style={{ fontSize:16 }}>🦊</span>
        <span style={{ fontSize:12, color:T.muted, fontStyle:"italic", lineHeight:1.5 }}>
          Take your time. Each word is a step on the trail.
        </span>
      </div>

      <button className="lv-primary"
        style={{ ...primaryBtn, animation:"lv-fadeUp 0.4s 0.28s ease both" }}
        onClick={onStart}>
        Start Lesson →
      </button>
    </div>
  );
}

/* ─── VOCAB ───────────────────────────────────────────────────────────────── */
function Vocab({ module, langCode, onDone }) {
  const vocab = module?.vocab || [];
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => { if (vocab.length === 0) onDone(); }, []);
  if (vocab.length === 0) return null;

  const word = vocab[idx] || {};
  const target = getTarget(word, langCode);

  function advance() {
    if (idx + 1 >= vocab.length) onDone();
    else { setIdx(i => i+1); setFlipped(false); }
  }

  const T = getLessonTheme();
  return (
    <div style={screen}>
      <style>{LESSON_CSS}</style>
      <PhasePill icon="📖" label="Vocabulary" current={idx+1} total={vocab.length} T={T} />

      {/* Progress dots */}
      <div style={{ display:"flex", gap:5, marginBottom:20 }}>
        {vocab.map((_,i) => (
          <div key={i} style={{
            flex:1, height:5, borderRadius:3,
            background: i<idx ? "#22c55e" : i===idx ? T.path : T.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            transition:"background 0.4s ease",
            boxShadow: i===idx ? `0 0 6px ${T.path}88` : "none",
          }}/>
        ))}
      </div>

      {/* Main vocab card */}
      <div className="lv-card"
        style={card(flipped, T)}
        onClick={() => {
          if (!flipped) {
            speak(target, langCode);
            setFlipped(true);
          }
        }}>
        {!flipped ? (
          <>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase",
              color:T.muted, marginBottom:16, opacity:0.7 }}>Tap to reveal</div>
            <div style={{ ...bigWord, color:T.text }}>{target || "—"}</div>
            {word.phonetic && (
              <div style={{ fontSize:13, color:T.muted, marginTop:4 }}>/{word.phonetic}/</div>
            )}
            <div style={{ marginTop:20, display:"flex", alignItems:"center", gap:6,
              padding:"7px 16px", borderRadius:20,
              background:T.isDark ? `${T.path}14` : `${T.path}18`,
              border:`1px solid ${T.path}30` }}>
              <span style={{ fontSize:12, color:T.path }}>🔊</span>
              <span style={{ fontSize:11, color:T.path, fontWeight:700 }}>Tap to hear</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize:13, fontWeight:700, color:T.path, marginBottom:6,
              letterSpacing:0.3, animation:"lv-fadeIn 0.3s ease" }}>
              Translation
            </div>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif",
              fontSize:"clamp(22px,4vw,32px)", fontWeight:800,
              color:T.text, marginBottom:8, animation:"lv-flip 0.3s ease" }}>
              {word.en || "—"}
            </div>
            <div style={{ fontSize:16, color:T.muted, marginBottom:18 }}>{target}</div>
            {word.example && (
              <div style={{ fontSize:12, color:T.muted, fontStyle:"italic",
                borderLeft:`3px solid ${T.path}55`, paddingLeft:10, textAlign:"left",
                lineHeight:1.6 }}>
                "{word.example}"
              </div>
            )}
            <button className="lv-speaker"
              style={{ marginTop:18, display:"flex", alignItems:"center", gap:8,
                padding:"8px 18px", borderRadius:20, cursor:"pointer",
                background:T.isDark ? `${T.path}14` : `${T.path}18`,
                border:`1px solid ${T.path}38`, color:T.path, fontSize:13, fontWeight:700 }}
              onClick={e => { e.stopPropagation(); speak(target, langCode); }}>
              🔊 Hear pronunciation
            </button>
          </>
        )}
      </div>

      {flipped && (
        <div style={{ display:"flex", gap:10, marginTop:16, animation:"lv-fadeUp 0.3s ease both" }}>
          <button style={{ flex:1, padding:"13px 10px", borderRadius:14, fontSize:13,
            fontWeight:700, cursor:"pointer", fontFamily:"inherit",
            border:`1px solid rgba(239,68,68,0.35)`,
            background:"rgba(239,68,68,0.1)", color:"#ef4444" }}
            onClick={advance}>😕 Still learning</button>
          <button style={{ flex:1, padding:"13px 10px", borderRadius:14, fontSize:13,
            fontWeight:700, cursor:"pointer", fontFamily:"inherit",
            border:`1px solid rgba(34,197,94,0.35)`,
            background:"rgba(34,197,94,0.1)", color:"#22c55e" }}
            onClick={advance}>✓ Got it!</button>
        </div>
      )}
    </div>
  );
}

/* ─── DIALOGUE ────────────────────────────────────────────────────────────── */
function Dialogue({ module, langCode, onDone }) {
  const lines = module?.dialogue || [];
  const [revealed, setRevealed] = useState(0);

  useEffect(() => { if (lines.length === 0) onDone(); }, []);
  if (lines.length === 0) return null;

  const speakers = [...new Set(lines.map(l => l?.speaker || ""))];
  const avatars = ["🧑","👩","👨","🧑","👩"];

  return (
    <div style={screen}>
      <PhasePill icon="💬" label="Real Dialogue" current={0} total={0} T={getLessonTheme()} />
      <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:24 }}>
        {lines.slice(0, revealed+1).map((line, i) => {
          if (!line) return null;
          const isRight = speakers.indexOf(line.speaker) === 1;
          return (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-end",
              flexDirection:isRight?"row-reverse":"row" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0,
                background:"rgba(107,61,16,.08)", border:"1px solid rgba(255,255,255,.12)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>
                {avatars[speakers.indexOf(line.speaker) % avatars.length]}
              </div>
              <div style={{ maxWidth:"75%", padding:"12px 16px", borderRadius:18,
                fontSize:15, lineHeight:1.6, textAlign:"left",
                background: isRight?`linear-gradient(135deg,${getLessonTheme().path}cc,${getLessonTheme().path}99)`:"rgba(255,255,255,.07)",
                border: isRight?"none":"1px solid rgba(255,255,255,.1)",
                borderBottomLeftRadius: isRight?18:4,
                borderBottomRightRadius: isRight?4:18 }}>
                <div style={{ fontSize:10, color:"rgba(107,61,16,.48)", marginBottom:4,
                  fontWeight:600, letterSpacing:.5, textTransform:"uppercase" }}>
                  {line.speaker}
                </div>
                <div>{line.text}</div>
                <button style={{ background:"none", border:"none",
                  color:"rgba(107,61,16,.42)", cursor:"pointer",
                  fontSize:12, padding:"4px 0 0", display:"block" }}
                  onClick={() => speak(line.text, langCode)}>🔊 Listen</button>
              </div>
            </div>
          );
        })}
      </div>
      <button style={primaryBtn} onClick={() => {
        if (revealed < lines.length - 1) setRevealed(r => r+1);
        else onDone();
      }}>
        {revealed < lines.length - 1 ? "Next →" : "Continue →"}
      </button>
    </div>
  );
}

/* ─── GRAMMAR ─────────────────────────────────────────────────────────────── */
function Grammar({ module, onDone }) {
  useEffect(() => { if (!module?.grammar) onDone(); }, []);
  if (!module?.grammar) return null;

  const T = getLessonTheme();
  return (
    <div style={screen}>
      <style>{LESSON_CSS}</style>
      <PhasePill icon="🧠" label="Grammar Tip" current={0} total={0} T={T} />

      <div style={{
        background: T.isDark ? `${T.path}08` : `${T.path}12`,
        border:`1.5px solid ${T.path}35`,
        borderRadius:22, padding:"22px 20px", marginBottom:22,
        animation:"lv-scaleIn 0.4s ease both",
        boxShadow: T.isDark
          ? `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px ${T.path}18`
          : `0 6px 24px rgba(0,0,0,0.08), 0 0 0 1px ${T.path}18`,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:T.path,
            boxShadow:`0 0 8px ${T.path}` }}/>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:2, textTransform:"uppercase",
            color:T.path }}>Key Pattern</div>
        </div>
        <div style={{ fontSize:15, lineHeight:1.9, color:T.text, fontWeight:400 }}>
          {module.grammar}
        </div>
        {module.dialogue?.[0]?.text && (
          <div style={{ borderLeft:`3px solid ${T.path}66`,
            borderRadius:"0 12px 12px 0", padding:"12px 16px", marginTop:16,
            background: T.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            fontSize:13.5, fontStyle:"italic", color:T.muted, lineHeight:1.6 }}>
            "{module.dialogue[0].text}"
          </div>
        )}
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px",
        background:`${T.path}14`, border:`1px solid ${T.path}30`, borderRadius:14, marginBottom:20 }}>
        <span>🦊</span>
        <span style={{ fontSize:12, color:T.muted, fontStyle:"italic" }}>
          Understanding the pattern is half the work. Now let's practice it.
        </span>
      </div>

      <button className="lv-primary" style={primaryBtn} onClick={onDone}>Practice →</button>
    </div>
  );
}

/* ─── QUIZ ────────────────────────────────────────────────────────────────── */
function TileQuestion({ q, onAnswer, langCode }) {
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [typed, setTyped] = useState("");
  const [mode, setMode] = useState("tiles");

  const tileAnswer = selected.map(i => q.tiles[i]).join(" ");
  const finalAnswer = mode === "tiles" ? tileAnswer : typed;
  const isCorrect = submitted &&
    finalAnswer.trim().toLowerCase() === q.ans.trim().toLowerCase();
  const hasInput = mode === "tiles" ? selected.length > 0 : typed.trim().length > 0;

  function toggleTile(idx) {
    if (submitted) return;
    setSelected(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  }

  function submit() {
    if (submitted || !hasInput) return;
    setSubmitted(true);
    const correct = finalAnswer.trim().toLowerCase() === q.ans.trim().toLowerCase();
    onAnswer(correct);
  }

  const T2 = getLessonTheme();
  return (
    <div>
      {/* Direction label */}
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5,
        textTransform:"uppercase", color:T2.muted, marginBottom:12 }}>
        Translate into {q.langName || "the language"}
      </div>

      {/* English hint box */}
      <div style={{
        background:T2.isDark ? "rgba(255,179,64,0.1)" : "rgba(245,165,36,0.12)",
        border:`1px solid ${T2.path}45`,
        borderRadius:14, padding:"13px 18px", marginBottom:16,
      }}>
        <div style={{ fontSize:10, fontWeight:800, letterSpacing:1.2,
          textTransform:"uppercase", color:T2.muted, marginBottom:5 }}>English</div>
        <div style={{ fontSize:17, fontWeight:700, color:T2.text, lineHeight:1.4 }}>
          {q.hint}
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[
          { key:"tiles", icon:"🧩", label:"Word tiles" },
          { key:"keyboard", icon:"⌨️", label:"Type it" },
        ].map(m => (
          <button key={m.key}
            onClick={() => { if (submitted) return; setMode(m.key); setSelected([]); setTyped(""); }}
            style={{ padding:"7px 16px", borderRadius:20, border:"1px solid",
              fontFamily:"inherit", fontSize:13, fontWeight:700,
              cursor: submitted ? "default" : "pointer",
              borderColor: mode===m.key ? T2.path : T2.border,
              background: mode===m.key ? `${T2.path}20` : T2.card,
              color: mode===m.key ? T2.text : T2.muted,
              opacity: submitted ? 0.5 : 1 }}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Answer area */}
      {mode === "tiles" ? (
        <>
          <div style={{
            minHeight:56, padding:"10px 14px", borderRadius:14, marginBottom:14,
            background: submitted
              ? isCorrect ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.08)"
              : T2.isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)",
            border:`2px solid ${submitted
              ? isCorrect ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.45)"
              : T2.path + "45"}`,
            display:"flex", flexWrap:"wrap", gap:8, alignItems:"center",
            transition:"all .2s",
          }}>
            {selected.length === 0
              ? <span style={{ color:T2.muted, fontSize:14 }}>
                  Tap words below to build your answer…
                </span>
              : selected.map((tIdx, pos) => (
                <button key={pos} onClick={() => !submitted && toggleTile(tIdx)}
                  disabled={submitted}
                  style={{ padding:"7px 14px", borderRadius:20,
                    background: submitted
                      ? isCorrect ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.12)"
                      : `${T2.path}28`,
                    border:`1px solid ${submitted
                      ? isCorrect ? "#22c55e" : "#ef4444"
                      : T2.path + "70"}`,
                    color: submitted
                      ? isCorrect ? "#16a34a" : "#dc2626"
                      : T2.text,
                    fontSize:15, fontWeight:700,
                    cursor:submitted ? "default" : "pointer",
                    fontFamily:"inherit" }}>
                  {q.tiles[tIdx]}
                </button>
              ))
            }
          </div>

          {/* Tile bank */}
          {!submitted && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:4 }}>
              {q.tiles.map((tile, idx) => {
                const used = selected.includes(idx);
                return (
                  <button key={idx} onClick={() => { if (!used) { speak(tile, langCode); toggleTile(idx); } }}
                    style={{ padding:"9px 16px", borderRadius:20,
                      background: used
                        ? T2.isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.2)"
                        : T2.isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)",
                      border:`1px solid ${used ? T2.border : T2.cardBorder}`,
                      color: used ? T2.muted : T2.text,
                      fontSize:15, fontWeight:600,
                      cursor: used ? "default" : "pointer",
                      fontFamily:"inherit", transition:"all .15s",
                      textDecoration: used ? "line-through" : "none",
                      opacity: used ? 0.35 : 1 }}>
                    {tile}
                  </button>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div style={{ marginBottom:14 }}>
          <input
            type="text"
            value={typed}
            onChange={e => setTyped(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !submitted && submit()}
            placeholder="Type your answer here…"
            disabled={submitted}
            autoFocus
            style={{ width:"100%", padding:"14px 18px", borderRadius:14,
              background: T2.isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.8)",
              border:`2px solid ${submitted
                ? isCorrect ? "rgba(34,197,94,0.55)" : "rgba(239,68,68,0.5)"
                : T2.path + "55"}`,
              color:T2.text, fontSize:16, fontFamily:"inherit", outline:"none",
              boxSizing:"border-box", transition:"border-color .2s",
              caretColor:T2.path }}
          />
        </div>
      )}

      {/* Check button */}
      {!submitted && (
        <button
          onClick={submit}
          disabled={!hasInput}
          style={{ width:"100%", padding:"14px 20px", borderRadius:16, border:"none",
            background: hasInput
              ? `linear-gradient(135deg,${T2.path},${T2.path}cc)`
              : T2.isDark ? "rgba(255,255,255,0.07)" : "rgba(245,165,36,0.2)",
            color: hasInput ? (T2.isDark ? "#120d00" : "#fff") : T2.muted,
            cursor: hasInput ? "pointer" : "default",
            fontFamily:"inherit", fontWeight:800, fontSize:15, marginTop:12,
            boxShadow: hasInput ? `0 4px 16px ${T2.path}40` : "none",
          }}>
          Check →
        </button>
      )}
    </div>
  );
}


function Quiz({ module, langCode, userId, onDone }) {
  const langName = { es:"Spanish",de:"German",fr:"French",it:"Italian",
    pt:"Portuguese",zh:"Mandarin",ja:"Japanese",ko:"Korean",
    ru:"Russian",el:"Greek",pl:"Polish",en:"English" }[langCode] || "the language";
  const [questions] = useState(() => buildQuestions(module, langCode));
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [tileCorrect, setTileCorrect] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  // Ref mirrors mistakes so next() always reads the latest value synchronously
  const mistakesRef = useRef(0);

  useEffect(() => {
    if (questions.length === 0) onDone(0, 0, 3);
  }, []);

  if (questions.length === 0) return null;
  if (qIdx >= questions.length) return null;

  const q = questions[qIdx];
  if (!q) return null;

  const isTile = q.type === "tile";
  const answered = isTile ? tileCorrect !== null : chosen !== null;
  const isCorrect = isTile ? tileCorrect : chosen === q.ans;

  const langEmoji = {
    de:"🇩🇪", es:"🇪🇸", fr:"🇫🇷", it:"🇮🇹", pt:"🇧🇷",
    zh:"🇨🇳", ja:"🇯🇵", ko:"🇰🇷", ru:"🇷🇺", el:"🇬🇷",
    pl:"🇵🇱", en:"🇬🇧",
  }[langCode] || "🌍";
  const typeLabel = {
    en:   `${langEmoji} What does it mean?`,
    tgt:  `🗣️ Translate to ${langName}`,
    response: "💬 Best response",
    tile: "🧩 Build the sentence",
  }[q.type] || "✏️ Question";

  function pickMCQ(opt) {
    if (chosen) return;
    setChosen(opt);
    if (opt !== q.ans) {
      mistakesRef.current += 1;
      setMistakes(mistakesRef.current);
      saveMistake(userId, langCode, q.q, opt, q.ans);
    }
  }

  function handleTileAnswer(correct) {
    setTileCorrect(correct);
    if (!correct) {
      mistakesRef.current += 1;
      setMistakes(mistakesRef.current);
      saveMistake(userId, langCode, q.q, "(word tiles)", q.ans);
    }
  }

  function next() {
    const nextIdx = qIdx + 1;
    if (nextIdx >= questions.length) {
      // Read from ref - always the latest value, never stale
      const totalMistakes = mistakesRef.current;
      const stars = totalMistakes === 0 ? 3 : totalMistakes <= 2 ? 2 : 1;
      const correct = Math.max(0, questions.length - totalMistakes);
      onDone(correct, questions.length, stars);
    } else {
      setQIdx(nextIdx);
      setChosen(null);
      setTileCorrect(null);
    }
  }

  return (
    <div style={screen}>
      {/* Header: phase label + live star preview */}
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:8 }}>
        <PhasePill icon={typeLabel.split(" ")[0]} label={typeLabel.replace(/^[^ ]+ /, "")} current={qIdx+1} total={questions.length} T={getLessonTheme()} />
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          {[3,2,1].map(starNum => {
            const currentStars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
            const lit = starNum <= currentStars;
            return (
              <span key={starNum} style={{
                fontSize:22,
                transition:"all .4s cubic-bezier(.34,1.56,.64,1)",
                filter: lit ? "none" : "grayscale(1) opacity(.18)",
                transform: lit ? "scale(1)" : "scale(0.7)",
                display:"inline-block",
              }}>⭐</span>
            );
          })}
        </div>
      </div>

      <div style={{ height:4, background:"rgba(107,61,16,.08)", borderRadius:2,
        marginBottom:22, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${((qIdx)/questions.length)*100}%`,
          background:"#c9a84c", borderRadius:2, transition:"width .3s" }}/>
      </div>

      {/* Question heading */}
      <div style={{
        fontSize:11,
        fontWeight:800,
        letterSpacing:0.7,
        color:"rgba(107,61,16,0.55)",
        marginBottom:10,
        textTransform:"uppercase"
      }}>
        {q.type === "response" ? "Conversation" : q.type === "en" ? "Meaning" : q.type === "tgt" ? "Translation" : "Question"}
      </div>

      <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:20,
        fontWeight:700, marginBottom: q.subtext ? 8 : 22, lineHeight:1.4, color:"#4a2800" }}>
        {q.q}
        {/* Speak button for German/target-language words in the question */}
        {(q.type === "en") && q.subtext && (
          <button className="lv-speaker" onClick={() => speak(q.subtext, langCode)}
            style={{ marginLeft:10, background:"none", border:`1px solid rgba(245,165,36,0.45)`,
              borderRadius:20, padding:"3px 10px", fontSize:13, color:"#f5a524", cursor:"pointer", verticalAlign:"middle" }}>
            🔊
          </button>
        )}
      </div>

      {q.subtext && (
        <div style={{
          fontSize:14,
          color:"rgba(107,61,16,0.72)",
          marginBottom:18,
          lineHeight:1.5
        }}>
          {q.subtext}
        </div>
      )}

      {q.type === "response" && q.lineContext && (
        <div style={{
          background:"rgba(245,165,36,0.10)",
          border:"1px solid rgba(245,165,36,0.28)",
          borderRadius:16,
          padding:"14px 18px",
          marginBottom:18,
          color:"#4a2800"
        }}>
          <div style={{ fontSize:13, fontWeight:800, marginBottom:8 }}>{q.speaker || "Speaker"}</div>
          <div style={{ fontSize:16, lineHeight:1.5, fontWeight:600 }}>{q.lineContext}</div>
        </div>
      )}

      {/* MCQ */}
      {!isTile && (
        <div key={qIdx}>
          {(q.opts || []).map((opt, oi) => {
            const state = !chosen ? "idle"
              : opt===q.ans ? "correct"
              : opt===chosen ? "wrong" : "dim";
            return (
              <button key={`${oi}-${opt}`} style={optionStyle(state, getLessonTheme())}
                disabled={!!chosen} onClick={() => { if (q.type !== "en") speak(opt, langCode); pickMCQ(opt); }}>
                <span>{opt}</span>
                {chosen && opt===q.ans && <span>✓</span>}
                {chosen && opt===chosen && opt!==q.ans && <span>✗</span>}
              </button>
            );
          })}
          {chosen && (
            <div style={{ marginTop:14, padding:"13px 16px", borderRadius:14,
              fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:10,
              background: chosen===q.ans?"rgba(34,197,94,.12)":"rgba(239,68,68,.1)",
              border:`1px solid ${chosen===q.ans?"rgba(34,197,94,.3)":"rgba(239,68,68,.3)"}`,
              color: chosen===q.ans?"#22c55e":"#ef4444" }}>
              <span style={{ fontSize:20 }}>{chosen===q.ans?"🎉":"💡"}</span>
              <span>{chosen===q.ans?"Correct!":`You chose "${chosen}" — correct: "${q.ans}"`}</span>
            </div>
          )}
        </div>
      )}

      {/* Tile / keyboard question */}
      {isTile && (
        <TileQuestion key={"tile-" + qIdx} q={q} onAnswer={handleTileAnswer} langCode={langCode} />
      )}

      {/* Feedback for tile */}
      {isTile && tileCorrect !== null && (
        <div style={{ marginTop:12, padding:"13px 16px", borderRadius:14,
          fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:10,
          background: tileCorrect?"rgba(34,197,94,.1)":"rgba(239,68,68,.1)",
          border:`1px solid ${tileCorrect?"rgba(34,197,94,.3)":"rgba(239,68,68,.3)"}`,
          color: tileCorrect?"#86efac":"#fca5a5" }}>
          <span style={{ fontSize:20 }}>{tileCorrect?"🎉":"💡"}</span>
          <span>{tileCorrect?"Correct!":"Correct answer: "+q.ans}</span>
        </div>
      )}

      <div style={{ textAlign:"center", fontSize:12,
        color:"rgba(255,255,255,.25)", marginTop:12 }}>
        {qIdx+1} / {questions.length}
      </div>

      {answered && (
        <button style={primaryBtn} onClick={next}>
          {qIdx+1>=questions.length ? "See Results →" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

/* ─── Fox complete messages ────────────────────────────────────────────────── */
const FOX_COMPLETE_MSGS = {
  3: [
    "That was smooth.",
    "You didn't hesitate.",
    "You're finding your rhythm.",
    "Clean. No gaps.",
  ],
  2: [
    "Nice work.",
    "You're improving.",
    "That's progress.",
    "Getting there.",
  ],
  1: [
    "That one was tougher.",
    "You're close.",
    "Let's try again.",
    "Keep going.",
  ],
};

const COMPLETE_CSS = `
  @keyframes foxPopIn   { 0%{transform:scale(0) rotate(-15deg);opacity:0} 60%{transform:scale(1.2) rotate(5deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes foxWiggle  { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-10deg)} 40%{transform:rotate(10deg)} 60%{transform:rotate(-6deg)} 80%{transform:rotate(6deg)} }
  @keyframes foxDance   { 0%,100%{transform:translateY(0) scale(1) rotate(0)} 25%{transform:translateY(-12px) scale(1.1) rotate(-5deg)} 75%{transform:translateY(-6px) scale(1.05) rotate(3deg)} }
  @keyframes speechIn   { 0%{transform:scale(0.7) translateY(8px);opacity:0} 70%{transform:scale(1.03);opacity:1} 100%{transform:scale(1);opacity:1} }
  @keyframes starSeq    { 0%{transform:scale(0) rotate(-30deg);opacity:0} 60%{transform:scale(1.3) rotate(10deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes xpPop      { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.15);opacity:1} 100%{transform:scale(1);opacity:1} }

  .fox-complete-wrap {
    display: flex; align-items: flex-end; justify-content: center;
    gap: 16px; margin-bottom: 20px;
  }
  .fox-complete-avatar {
    font-size: 64px; line-height: 1;
    filter: drop-shadow(0 4px 16px rgba(255,179,107,.5));
  }
  .fox-complete-avatar.stars3 { animation: foxDance .8s ease both; }
  .fox-complete-avatar.stars2 { animation: foxWiggle .7s ease both; }
  .fox-complete-avatar.stars1 { animation: foxPopIn .5s ease both; }

  .fox-speech-bubble {
    position: relative;
    background: rgba(255,255,255,.07);
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 18px 18px 18px 4px;
    padding: 12px 16px;
    max-width: 220px; text-align: left;
    font-size: 14px; font-weight: 500; line-height: 1.5;
    color: rgba(240,237,230,.95);
    animation: speechIn .4s .3s cubic-bezier(.34,1.56,.64,1) both;
  }
  .fox-speech-bubble.gold {
    border-color: rgba(201,168,76,.4);
    background: rgba(201,168,76,.08);
  }
`;

/* ─── COMPLETE ────────────────────────────────────────────────────────────── */
function Complete({ module, score, total, levelColor, onBack, onNext, onReview }) {
  const mistakes = total - score;
  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
  const xp = stars === 3 ? 35 : stars === 2 ? 25 : 15;
  const lessonName = module?.lesson_focus || module?.title || "Lesson";

  // Pick a random fox message based on stars
  const foxMsg = (() => {
    const msgs = FOX_COMPLETE_MSGS[stars] || FOX_COMPLETE_MSGS[1];
    return msgs[Math.floor(Math.random() * msgs.length)];
  })();

  const foxAnim = stars === 3 ? "stars3" : stars === 2 ? "stars2" : "stars1";

  const T = getLessonTheme();
  const trailPts = stars === 3 ? 15 : stars === 2 ? 10 : 5;

  return (
    <div style={{ ...screen, textAlign:"center", paddingTop:28 }}>
      <style>{COMPLETE_CSS + LESSON_CSS}</style>

      {/* Ambient glow behind fox */}
      <div style={{ position:"relative", marginBottom:24 }}>
        <div style={{ position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)", width:160, height:160,
          borderRadius:"50%", background:`radial-gradient(circle,${T.path}22,transparent 70%)`,
          filter:"blur(20px)", pointerEvents:"none", animation:"lv-glow 2s ease-in-out infinite" }}/>

        {/* Fox + speech bubble */}
        <div className="fox-complete-wrap" style={{ position:"relative" }}>
          <div className={`fox-complete-avatar ${foxAnim}`} style={{
            filter:`drop-shadow(0 8px 24px ${T.path}66)`
          }}>🦊</div>
          <div className={`fox-speech-bubble ${stars === 3 ? "gold" : ""}`}
            style={{ background: T.isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.85)",
              border:`1px solid ${stars===3 ? T.path+"55" : T.border}`,
              color:T.text }}>
            {foxMsg}
          </div>
        </div>
      </div>

      {/* Stars */}
      <div style={{ display:"flex", justifyContent:"center", gap:14, marginBottom:16 }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            fontSize:44, display:"inline-block",
            filter: i < stars ? "none" : "grayscale(1) opacity(0.18)",
            animation: i < stars ? `starSeq 0.4s ${i*0.15+0.45}s both` : "none",
          }}>⭐</span>
        ))}
      </div>

      {/* Lesson name */}
      <div style={{ fontSize:13, color:T.muted, marginBottom:22, letterSpacing:0.4 }}>
        {lessonName}
      </div>

      {/* XP + score pills */}
      <div style={{ display:"flex", gap:9, justifyContent:"center", marginBottom:28, flexWrap:"wrap" }}>
        <div style={{ padding:"9px 16px", borderRadius:40, fontSize:13, fontWeight:800,
          background:`linear-gradient(135deg,${T.path}22,${T.path}12)`,
          border:`1px solid ${T.path}45`, color:T.path,
          animation:"xpPop 0.4s 0.75s both",
          boxShadow:`0 4px 14px ${T.path}28` }}>
          ⚡ +{xp} XP
        </div>
        <div style={{ padding:"9px 16px", borderRadius:40, fontSize:13, fontWeight:800,
          background:"rgba(167,139,250,0.12)", border:"1px solid rgba(167,139,250,0.3)",
          color:"#a78bfa", animation:"xpPop 0.4s 0.9s both" }}>
          🏔️ +{trailPts} trail pts
        </div>
        <div style={{ padding:"9px 16px", borderRadius:40, fontSize:13, fontWeight:800,
          background: mistakes===0 ? "rgba(34,197,94,0.12)" : T.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
          border:`1px solid ${mistakes===0 ? "rgba(34,197,94,0.35)" : T.border}`,
          color: mistakes===0 ? "#22c55e" : T.muted,
          animation:"xpPop 0.4s 0.85s both" }}>
          {mistakes === 0 ? "✓ Perfect!" : `✓ ${score}/${total} correct`}
        </div>
      </div>

      {/* Trail path divider */}
      <div style={{ height:1, background:`linear-gradient(90deg,transparent,${T.path}30,transparent)`,
        marginBottom:22 }}/>

      <div style={{ display:"flex", flexDirection:"column", gap:10, width:"100%", maxWidth:340, margin:"0 auto" }}>
        {onNext && (
          <button className="lv-primary"
            style={{ ...primaryBtn,
              animation:"lv-fadeUp 0.4s 1.1s ease both" }}
            onClick={onNext}>
            ▶ Next Lesson
          </button>
        )}
        {onReview && (
          <button style={{ ...secondaryBtn,
            background: T.isDark ? "rgba(167,139,250,0.1)" : "rgba(139,92,246,0.08)",
            border:"1px solid rgba(167,139,250,0.3)", color:"#a78bfa",
            animation:"lv-fadeUp 0.4s 1.2s ease both" }}
            onClick={onReview}>
            📝 Review Flashcards
          </button>
        )}
        <button style={{ ...secondaryBtn,
          animation:"lv-fadeUp 0.4s 1.3s ease both",
          background: T.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          border:`1px solid ${T.border}`, color:T.muted }}
          onClick={onBack}>
          🗺️ Back to Trail
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN LESSONVIEW ─────────────────────────────────────────────────────── */
function LessonViewInner({
  module, levelKey, level, levelColor, langCode, userId,
  onComplete, onBack, onNextLesson, onGoReview,
}) {
  const [phase, setPhase] = useState("intro");
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  // Incremented on each re-attempt, forcing Quiz to fully remount and reset
  const [attemptKey, setAttemptKey] = useState(0);

  const resolvedLevel = levelKey || level || "A1";
  const resolvedColor = levelColor || "#22c55e";

  const hasGrammar  = typeof module?.grammar === "string" && module.grammar.length > 0;

  const phases = ["intro","vocab","grammar","quiz","complete"].filter(p => {
    if (p === "grammar")  return hasGrammar;
    return true;
  });

  const phaseIdx = phases.indexOf(phase);
  const progress = phaseIdx < 0 ? 0 : phaseIdx / Math.max(phases.length - 1, 1);

  useEffect(() => {
    setPhase("intro");
    setQuizScore(0);
    setQuizTotal(0);
    setAttemptKey(k => k + 1);
  }, [module?.id]);

  if (!module) return null;

  function goNext() {
    const i = phases.indexOf(phase);
    if (i >= 0 && i < phases.length - 1) setPhase(phases[i + 1]);
  }

  function handleQuizDone(score, total, stars) {
    setQuizScore(score);
    setQuizTotal(total);
    setPhase("complete");
    try {
      // stars passed directly from Quiz (0 mistakes=3, 1-2=2, 3+=1)
      const earnedStars = (typeof stars === "number" && stars >= 1) ? stars : 1;
      const earnedXP = earnedStars === 3 ? 35 : earnedStars === 2 ? 25 : 15;
      if (onComplete) onComplete(module.id, earnedXP, earnedStars);
    } catch (e) {
      console.error("onComplete error:", e);
    }
  }

  const lT = getLessonTheme();
  const dynamicRoot = { ...root, background:lT.bg, color:lT.text };
  const dynamicTopbar = { ...topbar, background:lT.topbar, borderBottom:`1px solid ${lT.border}` };
  const dynamicClose = { ...closeBtn, border:`1px solid ${lT.border}`, color:lT.muted,
    background: lT.isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" };

  return (
    <div style={dynamicRoot}>
      <style>{LESSON_CSS}</style>
      {/* Topbar */}
      <div style={dynamicTopbar}>
        <button style={dynamicClose} onClick={onBack}>✕</button>
        <div style={{ flex:1, position:"relative", height:8, borderRadius:4,
          background: lT.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:4,
            background:`linear-gradient(90deg, ${resolvedColor}, ${lT.path})`,
            width:`${progress*100}%`, transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)",
            boxShadow:`0 0 8px ${lT.path}88` }}/>
        </div>
        <div style={{ fontSize:12, fontWeight:800, color:lT.isDark?"#120d00":"#fff",
          background:`linear-gradient(135deg,${lT.path},${lT.path}bb)`,
          borderRadius:20, padding:"5px 13px", flexShrink:0,
          boxShadow:`0 2px 10px ${lT.path}55` }}>
          +{35} XP max
        </div>
      </div>

      {phase === "intro"    && <Intro    module={module} onStart={goNext} />}
      {phase === "vocab"    && <Vocab    module={module} langCode={langCode} onDone={goNext} />}
      {phase === "grammar"  && <Grammar  module={module} onDone={goNext} />}
      {phase === "quiz"     && <Quiz     key={attemptKey} module={module} langCode={langCode}
        userId={userId} onDone={handleQuizDone} />}
      {phase === "complete" && <Complete module={module} score={quizScore}
        total={quizTotal} levelColor={resolvedColor}
        onBack={onBack} onNext={onNextLesson} onReview={onGoReview} />}
    </div>
  );
}

export default function LessonView(props) {
  return (
    <ErrorBoundary onBack={props.onBack}>
      <LessonViewInner {...props} />
    </ErrorBoundary>
  );
}
