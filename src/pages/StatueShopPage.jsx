import { useState } from "react";
import { DE_STATUE_MARKETPLACE } from "../data/deStatueMarketplace";
import { getStoredXP, spendXP } from "../lib/appState";

const T = {
  bg: "linear-gradient(180deg,#fff7ea 0%,#ffe7c2 100%)",
  panel: "rgba(255,255,255,0.85)",
  card: "rgba(255,255,255,0.72)",
  border: "rgba(245,165,36,0.25)",
  borderStrong: "rgba(245,165,36,0.5)",
  path: "#f5a524",
  text: "#4a2800",
  muted: "rgba(107,61,16,0.6)",
  faint: "rgba(107,61,16,0.38)",
};

// Bonus phrase sets cost XP (regular XP, earned from lessons/streaks/AI/achievements)
// Trail Points are kept separate — they gate unit tests instead.
const UNLOCK_COST_XP = 200; // XP per phrase set

function PhraseCard({ item, revealed }) {
  return (
    <div style={{
      background: revealed ? T.panel : "rgba(245,165,36,0.05)",
      border: `1px solid ${revealed ? T.borderStrong : T.border}`,
      borderRadius: 14, padding: "13px 15px", marginBottom: 8,
      filter: revealed ? "none" : "blur(2px) opacity(0.5)",
      transition: "all 0.4s ease",
    }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 4 }}>{item.phrase}</div>
      <div style={{ fontSize: 12, color: T.path, fontWeight: 700, marginBottom: 6 }}>"{item.meaning}"</div>
      <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic", marginBottom: 4 }}>{item.example}</div>
      <div style={{ fontSize: 11, color: T.faint }}>{item.explain}</div>
    </div>
  );
}

function SetCard({ set, xp, onUnlock, unlocked }) {
  const [expanded, setExpanded] = useState(false);
  const canAfford = xp >= UNLOCK_COST_XP;

  return (
    <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: "0 2px 12px rgba(245,165,36,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: unlocked && expanded ? 14 : 0 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{set.title}</div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{set.items.length} phrases</div>
        </div>
        {unlocked ? (
          <button onClick={() => setExpanded(e => !e)} style={{
            background: `rgba(245,165,36,0.12)`, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 700,
            color: T.path, cursor: "pointer", fontFamily: "inherit",
          }}>
            {expanded ? "Hide ▲" : "View ▼"}
          </button>
        ) : (
          <button
            onClick={() => canAfford && onUnlock(set.key)}
            disabled={!canAfford}
            style={{
              background: canAfford ? `linear-gradient(135deg,${T.path},#c9a84c)` : "rgba(245,165,36,0.15)",
              border: "none", borderRadius: 10, padding: "7px 14px",
              fontSize: 12, fontWeight: 800, color: canAfford ? "#fff" : T.muted,
              cursor: canAfford ? "pointer" : "default", fontFamily: "inherit",
            }}>
            🔓 {UNLOCK_COST_XP} XP
          </button>
        )}
      </div>
      {unlocked && expanded && (
        <div>
          {set.items.map((item, i) => <PhraseCard key={i} item={item} revealed={true} />)}
        </div>
      )}
      {!unlocked && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, overflow: "hidden" }}>
          {set.items.slice(0, 2).map((item, i) => (
            <div key={i} style={{
              flex: 1, background: "rgba(245,165,36,0.06)", border: `1px solid ${T.border}`,
              borderRadius: 10, padding: "8px 10px", fontSize: 11, color: T.faint,
              filter: "blur(3px)", userSelect: "none",
            }}>
              {item.phrase}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StatueShopPage({ userId, langCode = "de", onClose }) {
  const [xp, setXp] = useState(() => getStoredXP(userId, langCode));
  const [unlocked, setUnlocked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`lp_statues_${userId || "anon"}`) || "[]"); } catch { return []; }
  });
  const [toast, setToast] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);

  const market = langCode === "de" ? DE_STATUE_MARKETPLACE : null;

  if (!market) {
    const LANG_NAMES = { fr:"French", es:"Spanish", it:"Italian", pt:"Portuguese", ru:"Russian", el:"Greek", zh:"Chinese", ja:"Japanese", ko:"Korean" };
    const langName = LANG_NAMES[langCode] || "this language";
    return (
      <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(107,61,16,0.35)", backdropFilter:"blur(8px)", display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
        <div onClick={e=>e.stopPropagation()} style={{ background:T.bg, borderRadius:"24px 24px 0 0", width:"100%", maxWidth:480, padding:"28px 24px 48px", border:`1px solid ${T.borderStrong}`, borderBottom:"none" }}>
          <div style={{ width:36, height:4, background:"rgba(245,165,36,0.3)", borderRadius:999, margin:"0 auto 20px" }} />
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🗿</div>
            <div style={{ fontSize:18, fontWeight:900, color:T.text, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:8 }}>Bonus Phrases</div>
            <div style={{ fontSize:14, color:T.muted, marginBottom:20, lineHeight:1.5 }}>
              Unlock cultural expressions & insider phrases for {langName} with your Trail Points.<br/><br/>
              <span style={{ color:T.path, fontWeight:700 }}>Coming soon for {langName}!</span> Earn XP by completing lessons, keeping streaks, and chatting with the AI — they'll be ready to spend when the content launches.
            </div>
            <button onClick={onClose} style={{ background:`linear-gradient(135deg,${T.path},#c9a84c)`, border:"none", borderRadius:12, padding:"10px 28px", fontSize:14, fontWeight:800, color:"#fff", cursor:"pointer", fontFamily:"inherit" }}>Got it</button>
          </div>
        </div>
      </div>
    );
  }

  function unlock(setKey) {
    const result = spendXP(userId, langCode, UNLOCK_COST_XP);
    if (!result) { setToast("Not enough XP! Keep doing lessons to earn more."); setTimeout(() => setToast(""), 2500); return; }
    const next = [...unlocked, setKey];
    setUnlocked(next);
    localStorage.setItem(`lp_statues_${userId || "anon"}`, JSON.stringify(next));
    setXp(getStoredXP(userId, langCode));
    setToast("🎉 Phrases unlocked!");
    setTimeout(() => setToast(""), 2500);
  }

  const categories = market.categories;
  const cat = categories[activeCategory];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(107,61,16,0.35)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.bg, borderRadius: 24,
          width: "100%", maxWidth: 700, maxHeight: "90vh",
          display: "flex", flexDirection: "column",
          border: `1px solid ${T.borderStrong}`, overflow: "hidden",
        }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px 14px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
          <div style={{ fontSize: 28 }}>🗿</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: T.text, fontFamily: "'Playfair Display',Georgia,serif" }}>Cultural Phrases</div>
            <div style={{ fontSize: 11, color: T.muted }}>Unlock bonus expressions with XP</div>
          </div>
          <div style={{ background: `rgba(245,165,36,0.1)`, border: `1px solid ${T.border}`, borderRadius: 12, padding: "6px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: T.path }}>⭐ {xp}</div>
            <div style={{ fontSize: 9, color: T.faint, textTransform: "uppercase", letterSpacing: 0.8 }}>XP</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, color: T.muted, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}>✕</button>
        </div>

        {toast && (
          <div style={{ background: `rgba(245,165,36,0.12)`, borderBottom: `1px solid ${T.border}`, padding: "10px 20px", fontSize: 13, fontWeight: 700, color: T.path, textAlign: "center", flexShrink: 0 }}>
            {toast}
          </div>
        )}

        {/* Two-panel body */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* Left: category list */}
          <div style={{ width: 160, flexShrink: 0, borderRight: `1px solid ${T.border}`, overflowY: "auto", padding: "12px 8px" }}>
            {categories.map((c, i) => (
              <button key={c.key} onClick={() => setActiveCategory(i)} style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "10px 12px", borderRadius: 14, marginBottom: 4,
                background: activeCategory === i ? `rgba(245,165,36,0.15)` : "transparent",
                border: `1px solid ${activeCategory === i ? T.borderStrong : "transparent"}`,
                fontSize: 12, fontWeight: 800,
                color: activeCategory === i ? T.path : T.muted,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 16, display: "block", marginBottom: 3 }}>{c.icon}</span>
                {c.title}
              </button>
            ))}
          </div>

          {/* Right: sets in selected category */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase", color: T.path, marginBottom: 12 }}>
              {cat.icon} {cat.title}
            </div>
            {cat.sets.map(set => (
              <SetCard
                key={set.key}
                set={set}
                xp={xp}
                unlocked={unlocked.includes(set.key)}
                onUnlock={unlock}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
