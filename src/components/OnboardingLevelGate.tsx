import React, { useMemo, useState } from "react";
import { calculatePlacementLevel, FREE_PLAN_RULES, LEVEL_ORDER, PLACEMENT_QUESTIONS } from "../data/placementConfig";

const LANGUAGES = [
  { code:"es", name:"Spanish",    native:"Español",   flag:"🇪🇸" },
  { code:"de", name:"German",     native:"Deutsch",   flag:"🇩🇪" },
  { code:"fr", name:"French",     native:"Français",  flag:"🇫🇷" },
  { code:"it", name:"Italian",    native:"Italiano",  flag:"🇮🇹" },
  { code:"pt", name:"Portuguese", native:"Português", flag:"🇧🇷" },
  { code:"zh", name:"Mandarin",   native:"普通话",     flag:"🇨🇳" },
  { code:"ja", name:"Japanese",   native:"日本語",     flag:"🇯🇵" },
  { code:"ko", name:"Korean",     native:"한국어",     flag:"🇰🇷" },
  { code:"ru", name:"Russian",    native:"Русский",   flag:"🇷🇺" },
  { code:"el", name:"Greek",      native:"Ελληνικά",  flag:"🇬🇷" },
];

export default function OnboardingLevelGate({ onFinish, appName = "Lingotrailz", initialLang = null }: any) {
  // initialLang: skip the language picker when switching to a new language from inside the app
  const [step, setStep] = useState(initialLang ? "welcome" : "language");
  const [selectedLang, setSelectedLang] = useState<string | null>(initialLang || null);
  const [answers, setAnswers] = useState({});
  const correctAnswers = useMemo(() => PLACEMENT_QUESTIONS.reduce((sum, q) => sum + (answers[q.id] === q.correctIndex ? 1 : 0), 0), [answers]);
  const placedLevel = useMemo(() => calculatePlacementLevel(correctAnswers), [correctAnswers]);
  const allAnswered = Object.keys(answers).length === PLACEMENT_QUESTIONS.length;

  const card = { width:"100%", maxWidth:840, background:"rgba(255,255,255,0.78)", border:"1.5px solid rgba(245,165,36,0.25)", borderRadius:28, padding: step==="placement" ? 28 : 34, boxShadow:"0 18px 48px rgba(245,165,36,0.14)", color:"#4a2800", backdropFilter:"blur(14px)" };
  const btnBase = { width:"100%", textAlign:"left", borderRadius:22, padding:"22px 20px", border:"1.5px solid rgba(245,165,36,0.22)", background:"rgba(255,255,255,0.72)", cursor:"pointer", color:"#4a2800" };

  const langName = selectedLang ? (LANGUAGES.find(l => l.code === selectedLang)?.name || "the language") : "the language";

  // ── Step 1: Language picker ──────────────────────────────────────────────────
  if (step === "language") return (
    <div style={card}>
      <div style={{display:"inline-flex",padding:"7px 14px",borderRadius:999,background:"rgba(245,165,36,0.12)",border:"1px solid rgba(245,165,36,0.24)",fontSize:12,fontWeight:800,letterSpacing:1.2,textTransform:"uppercase",color:"#c9840a",marginBottom:18}}>Welcome to {appName}</div>
      <div style={{fontFamily:"var(--font-display)",fontWeight:900,fontSize:36,lineHeight:1.05,marginBottom:8}}>Which language do you want to learn?</div>
      <div style={{fontSize:15,lineHeight:1.7,color:"rgba(74,40,0,0.65)",marginBottom:24}}>Pick the language you want to start with. You can always add more later.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12,marginBottom:28}}>
        {LANGUAGES.map(l => {
          const selected = selectedLang === l.code;
          return (
            <button key={l.code} onClick={() => setSelectedLang(l.code)}
              style={{display:"flex",alignItems:"center",gap:10,borderRadius:18,padding:"14px 16px",
                border: selected ? "2px solid #f5a524" : "1.5px solid rgba(245,165,36,0.22)",
                background: selected ? "rgba(245,165,36,0.14)" : "rgba(255,255,255,0.72)",
                cursor:"pointer",color:"#4a2800",fontWeight:700,transition:"all 0.15s"}}>
              <span style={{fontSize:22}}>{l.flag}</span>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:14,fontWeight:800}}>{l.name}</div>
                <div style={{fontSize:11,color:"rgba(74,40,0,0.55)"}}>{l.native}</div>
              </div>
            </button>
          );
        })}
      </div>
      <button disabled={!selectedLang} onClick={() => setStep("welcome")}
        style={{padding:"14px 32px",borderRadius:999,border:"none",
          background: selectedLang ? "#f5a524" : "rgba(245,165,36,0.25)",
          color: selectedLang ? "#fff" : "rgba(255,255,255,0.6)",
          fontWeight:800,fontSize:16,cursor:selectedLang?"pointer":"default",transition:"all 0.15s"}}>
        Continue →
      </button>
    </div>
  );

  // ── Step 2: New or experienced? ──────────────────────────────────────────────
  if (step === "welcome") return (
    <div style={card}>
      <div style={{display:"inline-flex",padding:"7px 14px",borderRadius:999,background:"rgba(245,165,36,0.12)",border:"1px solid rgba(245,165,36,0.24)",fontSize:12,fontWeight:800,letterSpacing:1.2,textTransform:"uppercase",color:"#c9840a",marginBottom:18}}>
        {LANGUAGES.find(l => l.code === selectedLang)?.flag} {langName}
      </div>
      <div style={{fontFamily:"var(--font-display)",fontWeight:900,fontSize:40,lineHeight:1.05,marginBottom:10}}>Are you new to {langName}?</div>
      <div style={{fontSize:17,lineHeight:1.75,color:"rgba(74,40,0,0.7)",maxWidth:680,marginBottom:24}}>Choose the smoothest starting point. Beginners go straight into A1. If you already know some {langName}, take a short placement check so the app can recommend the best level.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
        <button onClick={() => onFinish({ isBeginner:true, placedLevel:"A1", freeAccessLevel:"A1", previewLessonsAllowed:0, placementScore:0, langCode: selectedLang, selectedLanguage: langName })} style={btnBase}>
          <div style={{fontSize:22,fontWeight:900,marginBottom:6}}>I'm new</div>
          <div style={{fontSize:14,lineHeight:1.65,color:"rgba(74,40,0,0.7)"}}>Start in A1 right away with the easiest onboarding and no placement friction.</div>
          <div style={{marginTop:12,fontSize:14,fontWeight:800,color:"#c9840a"}}>Start A1 instantly →</div>
        </button>
        <button onClick={() => setStep("placement")} style={{...btnBase, background:"linear-gradient(180deg,rgba(255,248,232,0.96),rgba(255,255,255,0.8))"}}>
          <div style={{fontSize:22,fontWeight:900,marginBottom:6}}>I already know some</div>
          <div style={{fontSize:14,lineHeight:1.65,color:"rgba(74,40,0,0.7)"}}>Take a short placement test so we can recommend the right CEFR level for you.</div>
          <div style={{marginTop:12,fontSize:14,fontWeight:800,color:"#c9840a"}}>Take placement test →</div>
        </button>
      </div>
      <button onClick={() => setStep("language")} style={{marginTop:18,background:"none",border:"none",color:"rgba(74,40,0,0.45)",cursor:"pointer",fontSize:13,fontWeight:700}}>← Change language</button>
    </div>
  );

  // ── Step 3: Placement test ───────────────────────────────────────────────────
  if (step === "placement") return (
    <div style={card}>
      <div style={{fontSize:11,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:"#c9840a",marginBottom:10}}>Placement test</div>
      <div style={{fontFamily:"var(--font-display)",fontWeight:900,fontSize:34,lineHeight:1.08,marginBottom:10}}>Let's find your {langName} level</div>
      <div style={{fontSize:15,lineHeight:1.7,color:"rgba(74,40,0,0.7)",marginBottom:22}}>Answer these quick questions. Free users placed above A1 can preview a few lessons at that level before upgrading.</div>
      <div style={{display:"flex",flexDirection:"column",gap:14,maxHeight:"62vh",overflowY:"auto",paddingRight:4}}>
        {PLACEMENT_QUESTIONS.map((question, index) => (
          <div key={question.id} style={{border:"1.5px solid rgba(245,165,36,0.18)",borderRadius:20,padding:18,background:"rgba(255,255,255,0.62)"}}>
            <div style={{fontSize:11,fontWeight:800,letterSpacing:1.4,textTransform:"uppercase",color:"rgba(74,40,0,0.48)",marginBottom:6}}>Question {index+1} · {question.level}</div>
            <div style={{fontSize:18,fontWeight:800,lineHeight:1.45,marginBottom:12}}>{question.prompt}</div>
            <div style={{display:"grid",gap:10}}>
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                return (
                  <button key={option} onClick={() => setAnswers(prev => ({...prev, [question.id]: optionIndex}))}
                    style={{textAlign:"left",borderRadius:16,padding:"13px 14px",
                      border:selected?"1.5px solid #f5a524":"1.5px solid rgba(245,165,36,0.16)",
                      background:selected?"rgba(245,165,36,0.12)":"rgba(255,255,255,0.75)",
                      color:"#4a2800",fontWeight:700,cursor:"pointer"}}>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:18,gap:12}}>
        <button onClick={() => setStep("welcome")} style={{padding:"12px 18px",borderRadius:999,border:"1.5px solid rgba(245,165,36,0.18)",background:"transparent",cursor:"pointer",color:"#4a2800",fontWeight:700}}>← Back</button>
        <div style={{fontSize:13,color:"rgba(74,40,0,0.55)"}}>Answered {Object.keys(answers).length}/{PLACEMENT_QUESTIONS.length}</div>
        <button disabled={!allAnswered} onClick={() => setStep("result")} style={{padding:"13px 22px",borderRadius:999,border:"none",background:allAnswered?"#f5a524":"rgba(245,165,36,0.25)",color:allAnswered?"#fff":"rgba(255,255,255,0.7)",fontWeight:800,cursor:allAnswered?"pointer":"default"}}>See my result</button>
      </div>
    </div>
  );

  // ── Step 4: Result ───────────────────────────────────────────────────────────
  return (
    <div style={card}>
      <div style={{fontSize:11,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:"#c9840a",marginBottom:8}}>Your recommended level</div>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}>
        <div style={{width:76,height:76,borderRadius:22,background:"rgba(245,165,36,0.12)",border:"1.5px solid rgba(245,165,36,0.22)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,fontWeight:900,color:"#f5a524"}}>{placedLevel}</div>
        <div style={{fontSize:16,lineHeight:1.7,color:"rgba(74,40,0,0.72)"}}>{placedLevel === "A1" ? "You can begin A1 immediately on the free plan." : `You can preview ${FREE_PLAN_RULES.previewLessonsForPlacedUsers} lessons in ${placedLevel} on the free plan. Full progression in ${placedLevel} and above is part of Pro.`}</div>
      </div>
      <div style={{padding:18,borderRadius:18,background:"rgba(255,255,255,0.62)",border:"1.5px solid rgba(245,165,36,0.16)",marginBottom:16}}>
        <div style={{fontSize:12,color:"rgba(74,40,0,0.55)",marginBottom:4}}>Placement score</div>
        <div style={{fontSize:30,fontWeight:900}}>{correctAnswers}/{PLACEMENT_QUESTIONS.length}</div>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:18}}>
        {LEVEL_ORDER.map(level => (
          <div key={level} style={{padding:"8px 14px",borderRadius:999,background:level===placedLevel?"#f5a524":"rgba(245,165,36,0.08)",color:level===placedLevel?"#fff":"#8a5b10",fontWeight:800,fontSize:13}}>{level}</div>
        ))}
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={() => setStep("welcome")} style={{padding:"12px 18px",borderRadius:999,border:"1.5px solid rgba(245,165,36,0.18)",background:"transparent",cursor:"pointer",color:"#4a2800",fontWeight:700}}>← Back</button>
        <button onClick={() => onFinish({ isBeginner:false, placedLevel, freeAccessLevel: placedLevel === "A1" ? "A1" : placedLevel, previewLessonsAllowed: placedLevel === "A1" ? 0 : FREE_PLAN_RULES.previewLessonsForPlacedUsers, placementScore: correctAnswers, langCode: selectedLang, selectedLanguage: langName })} style={{padding:"13px 24px",borderRadius:999,border:"none",background:"#f5a524",color:"#fff",fontWeight:800,cursor:"pointer"}}>Continue →</button>
      </div>
    </div>
  );
}
