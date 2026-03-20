import { useState, useEffect } from "react";

const ITEMS = [
  { id: "learn",      label: "Trail",      icon: "🗺️" },
  { id: "situations", label: "Situations", icon: "🧭" },
  { id: "ai",         label: "AI Tutor",   icon: "🔥" },
  { id: "review",     label: "Review",     icon: "🎒" },
  { id: "profile",    label: "Profile",    icon: "👤" },
];

const CSS = `
  @keyframes nav-bounce { 0%{transform:translateY(0) scale(1)} 30%{transform:translateY(-5px) scale(1.15)} 100%{transform:translateY(0) scale(1)} }
  @keyframes nav-glow-in { from{opacity:0;transform:scaleX(0.4)} to{opacity:1;transform:scaleX(1)} }

  .bn-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2px;
    color: rgba(255,255,255,0.38);
    padding: 8px 4px 6px;
    position: relative;
    transition: color 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .bn-item.active { color: #d4af5f; }
  .bn-item .bn-icon {
    font-size: 21px;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
    will-change: transform;
    line-height: 1;
  }
  .bn-item.active .bn-icon {
    transform: scale(1.22) translateY(-1px);
    filter: drop-shadow(0 0 6px rgba(212,175,95,0.6));
  }
  .bn-item.tapped .bn-icon {
    animation: nav-bounce 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  .bn-indicator {
    position: absolute;
    bottom: 0;
    left: 25%; right: 25%;
    height: 2.5px;
    background: linear-gradient(90deg, #c9a84c, #f0cf83);
    border-radius: 99px 99px 0 0;
    box-shadow: 0 0 8px rgba(212,175,95,0.6);
    animation: nav-glow-in 0.25s ease both;
  }
  .bn-active-bg {
    position: absolute;
    inset: 4px 6px;
    border-radius: 14px;
    background: rgba(212,175,95,0.07);
    pointer-events: none;
    animation: nav-glow-in 0.2s ease both;
  }
`;

export default function BottomNavPro({ activeTab, onChange }) {
  activeTab = activeTab || "learn";
  onChange = onChange || function() {};

  const [tapped, setTapped] = useState(null);

  function handleTap(id) {
    setTapped(id);
    onChange(id);
    setTimeout(() => setTapped(null), 420);
  }

  return (
    <>
      <style>{CSS}</style>
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "stretch",
        // Floating pill shape
        margin: "0 12px 10px",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
        background: "rgba(13,16,22,0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: 26,
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.05) inset",
        overflow: "hidden",
        height: 66,
        left: 12, right: 12,
      }}>
        {ITEMS.map(item => {
          const isActive = activeTab === item.id;
          const isTapped = tapped === item.id;
          return (
            <button
              key={item.id}
              className={`bn-item${isActive ? " active" : ""}${isTapped ? " tapped" : ""}`}
              onClick={() => handleTap(item.id)}
            >
              {isActive && <div className="bn-active-bg" />}
              <span className="bn-icon">{item.icon}</span>
              <span style={{ position:"relative", zIndex:1 }}>{item.label}</span>
              {isActive && <div className="bn-indicator" />}
            </button>
          );
        })}
      </nav>
      {/* Spacer so content isn't hidden behind floating nav */}
      <div style={{ height: "calc(env(safe-area-inset-bottom, 0px) + 80px)", pointerEvents:"none" }} />
    </>
  );
}
