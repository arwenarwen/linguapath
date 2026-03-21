import { useState } from "react";
import { DE_STATUE_MARKETPLACE } from "../data/deStatueMarketplace";
import { getTrailPoints, spendTrailPoints } from "../lib/appState";

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

const UNLOCK_COST = 50; // trail points per set

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

function SetCard({ set, tp, onUnlock, unlocked }) {
  const [expanded, setExpanded] = useState(false);
  const canAfford = tp >= UNLOCK_COST;

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
            🔓 {UNLOCK_COST} TP
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
  const [tp, setTp] = useState(() => getTrailPoints(userId));
  const [unlocked, setUnlocked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`lp_statues_${userId || "anon"}`) || "[]"); } catch { return []; }
  });
  const [toast, setToast] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);

  const market = langCode === "de" ? DE_STATUE_MARKETPLACE : null;
  if (!market) return null;

  function unlock(setKey) {
    const result = spendTrailPoints(userId, UNLOCK_COST);
    if (!result) { setToast("Not enough Trail Points!"); setTimeout(() => setToast(""), 2500); return; }
    const next = [...unlocked, setKey];
    setUnlocked(next);
    localStorage.setItem(`lp_statues_${userId || "anon"}`, JSON.stringify(next));
    setTp(getTrailPoints(userId));
    setToast("🎉 Phrases unlocked!");
    setTimeout(() => setToast(""), 2500);
  }

  const categories = market.categories;
  const cat = categories[activeCategory];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(107,61,16,0.35)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.bg, borderRadius: "24px 24px 0 0",
          width: "100%", maxWidth: 480, maxHeight: "88vh", overflowY: "auto",
          padding: "20px 18px 48px", border: `1px solid ${T.borderStrong}`, borderBottom: "none",
        }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: "rgba(245,165,36,0.3)", borderRadius: 999, margin: "0 auto 16px" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ fontSize: 30 }}>🗿</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: T.text, fontFamily: "'Playfair Display',Georgia,serif" }}>
              Cultural Phrases
            </div>
            <div style={{ fontSize: 12, color: T.muted }}>Unlock bonus German expressions with Trail Points</div>
          </div>
          <div style={{ background: `rgba(245,165,36,0.1)`, border: `1px solid ${T.border}`, borderRadius: 12, padding: "6px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: T.path }}>⚡ {tp}</div>
            <div style={{ fontSize: 9, color: T.faint, textTransform: "uppercase", letterSpacing: 0.8 }}>TP</div>
          </div>
        </div>

        {toast && (
          <div style={{ background: `rgba(245,165,36,0.12)`, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 14px", marginBottom: 14, fontSize: 13, fontWeight: 700, color: T.path, textAlign: "center" }}>
            {toast}
          </div>
        )}

        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, WebkitOverflowScrolling: "touch" }}>
          {categories.map((c, i) => (
            <button key={c.key} onClick={() => setActiveCategory(i)} style={{
              flexShrink: 0, padding: "7px 14px", borderRadius: 999,
              background: activeCategory === i ? `rgba(245,165,36,0.15)` : T.card,
              border: `1px solid ${activeCategory === i ? T.borderStrong : T.border}`,
              fontSize: 12, fontWeight: 800, color: activeCategory === i ? T.path : T.muted,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              {c.icon} {c.title}
            </button>
          ))}
        </div>

        {/* Sets in category */}
        {cat.sets.map(set => (
          <SetCard
            key={set.key}
            set={set}
            tp={tp}
            unlocked={unlocked.includes(set.key)}
            onUnlock={unlock}
          />
        ))}
      </div>
    </div>
  );
}
