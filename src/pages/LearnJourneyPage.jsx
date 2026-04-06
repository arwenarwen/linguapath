import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getStreak, FREE_LESSONS_PER_DAY, getDailyUsage, getCheckpointPass, setCheckpointPass, getPlacementState, getXPLevel, DAILY_LESSON_GOAL, spendTrailPoints, CHECKPOINT_TP_REQUIRED } from "../lib/appState";

const CEFR = ["A1","A2","B1","B2","C1","C2"];

// ── Layout constants ──────────────────────────────────────────────────────────
const CW=150, CH=72, LX=14, RX=222, GAP=132, T0=52, VW=390, STOP=10;

// ── Unit animals: unique character per unit slot ─────────────────────────────
const UNIT_ANIMALS = {
  // A1 - The Forest (9 units): small woodland creatures
  A1:["🐇","🐿️","🦌","🐸","🦉","🦔","🐦","🦋","🐾"],
  // A2 - The Hills (7 units): hill & meadow animals
  A2:["🐐","🐑","🦊","🦡","🐇","🦅","🐾"],
  // B1 - The Mountains (6 units): mountain animals
  B1:["🐺","🦅","🦌","🐻","🐦","🐾"],
  // B2 - The Snow (7 units): cold-weather animals
  B2:["🐆","🦅","🐺","🦉","🦌","🐻❄️","🐾"],
  // C1 - High Peaks (6 units): rare, majestic
  C1:["🦁","🦅","🐆","🦊","🦌","🐾"],
  // C2 - The Summit (6 units): the fox and companions
  C2:["🦊","🦁","🦅","🐺","🦌","🌟"],
};

// Full character data for each animal
const ANIMALS = {
  "🐇":{ name:"Mira",    species:"Rabbit",      greeting:"Hi! I'm Mira the Rabbit.",        line:"Hop by hop, you're making it!",           color:"#e8b4b8", bg:"linear-gradient(135deg,#fff0f3,#ffe4e8)" },
  "🐿️":{ name:"Pip",     species:"Squirrel",    greeting:"Hey! I'm Pip the Squirrel.",       line:"You've been storing up knowledge!",        color:"#c47c3a", bg:"linear-gradient(135deg,#fff4e8,#ffe8cc)" },
  "🦌":{ name:"Oak",     species:"Deer",        greeting:"Hello. I'm Oak the Deer.",         line:"Walk steady, and you'll get there.",       color:"#8b6914", bg:"linear-gradient(135deg,#fffbe8,#fff3cc)" },
  "🐸":{ name:"Finn",    species:"Frog",        greeting:"Ribbit! I'm Finn the Frog.",       line:"Every leap forward counts!",              color:"#4a8c3f", bg:"linear-gradient(135deg,#eefbee,#d8f5d8)" },
  "🦉":{ name:"Sage",    species:"Owl",         greeting:"Hoo there. I'm Sage the Owl.",     line:"Wisdom grows with every lesson.",         color:"#7a5c2e", bg:"linear-gradient(135deg,#fdf4e7,#f5e8cc)" },
  "🦔":{ name:"Briar",   species:"Hedgehog",    greeting:"Hi! I'm Briar the Hedgehog.",      line:"Every prickly challenge makes you tougher.", color:"#8b7355", bg:"linear-gradient(135deg,#f9f4ec,#f0e8d4)" },
  "🐦":{ name:"Lark",    species:"Bird",        greeting:"Tweet! I'm Lark.",                 line:"Your voice is getting stronger!",         color:"#2d7dd2", bg:"linear-gradient(135deg,#eef4ff,#d8eaff)" },
  "🦋":{ name:"Flutter", species:"Butterfly",   greeting:"Hello! I'm Flutter.",              line:"You've transformed so much!",             color:"#9b59b6", bg:"linear-gradient(135deg,#f4eeff,#e8d8ff)" },
  "🐐":{ name:"Cliff",   species:"Goat",        greeting:"Hey! I'm Cliff the Goat.",         line:"Keep climbing those hills!",              color:"#7a7a4a", bg:"linear-gradient(135deg,#f8f8ec,#eeeedd)" },
  "🐑":{ name:"Wool",    species:"Sheep",       greeting:"Baa! I'm Wool the Sheep.",         line:"Fluffy steps, steady progress.",          color:"#aaaaaa", bg:"linear-gradient(135deg,#f8f8f8,#eeeeee)" },
  "🦡":{ name:"Burrow",  species:"Badger",      greeting:"Hello. I'm Burrow the Badger.",    line:"Persistence digs the deepest paths.",     color:"#555555", bg:"linear-gradient(135deg,#f4f4f4,#e8e8e8)" },
  "🐺":{ name:"Grey",    species:"Wolf",        greeting:"I'm Grey. The mountain knows me.", line:"The mountain doesn't scare you.",         color:"#666688", bg:"linear-gradient(135deg,#eeeef8,#ddddf0)" },
  "🦅":{ name:"Arro",    species:"Eagle",       greeting:"I am Arro. Welcome.",              line:"See how high you've flown.",              color:"#c47c28", bg:"linear-gradient(135deg,#fff4e0,#ffe8c0)" },
  "🐻":{ name:"Dusk",    species:"Bear",        greeting:"Grr. I'm Dusk the Bear.",          line:"Strength comes from pushing through.",    color:"#7a4a28", bg:"linear-gradient(135deg,#f8f0e8,#f0e0cc)" },
  "🐆":{ name:"Shade",   species:"Leopard",     greeting:"I'm Shade. You've come far.",      line:"Few make it here. You did.",              color:"#c4a028", bg:"linear-gradient(135deg,#fffce8,#fff0c0)" },
  "🐻❄️":{ name:"Frost", species:"Polar Bear",  greeting:"Hello. I'm Frost.",               line:"Cold doesn't stop those who persist.",    color:"#88aabb", bg:"linear-gradient(135deg,#eef4f8,#ddeef8)" },
  "🦁":{ name:"Rex",     species:"Lion",        greeting:"I am Rex. You're almost there.",   line:"The summit is within reach.",             color:"#c49a28", bg:"linear-gradient(135deg,#fffae8,#fff0c0)" },
  "🦊":{ name:"Fox",     species:"Fox",         greeting:"It's me. We made it together.",    line:"You've come so far. I'm proud of you.",  color:"#e8730a", bg:"linear-gradient(135deg,#fff4ee,#ffe8d8)" },
  "🌟":{ name:"Summit",  species:"Star",        greeting:"You reached the summit!",          line:"This is what you worked for.",            color:"#f5c842", bg:"linear-gradient(135deg,#fffde8,#fff8c0)" },
  "🐾":{ name:"Guide",   species:"Spirit",      greeting:"A trail spirit watches over you.", line:"Your journey continues.",                 color:"#aa88cc", bg:"linear-gradient(135deg,#f4eeff,#e8d8ff)" },
};

// Backwards compat helpers
const ANIMAL_NAMES = Object.fromEntries(Object.entries(ANIMALS).map(([k,v])=>[k,v.name]));
const ANIMAL_LINES = Object.fromEntries(Object.entries(ANIMALS).map(([k,v])=>[k,v.line]));

function groupUnits(mods) {
  mods = mods||[];
  const map = new Map();
  for (const m of mods) { const k=m.unit||"Unit 1"; if(!map.has(k))map.set(k,[]); map.get(k).push(m); }
  return Array.from(map.entries()).map(([unit,lessons])=>({unit,lessons}));
}

function findNextLesson(curriculum, completed, justCompletedId) {
  completed=completed||[];
  const all=CEFR.flatMap(k=>curriculum[k]?.modules||[]);
  const done=new Set([...completed,...(justCompletedId?[justCompletedId]:[])]); 
  const ai=justCompletedId?all.findIndex(m=>m.id===justCompletedId):-1;
  for(let i=ai+1;i<all.length;i++) if(!done.has(all[i].id)) return all[i];
  for(let i=0;i<all.length;i++) if(!done.has(all[i].id)) return all[i];
  return null;
}

function getTheme() {
  // Fixed warm daytime theme
  return {bg:"linear-gradient(180deg,#fff7ea,#ffe7c2)",panel:"rgba(255,255,255,0.72)",path:"#f5a524",glow:"rgba(255,170,56,0.35)",text:"#6b3d10",muted:"rgba(107,61,16,0.6)",border:"rgba(245,165,36,0.25)",mist:"rgba(255,243,220,0.93)"};
}

function lessonState(lessons,idx,completed) {
  const done=new Set(completed);
  if(done.has(lessons[idx].id)) return "done";
  if(idx===0) return "current";
  return done.has(lessons[idx-1].id)?"current":"locked";
}

function isLevelLocked(curriculum,completed,lk,placedLevel) {
  // If user was placed at or above this level, it's always unlocked
  if (placedLevel) {
    const placedIdx = CEFR.indexOf(placedLevel.toUpperCase());
    const thisIdx = CEFR.indexOf(lk);
    if (thisIdx <= placedIdx) return false;
  }
  const idx=CEFR.indexOf(lk);
  if(idx<=0) return false;
  const prev=curriculum[CEFR[idx-1]]?.modules||[];
  return prev.length>0&&prev.filter(m=>completed.includes(m.id)).length<Math.max(1,Math.floor(prev.length*0.8));
}

// ── Connector geometry ────────────────────────────────────────────────────────
// LEFT  card: exits RIGHT SIDE center  → enters TOP center of RIGHT card
// RIGHT card: exits LEFT  SIDE center  → enters TOP center of LEFT  card
// STOP=10px gap ensures lines never touch the card border
function buildConnector(from, to) {
  let p0,p1,p2,p3;
  // LEFT card -> RIGHT card:
  //   p0 = center of RIGHT SIDE of left card  (exits horizontally right)
  //   p3 = center of TOP    of right card     (enters vertically from above)
  //   p1 pulls 68px right  (horizontal departure)
  //   p2 pulls 47px up     (vertical approach)
  // RIGHT card -> LEFT card: exact mirror
  if (from.side==="left") {
    p0={x:LX+CW+STOP,   y:from.y+CH*0.5};
    p3={x:RX+CW*0.5,    y:to.y-STOP};
    p1={x:p0.x+68,      y:p0.y};
    p2={x:p3.x,         y:p3.y-47};
  } else {
    p0={x:RX-STOP,      y:from.y+CH*0.5};
    p3={x:LX+CW*0.5,   y:to.y-STOP};
    p1={x:p0.x-68,      y:p0.y};
    p2={x:p3.x,         y:p3.y-47};
  }
  return {p0,p1,p2,p3,d:`M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`};
}

function bezierPt(p0,p1,p2,p3,t) {
  const mt=1-t;
  return {x:mt**3*p0.x+3*mt**2*t*p1.x+3*mt*t**2*p2.x+t**3*p3.x, y:mt**3*p0.y+3*mt**2*t*p1.y+3*mt*t**2*p2.y+t**3*p3.y};
}

function buildConnectors(positions,cpPos) {
  const all=[...positions,cpPos];
  return all.slice(0,-1).map((pos,i)=>buildConnector(pos,all[i+1]));
}

// Sample N evenly-spaced points along bezier for fox walk
function samplePath(c,n) {
  return Array.from({length:n},(_,i)=>bezierPt(c.p0,c.p1,c.p2,c.p3,i/(n-1)));
}

function FreeLimitBanner({used,max,onUpgrade,C}) {
  if(!used) return null;
  return (
    <div style={{margin:"10px 14px 0",padding:"10px 12px",borderRadius:14,background:C.panel,border:`1px solid ${C.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:11}}>
        <span style={{color:C.muted}}>{used}/{max} free lessons today</span>
        {used>=max?<button onClick={onUpgrade} style={{border:"none",background:"transparent",color:C.path,fontWeight:800,cursor:"pointer"}}>Unlock more</button>:<span style={{color:C.muted}}>{max-used} left</span>}
      </div>
      <div style={{height:5,borderRadius:99,background:"rgba(255,255,255,0.15)",overflow:"hidden"}}>
        <div style={{width:`${Math.round(used/max*100)}%`,height:"100%",background:C.path}}/>
      </div>
    </div>
  );
}

// ── CheckpointCard: the cabin at end of each unit with a unit animal ──────────
function CheckpointCard({cpPos,completedCt,totalLessons,unitAnimal,onOpen,allDone,trailPoints=0,trailRequired=100, cpPassed=false}) {
  const name = ANIMAL_NAMES[unitAnimal]||"Friend";
  const hasEnoughTP = trailPoints >= trailRequired;
  // Can open checkpoint if all lessons done AND enough Trail XP
  const canOpen = allDone && (hasEnoughTP || cpPassed);
  const tpPct = Math.min(100, Math.round((trailPoints / trailRequired) * 100));
  const lessonsLeft = totalLessons - completedCt;

  return (
    <div
      onClick={canOpen ? onOpen : undefined}
      style={{
        position:"absolute",left:cpPos.x,top:cpPos.y,width:CW,
        textAlign:"center",padding:"12px 10px 14px",borderRadius:18,
        background:canOpen?"rgba(255,248,232,0.99)":allDone?"rgba(255,248,240,0.97)":"rgba(255,248,240,0.92)",
        border:`1.5px solid ${canOpen?"rgba(245,165,36,0.5)":allDone?"rgba(245,165,36,0.38)":"rgba(245,165,36,0.22)"}`,
        boxShadow:canOpen?"0 8px 28px rgba(255,166,57,0.18)":"0 4px 14px rgba(255,166,57,0.08)",
        zIndex:2,cursor:canOpen?"pointer":"default",
        transition:"all 0.3s",
      }}
    >
      <div style={{fontSize:28,marginBottom:2,filter:canOpen?"none":"grayscale(0.5) opacity(0.65)"}}>{unitAnimal}</div>
      <div style={{fontSize:11,fontWeight:800,color:"#6b3d10",marginBottom:2}}>{name}</div>

      {!allDone ? (
        /* Lessons still remaining */
        <div style={{fontSize:10,color:"rgba(107,61,16,0.65)"}}>
          {lessonsLeft} lesson{lessonsLeft!==1?"s":""} away
        </div>
      ) : canOpen ? (
        /* All done + enough TP → ready */
        <div style={{fontSize:10,color:"rgba(107,61,16,0.65)"}}>Tap to talk →</div>
      ) : (
        /* All lessons done but not enough Trail XP */
        <>
          {/* TP progress bar */}
          <div style={{margin:"5px 0 3px",height:5,borderRadius:99,background:"rgba(107,61,16,0.12)",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${tpPct}%`,borderRadius:99,background:"linear-gradient(90deg,#f5a524,#e8730a)",transition:"width 0.4s"}} />
          </div>
          <div style={{fontSize:9,fontWeight:800,color:"#e8730a",lineHeight:1.3}}>
            ⚡ {trailPoints}/{trailRequired} Trail XP
          </div>
          <div style={{fontSize:9,color:"rgba(107,61,16,0.55)",marginTop:2,lineHeight:1.3}}>
            Review lessons to earn more
          </div>
        </>
      )}

      {canOpen&&(
        <div style={{position:"absolute",top:-8,right:-6,background:"#f97316",color:"#fff",fontSize:9,fontWeight:900,padding:"2px 7px",borderRadius:20,letterSpacing:0.5}}>READY</div>
      )}
      {allDone && !canOpen && (
        <div style={{position:"absolute",top:-8,right:-6,background:"rgba(107,61,16,0.55)",color:"#fff",fontSize:9,fontWeight:900,padding:"2px 7px",borderRadius:20,letterSpacing:0.5}}>🔒 TP</div>
      )}
    </div>
  );
}

// ── Animal SVG illustrations ──────────────────────────────────────────────────
// Each animal is a unique hand-crafted 2D SVG character
function AnimalSVG({ animalKey, size = 200, animate = true }) {
  const anim = animate ? "animalIdle 3s ease-in-out infinite" : "none";
  const style = { width: size, height: size, display: "block", animation: anim };

  const svgs = {
    "🐇": ( // Mira the Rabbit - white with pink ears
      <svg viewBox="0 0 120 140" style={style}>
        {/* Ears */}
        <ellipse cx="38" cy="28" rx="12" ry="32" fill="#f0f0f0" stroke="#ccc" strokeWidth="1.5"/>
        <ellipse cx="82" cy="28" rx="12" ry="32" fill="#f0f0f0" stroke="#ccc" strokeWidth="1.5"/>
        <ellipse cx="38" cy="28" rx="7" ry="24" fill="#ffb3c6"/>
        <ellipse cx="82" cy="28" rx="7" ry="24" fill="#ffb3c6"/>
        {/* Body */}
        <ellipse cx="60" cy="105" rx="36" ry="32" fill="#f5f5f5" stroke="#ddd" strokeWidth="1.5"/>
        {/* Head */}
        <circle cx="60" cy="68" r="30" fill="#f5f5f5" stroke="#ddd" strokeWidth="1.5"/>
        {/* Eyes */}
        <circle cx="47" cy="63" r="8" fill="#1a1a1a"/><circle cx="49" cy="61" r="2.5" fill="white"/>
        <circle cx="73" cy="63" r="8" fill="#1a1a1a"/><circle cx="75" cy="61" r="2.5" fill="white"/>
        {/* Cheeks */}
        <ellipse cx="40" cy="72" rx="8" ry="5" fill="#ffb3c6" opacity="0.5"/>
        <ellipse cx="80" cy="72" rx="8" ry="5" fill="#ffb3c6" opacity="0.5"/>
        {/* Nose */}
        <ellipse cx="60" cy="74" rx="4" ry="3" fill="#ffb3c6"/>
        {/* Mouth */}
        <path d="M56 77 Q60 81 64 77" stroke="#d48" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Whiskers */}
        <line x1="28" y1="72" x2="52" y2="74" stroke="#bbb" strokeWidth="1"/><line x1="28" y1="76" x2="52" y2="76" stroke="#bbb" strokeWidth="1"/>
        <line x1="68" y1="74" x2="92" y2="72" stroke="#bbb" strokeWidth="1"/><line x1="68" y1="76" x2="92" y2="76" stroke="#bbb" strokeWidth="1"/>
        {/* Paws */}
        <ellipse cx="38" cy="130" rx="14" ry="10" fill="#f0f0f0" stroke="#ddd" strokeWidth="1.5"/>
        <ellipse cx="82" cy="130" rx="14" ry="10" fill="#f0f0f0" stroke="#ddd" strokeWidth="1.5"/>
        <ellipse cx="34" cy="132" rx="4" ry="3" fill="#ffb3c6"/><ellipse cx="42" cy="134" rx="4" ry="3" fill="#ffb3c6"/><ellipse cx="38" cy="136" rx="4" ry="3" fill="#ffb3c6"/>
        <ellipse cx="78" cy="132" rx="4" ry="3" fill="#ffb3c6"/><ellipse cx="86" cy="134" rx="4" ry="3" fill="#ffb3c6"/><ellipse cx="82" cy="136" rx="4" ry="3" fill="#ffb3c6"/>
      </svg>
    ),
    "🐿️": ( // Pip the Squirrel - brown with big bushy tail
      <svg viewBox="0 0 120 140" style={style}>
        {/* Tail */}
        <ellipse cx="88" cy="95" rx="28" ry="42" fill="#c47c3a" opacity="0.9"/>
        <ellipse cx="88" cy="95" rx="18" ry="32" fill="#e8a05a"/>
        {/* Body */}
        <ellipse cx="52" cy="100" rx="28" ry="30" fill="#c47c3a"/>
        {/* Head */}
        <circle cx="52" cy="65" r="26" fill="#c47c3a"/>
        {/* Ears */}
        <ellipse cx="35" cy="44" rx="9" ry="12" fill="#c47c3a"/>
        <ellipse cx="69" cy="44" rx="9" ry="12" fill="#c47c3a"/>
        <ellipse cx="35" cy="44" rx="5" ry="7" fill="#e8a05a"/>
        <ellipse cx="69" cy="44" rx="5" ry="7" fill="#e8a05a"/>
        {/* Face */}
        <ellipse cx="52" cy="72" rx="16" ry="12" fill="#e8c49a"/>
        {/* Eyes */}
        <circle cx="43" cy="60" r="6" fill="#1a1a1a"/><circle cx="45" cy="58" r="2" fill="white"/>
        <circle cx="61" cy="60" r="6" fill="#1a1a1a"/><circle cx="63" cy="58" r="2" fill="white"/>
        {/* Nose */}
        <ellipse cx="52" cy="70" rx="3" ry="2" fill="#7a3a1a"/>
        {/* Cheeks */}
        <ellipse cx="37" cy="70" rx="6" ry="4" fill="#e8a05a" opacity="0.6"/>
        <ellipse cx="67" cy="70" rx="6" ry="4" fill="#e8a05a" opacity="0.6"/>
        {/* Arms */}
        <ellipse cx="30" cy="100" rx="8" ry="16" fill="#c47c3a" transform="rotate(20,30,100)"/>
        <ellipse cx="74" cy="100" rx="8" ry="16" fill="#c47c3a" transform="rotate(-20,74,100)"/>
        {/* Legs */}
        <ellipse cx="42" cy="126" rx="10" ry="12" fill="#c47c3a"/>
        <ellipse cx="62" cy="126" rx="10" ry="12" fill="#c47c3a"/>
      </svg>
    ),
    "🦌": ( // Oak the Deer - brown with antlers
      <svg viewBox="0 0 120 150" style={style}>
        {/* Antlers */}
        <path d="M42 28 Q30 18 22 8 M42 28 Q35 14 38 4 M42 28 Q28 22 20 20" stroke="#8b6914" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M78 28 Q90 18 98 8 M78 28 Q85 14 82 4 M78 28 Q92 22 100 20" stroke="#8b6914" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Ears */}
        <ellipse cx="34" cy="42" rx="10" ry="14" fill="#c49a42" transform="rotate(-20,34,42)"/>
        <ellipse cx="86" cy="42" rx="10" ry="14" fill="#c49a42" transform="rotate(20,86,42)"/>
        <ellipse cx="34" cy="42" rx="6" ry="9" fill="#f0c8a0" transform="rotate(-20,34,42)"/>
        <ellipse cx="86" cy="42" rx="6" ry="9" fill="#f0c8a0" transform="rotate(20,86,42)"/>
        {/* Body */}
        <ellipse cx="60" cy="110" rx="30" ry="28" fill="#c49a42"/>
        {/* Head */}
        <ellipse cx="60" cy="68" rx="26" ry="28" fill="#c49a42"/>
        {/* Snout */}
        <ellipse cx="60" cy="82" rx="14" ry="10" fill="#d4b474"/>
        {/* Eyes */}
        <circle cx="46" cy="64" r="7" fill="#2a1a00"/><circle cx="48" cy="62" r="2.5" fill="white"/>
        <circle cx="74" cy="64" r="7" fill="#2a1a00"/><circle cx="76" cy="62" r="2.5" fill="white"/>
        {/* Nose */}
        <ellipse cx="60" cy="80" rx="5" ry="3.5" fill="#7a4a14"/>
        {/* Legs */}
        <rect x="40" y="132" width="10" height="16" rx="5" fill="#a07828"/><rect x="70" y="132" width="10" height="16" rx="5" fill="#a07828"/>
        <rect x="44" y="128" width="10" height="16" rx="5" fill="#a07828"/><rect x="66" y="128" width="10" height="16" rx="5" fill="#a07828"/>
      </svg>
    ),
    "🦉": ( // Sage the Owl - wise brown owl
      <svg viewBox="0 0 120 130" style={style}>
        {/* Body */}
        <ellipse cx="60" cy="95" rx="34" ry="32" fill="#7a5c2e"/>
        {/* Wing pattern */}
        <ellipse cx="32" cy="95" rx="16" ry="24" fill="#6a4c1e" transform="rotate(-10,32,95)"/>
        <ellipse cx="88" cy="95" rx="16" ry="24" fill="#6a4c1e" transform="rotate(10,88,95)"/>
        {/* Head */}
        <circle cx="60" cy="54" r="32" fill="#8b6c3a"/>
        {/* Ear tufts */}
        <path d="M42 30 L38 18 L48 26 Z" fill="#7a5c2e"/>
        <path d="M78 30 L82 18 L72 26 Z" fill="#7a5c2e"/>
        {/* Face disc */}
        <ellipse cx="60" cy="58" rx="24" ry="22" fill="#d4b474" opacity="0.4"/>
        {/* Eyes */}
        <circle cx="46" cy="52" r="12" fill="#e8d080"/><circle cx="46" cy="52" r="8" fill="#2a1800"/><circle cx="49" cy="49" r="3" fill="white"/>
        <circle cx="74" cy="52" r="12" fill="#e8d080"/><circle cx="74" cy="52" r="8" fill="#2a1800"/><circle cx="77" cy="49" r="3" fill="white"/>
        {/* Beak */}
        <path d="M56 66 L64 66 L60 74 Z" fill="#c4841a"/>
        {/* Belly pattern */}
        <ellipse cx="60" cy="100" rx="18" ry="20" fill="#d4b474" opacity="0.5"/>
        {/* Feet */}
        <path d="M44 125 L38 130 M44 125 L44 132 M44 125 L50 130" stroke="#8b6428" strokeWidth="3" strokeLinecap="round"/>
        <path d="M76 125 L70 130 M76 125 L76 132 M76 125 L82 130" stroke="#8b6428" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    "🐐": ( // Cliff the Goat
      <svg viewBox="0 0 120 140" style={style}>
        {/* Horns */}
        <path d="M40 30 Q32 18 36 8" stroke="#8b8060" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M80 30 Q88 18 84 8" stroke="#8b8060" strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Ears */}
        <ellipse cx="30" cy="44" rx="10" ry="8" fill="#c8c098" transform="rotate(-30,30,44)"/>
        <ellipse cx="90" cy="44" rx="10" ry="8" fill="#c8c098" transform="rotate(30,90,44)"/>
        {/* Body */}
        <ellipse cx="60" cy="108" rx="32" ry="26" fill="#d8d4bc"/>
        {/* Head */}
        <ellipse cx="60" cy="66" rx="26" ry="28" fill="#d8d4bc"/>
        {/* Snout */}
        <ellipse cx="60" cy="82" rx="14" ry="10" fill="#c8bca0"/>
        {/* Eyes */}
        <ellipse cx="46" cy="62" rx="7" ry="5" fill="#2a2800"/><circle cx="48" cy="61" r="2" fill="white"/>
        <ellipse cx="74" cy="62" rx="7" ry="5" fill="#2a2800"/><circle cx="76" cy="61" r="2" fill="white"/>
        {/* Nose */}
        <ellipse cx="58" cy="79" rx="3" ry="2" fill="#9a8878"/><ellipse cx="62" cy="79" rx="3" ry="2" fill="#9a8878"/>
        {/* Beard */}
        <ellipse cx="60" cy="96" rx="8" ry="10" fill="#c8c098"/>
        {/* Legs */}
        <rect x="38" y="128" width="9" height="14" rx="4" fill="#b8b49a"/><rect x="52" y="130" width="9" height="12" rx="4" fill="#b8b49a"/>
        <rect x="59" y="130" width="9" height="12" rx="4" fill="#b8b49a"/><rect x="73" y="128" width="9" height="14" rx="4" fill="#b8b49a"/>
      </svg>
    ),
    "🐺": ( // Grey the Wolf
      <svg viewBox="0 0 120 130" style={style}>
        {/* Ears */}
        <path d="M36 36 L26 14 L50 30 Z" fill="#6a6a80"/>
        <path d="M84 36 L94 14 L70 30 Z" fill="#6a6a80"/>
        <path d="M38 34 L30 18 L48 30 Z" fill="#d4d0e8"/>
        <path d="M82 34 L90 18 L72 30 Z" fill="#d4d0e8"/>
        {/* Body */}
        <ellipse cx="60" cy="100" rx="34" ry="26" fill="#8a8a9a"/>
        {/* Head */}
        <ellipse cx="60" cy="62" rx="30" ry="28" fill="#8a8a9a"/>
        {/* Snout */}
        <ellipse cx="60" cy="76" rx="18" ry="12" fill="#c4c0d8"/>
        {/* Eyes */}
        <ellipse cx="46" cy="58" rx="8" ry="7" fill="#d4a820"/><circle cx="46" cy="58" r="5" fill="#2a1a00"/><circle cx="48" cy="56" r="2" fill="white"/>
        <ellipse cx="74" cy="58" rx="8" ry="7" fill="#d4a820"/><circle cx="74" cy="58" r="5" fill="#2a1a00"/><circle cx="76" cy="56" r="2" fill="white"/>
        {/* Nose */}
        <ellipse cx="60" cy="73" rx="5" ry="3.5" fill="#2a2a3a"/>
        {/* Mouth */}
        <path d="M55 77 Q60 82 65 77" stroke="#4a4a5a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Tail */}
        <path d="M90 110 Q110 90 105 70" stroke="#8a8a9a" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M90 110 Q110 90 105 70" stroke="#c4c0d8" strokeWidth="5" fill="none" strokeLinecap="round"/>
        {/* Legs */}
        <rect x="36" y="118" width="11" height="14" rx="5" fill="#7a7a8a"/><rect x="52" y="120" width="11" height="12" rx="5" fill="#7a7a8a"/>
        <rect x="57" y="120" width="11" height="12" rx="5" fill="#7a7a8a"/><rect x="73" y="118" width="11" height="14" rx="5" fill="#7a7a8a"/>
      </svg>
    ),
    "🦅": ( // Arro the Eagle
      <svg viewBox="0 0 120 110" style={style}>
        {/* Wings spread */}
        <path d="M60 60 Q30 40 8 50 Q20 55 30 65 Q45 60 60 60 Z" fill="#5a4010"/>
        <path d="M60 60 Q90 40 112 50 Q100 55 90 65 Q75 60 60 60 Z" fill="#5a4010"/>
        {/* Wing highlights */}
        <path d="M60 60 Q35 45 15 52 Q25 54 35 62 Z" fill="#7a5820" opacity="0.6"/>
        <path d="M60 60 Q85 45 105 52 Q95 54 85 62 Z" fill="#7a5820" opacity="0.6"/>
        {/* Body */}
        <ellipse cx="60" cy="72" rx="20" ry="24" fill="#5a4010"/>
        {/* White head/neck */}
        <ellipse cx="60" cy="44" rx="18" ry="20" fill="#f0ede0"/>
        {/* Eyes */}
        <circle cx="52" cy="40" r="5" fill="#d4a820"/><circle cx="52" cy="40" r="3" fill="#1a1a00"/><circle cx="53" cy="39" r="1.5" fill="white"/>
        <circle cx="68" cy="40" r="5" fill="#d4a820"/><circle cx="68" cy="40" r="3" fill="#1a1a00"/><circle cx="69" cy="39" r="1.5" fill="white"/>
        {/* Beak */}
        <path d="M53 50 L67 50 L60 60 Z" fill="#d4a820"/>
        <path d="M53 50 L67 50 L60 55 Z" fill="#c49010"/>
        {/* Talons */}
        <path d="M50 94 L44 100 M50 94 L50 102 M50 94 L56 100" stroke="#c49010" strokeWidth="3" strokeLinecap="round"/>
        <path d="M70 94 L64 100 M70 94 L70 102 M70 94 L76 100" stroke="#c49010" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    "🦁": ( // Rex the Lion
      <svg viewBox="0 0 130 130" style={style}>
        {/* Mane */}
        <circle cx="65" cy="65" r="48" fill="#c4841a" opacity="0.8"/>
        <circle cx="65" cy="65" r="42" fill="#d49a2a"/>
        {/* Ears */}
        <circle cx="32" cy="32" r="14" fill="#c4841a"/><circle cx="32" cy="32" r="8" fill="#d4a040"/>
        <circle cx="98" cy="32" r="14" fill="#c4841a"/><circle cx="98" cy="32" r="8" fill="#d4a040"/>
        {/* Face */}
        <circle cx="65" cy="65" r="34" fill="#e8b84a"/>
        {/* Snout */}
        <ellipse cx="65" cy="78" rx="18" ry="13" fill="#d4a040"/>
        {/* Eyes */}
        <circle cx="50" cy="60" r="9" fill="#8b6010"/><circle cx="50" cy="60" r="6" fill="#2a1800"/><circle cx="52" cy="58" r="2.5" fill="white"/>
        <circle cx="80" cy="60" r="9" fill="#8b6010"/><circle cx="80" cy="60" r="6" fill="#2a1800"/><circle cx="82" cy="58" r="2.5" fill="white"/>
        {/* Nose */}
        <path d="M60 76 L70 76 L65 80 Z" fill="#8b4010"/>
        {/* Mouth */}
        <path d="M59 81 Q65 86 71 81" stroke="#7a3808" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Whiskers */}
        <line x1="30" y1="76" x2="50" y2="78" stroke="#c49a50" strokeWidth="1.5"/>
        <line x1="30" y1="80" x2="50" y2="80" stroke="#c49a50" strokeWidth="1.5"/>
        <line x1="80" y1="78" x2="100" y2="76" stroke="#c49a50" strokeWidth="1.5"/>
        <line x1="80" y1="80" x2="100" y2="80" stroke="#c49a50" strokeWidth="1.5"/>
      </svg>
    ),
    "🦊": ( // The Fox
      <svg viewBox="0 0 120 130" style={style}>
        {/* Tail */}
        <ellipse cx="92" cy="100" rx="24" ry="36" fill="#e8730a" transform="rotate(15,92,100)"/>
        <ellipse cx="92" cy="100" rx="14" ry="24" fill="#f0a050" transform="rotate(15,92,100)"/>
        <ellipse cx="97" cy="118" rx="10" ry="12" fill="#f5f5f0" transform="rotate(15,97,118)"/>
        {/* Body */}
        <ellipse cx="54" cy="100" rx="28" ry="26" fill="#e8730a"/>
        {/* Head */}
        <ellipse cx="54" cy="65" rx="26" ry="26" fill="#e8730a"/>
        {/* Ear triangles */}
        <path d="M36 45 L28 22 L52 40 Z" fill="#e8730a"/>
        <path d="M72 45 L80 22 L58 40 Z" fill="#e8730a"/>
        <path d="M38 43 L32 26 L50 40 Z" fill="#c84a08"/>
        <path d="M70 43 L76 26 L60 40 Z" fill="#c84a08"/>
        {/* White face markings */}
        <ellipse cx="54" cy="74" rx="18" ry="14" fill="#f5f0e8"/>
        {/* Eyes */}
        <ellipse cx="42" cy="62" rx="7" ry="6" fill="#d4a820"/><circle cx="42" cy="62" r="4" fill="#1a1a00"/><circle cx="44" cy="60" r="1.5" fill="white"/>
        <ellipse cx="66" cy="62" rx="7" ry="6" fill="#d4a820"/><circle cx="66" cy="62" r="4" fill="#1a1a00"/><circle cx="68" cy="60" r="1.5" fill="white"/>
        {/* Nose */}
        <ellipse cx="54" cy="72" rx="4" ry="3" fill="#2a1800"/>
        {/* Cheeks */}
        <ellipse cx="38" cy="72" rx="7" ry="4" fill="#f0a050" opacity="0.5"/>
        <ellipse cx="70" cy="72" rx="7" ry="4" fill="#f0a050" opacity="0.5"/>
        {/* Paws */}
        <ellipse cx="35" cy="120" rx="12" ry="8" fill="#e8730a"/><ellipse cx="73" cy="120" rx="12" ry="8" fill="#e8730a"/>
      </svg>
    ),
  };

  // Fallback: use emoji for animals without custom SVG
  return svgs[animalKey] || (
    <div style={{...style, fontSize: size * 0.7, display:"flex", alignItems:"center", justifyContent:"center",
      animation: animate ? "animalIdle 3s ease-in-out infinite" : "none"}}>
      {animalKey}
    </div>
  );
}

// ── CheckpointScreen ──────────────────────────────────────────────────────────
function CheckpointScreen({animal,unitName,lessons,onClose,userId,langCode,onCheckpointPass}) {
  const data = ANIMALS[animal] || ANIMALS["🐾"];
  const [phase, setPhase] = useState("intro");   // intro | ready | quiz | done
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState(null);     // for MCQ: chosen option string
  const [typed, setTyped] = useState("");         // for fill-blank / type
  const [tiles, setTiles] = useState([]);         // for tile builder: selected tiles
  const [submitted, setSubmitted] = useState(false);
  const [animalText, setAnimalText] = useState("");
  const [textDone, setTextDone] = useState(false);

  // ── Build 10 questions from unit vocab ──────────────────────────────────────
  const questions = useMemo(() => {
    const allVocab = (lessons||[]).flatMap(l => l.vocab || []).filter(v => {
      const keys = Object.keys(v).filter(k => !["en","phonetic","example","word","translation"].includes(k));
      return (keys[0] && v[keys[0]] && v.en) || (v.word && v.translation);
    });

    if (allVocab.length === 0) return [];

    // Helper to extract word/translation from a vocab entry
    const extract = (v) => {
      const keys = Object.keys(v).filter(k => !["en","phonetic","example","word","translation"].includes(k));
      const wordKey = keys[0];
      return { word: wordKey ? v[wordKey] : v.word, en: v.en || v.translation, example: v.example || "" };
    };

    const allTranslations = [...new Set(allVocab.map(v => extract(v).en).filter(Boolean))];
    const allWords = [...new Set(allVocab.map(v => extract(v).word).filter(Boolean))];

    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
    const pool = shuffle(allVocab);
    const getWrongEn = (correct) => shuffle(allTranslations.filter(t => t !== correct)).slice(0,3);
    const getWrongWord = (correct) => shuffle(allWords.filter(w => w !== correct)).slice(0,3);

    const qs = [];
    const types = shuffle(["mcq","mcq","mcq","reverse","context","context","tiles","tiles","tiles","mcq"]).slice(0,10);

    for (let i = 0; i < 10 && pool.length > 0; i++) {
      const v = pool[i % pool.length];
      const { word, en, example } = extract(v);
      if (!word || !en) continue;
      const type = types[i] || "mcq";

      if (type === "mcq") {
        // Show word in target language, pick English meaning
        const wrong = getWrongEn(en);
        const opts = shuffle([...wrong, en]);
        qs.push({ type:"mcq", prompt: word, promptLabel:"What does this mean?", answer: en, opts });

      } else if (type === "reverse") {
        // Show English, pick target language word
        const wrong = getWrongWord(word);
        const opts = shuffle([...wrong, word]);
        qs.push({ type:"mcq", prompt: en, promptLabel:"How do you say this?", answer: word, opts });

      } else if (type === "context") {
        // Context prompt without ugly blanks
        const wrong = getWrongWord(word);
        const opts = shuffle([...wrong, word]);
        qs.push({
          type:"mcq",
          prompt:`You want to say "${en}" naturally in this unit. Which phrase fits best?`,
          promptLabel:"Best response",
          answer: word,
          opts
        });

      } else if (type === "tiles") {
        // Build the target word from shuffled syllable tiles
        // Split word into tiles (roughly by syllable/character groups)
        const rawTiles = word.length <= 6
          ? word.split("")
          : word.split(" ").length > 1
            ? word.split(" ")
            : [word.slice(0, Math.ceil(word.length/2)), word.slice(Math.ceil(word.length/2))];
        const tileList = shuffle(rawTiles);
        qs.push({ type:"tiles", prompt: en, promptLabel:"Build the translation", answer: word, tileList });
      }
    }
    return qs.slice(0, 10);
  }, [lessons]);

  // ── Typewriter for intro/ready ───────────────────────────────────────────────
  const greeting = data.greeting;
  const readyLine = "I have " + questions.length + " questions for your " + unitName + " review. Are you ready?";
  useEffect(() => {
    const target = phase === "intro" ? greeting : readyLine;
    setAnimalText(""); setTextDone(false);
    let i = 0;
    const t = setInterval(() => { i++; setAnimalText(target.slice(0,i)); if(i>=target.length){clearInterval(t);setTextDone(true);} }, 26);
    return () => clearInterval(t);
  }, [phase]);

  // ── Reset answer state when question changes ──────────────────────────────
  useEffect(() => {
    setAnswer(null); setTyped(""); setTiles([]); setSubmitted(false);
  }, [qIdx]);

  function advance(correct) {
    if (correct) setScore(s => s + 1);
    setSubmitted(true);
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) setPhase("done");
      else setQIdx(i => i + 1);
    }, 1200);
  }

  function handleMCQ(opt) {
    if (submitted) return;
    setAnswer(opt);
    advance(opt === q.answer);
  }

  function handleFill() {
    if (submitted || !typed.trim()) return;
    advance(typed.trim().toLowerCase() === q.answer.toLowerCase());
  }

  // FIX 4: Use index-based tile tracking to prevent duplicate-tile bug
  function toggleTile(idx) {
    if (submitted) return;
    setTiles(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  }

  function submitTiles() {
    if (submitted || tiles.length === 0) return;
    const builtArr = tiles.map(i => q.tileList[i]);
    const built = builtArr.join(q.answer.includes(" ") ? " " : "");
    advance(built.toLowerCase() === q.answer.toLowerCase());
  }

  const pct = questions.length ? Math.round((score/questions.length)*100) : 0;
  const q = questions[qIdx];
  const isCorrect = submitted && (
    q?.type === "mcq"   ? answer === q.answer :
    q?.type === "fill"  ? typed.trim().toLowerCase() === q.answer.toLowerCase() :
    q?.type === "tiles" ? tiles.map(i => q.tileList[i]).join(q.answer.includes(" ")?" ":"").toLowerCase() === q.answer.toLowerCase() : false
  );

  return (
    <div style={{position:"fixed",inset:0,zIndex:999,overflow:"auto",background:data.bg,fontFamily:"var(--font-body)"}}>
      <style>{`
        @keyframes animalEntrance{0%{transform:translateY(50px) scale(0.75);opacity:0}65%{transform:translateY(-8px) scale(1.06)}100%{transform:translateY(0) scale(1);opacity:1}}
        @keyframes animalIdle{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-10px) rotate(1deg)}}
        @keyframes speechIn{0%{opacity:0;transform:translateX(-10px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes optPop{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes correctPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}50%{box-shadow:0 0 0 8px rgba(34,197,94,0.2)}}
        @keyframes wrongShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}
        @keyframes starPop{0%{transform:scale(0) rotate(-20deg);opacity:0}65%{transform:scale(1.3) rotate(5deg)}100%{transform:scale(1) rotate(0);opacity:1}}
        @keyframes tilePop{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}
      `}</style>

      <button onClick={onClose} style={{position:"fixed",top:16,right:16,width:36,height:36,borderRadius:"50%",background:"rgba(0,0,0,0.12)",border:"none",fontSize:16,cursor:"pointer",zIndex:1000,color:"#6b3d10",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>

      {/* ── INTRO / READY ── */}
      {(phase==="intro"||phase==="ready")&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",minHeight:"100vh",padding:"32px 24px 40px"}}>
          <div style={{fontSize:11,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:data.color,marginBottom:16,opacity:0.7,marginTop:8}}>{unitName} · Checkpoint</div>

          {/* Animal sits on the side with speech bubble */}
          <div style={{display:"flex",alignItems:"flex-end",gap:16,width:"100%",maxWidth:360,marginBottom:24}}>
            {/* 2D Animal illustration */}
            <div style={{flexShrink:0,animation:"animalEntrance 0.7s cubic-bezier(0.34,1.56,0.64,1) both",filter:`drop-shadow(0 12px 24px ${data.color}44)`}}>
              <AnimalSVG animalKey={animal} size={160} animate={true}/>
            </div>
            {/* Speech bubble pointing left toward animal */}
            <div style={{flex:1,position:"relative",background:"rgba(255,255,255,0.88)",backdropFilter:"blur(8px)",border:`1.5px solid ${data.color}44`,borderRadius:"18px 18px 18px 4px",padding:"14px 16px",fontSize:15,color:"#3d2a0a",lineHeight:1.65,fontWeight:500,boxShadow:"0 6px 24px rgba(0,0,0,0.08)",animation:"speechIn 0.4s 0.4s ease both",minHeight:64}}>
              {animalText}{!textDone&&<span style={{opacity:0.35}}>▊</span>}
            </div>
          </div>

          <div style={{fontSize:13,fontWeight:800,color:data.color,letterSpacing:1.5,textTransform:"uppercase",marginBottom:20,opacity:0.75}}>{data.name} · {data.species}</div>

          {phase==="intro"&&textDone&&(
            <button onClick={()=>setPhase("ready")} style={{background:data.color,color:"#fff",border:"none",borderRadius:14,padding:"14px 36px",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:`0 8px 24px ${data.color}55`,animation:"optPop 0.3s both"}}>
              Hi {data.name}! 👋
            </button>
          )}
          {phase==="ready"&&textDone&&questions.length>0&&(
            <button onClick={()=>setPhase("quiz")} style={{background:data.color,color:"#fff",border:"none",borderRadius:14,padding:"14px 36px",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:`0 8px 24px ${data.color}55`,animation:"optPop 0.3s both"}}>
              I'm ready! Let's go →
            </button>
          )}
          {phase==="ready"&&textDone&&questions.length===0&&(
            <button onClick={onClose} style={{background:data.color,color:"#fff",border:"none",borderRadius:14,padding:"14px 36px",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:`0 8px 24px ${data.color}55`}}>
              Continue on the trail →
            </button>
          )}
        </div>
      )}

      {/* ── QUIZ ── */}
      {phase==="quiz"&&q&&(
        <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",padding:"48px 20px 36px"}}>

          {/* Header: small animal + progress */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <div style={{width:48,height:48,flexShrink:0,animation:"animalIdle 3s ease-in-out infinite"}}>
              <AnimalSVG animalKey={animal} size={48} animate={false}/>
            </div>
            <div style={{flex:1}}>
              <div style={{height:7,borderRadius:99,background:"rgba(0,0,0,0.1)",overflow:"hidden",marginBottom:4}}>
                <div style={{width:((qIdx/questions.length)*100)+"%",height:"100%",background:data.color,transition:"width 0.4s ease",borderRadius:99}}/>
              </div>
              <div style={{fontSize:11,color:data.color,fontWeight:700,opacity:0.8}}>{qIdx}/{questions.length} · {q.type==="mcq"?"Multiple choice":q.type==="fill"?"Fill in the blank":"Build the word"}</div>
            </div>
          </div>

          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>

            {/* Prompt label */}
            <div style={{fontSize:11,fontWeight:800,color:data.color,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10,opacity:0.7}}>{q.promptLabel}</div>

            {/* Prompt */}
            <div style={{fontSize:q.type==="fill"?16:32,fontWeight:q.type==="fill"?600:900,color:"#2a1a08",marginBottom:20,background:"rgba(255,255,255,0.72)",backdropFilter:"blur(6px)",borderRadius:16,padding:"16px 20px",textAlign:"center",border:`1.5px solid ${data.color}33`,animation:"speechIn 0.25s ease both",lineHeight:1.5}}>
              {q.prompt}
              {q.hint&&<div style={{fontSize:12,color:data.color,marginTop:6,fontWeight:600,opacity:0.7}}>({q.hint})</div>}
            </div>

            {/* MCQ options */}
            {q.type==="mcq"&&(
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {q.opts.map((opt,i)=>{
                  const isChosen=answer===opt, isCorrect=opt===q.answer;
                  let bg="rgba(255,255,255,0.75)", border=`1.5px solid rgba(0,0,0,0.08)`, anim=`optPop 0.3s ${i*0.07}s both`;
                  if(isChosen&&isCorrect)  {bg="rgba(34,197,94,0.2)";  border="1.5px solid #22c55e"; anim="correctPulse 0.6s ease";}
                  if(isChosen&&!isCorrect) {bg="rgba(239,68,68,0.15)"; border="1.5px solid #ef4444"; anim="wrongShake 0.4s ease";}
                  if(submitted&&!isChosen&&isCorrect){bg="rgba(34,197,94,0.12)"; border="1.5px solid #22c55e77";}
                  return (
                    <button key={opt} onClick={()=>handleMCQ(opt)}
                      style={{background:bg,backdropFilter:"blur(6px)",border,borderRadius:14,padding:"14px 18px",fontSize:15,fontWeight:700,color:"#2a1a08",cursor:submitted?"default":"pointer",textAlign:"left",animation:anim,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
                      {submitted&&isChosen&&isCorrect&&"✅ "}{submitted&&isChosen&&!isCorrect&&"❌ "}{submitted&&!isChosen&&isCorrect&&"✅ "}{opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fill in the blank */}
            {q.type==="fill"&&(
              <div>
                <input value={typed} onChange={e=>setTyped(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter") handleFill();}}
                  disabled={submitted}
                  placeholder="Type your answer…"
                  style={{width:"100%",padding:"14px 18px",fontSize:16,fontWeight:600,borderRadius:14,border:`2px solid ${submitted?(isCorrect?"#22c55e":"#ef4444"):data.color+"66"}`,background:submitted?(isCorrect?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)"):"rgba(255,255,255,0.8)",color:"#2a1a08",outline:"none",marginBottom:12,boxSizing:"border-box",backdropFilter:"blur(6px)"}}
                />
                {!submitted&&(
                  <button onClick={handleFill} disabled={!typed.trim()}
                    style={{width:"100%",padding:"13px",background:typed.trim()?data.color:"rgba(0,0,0,0.1)",color:typed.trim()?"#fff":"rgba(0,0,0,0.35)",border:"none",borderRadius:14,fontSize:15,fontWeight:800,cursor:typed.trim()?"pointer":"default",boxShadow:typed.trim()?`0 6px 20px ${data.color}44`:"none",transition:"all 0.2s"}}>
                    Check answer →
                  </button>
                )}
                {submitted&&(
                  <div style={{textAlign:"center",fontSize:15,fontWeight:700,color:isCorrect?"#22c55e":"#ef4444",padding:"10px",animation:"optPop 0.3s both"}}>
                    {isCorrect?"✅ Correct!":"❌ The answer was: "+q.answer}
                  </div>
                )}
              </div>
            )}

            {/* Tile builder */}
            {q.type==="tiles"&&(
              <div>
                {/* Answer area */}
                <div style={{minHeight:54,borderRadius:14,border:`2px dashed ${submitted?(isCorrect?"#22c55e":"#ef4444"):data.color+"66"}`,background:submitted?(isCorrect?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)"):"rgba(255,255,255,0.5)",padding:"10px 14px",marginBottom:14,display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",backdropFilter:"blur(6px)"}}>
                  {tiles.length===0&&<span style={{color:"rgba(0,0,0,0.3)",fontSize:13,fontWeight:600}}>Tap tiles below to build your answer</span>}
                  {tiles.map((tileIdx,pos)=>(
                    <span key={pos} onClick={()=>!submitted&&setTiles(prev=>prev.filter((_,j)=>j!==pos))}
                      style={{padding:"6px 14px",borderRadius:10,background:data.color,color:"#fff",fontSize:15,fontWeight:700,cursor:submitted?"default":"pointer",animation:"tilePop 0.2s both",boxShadow:`0 3px 8px ${data.color}44`}}>
                      {q.tileList[tileIdx]}
                    </span>
                  ))}
                </div>
                {/* Tile bank */}
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
                  {q.tileList.map((t,i)=>{
                    // FIX 4: track by index so duplicate tiles work correctly
                    const used = tiles.includes(i);
                    return (
                      <button key={i} onClick={()=>!submitted&&!used&&toggleTile(i)}
                        style={{padding:"8px 16px",borderRadius:10,background:used?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.8)",border:`1.5px solid ${used?"rgba(0,0,0,0.1)":data.color+"55"}`,fontSize:15,fontWeight:700,color:used?"rgba(0,0,0,0.3)":"#2a1a08",cursor:(submitted||used)?"default":"pointer",transition:"all 0.15s",backdropFilter:"blur(4px)",opacity:used?0.4:1}}>
                        {t}
                      </button>
                    );
                  })}
                </div>
                {!submitted&&(
                  <button onClick={submitTiles} disabled={tiles.length===0}
                    style={{width:"100%",padding:"13px",background:tiles.length?data.color:"rgba(0,0,0,0.1)",color:tiles.length?"#fff":"rgba(0,0,0,0.35)",border:"none",borderRadius:14,fontSize:15,fontWeight:800,cursor:tiles.length?"pointer":"default",transition:"all 0.2s",boxShadow:tiles.length?`0 6px 20px ${data.color}44`:"none"}}>
                    Check answer →
                  </button>
                )}
                {submitted&&(
                  <div style={{textAlign:"center",fontSize:15,fontWeight:700,color:isCorrect?"#22c55e":"#ef4444",padding:"10px",animation:"optPop 0.3s both"}}>
                    {isCorrect?"✅ Correct!":"❌ The answer was: "+q.answer}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── DONE ── */}
      {phase==="done"&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 24px",textAlign:"center"}}>
          <div style={{animation:"animalEntrance 0.7s cubic-bezier(0.34,1.56,0.64,1) both",filter:`drop-shadow(0 14px 32px ${data.color}55)`,marginBottom:8}}>
            <AnimalSVG animalKey={animal} size={160} animate={true}/>
          </div>
          <div style={{fontSize:11,fontWeight:800,color:data.color,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8,opacity:0.75}}>{unitName} Checkpoint</div>
          <div style={{fontSize:56,fontWeight:900,color:pct>=70?data.color:"#ef4444",marginBottom:4,animation:"starPop 0.5s 0.2s both"}}>{score}/{questions.length}</div>
          <div style={{fontSize:16,color:"#6b3d10",marginBottom:6,fontWeight:600}}>
            {pct>=100?"Perfect! 🌟":pct>=70?"Checkpoint passed! 🎉":"Checkpoint failed 💪"}
          </div>
          <div style={{fontSize:13,color:"rgba(107,61,16,0.65)",marginBottom:16}}>
            {pct>=70
              ? `You scored ${pct}% — above the 70% pass mark.`
              : `You scored ${pct}% — you need 70% to pass. Try again!`}
          </div>
          <div style={{background:"rgba(255,255,255,0.8)",backdropFilter:"blur(8px)",border:`1.5px solid ${data.color}44`,borderRadius:18,padding:"14px 22px",maxWidth:280,fontSize:15,color:"#3d2a0a",lineHeight:1.6,fontWeight:500,marginBottom:24,fontStyle:"italic"}}>
            "{data.line}"
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:300}}>
            {pct >= 70 ? (
              <button onClick={() => { setCheckpointPass(userId, langCode, unitName, pct); spendTrailPoints(userId, CHECKPOINT_TP_REQUIRED); onCheckpointPass?.(); onClose(); }}
                style={{background:data.color,color:"#fff",border:"none",borderRadius:14,padding:"14px 36px",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:`0 8px 24px ${data.color}55`}}>
                Continue on the Trail →
              </button>
            ) : (
              <>
                <button onClick={() => { setQIdx(0); setScore(0); setAnswer(null); setTyped(""); setTiles([]); setSubmitted(false); setPhase("quiz"); }}
                  style={{background:data.color,color:"#fff",border:"none",borderRadius:14,padding:"14px 36px",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:`0 8px 24px ${data.color}55`}}>
                  🔄 Try Again
                </button>
                <button onClick={onClose}
                  style={{background:"rgba(0,0,0,0.08)",color:"#6b3d10",border:"1px solid rgba(107,61,16,0.2)",borderRadius:14,padding:"13px 36px",fontSize:15,fontWeight:700,cursor:"pointer"}}>
                  Back to Trail (practice more)
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── TrailUnit ─────────────────────────────────────────────────────────────────
function TrailUnit({unit,color,completed,nextLessonId,justCompletedId,doAnimate,onSelectLesson,levelKey,isCurrentLevel,mist,unitAnimal,unitIdx,userId,langCode,unitLocked,onCheckpointPass,starsMap,trailPoints=0,trailRequired=100}) {
  const lessons=unit.lessons;
  const [torchList,setTorchList]=useState([]);
  const [foxPos,setFoxPos]=useState(null);     // {x,y} current fox position during walk
  const [pathLit,setPathLit]=useState(false);  // is the just-completed path now glowing
  const [animalModal,setAnimalModal]=useState(false);
  const prevDoAnimate=useRef(false);
  const animTimers=useRef([]);

  // Measure container so SVG paths always align with absolutely-positioned cards
  const wrapRef=useRef(null);
  const [scale,setScale]=useState(1);
  useEffect(()=>{
    const el=wrapRef.current;
    if(!el) return;
    const update=()=>setScale((el.offsetWidth||VW)/VW);
    update();
    const obs=new ResizeObserver(update);
    obs.observe(el);
    return()=>obs.disconnect();
  },[]);

  const {positions,cpPos,connectors}=useMemo(()=>{
    const pos=lessons.map((mod,idx)=>({
      id:mod.id, x:idx%2===0?LX:RX, y:T0+idx*GAP, side:idx%2===0?"left":"right"
    }));
    const last=pos[pos.length-1];
    const cpSide=last.side==="left"?"right":"left";
    const cp={x:cpSide==="left"?LX:RX,y:last.y+GAP,side:cpSide};
    return {positions:pos,cpPos:cp,connectors:buildConnectors(pos,cp)};
  },[unit.unit,lessons.length]);

  const completedCt=useMemo(()=>lessons.filter(m=>completed.includes(m.id)).length,[completed]);
  const justIdx=useMemo(()=>lessons.findIndex(m=>m.id===justCompletedId),[justCompletedId]);
  const currentIdx=useMemo(()=>lessons.findIndex((_,i)=>lessonState(lessons,i,completed)==="current"),[completed]);

  // Refs for stable access inside timeouts
  const justIdxRef=useRef(justIdx);
  const connectorsRef=useRef(connectors);
  useEffect(()=>{justIdxRef.current=justIdx;},[justIdx]);
  useEffect(()=>{connectorsRef.current=connectors;},[connectors]);

  function clearAllTimers() { animTimers.current.forEach(clearTimeout); animTimers.current=[]; }
  function after(ms,fn) { const t=setTimeout(fn,ms); animTimers.current.push(t); }

  // ── Main animation sequence: fox walks, torches ignite, path glows ──────────
  useEffect(()=>{
    if(!doAnimate) { prevDoAnimate.current=false; setFoxPos(null); setTorchList([]); setPathLit(false); return; }
    if(prevDoAnimate.current) return;
    prevDoAnimate.current=true;
    clearAllTimers();

    const cons=connectorsRef.current;
    let idx=justIdxRef.current;
    if(idx<0||idx>=cons.length) {
      const ct=lessons.filter(m=>completed.includes(m.id)).length;
      idx=ct>0?ct-1:-1;
    }
    if(idx<0||idx>=cons.length) return;

    const connector=cons[idx];
    const STEPS=20;
    const pathPoints=samplePath(connector,STEPS);

    // Place torch positions at t=0.25, 0.5, 0.75
    const torchPositions=[0.25,0.5,0.75].map(t=>bezierPt(connector.p0,connector.p1,connector.p2,connector.p3,t));

    // Step 1 (0ms): fox appears at start of this connector
    setFoxPos(pathPoints[0]);

    // Steps 2-20: fox walks (each step 80ms = 1.6s total walk)
    pathPoints.forEach((pt,i)=>{
      if(i===0) return;
      after(i*80,()=>setFoxPos(pt));
    });

    // Torches ignite at t=500, 800, 1100ms (staggered)
    torchPositions.forEach((tp,i)=>{
      after(400+i*320,()=>{
        setTorchList(prev=>[...prev,{x:tp.x,y:tp.y,id:Date.now()+i}]);
      });
    });

    // Path glows after fox is halfway
    after(900,()=>setPathLit(true));

    // Fox disappears, torches fade
    after(2000,()=>setFoxPos(null));
    after(3500,()=>setTorchList([]));

    return clearAllTimers;
  },[doAnimate]);

  const svgH=cpPos.y+90;
  const allDone=completedCt>=lessons.length;
  const cpPassed=!!getCheckpointPass(userId,langCode,unit.unit)?.passed;
  const scaledH=Math.round(svgH*scale);

  return (
    // Outer div: measured, holds the scaled height so layout doesn't collapse
    <div ref={wrapRef} style={{position:"relative",width:"100%",height:scaledH,marginTop:8,overflow:"hidden"}}>
      {/* Inner div: fixed VW wide, scaled uniformly — SVG paths stay aligned with cards */}
      <div style={{position:"absolute",top:0,left:0,width:VW,height:svgH,transformOrigin:"top left",transform:`scale(${scale})`}}>
      <svg width={VW} height={svgH} viewBox={`0 0 ${VW} ${svgH}`}
        style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:1,overflow:"visible"}}>

        {/* Dim base paths */}
        {connectors.map((c,i)=>(
          <path key={`b${i}`} d={c.d} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="10" strokeLinecap="round"/>
        ))}

        {/* Lit completed paths */}
        {connectors.map((c,i)=>{
          const isJustDone=doAnimate&&i===justIdxRef.current;
          const lit=isJustDone?pathLit:i<completedCt;
          return (
            <path key={`l${i}`} d={c.d} fill="none" stroke={color}
              strokeWidth="4.5" strokeLinecap="round"
              opacity={lit?0.72:0.12}
              style={lit?{filter:`drop-shadow(0 0 7px ${color}bb)`}:{}}
            />
          );
        })}

        {/* Animated stroke-draw for the just-completed path */}
        {doAnimate&&pathLit&&justIdxRef.current>=0&&justIdxRef.current<connectors.length&&(
          <path d={connectors[justIdxRef.current].d} fill="none" stroke={color}
            strokeWidth="5.5" strokeLinecap="round"
            style={{filter:`drop-shadow(0 0 18px ${color})`,strokeDasharray:600,strokeDashoffset:600,animation:"drawPath 1.2s ease forwards"}}
          />
        )}

      </svg>

      {/* 🔥 Torch flames — absolute positioned over SVG */}
      {torchList.map((t)=>(
        <div key={t.id} style={{position:"absolute",left:t.x-14,top:t.y-26,fontSize:22,pointerEvents:"none",zIndex:15,animation:"torchPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both"}}>
          <div style={{fontSize:22}}>🔥</div>
          <div style={{position:"absolute",top:-8,left:-4,width:28,height:28,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,180,60,0.4),transparent 70%)",animation:"torchGlow 1.2s ease-in-out infinite"}}/>
        </div>
      ))}

      {/* 🦊 Fox walking along path */}
      {foxPos&&(
        <div style={{position:"absolute",left:foxPos.x-16,top:foxPos.y-20,fontSize:26,zIndex:20,pointerEvents:"none",transition:"left 0.08s linear,top 0.08s linear",filter:"drop-shadow(0 4px 8px rgba(255,130,0,0.5))"}}>
          🦊
        </div>
      )}

      {/* Lesson cards — fully clickable, no separate play button */}
      {positions.map((pos,idx)=>{
        const mod=lessons[idx];
        const state=lessonState(lessons,idx,completed);
        const isNext=mod.id===nextLessonId;
        const locked=state==="locked";
        const title=mod.lesson_focus||mod.title;
        const stepsAhead=idx-Math.max(currentIdx,0);
        const mistOpacity=locked&&stepsAhead>1?Math.min(0.88,0.50+stepsAhead*0.06):0;
        const blurPx=locked&&stepsAhead>1?Math.min(6,stepsAhead*1.6):0;

        return (
          <div key={mod.id} id={`lesson-${mod.id}`}
            style={{position:"absolute",left:pos.x,top:pos.y,width:CW,height:CH,zIndex:isNext?4:2}}>
            {/* Entire card is the click target */}
            <div
              onClick={()=>!locked&&!unitLocked&&onSelectLesson(mod,levelKey,color)}
              style={{
                width:"100%",height:"100%",borderRadius:16,padding:"10px 12px",
                cursor:(locked||unitLocked)?"default":"pointer",
                background:state==="done"?"rgba(255,248,232,0.98)":locked||unitLocked?"rgba(255,255,255,0.07)":isNext?"rgba(255,248,235,0.99)":"rgba(255,248,238,0.97)",
                border:`1.5px solid ${isNext&&!unitLocked?"rgba(245,165,36,0.6)":locked||unitLocked?"rgba(255,255,255,0.08)":state==="done"?"rgba(245,165,36,0.28)":"rgba(245,165,36,0.24)"}`,
                boxShadow:isNext&&!unitLocked?"0 0 0 3px rgba(245,165,36,0.14),0 10px 28px rgba(255,166,57,0.26)":"0 3px 12px rgba(0,0,0,0.07)",
                display:"flex",flexDirection:"column",justifyContent:"center",
                overflow:"hidden",position:"relative",boxSizing:"border-box",
                transition:"box-shadow 0.2s,transform 0.15s",
              }}
              onMouseEnter={e=>{if(!locked){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=isNext?"0 0 0 3px rgba(245,165,36,0.2),0 14px 32px rgba(255,166,57,0.35)":"0 8px 20px rgba(0,0,0,0.14)";}}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=isNext?"0 0 0 3px rgba(245,165,36,0.14),0 10px 28px rgba(255,166,57,0.26)":"0 3px 12px rgba(0,0,0,0.07)";}}
            >
              {/* Title row: text + stars/indicator side by side */}
              <div style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:4}}>
                <div style={{fontSize:12,fontWeight:800,color:locked?"rgba(107,61,16,0.38)":"#6b3d10",lineHeight:1.3,flex:1}}>
                  {title}
                </div>
                {/* Stars for completed lessons */}
                {state==="done"&&(()=>{const s=starsMap?.[mod.id]||0;return<div style={{fontSize:10,letterSpacing:0,flexShrink:0,marginTop:1,lineHeight:1}}>{s===3?"⭐⭐⭐":s===2?"⭐⭐☆":s===1?"⭐☆☆":"✓"}</div>;})()}
                {/* Active green dot */}
                {isNext&&isCurrentLevel&&<div style={{flexShrink:0,marginTop:4,width:8,height:8,borderRadius:"50%",background:"#32d266",boxShadow:"0 0 6px rgba(50,210,102,0.7)",animation:"pulse 1.8s ease-in-out infinite"}}/>}
              </div>
              <div style={{fontSize:10,color:locked||unitLocked?"rgba(107,61,16,0.28)":"rgba(107,61,16,0.6)"}}>
                {state==="done"?`Completed · +${mod.xp||25} XP`:unitLocked?"🔒 Pass checkpoint first":locked?"Locked":`${(mod.vocab||[]).length||10} words · ${mod.xp||25} XP`}
              </div>
              {/* Mist overlay for far-ahead locked lessons */}
              {mistOpacity>0&&(
                <div style={{position:"absolute",inset:0,borderRadius:15,background:mist,backdropFilter:`blur(${blurPx}px)`,WebkitBackdropFilter:`blur(${blurPx}px)`,opacity:mistOpacity,pointerEvents:"none",transition:"opacity 0.5s"}}/>
              )}
            </div>
            {/* Small fox on the next lesson card */}
            {isNext&&isCurrentLevel&&!foxPos&&!unitLocked&&(
              <div style={{position:"absolute",bottom:-6,right:-4,fontSize:18,filter:"drop-shadow(0 2px 6px rgba(255,130,0,0.4))",animation:"idleBob 2.4s ease-in-out infinite",zIndex:6,pointerEvents:"none"}}>🦊</div>
            )}
          </div>
        );
      })}

      {/* Checkpoint card with unit animal */}
      <CheckpointCard
        cpPos={cpPos} completedCt={completedCt} totalLessons={lessons.length}
        unitAnimal={unitAnimal} allDone={allDone}
        onOpen={()=>setAnimalModal(true)}
        trailPoints={trailPoints}
        trailRequired={trailRequired}
        cpPassed={cpPassed}
      />

      {/* Fox sits at checkpoint when all lessons done */}
        {allDone&&!foxPos&&(
          <div style={{position:"absolute",left:cpPos.x+(CW/2)-10,top:cpPos.y-14,fontSize:20,filter:"drop-shadow(0 2px 6px rgba(255,130,0,0.4))",animation:"idleBob 2.4s ease-in-out infinite",zIndex:6,pointerEvents:"none"}}>🦊</div>
        )}
        {/* Animal talk modal */}
      {animalModal&&createPortal(
        <CheckpointScreen
          animal={unitAnimal}
          unitName={unit.unit}
          lessons={lessons}
          userId={userId}
          langCode={langCode}
          onClose={()=>setAnimalModal(false)}
          onCheckpointPass={onCheckpointPass}
        />,
        document.body
      )}
      </div>{/* end inner scale wrapper */}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LearnJourneyPage({curriculum,progress,langName,user,justCompletedId,animTrigger,onSelectLesson,onUpgrade,isPro,langCode,starsMap,onStatues,trailPoints=0,trailRequired=100}) {
  const C=getTheme();
  const completed=progress?.completed||[];
  const totalXP=progress?.xp||0;
  const streak=getStreak(user?.id);
  const usage=getDailyUsage(user?.id);
  const nextLesson=useMemo(()=>findNextLesson(curriculum,completed,justCompletedId),[curriculum,completed,justCompletedId]);
  const allMods=CEFR.flatMap(k=>curriculum[k]?.modules||[]);
  const readinessPct=allMods.length?Math.round((completed.length/allMods.length)*100):0;

  // Read placement state so placed users don't have their level locked
  const placementState = useMemo(() => getPlacementState(user?.id, langCode), [user?.id, langCode]);
  const placedLevel = placementState?.placedLevel || null;

  // FIX 5: revision counter forces re-render when a checkpoint is passed,
  // so prevCheckpointPassed reads fresh values from localStorage
  const [cpPassRevision, setCpPassRevision] = useState(0);
  const handleCheckpointPass = () => setCpPassRevision(r => r + 1);

  // Duolingo-style: find the first unlocked level with incomplete lessons
  const activeLevel = useMemo(() => {
    for (const k of CEFR) {
      const mods = curriculum[k]?.modules || [];
      if (!mods.length) continue;
      if (isLevelLocked(curriculum, completed, k, placedLevel)) continue;
      if (mods.filter(m => completed.includes(m.id)).length < mods.length) return k;
    }
    return CEFR.find(k => (curriculum[k]?.modules||[]).length > 0) || "A1";
  }, [curriculum, completed, placedLevel]);

  // null = auto-track activeLevel; set explicitly when user taps a collapsed header
  const [expandedLevel, setExpandedLevel] = useState(null);
  const effectiveExpanded = expandedLevel || activeLevel;

  // Floating jump popover
  const [showJumpMenu, setShowJumpMenu] = useState(false);

  const [doAnimate,setDoAnimate]=useState(false);
  const prevTrigger=useRef(0);

  // Close jump menu on outside click
  useEffect(()=>{
    if(!showJumpMenu) return;
    const close = (e) => {
      if(!e.target.closest("[data-jump-menu]")) setShowJumpMenu(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  },[showJumpMenu]);

  // Scroll current lesson into center on initial load
  useEffect(()=>{
    if(!nextLesson?.id) return;
    const t=setTimeout(()=>{
      const el=document.getElementById(`lesson-${nextLesson.id}`);
      if(el) el.scrollIntoView({behavior:"smooth",block:"center"});
    }, 300);
    return ()=>clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    if(!animTrigger||animTrigger===prevTrigger.current) return;
    prevTrigger.current=animTrigger;
    setDoAnimate(true);
    const t1=setTimeout(()=>{
      const targetId = justCompletedId || nextLesson?.id;
      if(!targetId) return;
      const el=document.getElementById(`lesson-${targetId}`);
      if(el) el.scrollIntoView({behavior:"smooth",block:"center"});
    },450);
    const t2=setTimeout(()=>setDoAnimate(false),5500);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[animTrigger]);

  const WNAME={A1:"The Forest",A2:"The Hills",B1:"The Mountains",B2:"The Snow",C1:"High Peaks",C2:"The Summit"};
  const WANIM={A1:"🐇🐿️🦌🦉",A2:"🐐🦉",B1:"🐺🦅",B2:"🐆🦅",C1:"🦁",C2:"🦊"};
  const WLINE={A1:"The forest begins here.",A2:"The hills open up ahead.",B1:"The mountain tests you.",B2:"Few reach this far.",C1:"Almost there.",C2:"You've come far."};

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"var(--font-body)",color:C.text,paddingBottom:90}}>
      <style>{`
        @keyframes idleBob  {0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes pulse    {0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.4)}}
        @keyframes torchPop {0%{opacity:0;transform:scale(0.2) translateY(14px)}65%{opacity:1;transform:scale(1.3) translateY(-5px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes torchGlow{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:0.9;transform:scale(1.3)}}
        @keyframes drawPath {0%{stroke-dashoffset:600}100%{stroke-dashoffset:0}}
        @keyframes animalPop{0%{opacity:0;transform:scale(0.7) translateY(20px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes animalBob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(2deg)}}
        @keyframes cardShine{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
      `}</style>

      <div style={{maxWidth:420,margin:"0 auto",padding:"10px 12px 0"}}>
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:22,overflow:"hidden",boxShadow:`0 16px 40px ${C.glow}`}}>

          {/* Header */}
          {(()=>{
            const xpInfo = getXPLevel(totalXP);
            const dailyUsage = getDailyUsage(user?.id);
            const dailyDone = dailyUsage.lessons || 0;
            const dailyPct = Math.min(100, Math.round((dailyDone / DAILY_LESSON_GOAL) * 100));
            const xpPct = xpInfo.next ? Math.round((xpInfo.current / (xpInfo.next - (xpInfo.xp - xpInfo.current))) * 100) : 100;
            return (
              <div style={{padding:"14px 16px 12px",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div>
                    <div style={{fontSize:19,fontWeight:900}}>{langName} Trail</div>
                    <div style={{fontSize:11,color:C.muted}}>{xpInfo.title} · {totalXP.toLocaleString()} XP</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
                    {streak?.count>1&&<div style={{fontSize:12,fontWeight:800,color:"#ff7b4e"}}>🔥 {streak.count}</div>}
                    <div title="Regular XP — spend in Statue Shop for bonus lessons" style={{fontSize:12,fontWeight:800,color:C.path}}>🪙 {totalXP.toLocaleString()}</div>
                    <div title="Trail XP — spend to unlock unit checkpoints" style={{fontSize:12,fontWeight:800,color:"#f5a524",background:"rgba(245,165,36,0.12)",padding:"2px 8px",borderRadius:20,border:"1px solid rgba(245,165,36,0.3)"}}>⚡ {trailPoints}</div>
                  </div>
                </div>
                {/* XP level bar */}
                {xpInfo.next && (
                  <div style={{marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.muted,marginBottom:3}}>
                      <span>Level: {xpInfo.title}</span>
                      <span>{xpInfo.current} / {xpInfo.next - (xpInfo.xp - xpInfo.current)} XP</span>
                    </div>
                    <div style={{height:5,borderRadius:999,overflow:"hidden",background:"rgba(245,165,36,0.15)"}}>
                      <div style={{width:`${xpPct}%`,height:"100%",background:`linear-gradient(90deg,${C.path},#f0cf83)`,transition:"width 0.8s ease",borderRadius:999}}/>
                    </div>
                  </div>
                )}
                {/* Daily goal */}
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1,height:4,borderRadius:999,overflow:"hidden",background:"rgba(245,165,36,0.15)"}}>
                    <div style={{width:`${dailyPct}%`,height:"100%",background:dailyDone>=DAILY_LESSON_GOAL?"#22c55e":C.path,transition:"width 0.6s ease",borderRadius:999}}/>
                  </div>
                  <div style={{fontSize:10,fontWeight:800,color:dailyDone>=DAILY_LESSON_GOAL?"#22c55e":C.muted,flexShrink:0}}>
                    {dailyDone>=DAILY_LESSON_GOAL?"✅ Goal done!": `${dailyDone}/${DAILY_LESSON_GOAL} daily`}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Fluency progress bar */}
          <div style={{padding:"10px 16px 0"}}>
            <div style={{height:6,borderRadius:999,overflow:"hidden",background:"rgba(255,255,255,0.15)"}}>
              <div style={{width:`${readinessPct}%`,height:"100%",background:`linear-gradient(90deg,${C.path},#3ddc73)`,transition:"width 0.8s ease"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:11,color:C.muted}}>
              <span>Fluency progress</span><span>{readinessPct}% complete</span>
            </div>
          </div>

          {!isPro&&<FreeLimitBanner used={usage.lessons||0} max={FREE_LESSONS_PER_DAY} onUpgrade={onUpgrade} C={C}/>}

          {/* Continue button */}
          {nextLesson&&(
            <div style={{padding:"12px 14px 0"}}>
              <button onClick={()=>{
                for(const lvl of CEFR) if((curriculum[lvl]?.modules||[]).some(m=>m.id===nextLesson.id)){onSelectLesson(nextLesson,lvl,C.path);break;}
              }} style={{width:"100%",border:"none",borderRadius:16,padding:"12px 14px",cursor:"pointer",background:`linear-gradient(135deg,${C.path},#ff6d00)`,color:"#fff9f0",fontWeight:800,boxShadow:`0 10px 22px ${C.glow}`,fontSize:14}}>
                Continue Journey · {nextLesson.lesson_focus||nextLesson.title}
              </button>
            </div>
          )}

          <div style={{position:"sticky",top:0,zIndex:20,background:"rgba(255,247,234,0.97)",backdropFilter:"blur(8px)",borderBottom:"1px solid rgba(245,165,36,0.18)"}}>
            <div style={{display:"flex",alignItems:"center",gap:0,padding:"8px 14px 8px"}}>
              <div style={{display:"flex",gap:8,alignItems:"center",overflowX:"auto",flex:1,WebkitOverflowScrolling:"touch",msOverflowStyle:"none",scrollbarWidth:"none"}}>
                <span style={{fontSize:10,fontWeight:800,letterSpacing:1.2,color:"rgba(107,61,16,0.45)",textTransform:"uppercase",flexShrink:0}}>Jump to:</span>
                {CEFR.filter(k=>(curriculum[k]?.modules||[]).length>0).map(k => <button key={k} onClick={() => document.getElementById(`level-${k}`)?.scrollIntoView({behavior:"smooth", block:"start"})} style={{border:"1px solid rgba(245,165,36,0.35)",background:"rgba(255,255,255,0.85)",borderRadius:999,padding:"6px 14px",fontSize:12,fontWeight:800,color:C.path,cursor:"pointer",flexShrink:0,boxShadow:"0 1px 4px rgba(245,165,36,0.1)"}}>{k}</button>)}
              </div>
              {onStatues&&<button onClick={onStatues} style={{flexShrink:0,marginLeft:8,border:"1px solid rgba(245,165,36,0.5)",background:"linear-gradient(135deg,rgba(245,165,36,0.12),rgba(245,165,36,0.06))",borderRadius:999,padding:"6px 13px",fontSize:12,fontWeight:800,color:"#c97b0a",cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 1px 6px rgba(245,165,36,0.15)"}}>🗿 Bonus</button>}
            </div>
          </div>

          {/* Trail map per level — Duolingo-style accordion */}
          {CEFR.filter(k=>(curriculum[k]?.modules||[]).length>0).map((levelKey,li)=>{
            const mods=curriculum[levelKey]?.modules||[];
            const units=groupUnits(mods);
            const locked=isLevelLocked(curriculum,completed,levelKey,placedLevel);
            const done=mods.filter(m=>completed.includes(m.id)).length;
            const pct=mods.length?Math.round((done/mods.length)*100):0;
            const levelAnimals=UNIT_ANIMALS[levelKey]||[];
            const isExpanded = effectiveExpanded === levelKey;
            return (
              <div key={levelKey} id={`level-${levelKey}`} style={{borderTop:li>0?`1px solid ${C.border}`:"none"}}>
                {/* Tappable level header — always visible */}
                <div
                  onClick={() => { if(!locked) setExpandedLevel(isExpanded ? null : levelKey); }}
                  style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:10,cursor:locked?"default":"pointer",
                    background: isExpanded ? "rgba(245,165,36,0.04)" : "transparent",
                    transition:"background 0.15s"}}>
                  {/* Emoji badge */}
                  <div style={{fontSize:22,flexShrink:0,filter:locked?"grayscale(1) opacity(0.35)":"none"}}>
                    {([...(WANIM[levelKey]||"")][0])||"🌲"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:10,letterSpacing:1.5,fontWeight:900,color:C.muted,flexShrink:0}}>{levelKey}</span>
                      <span style={{fontSize:15,fontWeight:900,color:locked?C.muted:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{WNAME[levelKey]}</span>
                    </div>
                    <div style={{fontSize:11,color:locked?"rgba(107,61,16,0.4)":C.muted,marginTop:1}}>
                      {locked ? "🔒 Complete previous level" : done===mods.length ? "✅ Level complete!" : `${done}/${mods.length} lessons · ${pct}%`}
                    </div>
                    {/* Mini progress bar */}
                    {!locked && (
                      <div style={{marginTop:5,height:3,borderRadius:99,background:"rgba(245,165,36,0.15)",overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pct}%`,borderRadius:99,background:done===mods.length?"#22c55e":C.path,transition:"width 0.6s ease"}}/>
                      </div>
                    )}
                  </div>
                  {/* Chevron */}
                  {!locked && (
                    <div style={{fontSize:16,color:C.muted,flexShrink:0,transition:"transform 0.25s",transform:isExpanded?"rotate(180deg)":"rotate(0deg)"}}>▾</div>
                  )}
                  {locked && <div style={{fontSize:16,color:"rgba(107,61,16,0.25)",flexShrink:0}}>🔒</div>}
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div style={{padding:"0 14px 12px"}}>
                    {locked ? (
                      <div style={{borderRadius:18,padding:"28px 16px",background:C.mist,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",border:`1px solid ${C.border}`,textAlign:"center",color:C.muted}}>
                        <div style={{fontSize:24,marginBottom:8,filter:"grayscale(1) opacity(0.35)",letterSpacing:6}}>{WANIM[levelKey]}</div>
                        <div style={{fontSize:13,fontWeight:700}}>🌫️ Shrouded in mist</div>
                        <div style={{fontSize:11,marginTop:4,opacity:0.65}}>Complete the previous level to reveal this path</div>
                      </div>
                    ) : (
                      units.map((unit,idx)=>{
                        const prevUnit = idx > 0 ? units[idx - 1] : null;
                        const prevCheckpointPassed = idx === 0 ? true : (cpPassRevision >= 0 && !!getCheckpointPass(user?.id, langCode || curriculum.code, prevUnit.unit)?.passed);
                        return (
                          <div key={unit.unit} style={{marginTop:idx?0:2}}>
                            {idx > 0 && onStatues && (
                              <div onClick={onStatues} style={{margin:"8px 0 10px",padding:"10px 16px",borderRadius:16,background:"linear-gradient(135deg,rgba(245,165,36,0.09),rgba(245,165,36,0.04))",border:"1.5px dashed rgba(245,165,36,0.38)",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background 0.2s"}}
                                onMouseEnter={e=>e.currentTarget.style.background="linear-gradient(135deg,rgba(245,165,36,0.16),rgba(245,165,36,0.08))"}
                                onMouseLeave={e=>e.currentTarget.style.background="linear-gradient(135deg,rgba(245,165,36,0.09),rgba(245,165,36,0.04))"}>
                                <div style={{fontSize:24,flexShrink:0}}>🗿</div>
                                <div style={{flex:1}}>
                                  <div style={{fontSize:12,fontWeight:900,color:C.path,marginBottom:1}}>Bonus Phrases</div>
                                  <div style={{fontSize:11,color:C.muted}}>Unlock cultural expressions with your Trail Points</div>
                                </div>
                                <div style={{fontSize:10,fontWeight:800,color:C.path,opacity:0.7}}>→</div>
                              </div>
                            )}
                            <div style={{textAlign:"center",fontSize:11,letterSpacing:2,fontWeight:900,color:C.muted,marginBottom:4,marginTop:idx?2:0}}>
                              {unit.unit.toUpperCase()} · {unit.lessons.filter(l=>completed.includes(l.id)).length}/{unit.lessons.length}{idx>0 && !prevCheckpointPassed ? " · Checkpoint locked" : ""}
                            </div>
                            <TrailUnit
                              unit={unit} color={C.path} completed={completed}
                              nextLessonId={nextLesson?.id} justCompletedId={justCompletedId}
                              doAnimate={doAnimate} onSelectLesson={onSelectLesson}
                              levelKey={levelKey} isCurrentLevel={!locked} mist={C.mist}
                              unitAnimal={levelAnimals[idx]||"🏡"}
                              unitIdx={idx}
                              userId={user?.id}
                              langCode={langCode || curriculum.code}
                              unitLocked={!prevCheckpointPassed}
                              onCheckpointPass={handleCheckpointPass}
                              starsMap={starsMap}
                              trailPoints={trailPoints}
                              trailRequired={trailRequired}
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Jump button — always accessible, bottom-right above nav */}
      <div data-jump-menu style={{position:"fixed",bottom:78,right:14,zIndex:50}}>
        {showJumpMenu && (
          <div style={{
            position:"absolute",bottom:"calc(100% + 8px)",right:0,
            background:"rgba(255,247,234,0.97)",backdropFilter:"blur(12px)",
            border:"1px solid rgba(245,165,36,0.3)",borderRadius:16,
            padding:"10px 8px",boxShadow:"0 8px 24px rgba(245,165,36,0.18)",
            display:"flex",flexDirection:"column",gap:4,minWidth:90,
          }}>
            {CEFR.filter(k=>(curriculum[k]?.modules||[]).length>0).map(k => {
              const mLocked = isLevelLocked(curriculum,completed,k,placedLevel);
              return (
                <button key={k} onClick={()=>{
                  setShowJumpMenu(false);
                  if(!mLocked) setExpandedLevel(k);
                  setTimeout(()=>document.getElementById(`level-${k}`)?.scrollIntoView({behavior:"smooth",block:"start"}),50);
                }} style={{
                  background: effectiveExpanded===k ? `${C.path}18` : "transparent",
                  border: effectiveExpanded===k ? `1px solid ${C.path}55` : "1px solid transparent",
                  borderRadius:10,padding:"7px 12px",fontSize:13,fontWeight:800,
                  color: mLocked ? "rgba(107,61,16,0.3)" : C.path,
                  cursor: mLocked ? "default" : "pointer",
                  textAlign:"left",display:"flex",alignItems:"center",gap:6,
                }}>
                  {mLocked ? "🔒" : effectiveExpanded===k ? "▸" : ""} {k}
                </button>
              );
            })}
          </div>
        )}
        <button
          onClick={()=>setShowJumpMenu(v=>!v)}
          style={{
            background:`linear-gradient(135deg,${C.path},#ff6d00)`,
            border:"none",borderRadius:999,
            padding:"9px 14px",fontSize:12,fontWeight:800,
            color:"#fff9f0",cursor:"pointer",
            boxShadow:`0 4px 14px ${C.glow}`,
            display:"flex",alignItems:"center",gap:5,
            transition:"transform 0.15s",
          }}
          onMouseDown={e=>e.currentTarget.style.transform="scale(0.93)"}
          onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
        >
          {showJumpMenu ? "✕" : "⇅"} Jump
        </button>
      </div>
    </div>
  );
}
