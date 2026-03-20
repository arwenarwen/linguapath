import React, { useState } from "react";
import { SITUATIONS as FULL_SITUATIONS } from "../lib/constants";

// -- Fixed warm daytime theme
function getTheme() {
  return {bg:"linear-gradient(180deg,#fff7ea,#ffe7c2)",panel:"rgba(255,255,255,0.72)",path:"#f5a524",glow:"rgba(255,170,56,0.35)",text:"#6b3d10",muted:"rgba(107,61,16,0.6)",border:"rgba(245,165,36,0.25)",card:"rgba(255,255,255,0.55)",cardBorder:"rgba(245,165,36,0.22)",chip:"rgba(245,165,36,0.12)"};
}

const SITUATIONS = [
  { id:"airport",        icon:"✈️", title:"Airport",         color:"#8b5cf6", cat:"travel",   desc:"Check-in, boarding, lost luggage",              aiRole:"airline staff",  difficulty:"A2" },
  { id:"hotel",          icon:"🏨", title:"Hotel",           color:"#06b6d4", cat:"travel",   desc:"Check in, request amenities, solve problems",   aiRole:"receptionist",   difficulty:"A2" },
  { id:"travel",         icon:"🗺️", title:"Sightseeing",     color:"#0891b2", cat:"travel",   desc:"Tourist info, attractions, local tips",         aiRole:"tour guide",     difficulty:"A1" },
  { id:"directions",     icon:"🧭", title:"Directions",      color:"#059669", cat:"travel",   desc:"Ask locals how to get around town",             aiRole:"local",          difficulty:"A1" },
  { id:"taxi",           icon:"🚕", title:"Taxi",            color:"#fbbf24", cat:"travel",   desc:"Get around, directions, negotiate price",       aiRole:"driver",         difficulty:"A1" },
  { id:"restaurant",     icon:"🍽️", title:"Restaurant",      color:"#f97316", cat:"food",     desc:"Order food, ask for bill, dietary needs",       aiRole:"waiter",         difficulty:"A1" },
  { id:"cafe",           icon:"☕", title:"Café",            color:"#a16207", cat:"food",     desc:"Order coffee, pastries, make small talk",       aiRole:"barista",        difficulty:"A1" },
  { id:"supermarket",    icon:"🏪", title:"Supermarket",     color:"#84cc16", cat:"food",     desc:"Find products, checkout, ask for help",         aiRole:"store employee", difficulty:"A1" },
  { id:"making-friends", icon:"🤝", title:"Meeting People",  color:"#f472b6", cat:"social",   desc:"Introductions, small talk, making friends",     aiRole:"new friend",     difficulty:"A1" },
  { id:"weather",        icon:"☀️", title:"Small Talk",      color:"#eab308", cat:"social",   desc:"Weather, casual conversation, daily life",      aiRole:"local",          difficulty:"A1" },
  { id:"first-date",     icon:"❤️", title:"First Date",      color:"#e11d48", cat:"social",   desc:"Romantic conversation, getting to know someone",aiRole:"date",           difficulty:"B1" },
  { id:"shopping",       icon:"🛒", title:"Shopping",        color:"#22c55e", cat:"services", desc:"Buy clothes, sizes, returns, negotiate",        aiRole:"shop assistant", difficulty:"A2" },
  { id:"bank",           icon:"🏦", title:"Bank",            color:"#6366f1", cat:"services", desc:"Open accounts, transfers, card problems",       aiRole:"bank teller",    difficulty:"B1" },
  { id:"phone-call",     icon:"📞", title:"Phone Call",      color:"#64748b", cat:"services", desc:"Make appointments, formal calls",               aiRole:"receptionist",   difficulty:"A2" },
  { id:"office",         icon:"🏢", title:"Office",          color:"#475569", cat:"services", desc:"Meetings, colleagues, workplace talk",          aiRole:"colleague",      difficulty:"B1" },
  { id:"university",     icon:"🎓", title:"University",      color:"#4f46e5", cat:"services", desc:"Academic life, professors, exams",              aiRole:"professor",      difficulty:"B2" },
  { id:"job-interview",  icon:"💼", title:"Job Interview",   color:"#0ea5e9", cat:"services", desc:"Professional interview, formal language",       aiRole:"HR manager",     difficulty:"B2" },
  { id:"doctor",         icon:"🩺", title:"Doctor",          color:"#ef4444", cat:"health",   desc:"Describe symptoms, get medical advice",         aiRole:"doctor",         difficulty:"A2" },
  { id:"pharmacy",       icon:"💊", title:"Pharmacy",        color:"#10b981", cat:"health",   desc:"Buy medicine, ask about dosage",                aiRole:"pharmacist",     difficulty:"A2" },
  { id:"emergency",      icon:"🚨", title:"Emergency",       color:"#b91c1c", cat:"health",   desc:"Emergency phrases, calling for help",           aiRole:"operator",       difficulty:"A1" },
];

const CATEGORIES = [
  { id:"all",      label:"All",        icon:"🗺️" },
  { id:"travel",   label:"Travel",     icon:"✈️" },
  { id:"food",     label:"Food",       icon:"🍽️" },
  { id:"social",   label:"Social",     icon:"🤝" },
  { id:"services", label:"Daily Life", icon:"🏪" },
  { id:"health",   label:"Health",     icon:"🩺" },
];

const CAT_HEADERS = {
  travel:   { label:"Travel & Getting Around",  icon:"✈️",  desc:"Navigate airports, hotels, and new cities" },
  food:     { label:"Food & Drink",              icon:"🍽️", desc:"Order meals, visit cafés, find your favourites" },
  social:   { label:"Social Situations",         icon:"🤝", desc:"Meet locals, chat, and make connections" },
  services: { label:"Daily Life & Services",     icon:"🏪", desc:"Shopping, banking, work, and university" },
  health:   { label:"Health & Emergencies",      icon:"🩺", desc:"Stay safe and get the help you need" },
};

const DIFF_COLORS = { A1:"#22c55e", A2:"#38bdf8", B1:"#a78bfa", B2:"#f97316" };

export default function SituationsHub({ langCode, onSelectSituation }) {
  const C = getTheme();
  const [activeFilter, setActiveFilter] = useState("all");
  const [hovered, setHovered] = useState(null);

  const groups = activeFilter === "all"
    ? Object.keys(CAT_HEADERS).map(cat => ({ cat, ...CAT_HEADERS[cat], items: SITUATIONS.filter(s => s.cat === cat) }))
    : [{ cat: activeFilter, ...CAT_HEADERS[activeFilter], items: SITUATIONS.filter(s => s.cat === activeFilter) }];

  function openSituation(s, mode) {
    const fullSit = FULL_SITUATIONS.find(fs => fs.id === s.id);
    onSelectSituation({ ...s, ...(fullSit||{}), quickPhrases: fullSit?.quickPhrases||[], startMode: mode });
  }

  const isDark = false;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"var(--font-body)", paddingBottom:90, color:C.text }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes lanternPulse{0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
        .sit-card{transition:transform 0.2s ease,box-shadow 0.2s ease,border-color 0.2s ease,background 0.2s ease;}
        .sit-card:hover{transform:translateY(-3px);}
        .sit-card:active{transform:translateY(-1px) scale(0.985);}
        .filter-chip{transition:all 0.15s ease;cursor:pointer;border:none;user-select:none;}
        .mode-btn{transition:all 0.15s ease;border:none;cursor:pointer;}
        .mode-btn:hover{filter:brightness(1.2);}
        .mode-btn:active{transform:scale(0.94);}
      `}</style>

      {/* ── Header ── */}
      <div style={{ padding:"22px 18px 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-40,left:"50%",transform:"translateX(-50%)",width:280,height:180,background:`radial-gradient(circle,${C.path}18,transparent 70%)`,pointerEvents:"none" }}/>
        <div style={{ position:"relative", animation:"fadeUp 0.45s ease both" }}>
          {/* Eyebrow */}
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
            <div style={{ width:18,height:2,borderRadius:99,background:`${C.path}66` }}/>
            <span style={{ fontSize:10,fontWeight:800,letterSpacing:2.5,textTransform:"uppercase",color:`${C.path}` }}>Side Quests</span>
            <div style={{ flex:1,height:1,background:`linear-gradient(90deg,${C.path}30,transparent)` }}/>
          </div>
          {/* Title */}
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
            <div style={{ fontSize:26,animation:"lanternPulse 3s ease-in-out infinite" }}>🏮</div>
            <div>
              <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:21,fontWeight:900,color:C.text,lineHeight:1.1,margin:0 }}>Practice Stops</h1>
              <p style={{ fontSize:12,color:C.muted,margin:"3px 0 0",fontWeight:400 }}>Real-world scenarios. Jump in any time.</p>
            </div>
          </div>
          {/* Fox helper */}
          <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:10,padding:"8px 12px",background:`${C.path}12`,border:`1px solid ${C.path}28`,borderRadius:12 }}>
            <span style={{ fontSize:16 }}>🦊</span>
            <span style={{ fontSize:12,color:C.muted,fontStyle:"italic" }}>Pick a stop and choose your guide.</span>
          </div>
        </div>
        <div style={{ margin:"14px 0 0",height:1,background:`linear-gradient(90deg,transparent,${C.path}25,transparent)` }}/>
      </div>

      {/* ── Filter chips ── */}
      <div style={{ padding:"12px 18px 0",display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none" }}>
        {CATEGORIES.map(c => {
          const active = activeFilter === c.id;
          return (
            <button key={c.id} className="filter-chip" onClick={() => setActiveFilter(c.id)}
              style={{ display:"flex",alignItems:"center",gap:5,padding:"6px 13px",borderRadius:99,fontWeight:700,fontSize:12,whiteSpace:"nowrap",
                background: active ? `${C.path}22` : `${C.chip}`,
                color: active ? C.path : C.muted,
                boxShadow: active ? `0 0 0 1.5px ${C.path}55` : `0 0 0 1px ${C.border}`,
                fontFamily:"var(--font-body)" }}>
              <span style={{ fontSize:13 }}>{c.icon}</span>{c.label}
            </button>
          );
        })}
      </div>

      {/* ── Groups ── */}
      <div style={{ padding:"18px 18px 0" }}>
        {groups.map((group, gi) => (
          <div key={group.cat} style={{ marginBottom:24,animation:`fadeUp 0.4s ${gi*0.06}s ease both` }}>
            {activeFilter === "all" && (
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                <span style={{ fontSize:16 }}>{group.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif",opacity:0.9 }}>{group.label}</div>
                  <div style={{ fontSize:10,color:C.muted,marginTop:1 }}>{group.desc}</div>
                </div>
                <div style={{ height:1,width:36,background:`linear-gradient(90deg,${C.border},transparent)` }}/>
              </div>
            )}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:9 }}>
              {group.items.map((s, i) => {
                const isHov = hovered === s.id;
                return (
                  <div key={s.id} className="sit-card"
                    onMouseEnter={() => setHovered(s.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => openSituation(s,"pick")}
                    style={{
                      borderRadius:18,padding:"13px 12px 11px",cursor:"pointer",position:"relative",overflow:"hidden",
                      background: isHov ? `linear-gradient(135deg,${s.color}18,${s.color}0a)` : C.card,
                      border:`1px solid ${isHov ? s.color+"44" : C.cardBorder}`,
                      boxShadow: isHov ? `0 8px 24px rgba(0,0,0,0.2),0 0 0 1px ${s.color}22` : `0 2px 8px rgba(0,0,0,0.1),inset 0 1px 0 rgba(255,255,255,0.06)`,
                      animation:`fadeUp 0.35s ${i*0.04}s ease both`,
                    }}>
                    {/* Corner glow */}
                    <div style={{ position:"absolute",top:-16,right:-16,width:56,height:56,borderRadius:"50%",background:`radial-gradient(circle,${s.color}20,transparent 70%)`,pointerEvents:"none" }}/>
                    {/* Icon badge */}
                    <div style={{ width:36,height:36,borderRadius:11,background:`${s.color}18`,border:`1px solid ${s.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:9,position:"relative" }}>{s.icon}</div>
                    {/* Title */}
                    <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12.5,color:C.text,lineHeight:1.2,marginBottom:4 }}>{s.title}</div>
                    {/* Desc */}
                    <div style={{ fontSize:10,color:C.muted,lineHeight:1.45,marginBottom:9,minHeight:28 }}>{s.desc}</div>
                    {/* Footer */}
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:3 }}>
                      <span style={{ fontSize:9,fontWeight:800,color:DIFF_COLORS[s.difficulty]||C.muted,background:`${DIFF_COLORS[s.difficulty]||"#888"}14`,border:`1px solid ${DIFF_COLORS[s.difficulty]||"#888"}28`,borderRadius:99,padding:"2px 7px",letterSpacing:0.3 }}>
                        {s.difficulty}
                      </span>
                      <div style={{ display:"flex",gap:3 }} onClick={e => e.stopPropagation()}>
                        <button className="mode-btn" onClick={e=>{e.stopPropagation();openSituation(s,"quick");}}
                          style={{ fontSize:9,fontWeight:800,padding:"3px 7px",borderRadius:99,background:`${s.color}18`,color:s.color,boxShadow:`0 0 0 1px ${s.color}35`,fontFamily:"var(--font-body)" }}>⚡</button>
                        <button className="mode-btn" onClick={e=>{e.stopPropagation();openSituation(s,"ai");}}
                          style={{ fontSize:9,fontWeight:800,padding:"3px 7px",borderRadius:99,background:`${C.path}15`,color:C.path,boxShadow:`0 0 0 1px ${C.path}35`,fontFamily:"var(--font-body)" }}>🦊</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
