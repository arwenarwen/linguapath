/**
 * WeeklyFoxReward
 * Shown once per ISO week when the user opens the app.
 * Celebrates their week, shows stats, awards bonus XP.
 */
import React, { useState, useEffect } from "react";
import { getWeekKey, claimWeeklyReward } from "../lib/appState";

const KF = `
@keyframes wfr-bounce {
  0%,100% { transform: translateY(0) rotate(0deg) scale(1); }
  30%      { transform: translateY(-18px) rotate(-8deg) scale(1.08); }
  60%      { transform: translateY(-8px)  rotate(6deg)  scale(1.04); }
}
@keyframes wfr-glow {
  0%,100% { filter: drop-shadow(0 0 12px rgba(245,165,36,0.45)); }
  50%     { filter: drop-shadow(0 0 32px rgba(245,165,36,0.9)) drop-shadow(0 0 60px rgba(245,165,36,0.3)); }
}
@keyframes wfr-slide {
  from { transform: translateY(110%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes wfr-pop {
  0%   { transform: scale(0.6); opacity: 0; }
  70%  { transform: scale(1.12); opacity: 1; }
  100% { transform: scale(1);   opacity: 1; }
}
@keyframes wfr-float {
  0%,100% { transform: translateY(0) rotate(0deg)  scale(1);    opacity: 1; }
  100%    { transform: translateY(-90px) rotate(20deg) scale(0.6); opacity: 0; }
}
@keyframes wfr-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
`;

const EMOJIS = ["⭐","🌟","✨","🦊","🎉","💫","🏔️","🔥","⚡","🎊"];

function Particle({ emoji, x, delay }) {
  return (
    <div style={{
      position: "absolute",
      left: `${x}%`,
      bottom: "55%",
      fontSize: 22,
      animation: `wfr-float 1.4s ease-out ${delay}s forwards`,
      pointerEvents: "none",
      zIndex: 10,
    }}>{emoji}</div>
  );
}

function StatPill({ icon, label, value, highlight }) {
  return (
    <div style={{
      flex: 1, textAlign: "center",
      background: highlight ? "rgba(245,165,36,0.15)" : "rgba(255,255,255,0.05)",
      border: `1px solid ${highlight ? "rgba(245,165,36,0.45)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 18, padding: "14px 8px",
      transition: "all 0.3s",
    }}>
      <div style={{ fontSize: 26, marginBottom: 5 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 900, color: highlight ? "#f5a524" : "#fff" }}>{value}</div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.9, marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function WeeklyFoxReward({ userId, weeklyXP = 0, streak = 0, lessonsThisWeek = 0, bonusXP, onClaim }) {
  const [claimed, setClaimed] = useState(false);
  const [particles, setParticles] = useState([]);

  // auto-calculate bonus XP based on effort
  const reward = bonusXP ?? Math.min(150, 25 + streak * 3 + lessonsThisWeek * 5);
  const weekLabel = getWeekKey().replace("-W", " · Week ");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = KF;
    document.head.appendChild(style);
    return () => { try { document.head.removeChild(style); } catch {} };
  }, []);

  function handleClaim() {
    if (claimed) return;
    setClaimed(true);
    claimWeeklyReward(userId);
    // burst particles
    setParticles(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        emoji: EMOJIS[i % EMOJIS.length],
        x: 5 + (i / 13) * 90,
        delay: (i * 0.07),
      }))
    );
    setTimeout(() => onClaim?.(reward), 1000);
  }

  const streakIcon = streak >= 30 ? "🌟" : streak >= 14 ? "🔥" : streak >= 7 ? "⚡" : "📅";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 700,
      background: "rgba(0,0,0,0.82)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <style>{KF}</style>
      <div style={{
        width: "100%", maxWidth: 480,
        background: "linear-gradient(170deg, #180800 0%, #2a1100 50%, #1a0c00 100%)",
        border: "1.5px solid rgba(245,165,36,0.3)",
        borderBottom: "none",
        borderRadius: "28px 28px 0 0",
        padding: "36px 24px 52px",
        animation: "wfr-slide 0.45s cubic-bezier(0.34,1.56,0.64,1)",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Background ring glow */}
        <div style={{
          position: "absolute", top: -80, left: "50%",
          transform: "translateX(-50%)",
          width: 260, height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,165,36,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Particles */}
        {particles.map(p => <Particle key={p.id} {...p} />)}

        {/* Fox */}
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <div style={{
            fontSize: 80,
            display: "inline-block",
            animation: claimed ? "wfr-pop 0.5s ease-out" : "wfr-bounce 2s ease-in-out infinite, wfr-glow 2.5s ease-in-out infinite",
            lineHeight: 1,
          }}>🦊</div>
        </div>

        {/* Week label */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{
            display: "inline-block",
            fontSize: 11, fontWeight: 900, letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(245,165,36,0.65)",
            border: "1px solid rgba(245,165,36,0.2)",
            borderRadius: 999, padding: "4px 14px", marginBottom: 10,
          }}>{weekLabel}</div>

          <div style={{
            fontSize: 28, fontWeight: 900, color: "#fff",
            fontFamily: "'Playfair Display', Georgia, serif",
            lineHeight: 1.2, marginBottom: 8,
            animation: claimed ? "wfr-pop 0.4s ease-out" : "none",
          }}>
            {claimed ? "You're on fire! 🔥" : "Your weekly reward is ready!"}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            {claimed
              ? "The fox is proud. Keep climbing the mountain this week 🏔️"
              : "Your fox guide has been watching your progress all week"}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <StatPill icon="⭐" label="XP this week" value={weeklyXP} highlight={weeklyXP > 0} />
          <StatPill icon={streakIcon} label="Day streak" value={streak} highlight={streak >= 7} />
          <StatPill icon="📖" label="Lessons" value={lessonsThisWeek} highlight={lessonsThisWeek >= 5} />
        </div>

        {/* Reward card */}
        <div style={{
          background: claimed
            ? "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))"
            : "linear-gradient(135deg, rgba(245,165,36,0.18), rgba(245,165,36,0.06))",
          border: `1.5px solid ${claimed ? "rgba(34,197,94,0.4)" : "rgba(245,165,36,0.45)"}`,
          borderRadius: 20, padding: "18px 20px",
          display: "flex", alignItems: "center", gap: 16,
          marginBottom: 22,
          transition: "all 0.5s ease",
        }}>
          <div style={{
            fontSize: 44,
            animation: claimed ? "wfr-spin 0.6s ease-out" : "none",
            lineHeight: 1,
          }}>{claimed ? "✅" : "🎁"}</div>
          <div>
            <div style={{
              fontSize: 20, fontWeight: 900,
              color: claimed ? "#22c55e" : "#f5a524",
              marginBottom: 4,
            }}>
              {claimed ? `+${reward} XP added!` : `+${reward} Bonus XP`}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
              {claimed
                ? "It's already on your leaderboard 🏆"
                : streak >= 7
                  ? `Streak bonus: ${streak} days × 🔥`
                  : "Rewarded for showing up this week"}
            </div>
          </div>
        </div>

        {/* CTA */}
        {!claimed ? (
          <button
            onClick={handleClaim}
            onMouseDown={e => { e.currentTarget.style.transform = "scale(0.96)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
            style={{
              width: "100%", padding: "18px 0",
              background: "linear-gradient(135deg, #f5a524 0%, #d4880a 100%)",
              border: "none", borderRadius: 20,
              fontSize: 17, fontWeight: 900, color: "#fff",
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 6px 28px rgba(245,165,36,0.45)",
              transition: "transform 0.1s",
              letterSpacing: 0.3,
            }}>
            Claim Your Reward 🦊
          </button>
        ) : (
          <div style={{
            textAlign: "center", fontSize: 14,
            color: "rgba(255,255,255,0.35)",
            padding: "12px 0",
            animation: "wfr-pop 0.4s ease-out",
          }}>
            Closing in a moment…
          </div>
        )}
      </div>
    </div>
  );
}
