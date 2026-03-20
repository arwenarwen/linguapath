import React, { useEffect, useRef, useState } from "react";
import MascotGuide from "./MascotGuide";

// ─── XP Count-Up Hook ────────────────────────────────────────────────────────
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) { setValue(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

// ─── Star Display ─────────────────────────────────────────────────────────────
function Stars({ count }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "8px 0 4px" }}>
      {[1, 2, 3].map(i => (
        <svg key={i} width="32" height="32" viewBox="0 0 24 24" style={{
          opacity: i <= count ? 1 : 0.2,
          filter: i <= count ? "drop-shadow(0 0 6px #d4af5f88)" : "none",
          transition: `opacity 0.3s ease ${(i - 1) * 120}ms, filter 0.3s ease`,
        }}>
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={i <= count ? "#d4af5f" : "rgba(255,255,255,0.15)"}
            stroke={i <= count ? "#f0cf83" : "rgba(255,255,255,0.1)"}
            strokeWidth="1"
          />
        </svg>
      ))}
    </div>
  );
}

// ─── XP Breakdown Row ────────────────────────────────────────────────────────
function XPRow({ label, amount, delay, gold }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(8px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    }}>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{label}</span>
      <span style={{
        fontSize: 13, fontWeight: 700,
        color: gold ? "#d4af5f" : "#a3e635",
      }}>+{amount} XP</span>
    </div>
  );
}

// ─── Achievement Card ────────────────────────────────────────────────────────
function AchievementCard({ achievement, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 14px", borderRadius: 14,
      background: "rgba(212,175,95,0.10)",
      border: "1px solid rgba(212,175,95,0.35)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.97)",
      transition: "opacity 0.35s ease, transform 0.35s ease",
    }}>
      <span style={{ fontSize: 28, flexShrink: 0 }}>{achievement.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5" }}>{achievement.name}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{achievement.desc}</div>
      </div>
      <div style={{
        fontSize: 9, fontWeight: 800, letterSpacing: 1,
        color: "#d4af5f", background: "rgba(212,175,95,0.12)",
        padding: "4px 8px", borderRadius: 20, flexShrink: 0,
      }}>UNLOCKED</div>
    </div>
  );
}

// ─── Challenge Banner ────────────────────────────────────────────────────────
function ChallengeBanner({ text, xp, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 14px", borderRadius: 12,
      background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(8px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    }}>
      <span style={{ fontSize: 13, color: "#a3e635" }}>📆 {text}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#a3e635" }}>+{xp} XP</span>
    </div>
  );
}

// ─── BREAKDOWN LABELS ────────────────────────────────────────────────────────
const BREAKDOWN_LABELS = {
  base:               "Lesson score",
  streakDailyBonus:   "Streak bonus",
  firstLesson:        "First lesson ever! 🌱",
  fullHouseBonus:     "Full house bonus 🎉",
};
function labelFor(key) {
  if (BREAKDOWN_LABELS[key]) return BREAKDOWN_LABELS[key];
  if (key.startsWith("streakMilestone_"))  return `Streak milestone 🔥`;
  if (key.startsWith("challenge_"))        return "Daily challenge 📆";
  if (key.startsWith("timeMilestone_"))    return "Days milestone ⏳";
  if (key.startsWith("achievement_"))      return "Achievement bonus ✨";
  return key;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
/**
 * Props:
 *   rewardSummary  – returned by calculateRewards() from rewards.js
 *   nextLabel      – button label string
 *   onNext         – callback
 *
 * Falls back gracefully if rewardSummary is not provided (old call sites).
 */
export default function LessonComplete({
  // legacy props (kept for backward compat)
  xp: legacyXP = 25,
  streak: legacyStreak = 0,
  // new props
  rewardSummary = null,
  nextLabel = "Continue Trail",
  onNext = () => {},
}) {
  const totalXP   = rewardSummary?.totalXP ?? legacyXP;
  const streak    = rewardSummary?.streakCount ?? legacyStreak;
  const stars     = rewardSummary?.stars ?? 2;
  const breakdown = rewardSummary?.breakdown ?? { base: legacyXP };
  const achievements = rewardSummary?.newAchievements ?? [];
  const challenges   = rewardSummary?.challengesCompleted ?? [];
  const hasChallengeBonus = breakdown.fullHouseBonus > 0;

  const displayXP = useCountUp(totalXP, 1000);

  // Separate breakdown rows from achievement-bonus rows so they appear cleanly
  const breakdownRows = Object.entries(breakdown).filter(([k]) => !k.startsWith("achievement_"));
  const hasMultipleRows = breakdownRows.length > 1;

  const mascotMsg = stars === 3
    ? "Perfect score! Every step up the mountain counts."
    : stars === 2
    ? "Great work! You're moving steadily up the trail."
    : "You finished the lesson. Every attempt makes you stronger.";

  return (
    <div className="page-frame">
      {/* Header */}
      <div className="hero-card" style={{ marginBottom: 14, textAlign: "center" }}>
        <div className="sunrise-bloom" />
        <span className="mountain-pill">Checkpoint reached</span>
        <Stars count={stars} />
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 900,
          color: "#d4af5f", letterSpacing: -1, margin: "10px 0 4px",
          textShadow: "0 0 30px #d4af5f55",
        }}>
          +{displayXP}
          <span style={{ fontSize: 22, fontWeight: 700, color: "rgba(212,175,95,0.7)" }}> XP</span>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 0 }}>
          🔥 {streak} day streak
        </p>
      </div>

      <MascotGuide message={mascotMsg} />

      {/* XP Breakdown — only show if there's more than just the base */}
      {hasMultipleRows && (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: "14px 16px", marginTop: 14, marginBottom: 12,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
            textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8,
          }}>XP Breakdown</div>
          {breakdownRows.map(([key, amount], i) => (
            <XPRow key={key} label={labelFor(key)} amount={amount} delay={300 + i * 150} gold={key === "base"} />
          ))}
          <div style={{
            display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4,
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>Total</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#d4af5f" }}>+{totalXP} XP</span>
          </div>
        </div>
      )}

      {/* Daily challenge completions */}
      {challenges.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {challenges.map((id, i) => (
            <ChallengeBanner
              key={id}
              text="Daily Challenge Complete!"
              xp={15}
              delay={600 + i * 200}
            />
          ))}
          {hasChallengeBonus && (
            <ChallengeBanner text="Full House — both challenges done!" xp={5} delay={800} />
          )}
        </div>
      )}

      {/* New achievements */}
      {achievements.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
            textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
            marginBottom: 10,
          }}>Achievement{achievements.length > 1 ? "s" : ""} Unlocked</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {achievements.map((a, i) => (
              <AchievementCard key={a.id} achievement={a} delay={500 + i * 200} />
            ))}
          </div>
        </div>
      )}

      <button className="mountain-button" style={{ width: "100%", marginTop: 4 }} onClick={onNext}>
        {nextLabel} →
      </button>
    </div>
  );
}
