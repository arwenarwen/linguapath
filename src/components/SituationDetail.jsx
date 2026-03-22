import React, { useState } from 'react';
import AIChat from './AIChat';
import { GLOBAL_CSS } from '../config/theme';
import { getAIChatLangConfig } from '../config/langConfig';
import { EXTRA_SITUATION_PHRASES, getSituationPhrases, formatTutorPhraseList } from '../data/situations';
import { AI_SCENARIOS } from '../data/aiScenarios';


// ── Trail animal tutors ───────────────────────────────────────────────────────
const TUTOR_ANIMALS = [
  { key:"🦊", name:"Fox",    species:"Your Guide",    color:"#e8730a", bg:"linear-gradient(135deg,#fff4ee,#ffe8d8)", greeting:"Let's practice together. I'll guide you through this." },
  { key:"🐇", name:"Mira",   species:"Rabbit",        color:"#e8b4b8", bg:"linear-gradient(135deg,#fff0f3,#ffe4e8)", greeting:"Hi! I'm Mira. Ready to hop through this scenario?" },
  { key:"🦉", name:"Sage",   species:"Owl",           color:"#7a5c2e", bg:"linear-gradient(135deg,#fdf4e7,#f5e8cc)", greeting:"Hoo there. Let's learn wisely together." },
  { key:"🐺", name:"Grey",   species:"Wolf",          color:"#666688", bg:"linear-gradient(135deg,#eeeef8,#ddddf0)", greeting:"I'm Grey. The challenge won't scare us." },
  { key:"🦁", name:"Rex",    species:"Lion",          color:"#c49a28", bg:"linear-gradient(135deg,#fffae8,#fff0c0)", greeting:"I am Rex. Let's face this together." },
  { key:"🦅", name:"Arro",   species:"Eagle",         color:"#c47c28", bg:"linear-gradient(135deg,#fff4e0,#ffe8c0)", greeting:"I am Arro. See how far you can fly." },
];

const ANIMAL_SVG_SMALL = {
  "🦊": <svg viewBox="0 0 120 130" width="100%" height="100%"><ellipse cx="92" cy="100" rx="24" ry="36" fill="#e8730a" transform="rotate(15,92,100)"/><ellipse cx="92" cy="100" rx="14" ry="24" fill="#f0a050" transform="rotate(15,92,100)"/><ellipse cx="97" cy="118" rx="10" ry="12" fill="#f5f5f0" transform="rotate(15,97,118)"/><ellipse cx="54" cy="100" rx="28" ry="26" fill="#e8730a"/><ellipse cx="54" cy="65" rx="26" ry="26" fill="#e8730a"/><path d="M36 45 L28 22 L52 40 Z" fill="#e8730a"/><path d="M72 45 L80 22 L58 40 Z" fill="#e8730a"/><path d="M38 43 L32 26 L50 40 Z" fill="#c84a08"/><path d="M70 43 L76 26 L60 40 Z" fill="#c84a08"/><ellipse cx="54" cy="74" rx="18" ry="14" fill="#f5f0e8"/><ellipse cx="42" cy="62" rx="7" ry="6" fill="#d4a820"/><circle cx="42" cy="62" r="4" fill="#1a1a00"/><circle cx="44" cy="60" r="1.5" fill="white"/><ellipse cx="66" cy="62" rx="7" ry="6" fill="#d4a820"/><circle cx="66" cy="62" r="4" fill="#1a1a00"/><circle cx="68" cy="60" r="1.5" fill="white"/><ellipse cx="54" cy="72" rx="4" ry="3" fill="#2a1800"/><ellipse cx="35" cy="120" rx="12" ry="8" fill="#e8730a"/><ellipse cx="73" cy="120" rx="12" ry="8" fill="#e8730a"/></svg>,
  "🐇": <svg viewBox="0 0 120 140" width="100%" height="100%"><ellipse cx="38" cy="28" rx="12" ry="32" fill="#f0f0f0" stroke="#ccc" strokeWidth="1.5"/><ellipse cx="82" cy="28" rx="12" ry="32" fill="#f0f0f0" stroke="#ccc" strokeWidth="1.5"/><ellipse cx="38" cy="28" rx="7" ry="24" fill="#ffb3c6"/><ellipse cx="82" cy="28" rx="7" ry="24" fill="#ffb3c6"/><ellipse cx="60" cy="105" rx="36" ry="32" fill="#f5f5f5" stroke="#ddd" strokeWidth="1.5"/><circle cx="60" cy="68" r="30" fill="#f5f5f5" stroke="#ddd" strokeWidth="1.5"/><circle cx="47" cy="63" r="8" fill="#1a1a1a"/><circle cx="49" cy="61" r="2.5" fill="white"/><circle cx="73" cy="63" r="8" fill="#1a1a1a"/><circle cx="75" cy="61" r="2.5" fill="white"/><ellipse cx="40" cy="72" rx="8" ry="5" fill="#ffb3c6" opacity="0.5"/><ellipse cx="80" cy="72" rx="8" ry="5" fill="#ffb3c6" opacity="0.5"/><ellipse cx="60" cy="74" rx="4" ry="3" fill="#ffb3c6"/><ellipse cx="38" cy="130" rx="14" ry="10" fill="#f0f0f0" stroke="#ddd" strokeWidth="1.5"/><ellipse cx="82" cy="130" rx="14" ry="10" fill="#f0f0f0" stroke="#ddd" strokeWidth="1.5"/></svg>,
  "🦉": <svg viewBox="0 0 120 130" width="100%" height="100%"><ellipse cx="60" cy="95" rx="34" ry="32" fill="#7a5c2e"/><ellipse cx="32" cy="95" rx="16" ry="24" fill="#6a4c1e" transform="rotate(-10,32,95)"/><ellipse cx="88" cy="95" rx="16" ry="24" fill="#6a4c1e" transform="rotate(10,88,95)"/><circle cx="60" cy="54" r="32" fill="#8b6c3a"/><path d="M42 30 L38 18 L48 26 Z" fill="#7a5c2e"/><path d="M78 30 L82 18 L72 26 Z" fill="#7a5c2e"/><ellipse cx="60" cy="58" rx="24" ry="22" fill="#d4b474" opacity="0.4"/><circle cx="46" cy="52" r="12" fill="#e8d080"/><circle cx="46" cy="52" r="8" fill="#2a1800"/><circle cx="49" cy="49" r="3" fill="white"/><circle cx="74" cy="52" r="12" fill="#e8d080"/><circle cx="74" cy="52" r="8" fill="#2a1800"/><circle cx="77" cy="49" r="3" fill="white"/><path d="M56 66 L64 66 L60 74 Z" fill="#c4841a"/></svg>,
  "🐺": <svg viewBox="0 0 120 130" width="100%" height="100%"><path d="M36 36 L26 14 L50 30 Z" fill="#6a6a80"/><path d="M84 36 L94 14 L70 30 Z" fill="#6a6a80"/><path d="M38 34 L30 18 L48 30 Z" fill="#d4d0e8"/><path d="M82 34 L90 18 L72 30 Z" fill="#d4d0e8"/><ellipse cx="60" cy="100" rx="34" ry="26" fill="#8a8a9a"/><ellipse cx="60" cy="62" rx="30" ry="28" fill="#8a8a9a"/><ellipse cx="60" cy="76" rx="18" ry="12" fill="#c4c0d8"/><ellipse cx="46" cy="58" rx="8" ry="7" fill="#d4a820"/><circle cx="46" cy="58" r="5" fill="#2a1a00"/><circle cx="48" cy="56" r="2" fill="white"/><ellipse cx="74" cy="58" rx="8" ry="7" fill="#d4a820"/><circle cx="74" cy="58" r="5" fill="#2a1a00"/><circle cx="76" cy="56" r="2" fill="white"/><ellipse cx="60" cy="73" rx="5" ry="3.5" fill="#2a2a3a"/></svg>,
  "🦁": <svg viewBox="0 0 130 130" width="100%" height="100%"><circle cx="65" cy="65" r="48" fill="#c4841a" opacity="0.8"/><circle cx="65" cy="65" r="42" fill="#d49a2a"/><circle cx="65" cy="65" r="34" fill="#e8b84a"/><ellipse cx="65" cy="78" rx="18" ry="13" fill="#d4a040"/><circle cx="50" cy="60" r="9" fill="#8b6010"/><circle cx="50" cy="60" r="6" fill="#2a1800"/><circle cx="52" cy="58" r="2.5" fill="white"/><circle cx="80" cy="60" r="9" fill="#8b6010"/><circle cx="80" cy="60" r="6" fill="#2a1800"/><circle cx="82" cy="58" r="2.5" fill="white"/><path d="M60 76 L70 76 L65 80 Z" fill="#8b4010"/></svg>,
  "🦅": <svg viewBox="0 0 120 110" width="100%" height="100%"><path d="M60 60 Q30 40 8 50 Q20 55 30 65 Q45 60 60 60 Z" fill="#5a4010"/><path d="M60 60 Q90 40 112 50 Q100 55 90 65 Q75 60 60 60 Z" fill="#5a4010"/><ellipse cx="60" cy="72" rx="20" ry="24" fill="#5a4010"/><ellipse cx="60" cy="44" rx="18" ry="20" fill="#f0ede0"/><circle cx="52" cy="40" r="5" fill="#d4a820"/><circle cx="52" cy="40" r="3" fill="#1a1a00"/><circle cx="53" cy="39" r="1.5" fill="white"/><circle cx="68" cy="40" r="5" fill="#d4a820"/><circle cx="68" cy="40" r="3" fill="#1a1a00"/><circle cx="69" cy="39" r="1.5" fill="white"/><path d="M53 50 L67 50 L60 60 Z" fill="#d4a820"/></svg>,
};

function TutorAnimalCard({ a, i, C, onPick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onPick}
      style={{
        borderRadius:16,padding:"12px 10px",cursor:"pointer",textAlign:"center",
        background: hov ? a.bg : `rgba(255,255,255,0.04)`,
        border: `1px solid ${hov ? a.color+"55" : C.border}`,
        boxShadow: hov ? `0 8px 24px rgba(0,0,0,0.15),0 0 0 1px ${a.color}22` : "0 2px 6px rgba(0,0,0,0.08)",
        transition:"all 0.18s ease",
        animation:`animalPop 0.35s ${i*0.08}s ease both`,
      }}>
      <div style={{ width:"100%",aspectRatio:"1",maxWidth:72,margin:"0 auto 6px",animation:hov?"animalIdle 2.5s ease-in-out infinite":"none" }}>
        {ANIMAL_SVG_SMALL[a.key]||<div style={{fontSize:44}}>{a.key}</div>}
      </div>
      <div style={{ fontSize:11,fontWeight:800,color:hov?a.color:C.text,fontFamily:"'Syne',sans-serif",marginBottom:1 }}>{a.name}</div>
      <div style={{ fontSize:9,color:C.muted,opacity:0.8 }}>{a.species}</div>
    </div>
  );
}

function SituationDetail({ situation, langCode = "es", userId, onClose, onGoReview }) {
  const [mode, setMode] = useState("pick"); // pick | quick | ai
  const [aiScenario, setAiScenario] = useState(null);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [showTranslation, setShowTranslation] = useState({});

  const matchingScenario = AI_SCENARIOS.find(s => s.situationId === situation.id);
  const quickPhrases = getSituationPhrases(situation);

  function buildSituationAIScenario(animalTutor) {
    if (!matchingScenario) return null;
    const langName = getAIChatLangConfig(langCode).name;
    const phraseList = formatTutorPhraseList(situation, langCode);

    return {
      ...matchingScenario,
      mode: "tutor",
      id: situation.id,
      scenarioId: situation.id,
      scenarioTitle: situation.title,
      title: situation.title,
      icon: animalTutor ? animalTutor.key : situation.icon,
      tutorName: animalTutor ? animalTutor.name + ' the ' + animalTutor.species : 'the Fox',
      animalKey: animalTutor ? animalTutor.key : "🦊",
      animalBg: animalTutor ? animalTutor.bg : "linear-gradient(135deg,#fff4ee,#ffe8d8)",
      animalColor: animalTutor ? animalTutor.color : "#e8730a",
      animalName: animalTutor ? animalTutor.name : "Fox",
      systemPrompt: `You are LingoTrailz AI Tutor for the ${situation.title} scenario in ${langName}.

Start in English. Do not ask the learner which scenario they want — it is already selected.

First present these 10 useful phrases:
${phraseList}

Then ask:
1) Practice the phrases
2) Do a quick mini exercise
3) Start the roleplay

After that:
- stay inside the ${situation.title} scenario
- act as the ${matchingScenario.aiRole}
- keep the roleplay practical and realistic
- when the learner makes mistakes, praise the attempt, show the corrected sentence, explain briefly in English, and ask them to try again

Use natural, high-frequency language that sounds helpful and real.`
    };
  }

  if (mode === "ai" && aiScenario) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <style>{GLOBAL_CSS}</style>
        <AIChat scenario={aiScenario} langCode={langCode} userId={userId}
          onClose={() => { setMode("pick"); setAiScenario(null); }}
          onBack={() => { setMode("pick"); setAiScenario(null); }}
          onGoReview={() => {
            stopAllAudio();
            setAiScenario(null);
            setMode("pick");
            onGoReview?.();
          }} />
      </div>
    );
  }

  // ── Trail theme ──────────────────────────────────────────────────────────────
  const h = new Date().getHours();
  const C = h>=6&&h<12
    ? {bg:"linear-gradient(180deg,#fff7ea,#ffe7c2)",text:"#6b3d10",muted:"rgba(107,61,16,0.6)",path:"#f5a524",border:"rgba(245,165,36,0.25)",panel:"rgba(255,255,255,0.72)"}
    : h>=12&&h<18
    ? {bg:"linear-gradient(180deg,#fff8ef,#ffe9cf)",text:"#6c3a0a",muted:"rgba(108,58,10,0.58)",path:"#f59e0b",border:"rgba(245,158,11,0.2)",panel:"rgba(255,255,255,0.7)"}
    : h>=18&&h<21
    ? {bg:"linear-gradient(180deg,#2b1408,#54260d)",text:"#fff0da",muted:"rgba(255,233,204,0.58)",path:"#ffb340",border:"rgba(255,179,64,0.22)",panel:"rgba(70,31,10,0.78)"}
    : {bg:"linear-gradient(180deg,#121420,#21191a)",text:"#f8ead0",muted:"rgba(248,234,208,0.56)",path:"#ffb84d",border:"rgba(255,184,77,0.18)",panel:"rgba(22,23,37,0.82)"};

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily:"var(--font-body)", color:C.text }}>
      <style>{GLOBAL_CSS + `
        @keyframes situFadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes animalEntrance{0%{transform:translateY(40px) scale(0.8);opacity:0}65%{transform:translateY(-6px) scale(1.05)}100%{transform:translateY(0) scale(1);opacity:1}}
        @keyframes animalIdle{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-8px) rotate(1deg)}}
        @keyframes animalPop{0%{transform:scale(0.85);opacity:0}70%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
        .tutor-card{transition:transform 0.18s ease,box-shadow 0.18s ease,border-color 0.18s ease,background 0.18s ease;}
        .tutor-card:hover{transform:translateY(-3px);}
        .tutor-card:active{transform:scale(0.97);}
      `}</style>

      {/* Back nav bar */}
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${C.border}`, background:C.panel, backdropFilter:"blur(12px)" }}>
        <button style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:20,padding:"2px 6px",borderRadius:8 }} onClick={onClose}>←</button>
        <span style={{ fontSize:22 }}>{situation.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:C.text }}>{situation.title}</div>
          <div style={{ fontSize:11,color:C.muted }}>{situation.desc}</div>
        </div>
      </div>

      <div style={{ maxWidth:520, margin:"0 auto", padding:"20px 18px" }}>
        {mode === "pick" && (
          <div style={{ animation:"situFadeUp 0.4s ease both" }}>

            {/* Quick mode card */}
            <div className="tutor-card"
              onClick={() => setMode("quick")}
              style={{ borderRadius:18,padding:"16px",marginBottom:10,cursor:"pointer",
                background:`${C.path}10`,border:`1px solid ${C.path}35`,
                boxShadow:`0 4px 16px rgba(0,0,0,0.08),inset 0 1px 0 rgba(255,255,255,0.08)` }}>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:44,height:44,borderRadius:13,background:`${C.path}20`,border:`1px solid ${C.path}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>⚡</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:C.text,marginBottom:3 }}>Quick Practice</div>
                  <div style={{ fontSize:12,color:C.muted }}>{quickPhrases.length} essential phrases — learn the most-used lines first</div>
                </div>
                <div style={{ color:C.path,fontSize:18,opacity:0.6 }}>→</div>
              </div>
            </div>

            {/* AI Tutor — pick your guide */}
            {matchingScenario && (
              <div style={{ marginTop:6 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10,marginTop:16 }}>
                  <div style={{ height:1,flex:1,background:`linear-gradient(90deg,transparent,${C.border})` }}/>
                  <span style={{ fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:C.muted }}>Or choose your guide</span>
                  <div style={{ height:1,flex:1,background:`linear-gradient(90deg,${C.border},transparent)` }}/>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
                  {TUTOR_ANIMALS.map((a,i) => (
                    <TutorAnimalCard key={a.key} a={a} i={i} C={C}
                      onPick={() => { setAiScenario(buildSituationAIScenario(a)); setMode("ai"); }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {mode === "quick" && (
          <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>⚡ Quick Phrases</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setMode("pick")}>← Back</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {quickPhrases.map((p, i) => (
                <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 18px",
                  cursor: "pointer", transition: "all 0.15s" }}
                  onClick={() => setShowTranslation(prev => ({ ...prev, [i]: !prev[i] }))}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color:"var(--text)", marginBottom: showTranslation[i] ? 6 : 0 }}>{p.en}</div>
                      {showTranslation[i] && (
                        <div style={{ fontSize: 14, color: situation.color, fontWeight: 600 }} className="fade-in">
                          {p[langCode] || p.es || p.de || p.fr || p.it || p.pt || p.zh || p.ja || p.ko || p.pl || "Translation not available"}
                        </div>
                      )}
                      {!showTranslation[i] && <div style={{ fontSize: 11, color: "var(--muted)", marginTop:3 }}>tap to reveal translation</div>}
                    </div>
                    <button onClick={e => { e.stopPropagation(); playWordAudio((p[langCode] || p.de || p.es || p.fr || p.it || p.pt || p.zh || p.ja || p.ko || p.pl || p.en), langCode); }}
                      style={{ background:"rgba(245,200,66,0.1)", border:"1px solid rgba(245,200,66,0.25)",
                        borderRadius:20, padding:"5px 12px", color:"var(--gold)", fontSize:12, cursor:"pointer", flexShrink:0, marginLeft:10 }}>
                      🔊
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {matchingScenario && (
              <button className="btn btn-gold" style={{ width: "100%", marginTop: 24 }}
                onClick={() => { setAiScenario(buildSituationAIScenario()); setMode("ai"); }}>
                🤖 Now practice with AI →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW PANEL — Flashcards + Dictionary
// ─────────────────────────────────────────────────────────────────────────────


export default SituationDetail;
