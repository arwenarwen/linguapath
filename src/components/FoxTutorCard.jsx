/**
 * FoxTutorCard — cinematic AI tutor card.
 * Accepts any animal video via the `src` prop.
 * Defaults to the fox for free chat / tutor modes.
 * Exam mode passes the CEFR-level animal (rabbit/owl/fox etc).
 */

import React, { useState, useEffect } from "react";
import { subscribeSpeaking } from "../lib/audioPlayer";

// ── Animal video map — keyed by CEFR level & mode ────────────────────────────
export const ANIMAL_VIDEOS = {
  fox:      "/images/animals/fox.mp4",
  rabbit:   "/images/animals/rabbit.mp4",
  owl:      "/images/animals/owl.mp4",
  squirrel: "/images/animals/fox.mp4",  // placeholder until squirrel uploaded
  wolf:     "/images/animals/fox.mp4",  // placeholder until wolf uploaded
  lion:     "/images/animals/fox.mp4",  // placeholder until lion uploaded
};

export const CEFR_ANIMAL = {
  A1: "rabbit",
  A2: "squirrel",
  B1: "owl",
  B2: "wolf",
  C1: "lion",
  C2: "fox",
};

export const DEFAULT_VIDEO = ANIMAL_VIDEOS.fox;

// ── CSS keyframes ────────────────────────────────────────────────────────────
const KEYFRAMES = `
@keyframes foxSpeakBob {
  0%   { transform: scale(1.03) translateY(0px);    }
  50%  { transform: scale(1.03) translateY(-7px);   }
  100% { transform: scale(1.03) translateY(0px);    }
}
@keyframes foxIdleBreath {
  0%, 100% { transform: scale(1.03) translateY(0px);  }
  50%       { transform: scale(1.03) translateY(-4px); }
}
@keyframes foxMouthPulse {
  0%   { height: 4px;  opacity: 0.18; }
  50%  { height: 14px; opacity: 0.38; }
  100% { height: 4px;  opacity: 0.18; }
}
@keyframes foxWave {
  0%, 100% { transform: scaleY(0.25); opacity: 0.45; }
  50%       { transform: scaleY(1);   opacity: 1;    }
}
@keyframes foxBorderGlow {
  0%, 100% { opacity: 0.55; }
  50%       { opacity: 1;   }
}
@keyframes foxBubbleIn {
  from { opacity: 0; transform: scale(0.82) translateY(-8px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
}
@keyframes foxOrangeDot {
  0%, 100% { transform: scale(1);    box-shadow: 0 0 5px #f97316; }
  50%       { transform: scale(1.25); box-shadow: 0 0 12px #f97316; }
}
`;

let _kfInjected = false;
function injectKF() {
  if (_kfInjected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.textContent = KEYFRAMES;
  document.head.appendChild(s);
  _kfInjected = true;
}

// ── Sound wave bars ──────────────────────────────────────────────────────────
function SpeakingWave() {
  const bars = [0.35, 0.70, 0.95, 0.55, 1, 0.60, 0.80, 0.40, 0.70, 0.45];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 24 }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          width: 3.5, borderRadius: 5,
          background: "linear-gradient(to top, #f97316, #fdba74)",
          height: `${h * 22}px`,
          animation: `foxWave 0.9s ease-in-out ${(i * 0.08).toFixed(2)}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Compact version (tiny avatar in header / message bubbles) ────────────────
function CompactFox({ size, style, isSpeaking, src }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: 10, overflow: "hidden",
      position: "relative", flexShrink: 0,
      boxShadow: isSpeaking
        ? "0 0 0 2px #f97316, 0 0 12px rgba(249,115,22,0.5)"
        : "0 2px 8px rgba(0,0,0,0.3)",
      transition: "box-shadow 0.3s ease",
      ...style,
    }}>
      <video
        src={src}
        autoPlay loop muted playsInline
        style={{
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 15%",
          animation: isSpeaking
            ? "foxSpeakBob 0.5s ease-in-out infinite"
            : "foxIdleBreath 4s ease-in-out infinite",
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(0,0,0,0.35) 100%)",
        pointerEvents: "none",
      }} />
      {isSpeaking && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 10,
          boxShadow: "inset 0 0 10px rgba(249,115,22,0.35)",
          pointerEvents: "none",
          animation: "foxBorderGlow 1.2s ease-in-out infinite",
        }} />
      )}
    </div>
  );
}

// ── Full cinematic panel ─────────────────────────────────────────────────────
export default function FoxTutorCard({ style = {}, size = 220, compact = false, src }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const videoSrc = src || DEFAULT_VIDEO;

  useEffect(() => {
    injectKF();
    return subscribeSpeaking((on, text) => {
      setIsSpeaking(on);
      if (text) setSpeechText(text);
    });
  }, []);

  if (compact) {
    return <CompactFox size={size} style={style} isSpeaking={isSpeaking} src={videoSrc} />;
  }

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      overflow: "hidden", background: "#081510", ...style,
    }}>
      {/* ── Animal video — loops continuously ── */}
      <video
        key={videoSrc}
        src={videoSrc}
        autoPlay loop muted playsInline
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 10%",
          animation: isSpeaking
            ? "foxSpeakBob 0.52s ease-in-out infinite"
            : "foxIdleBreath 4.5s ease-in-out infinite",
        }}
      />

      {/* ── Vignette ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 38%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.52) 100%)",
        pointerEvents: "none",
      }} />

      {/* ── Bottom gradient ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "38%",
        background: "linear-gradient(to top, rgba(8,21,16,0.96) 0%, rgba(8,21,16,0.5) 55%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* ── Mouth pulse overlay ── */}
      {isSpeaking && (
        <div style={{
          position: "absolute", top: "66%", left: "50%",
          transform: "translateX(-50%)", width: 36, borderRadius: 12,
          background: "rgba(0,0,0,0.42)",
          animation: "foxMouthPulse 0.22s ease-in-out infinite",
        }} />
      )}

      {/* ── Speaking glow border ── */}
      <div style={{
        position: "absolute", inset: 0,
        boxShadow: isSpeaking
          ? "inset 0 0 0 2.5px rgba(249,115,22,0.65), inset 0 0 40px rgba(249,115,22,0.18)"
          : "inset 0 0 0 1px rgba(255,255,255,0.06)",
        pointerEvents: "none",
        transition: "box-shadow 0.4s ease",
        animation: isSpeaking ? "foxBorderGlow 1.3s ease-in-out infinite" : undefined,
      }} />

      {/* ── Wave bar ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "10px 16px 14px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        zIndex: 3,
      }}>
        {isSpeaking && <SpeakingWave />}
      </div>

      {/* ── Speech bubble ── */}
      {speechText && isSpeaking && (
        <div style={{
          position: "absolute", top: 14, right: 14, zIndex: 10,
          background: "rgba(255,255,255,0.97)",
          borderRadius: "14px 14px 14px 4px",
          padding: "10px 14px", maxWidth: 170,
          boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
          animation: "foxBubbleIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
          backdropFilter: "blur(8px)", pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", top: 12, left: -9,
            width: 10, height: 10, borderRadius: "50%",
            background: "#f97316",
            animation: "foxOrangeDot 1.4s ease-in-out infinite",
          }} />
          <div style={{
            fontSize: 9, fontWeight: 800, color: "#f97316",
            letterSpacing: 1.5, textTransform: "uppercase",
            marginBottom: 4, fontFamily: "'Nunito', sans-serif",
          }}>AI Guide</div>
          <div style={{
            fontSize: 12.5, color: "#1a1a1a",
            lineHeight: 1.45, fontStyle: "italic",
            fontFamily: "'Nunito', sans-serif",
          }}>
            "{speechText.slice(0, 75)}{speechText.length > 75 ? "…" : ""}"
          </div>
        </div>
      )}
    </div>
  );
}
