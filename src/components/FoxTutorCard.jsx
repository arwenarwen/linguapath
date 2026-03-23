/**
 * FoxTutorCard — cinematic AI tutor portrait card
 * Shows an animated fox that "talks" when audio is playing.
 * Subscribes to audioPlayer speaking state automatically.
 */

import React, { useState, useEffect } from "react";
import { subscribeSpeaking } from "../lib/audioPlayer";

// ── CSS keyframes injected once ─────────────────────────────────────────────
const FOX_KEYFRAMES = `
@keyframes foxMouth {
  0%   { transform: scaleY(0.25); }
  40%  { transform: scaleY(1.6);  }
  70%  { transform: scaleY(0.5);  }
  100% { transform: scaleY(1.8);  }
}
@keyframes foxBob {
  0%   { transform: translateY(0px) rotate(0deg); }
  50%  { transform: translateY(-5px) rotate(0.4deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
@keyframes foxIdle {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-3px) scale(1.005); }
}
@keyframes foxBlink {
  0%, 92%, 100% { transform: scaleY(1); }
  95%            { transform: scaleY(0.08); }
}
@keyframes waveBar {
  0%, 100% { transform: scaleY(0.3); opacity: 0.5; }
  50%       { transform: scaleY(1);   opacity: 1; }
}
@keyframes foxCardGlow {
  0%, 100% { box-shadow: 0 24px 60px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(249,115,22,0.35), 0 0 30px rgba(249,115,22,0.12); }
  50%       { box-shadow: 0 24px 60px rgba(0,0,0,0.55), 0 0 0 2px   rgba(249,115,22,0.55), 0 0 50px rgba(249,115,22,0.22); }
}
@keyframes bubbleIn {
  from { opacity: 0; transform: scale(0.85) translateY(-6px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}
@keyframes foxCardIdle {
  0%, 100% { box-shadow: 0 20px 50px rgba(0,0,0,0.45), 0 0 0 1.5px rgba(255,255,255,0.07); }
  50%       { box-shadow: 0 24px 60px rgba(0,0,0,0.5),  0 0 0 1.5px rgba(255,255,255,0.10); }
}
`;

let _keyframesInjected = false;
function injectKeyframes() {
  if (_keyframesInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = FOX_KEYFRAMES;
  document.head.appendChild(style);
  _keyframesInjected = true;
}

// ── Fox SVG portrait ─────────────────────────────────────────────────────────
function FoxPortrait({ isSpeaking, size = 180 }) {
  return (
    <svg viewBox="0 0 120 130" width={size} height={size} style={{ display: "block", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}>
      {/* Tail */}
      <ellipse cx="92" cy="100" rx="24" ry="36" fill="#e8730a" transform="rotate(15,92,100)" />
      <ellipse cx="92" cy="100" rx="14" ry="24" fill="#f0a050" transform="rotate(15,92,100)" />
      <ellipse cx="97" cy="118" rx="10" ry="12" fill="#f5f5f0" transform="rotate(15,97,118)" />
      {/* Body */}
      <ellipse cx="54" cy="100" rx="28" ry="26" fill="#e8730a" />
      {/* Head */}
      <ellipse cx="54" cy="65" rx="26" ry="26" fill="#e8730a"
        style={{ animation: isSpeaking ? "foxBob 0.45s ease-in-out infinite" : "foxIdle 3s ease-in-out infinite" }} />
      {/* Ears */}
      <path d="M36 45 L28 22 L52 40 Z" fill="#e8730a" />
      <path d="M72 45 L80 22 L58 40 Z" fill="#e8730a" />
      <path d="M38 43 L32 26 L50 40 Z" fill="#c84a08" />
      <path d="M70 43 L76 26 L60 40 Z" fill="#c84a08" />
      {/* Snout */}
      <ellipse cx="54" cy="74" rx="18" ry="14" fill="#f5f0e8" />
      {/* Eye whites */}
      <ellipse cx="42" cy="62" rx="7" ry="6" fill="#d4a820" />
      <ellipse cx="66" cy="62" rx="7" ry="6" fill="#d4a820" />
      {/* Pupils with blink */}
      <circle cx="42" cy="62" r="4" fill="#1a1a00"
        style={{ transformOrigin: "42px 62px", animation: "foxBlink 4.5s ease-in-out 1s infinite" }} />
      <circle cx="44" cy="60" r="1.5" fill="white" />
      <circle cx="66" cy="62" r="4" fill="#1a1a00"
        style={{ transformOrigin: "66px 62px", animation: "foxBlink 4.5s ease-in-out 1.2s infinite" }} />
      <circle cx="68" cy="60" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="54" cy="71" rx="4" ry="3" fill="#2a1800" />
      {/* MOUTH — animated when speaking */}
      <ellipse cx="54" cy="79" rx="5" ry="2" fill="#1a0800"
        style={{
          transformOrigin: "54px 79px",
          animation: isSpeaking ? "foxMouth 0.22s ease-in-out infinite alternate" : "none",
          transform: isSpeaking ? undefined : "scaleY(0.3)",
        }}
      />
      {/* Cheek blush */}
      <ellipse cx="36" cy="70" rx="6" ry="4" fill="#e06030" opacity="0.25" />
      <ellipse cx="72" cy="70" rx="6" ry="4" fill="#e06030" opacity="0.25" />
      {/* Feet */}
      <ellipse cx="35" cy="120" rx="12" ry="8" fill="#e8730a" />
      <ellipse cx="73" cy="120" rx="12" ry="8" fill="#e8730a" />
    </svg>
  );
}

// ── Sound wave bars ──────────────────────────────────────────────────────────
function SpeakingWave() {
  const heights = [0.45, 0.75, 1, 0.65, 0.9, 0.55, 0.8, 0.4];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 20 }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 4,
          background: "linear-gradient(to top, #f97316, #fb923c)",
          height: `${h * 18}px`,
          animation: `waveBar 0.8s ease-in-out ${i * 0.09}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function FoxTutorCard({ style = {}, size = 180 }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechText, setSpeechText] = useState("");

  useEffect(() => {
    injectKeyframes();
    const unsub = subscribeSpeaking((speaking, text) => {
      setIsSpeaking(speaking);
      if (text) setSpeechText(text);
    });
    return unsub;
  }, []);

  return (
    <div style={{
      position: "relative",
      borderRadius: 22,
      overflow: "visible",
      background: "linear-gradient(160deg, #1c3d2a 0%, #0f2419 55%, #0a1c12 100%)",
      animation: isSpeaking ? "foxCardGlow 1.4s ease-in-out infinite" : "foxCardIdle 4s ease-in-out infinite",
      transition: "transform 0.3s ease",
      transform: isSpeaking ? "scale(1.02)" : "scale(1)",
      ...style,
    }}>
      {/* Dot-grid overlay */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 22,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Orange glow at bottom */}
      <div style={{
        position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)",
        width: size * 1.1, height: 60,
        background: "radial-gradient(ellipse, rgba(249,115,22,0.25) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 1,
        opacity: isSpeaking ? 1 : 0.3,
        transition: "opacity 0.5s ease",
      }} />

      {/* Fox portrait */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", justifyContent: "center", alignItems: "flex-end",
        paddingTop: 18, paddingBottom: 0,
        paddingLeft: 12, paddingRight: 12,
      }}>
        <FoxPortrait isSpeaking={isSpeaking} size={size} />
      </div>

      {/* Bottom bar: badge or wave */}
      <div style={{
        position: "relative", zIndex: 3,
        padding: "6px 14px 12px",
        display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
        minHeight: 34,
      }}>
        {isSpeaking ? (
          <>
            <SpeakingWave />
          </>
        ) : (
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 2.5,
            color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
            fontFamily: "'Nunito', sans-serif",
          }}>
            AI Guide · Fox
          </div>
        )}
      </div>

      {/* Speech bubble — appears when speaking */}
      {speechText && isSpeaking && (
        <div style={{
          position: "absolute", top: 10, right: -8, zIndex: 10,
          background: "white",
          borderRadius: "14px 14px 14px 4px",
          padding: "8px 12px",
          maxWidth: 160,
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
          animation: "bubbleIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
          pointerEvents: "none",
        }}>
          {/* Orange dot */}
          <div style={{
            position: "absolute", top: 10, left: -7,
            width: 8, height: 8, borderRadius: "50%",
            background: "#f97316",
            boxShadow: "0 0 6px #f97316",
          }} />
          <div style={{
            fontSize: 9, fontWeight: 800, color: "#f97316",
            letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3,
            fontFamily: "'Nunito', sans-serif",
          }}>AI Guide</div>
          <div style={{
            fontSize: 12, color: "#1a1a1a", lineHeight: 1.45,
            fontStyle: "italic", fontFamily: "'Nunito', sans-serif",
          }}>
            "{speechText.slice(0, 72)}{speechText.length > 72 ? "…" : ""}"
          </div>
        </div>
      )}
    </div>
  );
}
