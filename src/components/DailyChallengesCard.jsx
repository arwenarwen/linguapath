// src/components/DailyChallengesCard.jsx
// Drop this component near the top of LearnJourneyPage, below the streak counter.
//
// Usage:
//   import DailyChallengesCard from "../components/DailyChallengesCard";
//   <DailyChallengesCard userId={user?.id} />

import React from "react";
import { getDailyChallenges, getDailyChallengeProgress } from "../lib/rewards";

export default function DailyChallengesCard({ userId }) {
  const challenges = getDailyChallenges(userId);
  const progress   = getDailyChallengeProgress(userId);
  const completed  = progress.completed || [];
  const bothDone   = challenges.every(c => completed.includes(c.id));

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 18,
      padding: "16px",
      marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: 14, fontWeight: 800, color: "#f0f0f5",
        }}>
          📆 Today's Challenges
        </div>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 1,
          color: bothDone ? "#a3e635" : "rgba(255,255,255,0.3)",
          background: bothDone ? "rgba(163,230,53,0.1)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${bothDone ? "rgba(163,230,53,0.25)" : "rgba(255,255,255,0.08)"}`,
          padding: "3px 10px", borderRadius: 20,
        }}>
          {bothDone ? "✓ COMPLETE" : `${completed.length}/2`}
        </div>
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
        Resets at midnight · +15 XP each · +5 bonus for both
      </div>

      {/* Challenge rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {challenges.map(c => {
          const done = completed.includes(c.id);
          return (
            <div key={c.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 12,
              background: done ? "rgba(163,230,53,0.06)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${done ? "rgba(163,230,53,0.2)" : "rgba(255,255,255,0.07)"}`,
              transition: "background 0.3s, border-color 0.3s",
            }}>
              {/* Checkbox */}
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                background: done ? "#a3e635" : "rgba(255,255,255,0.08)",
                border: `1.5px solid ${done ? "#a3e635" : "rgba(255,255,255,0.2)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}>
                {done && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4L4 7L10 1" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              {/* Text */}
              <span style={{
                flex: 1, fontSize: 13,
                color: done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)",
                textDecoration: done ? "line-through" : "none",
              }}>
                {c.text}
              </span>

              {/* XP pill */}
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: done ? "#a3e635" : "rgba(255,255,255,0.4)",
                background: done ? "rgba(163,230,53,0.1)" : "rgba(255,255,255,0.04)",
                padding: "3px 9px", borderRadius: 20, flexShrink: 0,
              }}>
                {done ? "✓ +15 XP" : "+15 XP"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Full House bonus banner */}
      {bothDone && progress.bonusClaimed && (
        <div style={{
          marginTop: 10, padding: "9px 14px", borderRadius: 12,
          background: "rgba(212,175,95,0.08)",
          border: "1px solid rgba(212,175,95,0.25)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 12, color: "#d4af5f" }}>🎉 Full House — both challenges done!</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#d4af5f" }}>+5 XP</span>
        </div>
      )}
    </div>
  );
}
