import React, { useState, useEffect } from "react";
import { getAllModulesFromCurriculum } from "../lib/appState";
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORY_ORDER, getAchievements } from "../lib/rewards";

const T = {
  bg: "linear-gradient(180deg,#fff7ea 0%,#ffe7c2 100%)",
  panel: "rgba(255,255,255,0.82)",
  card: "rgba(255,255,255,0.72)",
  border: "rgba(245,165,36,0.25)",
  borderStrong: "rgba(245,165,36,0.4)",
  text: "#4a2800",
  muted: "rgba(107,61,16,0.6)",
  faint: "rgba(107,61,16,0.38)",
  path: "#f5a524",
  gold: "#c9a84c",
  goldLight: "#f0cf83",
  red: "#ef4444",
  redBg: "rgba(239,68,68,0.07)",
  green: "#16a34a",
  greenBg: "rgba(22,163,74,0.07)",
};

const CSS = `
  @keyframes prof-shine { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes prof-bar-fill { from{width:0%} to{width:var(--tw)} }
  @keyframes prof-slide-in { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
  @keyframes prof-fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes prof-avatar-glow { 0%,100%{box-shadow:0 0 0 0 rgba(245,165,36,0.2)} 50%{box-shadow:0 0 22px 8px rgba(245,165,36,0.15)} }
  @keyframes prof-count { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }

  .pf-stat-card { transition:all 0.2s ease; }
  .pf-stat-card:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(245,165,36,0.2) !important; }
  .pf-tab-btn { transition:all 0.18s ease; cursor:pointer; border:none; font-family:inherit; }
  .pf-achievement-card { transition:all 0.2s ease; }
  .pf-achievement-card.earned:hover { transform:translateY(-2px); }
  .pf-lb-row { transition:background 0.15s ease; }
  .pf-lb-row:hover { background:rgba(245,165,36,0.06) !important; }
  .pf-lang-item { transition:background 0.15s ease; cursor:pointer; border:none; font-family:inherit; }
  .pf-lang-item:hover { background:rgba(245,165,36,0.08) !important; }
  .pf-bar { animation:prof-bar-fill 0.9s cubic-bezier(0.34,1.56,0.64,1) both; }
  .pf-avatar { animation:prof-avatar-glow 3s ease-in-out infinite; }
  .pf-tab-content { animation:prof-fade-up 0.3s ease both; }
`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const LEVEL_COLORS = { A1:"#22c55e", A2:"#38bdf8", B1:"#a78bfa", B2:"#f97316", C1:"#ec4899", C2:"#d4af5f" };
const LEVEL_LABELS = { A1:"Base Camp", A2:"Forest Trail", B1:"Mountain Ridge", B2:"High Pass", C1:"Summit Approach", C2:"Peak" };
const LEVEL_ICONS  = { A1:"⛺", A2:"🌲", B1:"🏔️", B2:"🦅", C1:"🌠", C2:"🏆" };
const FLAGS = { de:"🇩🇪", es:"🇪🇸", fr:"🇫🇷", it:"🇮🇹", pt:"🇧🇷", ja:"🇯🇵", ko:"🇰🇷", pl:"🇵🇱", zh:"🇨🇳", en:"🇬🇧", ru:"🇷🇺", el:"🇬🇷" };

function getLevelTitle(xp) {
  if (xp < 100)  return "Newcomer";
  if (xp < 300)  return "Explorer";
  if (xp < 700)  return "Hiker";
  if (xp < 1500) return "Climber";
  if (xp < 3000) return "Mountaineer";
  if (xp < 6000) return "Summit Seeker";
  return "Peak Master";
}

// ─── ANIMATED NUMBER ──────────────────────────────────────────────────────────
function AnimNum({ value, dur = 900 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let start = null;
    const go = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(go);
    };
    requestAnimationFrame(go);
  }, [value]);
  return <>{n.toLocaleString()}</>;
}

// ─── LEADERBOARD HELPER ───────────────────────────────────────────────────────
function makeBoard(userId, userXP, displayName) {
  const names = ["SakuraSpeaks","LinguaBolt","TrailBlazer99","MountainFox","WordWanderer","PolyglotPro","FluentFlame","NativePace","VerbViking","SyllableStorm","GrammarGuru","PhrasePhoenix"];
  const avatars = ["🦊","🐺","🦁","🐯","🦋","🐉","🦅","🐬","🦊","🐻","🦁","🐺"];
  const rows = names.map((n, i) => ({
    id: `fake-${i}`, name: n, avatar: avatars[i], isYou: false,
    xp: Math.max(10, Math.round(userXP * (1.8 - i * 0.12) + (Math.sin(i) * 30))),
  }));
  rows.push({ id: userId || "you", name: displayName || "You", avatar: "🧗", isYou: true, xp: userXP });
  return rows.sort((a, b) => b.xp - a.xp).map((r, i) => ({ ...r, rank: i + 1 }));
}

// ─── LANGUAGE PICKER MODAL ───────────────────────────────────────────────────
function LangModal({ curricula, activeLang, progressMap, onPick, onClose }) {
  const langs = Object.entries(curricula || {})
    .filter(([, v]) => v?.language)
    .map(([code, data]) => {
      const allMods = getAllModulesFromCurriculum(data);
      const done = (progressMap?.[code]?.completed || []).length;
      return { code, name: data.language, flag: FLAGS[code] || "🌍", pct: allMods.length ? Math.round(done / allMods.length * 100) : 0, started: done > 0 };
    })
    .sort((a, b) => a.code === activeLang ? -1 : b.code === activeLang ? 1 : b.started - a.started || a.name.localeCompare(b.name));

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:600, background:"rgba(107,61,16,0.35)", backdropFilter:"blur(8px)", display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#fff7ea", borderRadius:"24px 24px 0 0", width:"100%", maxWidth:480, maxHeight:"85vh", overflowY:"auto", padding:"22px 18px 100px", border:`1px solid ${T.borderStrong}`, borderBottom:"none" }}>
        <div style={{ width:36, height:4, background:"rgba(245,165,36,0.25)", borderRadius:999, margin:"0 auto 18px" }} />
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:T.text, marginBottom:14 }}>Choose Language</div>
        {langs.map(l => (
          <button key={l.code} className="pf-lang-item" onClick={() => onPick(l.code)} style={{
            width:"100%", display:"flex", alignItems:"center", gap:14, padding:"12px 14px", borderRadius:14, marginBottom:8,
            background: l.code === activeLang ? `rgba(245,165,36,0.09)` : T.card,
            border:`1px solid ${l.code === activeLang ? T.borderStrong : T.border}`,
            textAlign:"left",
          }}>
            <span style={{ fontSize:26 }}>{l.flag}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{l.name}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{l.pct}% complete</div>
            </div>
            {l.code === activeLang && <span style={{ fontSize:10, fontWeight:700, color:T.path, background:`rgba(245,165,36,0.1)`, padding:"3px 10px", borderRadius:20 }}>Current</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: PROGRESS ────────────────────────────────────────────────────────────
function ProgressTab({ progress, curriculum, langName }) {
  const completed = progress?.completed || [];
  const allMods = getAllModulesFromCurriculum(curriculum);
  const totalDone = completed.filter(id => allMods.some(m => m.id === id)).length;
  const readiness = allMods.length ? Math.round(totalDone / allMods.length * 100) : 0;

  const nextGoal = [
    { label:"Trail Walker", target:10, icon:"🎒" },
    { label:"Camp Builder", target:50, icon:"🏕️" },
    { label:"Mountain Climber", target:100, icon:"⛰️" },
    { label:"Summit Seeker", target:250, icon:"🏔️" },
  ].find(g => totalDone < g.target);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {/* Readiness */}
      <div style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:18, padding:16, boxShadow:"0 2px 12px rgba(245,165,36,0.08)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ fontSize:13, fontWeight:700, color:T.text }}>Readiness · {langName}</span>
          <span style={{ fontSize:15, fontWeight:900, color:T.path }}>{readiness}%</span>
        </div>
        <div style={{ height:7, background:"rgba(245,165,36,0.12)", borderRadius:999, overflow:"hidden", marginBottom:5 }}>
          <div className="pf-bar" style={{ height:"100%", borderRadius:999, background:`linear-gradient(90deg,${T.path},${T.goldLight})`, boxShadow:`0 0 10px rgba(245,165,36,0.3)`, "--tw":`${readiness}%` }} />
        </div>
        <div style={{ fontSize:11, color:T.muted }}>{totalDone} of {allMods.length} lessons</div>
      </div>

      {/* Next goal */}
      {nextGoal && (
        <div style={{ background:`rgba(245,165,36,0.06)`, border:`1px solid ${T.border}`, borderRadius:14, padding:"11px 14px", display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:22 }}>{nextGoal.icon}</span>
          <div>
            <div style={{ fontSize:11, color:T.path, fontWeight:700 }}>Next Achievement</div>
            <div style={{ fontSize:13, color:T.muted, marginTop:2 }}>{nextGoal.label} — {nextGoal.target - totalDone} lessons away</div>
          </div>
        </div>
      )}

      {/* Level breakdown */}
      <div style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:18, padding:16, boxShadow:"0 2px 12px rgba(245,165,36,0.08)" }}>
        <div style={{ fontSize:11, fontWeight:700, color:T.faint, textTransform:"uppercase", letterSpacing:1.5, marginBottom:14 }}>Level Progress</div>
        <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
          {["A1","A2","B1","B2","C1","C2"].map(k => {
            const mods = curriculum[k]?.modules || [];
            if (!mods.length) return null;
            const done = mods.filter(m => completed.includes(m.id)).length;
            const pct = Math.round(done / mods.length * 100);
            const color = LEVEL_COLORS[k];
            return (
              <div key={k}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                  <span style={{ fontSize:15 }}>{LEVEL_ICONS[k]}</span>
                  <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, background:`${color}18`, color, border:`1px solid ${color}30` }}>{k}</span>
                  <span style={{ fontSize:12, color:T.muted, flex:1 }}>{LEVEL_LABELS[k]}</span>
                  <span style={{ fontSize:12, color, fontWeight:700 }}>{done}/{mods.length}</span>
                </div>
                <div style={{ height:5, background:"rgba(245,165,36,0.1)", borderRadius:999, overflow:"hidden" }}>
                  <div className="pf-bar" style={{ height:"100%", borderRadius:999, background:color, boxShadow:`0 0 8px ${color}44`, "--tw":`${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TAB: ACHIEVEMENTS ────────────────────────────────────────────────────────
function AchievementsTab({ userId, progress }) {
  const [filter, setFilter] = useState("all");
  const [openCats, setOpenCats] = useState(new Set(["Milestones","Streaks","XP"]));
  const earnedSet = new Set(getAchievements(userId).map(a => a.id));
  const totalXP = progress?.xp || 0;
  const totalLessons = (progress?.completed || []).length;

  function progOf(a) {
    if (earnedSet.has(a.id)) return null;
    if (a.id.startsWith("xp-")) { const t = parseInt(a.id.split("-")[1]); return { v: Math.min(totalXP, t), max: t }; }
    if (a.id.startsWith("lessons-")) { const t = parseInt(a.id.split("-")[1]); return { v: Math.min(totalLessons, t), max: t }; }
    return null;
  }

  const earned = ACHIEVEMENTS.filter(a => earnedSet.has(a.id)).length;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <span style={{ fontSize:12, color:T.muted, flex:1 }}>{earned}/{ACHIEVEMENTS.length} earned</span>
        {[["all","All"],["earned","✓ Earned"],["locked","🔒 Locked"]].map(([v,l]) => (
          <button key={v} className="pf-tab-btn" onClick={() => setFilter(v)} style={{
            padding:"5px 11px", borderRadius:20, fontSize:11, fontWeight:700,
            background: filter===v ? `rgba(245,165,36,0.12)` : "transparent",
            border:`1px solid ${filter===v ? T.borderStrong : T.border}`,
            color: filter===v ? T.path : T.muted,
          }}>{l}</button>
        ))}
      </div>

      {ACHIEVEMENT_CATEGORY_ORDER.map(cat => {
        const items = ACHIEVEMENTS.filter(a => {
          if (a.category !== cat) return false;
          if (filter === "earned") return earnedSet.has(a.id);
          if (filter === "locked") return !earnedSet.has(a.id);
          return true;
        });
        if (!items.length) return null;
        const isOpen = openCats.has(cat);
        const catEarned = items.filter(a => earnedSet.has(a.id)).length;
        const toggle = () => setOpenCats(s => { const n = new Set(s); n.has(cat) ? n.delete(cat) : n.add(cat); return n; });

        return (
          <div key={cat} style={{ marginBottom:10 }}>
            <button className="pf-tab-btn" onClick={toggle} style={{
              width:"100%", display:"flex", alignItems:"center", gap:8, padding:"10px 13px",
              background:T.card, border:`1px solid ${T.border}`,
              borderRadius:13, color:T.text, textAlign:"left",
            }}>
              <span style={{ fontSize:13, fontWeight:700, flex:1 }}>{cat}</span>
              <span style={{ fontSize:11, color:T.muted }}>{catEarned}/{items.length}</span>
              <span style={{ fontSize:11, color:T.faint, transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▾</span>
            </button>

            {isOpen && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginTop:7 }}>
                {items.map(a => {
                  const e = earnedSet.has(a.id);
                  const p = progOf(a);
                  return (
                    <div key={a.id} className={`pf-achievement-card ${e ? "earned" : ""}`} style={{
                      padding:"12px 11px", borderRadius:15, textAlign:"center",
                      background: e ? `rgba(245,165,36,0.08)` : T.card,
                      border:`1px solid ${e ? T.borderStrong : T.border}`,
                      opacity: e ? 1 : 0.55,
                      boxShadow: e ? `0 0 14px rgba(245,165,36,0.1)` : "none",
                    }}>
                      <div style={{ fontSize:22, marginBottom:5, filter:e?"none":"grayscale(1)" }}>{e ? a.icon : "🔒"}</div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, marginBottom:3, color:e?T.text:T.muted }}>{a.name}</div>
                      <div style={{ fontSize:10, color:T.muted, lineHeight:1.4, marginBottom: p ? 7 : 0 }}>{a.desc}</div>
                      {p && (
                        <div>
                          <div style={{ height:3, background:"rgba(245,165,36,0.12)", borderRadius:999, overflow:"hidden", marginBottom:3 }}>
                            <div style={{ height:"100%", background:T.path, borderRadius:999, width:`${Math.round(p.v/p.max*100)}%`, transition:"width 0.6s" }} />
                          </div>
                          <div style={{ fontSize:9, color:T.faint }}>{p.v}/{p.max}</div>
                        </div>
                      )}
                      {e && <div style={{ marginTop:5, fontSize:9, fontWeight:800, color:T.path }}>✦ EARNED{a.xp ? ` · +${a.xp} XP` : ""}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── TAB: LEADERBOARD ────────────────────────────────────────────────────────
function LeaderboardTab({ userId, userXP, displayName }) {
  const [scope, setScope] = useState("weekly");
  const board = makeBoard(userId, userXP, displayName);
  const me = board.find(r => r.isYou);
  const top3 = board.slice(0, 3);
  const rest = board.slice(3);
  const MEDALS = ["🥇","🥈","🥉"];
  const MBG = ["rgba(212,175,95,0.13)","rgba(192,192,192,0.09)","rgba(180,130,70,0.09)"];
  const MBR = ["rgba(212,175,95,0.38)","rgba(192,192,192,0.28)","rgba(180,130,70,0.28)"];

  return (
    <div>
      {me && (
        <div style={{ background:`rgba(245,165,36,0.08)`, border:`1.5px solid ${T.borderStrong}`, borderRadius:17, padding:"13px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:"50%", background:`linear-gradient(135deg,${T.goldLight},${T.gold})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🧗</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:T.path, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Your Rank</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:21, fontWeight:900, color:T.text, lineHeight:1.1 }}>#{me.rank}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:17, fontWeight:900, color:T.path }}>{me.xp.toLocaleString()} XP</div>
            <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>this week</div>
          </div>
        </div>
      )}

      <div style={{ background:`rgba(245,165,36,0.07)`, border:`1px solid ${T.border}`, borderRadius:11, padding:"8px 13px", marginBottom:14, fontSize:12, color:T.path }}>
        🏆 Top 3 earn a bonus XP multiplier next week
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        {[["weekly","🔥 Weekly"],["global","🌍 Global"]].map(([v,l]) => (
          <button key={v} className="pf-tab-btn" onClick={() => setScope(v)} style={{
            padding:"6px 15px", borderRadius:20, fontSize:11, fontWeight:700,
            background: scope===v ? `rgba(245,165,36,0.12)` : "transparent",
            border:`1px solid ${scope===v ? T.borderStrong : T.border}`,
            color: scope===v ? T.path : T.muted,
          }}>{l}</button>
        ))}
      </div>

      {/* Podium */}
      <div style={{ display:"flex", gap:7, marginBottom:12 }}>
        {top3.map((r, i) => (
          <div key={r.id} style={{
            flex:1, padding:"13px 8px", borderRadius:17, textAlign:"center",
            background: r.isYou ? `rgba(245,165,36,0.1)` : T.card,
            border:`1.5px solid ${r.isYou ? T.borderStrong : T.border}`,
            boxShadow: `0 2px 12px ${r.isYou ? "rgba(245,165,36,0.15)" : "rgba(0,0,0,0.04)"}`,
          }}>
            <div style={{ fontSize:18, marginBottom:3 }}>{MEDALS[i]}</div>
            <div style={{ fontSize:20, marginBottom:5 }}>{r.avatar}</div>
            <div style={{ fontSize:10, fontWeight:700, color:r.isYou?T.path:T.muted, marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.name}</div>
            <div style={{ fontSize:13, fontWeight:900, color:r.isYou?T.path:T.text }}>{r.xp.toLocaleString()}</div>
            <div style={{ fontSize:9, color:T.faint }}>XP</div>
          </div>
        ))}
      </div>

      {/* Rest */}
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {rest.map(r => (
          <div key={r.id} className="pf-lb-row" style={{
            display:"flex", alignItems:"center", gap:12, padding:"9px 13px", borderRadius:13,
            background: r.isYou ? `rgba(245,165,36,0.07)` : T.card,
            border:`1px solid ${r.isYou ? T.borderStrong : T.border}`,
          }}>
            <div style={{ width:22, fontSize:12, fontWeight:700, color:T.faint, textAlign:"center", flexShrink:0 }}>#{r.rank}</div>
            <div style={{ width:30, height:30, borderRadius:"50%", background:`rgba(245,165,36,0.1)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{r.avatar}</div>
            <div style={{ flex:1, fontSize:13, fontWeight:r.isYou?800:600, color:r.isYou?T.path:T.text }}>{r.name}{r.isYou ? " (You)" : ""}</div>
            <div style={{ fontSize:12, fontWeight:800, color:r.isYou?T.path:T.muted }}>{r.xp.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: SETTINGS ───────────────────────────────────────────────────────────
function SettingsTab({ langName, langCode, onChangeLang, onLogout, onUpgrade, isPro }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
      <div style={{ fontSize:10, color:T.faint, textTransform:"uppercase", letterSpacing:1.5, marginBottom:2 }}>Language</div>
      <button className="pf-lang-item pf-tab-btn" onClick={onChangeLang} style={{
        display:"flex", alignItems:"center", gap:12, padding:"13px 15px", borderRadius:15, width:"100%",
        background:T.card, border:`1px solid ${T.border}`, textAlign:"left", color:T.text,
      }}>
        <span style={{ fontSize:24 }}>{FLAGS[langCode] || "🌍"}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700 }}>Change Language</div>
          <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Currently: {langName}</div>
        </div>
        <span style={{ fontSize:12, color:T.faint }}>→</span>
      </button>

      <div style={{ fontSize:10, color:T.faint, textTransform:"uppercase", letterSpacing:1.5, marginBottom:2, marginTop:8 }}>Account</div>

      {!isPro && (
        <button className="pf-tab-btn" onClick={onUpgrade} style={{
          display:"flex", alignItems:"center", gap:12, padding:"13px 15px", borderRadius:15, width:"100%",
          background:`linear-gradient(135deg,rgba(245,165,36,0.1),rgba(245,165,36,0.04))`,
          border:`1px solid ${T.borderStrong}`, cursor:"pointer", textAlign:"left",
        }}>
          <span style={{ fontSize:22 }}>⭐</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:T.path }}>Upgrade to Pro</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Unlimited lessons · +15% XP · No limits</div>
          </div>
          <span style={{ fontSize:12, color:T.path }}>→</span>
        </button>
      )}
      {isPro && (
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 15px", borderRadius:15, background:`rgba(245,165,36,0.07)`, border:`1px solid ${T.border}` }}>
          <span style={{ fontSize:22 }}>👑</span>
          <div><div style={{ fontSize:14, fontWeight:700, color:T.path }}>Pro Member</div><div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Full access enabled</div></div>
        </div>
      )}

      <button className="pf-tab-btn" onClick={onLogout} style={{
        display:"flex", alignItems:"center", gap:12, padding:"13px 15px", borderRadius:15, width:"100%",
        background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", textAlign:"left",
        color:"#dc2626", cursor:"pointer",
      }}>
        <span style={{ fontSize:20 }}>🚪</span>
        <div style={{ fontSize:14, fontWeight:700 }}>Log Out</div>
      </button>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ProfileSummitPage({ user, progress, curriculum, curricula, progressMap, langCode, langName, onChangeLang, onLogout, isPro, trailPoints, onUpgrade }) {
  const [tab, setTab] = useState("progress");
  const [showLangPicker, setShowLangPicker] = useState(false);

  const completed = progress?.completed || [];
  const totalXP = progress?.xp || 0;
  const allMods = getAllModulesFromCurriculum(curriculum);
  const totalDone = completed.filter(id => allMods.some(m => m.id === id)).length;
  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Climber";
  const initials = displayName.slice(0, 2).toUpperCase();
  const earnedCount = getAchievements(user?.id).length;

  const TABS = [
    { id:"progress",     icon:"📊", label:"Progress"  },
    { id:"achievements", icon:"🏅", label:"Badges"    },
    { id:"leaderboard",  icon:"🏆", label:"Ranks"     },
    { id:"settings",     icon:"⚙️",  label:"Settings"  },
  ];

  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:90, background:T.bg, minHeight:"100vh" }}>
      <style>{CSS}</style>
      <div style={{ padding:"18px 18px 0" }}>

        {/* ── HEADER CARD ─────────────────────────────────────────────── */}
        <div style={{
          background:T.panel, backdropFilter:"blur(14px)",
          border:`1px solid ${T.borderStrong}`, borderRadius:22, padding:"19px 17px",
          marginBottom:14, position:"relative", overflow:"hidden",
          boxShadow:"0 4px 24px rgba(245,165,36,0.12)",
        }}>
          <div style={{ position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle, rgba(245,165,36,0.1) 0%, transparent 70%)", pointerEvents:"none" }} />

          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:15 }}>
            <div className="pf-avatar" style={{
              width:58, height:58, borderRadius:"50%",
              background:`linear-gradient(135deg,${T.goldLight},${T.gold})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'Syne',sans-serif", fontSize:21, fontWeight:900, color:"#4a2800", flexShrink:0,
            }}>{initials}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:900, color:T.text, lineHeight:1.1 }}>{displayName}</div>
              <div style={{ fontSize:12, color:T.path, fontWeight:700, marginTop:3 }}>{getLevelTitle(totalXP)}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{user?.email}</div>
            </div>
            {isPro && <div style={{ fontSize:9, fontWeight:800, color:T.path, background:`rgba(245,165,36,0.1)`, border:`1px solid ${T.border}`, padding:"4px 10px", borderRadius:20 }}>PRO</div>}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {[
              { icon:"⚡", v:<AnimNum value={totalXP} />, l:"Total XP" },
              { icon:"📚", v:`${totalDone}/${allMods.length}`, l:"Lessons" },
              { icon:"🎖️", v:`${earnedCount}`, l:"Badges" },
            ].map(({ icon, v, l }) => (
              <div key={l} className="pf-stat-card" style={{
                background:`rgba(245,165,36,0.07)`, border:`1px solid ${T.border}`,
                borderRadius:13, padding:"11px 8px", textAlign:"center",
                boxShadow:"0 2px 8px rgba(245,165,36,0.06)",
              }}>
                <div style={{ fontSize:17, marginBottom:3 }}>{icon}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:900, color:T.path }}>{v}</div>
                <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TAB BAR ─────────────────────────────────────────────────── */}
        <div style={{ display:"flex", gap:5, marginBottom:14, background:T.card, padding:4, borderRadius:15, border:`1px solid ${T.border}` }}>
          {TABS.map(t => (
            <button key={t.id} className="pf-tab-btn" onClick={() => setTab(t.id)} style={{
              flex:1, padding:"8px 3px", borderRadius:12, fontSize:10, fontWeight:800,
              display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              background: tab===t.id ? `rgba(245,165,36,0.14)` : "transparent",
              border:`1px solid ${tab===t.id ? T.borderStrong : "transparent"}`,
              color: tab===t.id ? T.path : T.muted,
              boxShadow: tab===t.id ? `0 0 12px rgba(245,165,36,0.1)` : "none",
            }}>
              <span style={{ fontSize:17 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ─────────────────────────────────────────────── */}
        <div key={tab} className="pf-tab-content">
          {tab === "progress"     && <ProgressTab progress={progress} curriculum={curriculum} langName={langName} />}
          {tab === "achievements" && <AchievementsTab userId={user?.id} progress={progress} />}
          {tab === "leaderboard"  && <LeaderboardTab userId={user?.id} userXP={totalXP} displayName={displayName} />}
          {tab === "settings"     && <SettingsTab langName={langName} langCode={langCode} onChangeLang={() => setShowLangPicker(true)} onLogout={onLogout} onUpgrade={onUpgrade} isPro={isPro} />}
        </div>
      </div>

      {showLangPicker && (
        <LangModal curricula={curricula || {}} activeLang={langCode} progressMap={progressMap || {}}
          onPick={code => { setShowLangPicker(false); onChangeLang?.(code); }}
          onClose={() => setShowLangPicker(false)} />
      )}
    </div>
  );
}
