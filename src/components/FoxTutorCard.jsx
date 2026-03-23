/**
 * FoxTutorCard — cinematic AI tutor card
 * Realistic SVG fox portrait with speaking mouth animation.
 * Auto-subscribes to audioPlayer speaking state.
 */

import React, { useState, useEffect } from "react";
import { subscribeSpeaking } from "../lib/audioPlayer";

// ── Inject CSS keyframes once ────────────────────────────────────────────────
const KEYFRAMES = `
@keyframes foxMouth {
  0%   { transform: scaleY(0.2);  }
  35%  { transform: scaleY(1.8);  }
  65%  { transform: scaleY(0.6);  }
  100% { transform: scaleY(2.2);  }
}
@keyframes foxBobSpeak {
  0%   { transform: translateY(0px)   rotate(0deg);    }
  50%  { transform: translateY(-6px)  rotate(0.5deg);  }
  100% { transform: translateY(0px)   rotate(0deg);    }
}
@keyframes foxBreath {
  0%, 100% { transform: translateY(0px)  scale(1);      }
  50%       { transform: translateY(-4px) scale(1.008);  }
}
@keyframes foxBlink {
  0%, 88%, 100% { transform: scaleY(0);   }
  93%            { transform: scaleY(1.1); }
}
@keyframes foxWave {
  0%, 100% { transform: scaleY(0.25); opacity: 0.45; }
  50%       { transform: scaleY(1);   opacity: 1;    }
}
@keyframes foxCardGlow {
  0%, 100% { box-shadow: 0 28px 70px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(232,115,10,0.38), 0 0 35px rgba(232,115,10,0.14); }
  50%       { box-shadow: 0 28px 70px rgba(0,0,0,0.6), 0 0 0 2.5px rgba(232,115,10,0.60), 0 0 60px rgba(232,115,10,0.28); }
}
@keyframes foxCardIdle {
  0%, 100% { box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(255,255,255,0.07); }
  50%       { box-shadow: 0 24px 60px rgba(0,0,0,0.55),0 0 0 1.5px rgba(255,255,255,0.11); }
}
@keyframes bubbleIn {
  from { opacity: 0; transform: scale(0.82) translateY(-8px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
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

// ── Realistic SVG fox portrait ───────────────────────────────────────────────
function FoxPortrait({ isSpeaking, width = 260 }) {
  const h = width * (300 / 260);
  const anim = isSpeaking
    ? "foxBobSpeak 0.48s ease-in-out infinite"
    : "foxBreath 3.8s ease-in-out infinite";

  return (
    <svg
      viewBox="0 0 260 300"
      width={width}
      height={h}
      style={{ display: "block", filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.7))", animation: anim }}
    >
      <defs>
        {/* Head — warm orange, bright center, dark rim for 3-D look */}
        <radialGradient id="ftHead" cx="40%" cy="35%" r="58%">
          <stop offset="0%"   stopColor="#F89438" />
          <stop offset="40%"  stopColor="#D96C1A" />
          <stop offset="78%"  stopColor="#A84408" />
          <stop offset="100%" stopColor="#7A3005" />
        </radialGradient>

        {/* Chest / snout — warm cream */}
        <radialGradient id="ftChest" cx="50%" cy="18%" r="68%">
          <stop offset="0%"   stopColor="#FAF0D8" />
          <stop offset="55%"  stopColor="#EDD9A5" />
          <stop offset="100%" stopColor="#D8C08A" />
        </radialGradient>

        {/* Amber eye iris */}
        <radialGradient id="ftEye" cx="28%" cy="28%" r="68%">
          <stop offset="0%"   stopColor="#F5B828" />
          <stop offset="38%"  stopColor="#CC8410" />
          <stop offset="72%"  stopColor="#926010" />
          <stop offset="100%" stopColor="#5A3808" />
        </radialGradient>

        {/* Body / shoulders */}
        <radialGradient id="ftBody" cx="42%" cy="18%" r="72%">
          <stop offset="0%"   stopColor="#DC7020" />
          <stop offset="55%"  stopColor="#AE4810" />
          <stop offset="100%" stopColor="#6C2808" />
        </radialGradient>

        {/* Ear inner pink */}
        <radialGradient id="ftEarIn" cx="50%" cy="65%" r="60%">
          <stop offset="0%"   stopColor="#E88070" />
          <stop offset="100%" stopColor="#C04838" />
        </radialGradient>

        {/* Vignette — darkens edges of head for depth */}
        <radialGradient id="ftVig" cx="50%" cy="50%" r="53%">
          <stop offset="48%" stopColor="rgba(0,0,0,0)"   />
          <stop offset="100%" stopColor="rgba(0,0,0,0.42)" />
        </radialGradient>

        {/* Fur edge turbulence */}
        <filter id="ftFur" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.68 0.88" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.8"
            xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Softer shadow under chin */}
        <filter id="ftShadow">
          <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor="#200800" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* ── Shoulders / body ── */}
      <ellipse cx="130" cy="285" rx="98" ry="52" fill="url(#ftBody)" filter="url(#ftFur)" />

      {/* ── Chest white fluff ── */}
      <ellipse cx="130" cy="252" rx="60" ry="68" fill="url(#ftChest)" filter="url(#ftFur)" />

      {/* ── Neck ── */}
      <path
        d="M 88 195 Q 130 172 172 195 Q 160 232 130 242 Q 100 232 88 195 Z"
        fill="url(#ftHead)" filter="url(#ftFur)"
      />

      {/* ── Cheek fluff (wider than head, characteristic fox) ── */}
      <ellipse cx="60" cy="158" rx="34" ry="28" fill="url(#ftHead)" filter="url(#ftFur)" opacity="0.88" />
      <ellipse cx="200" cy="158" rx="34" ry="28" fill="url(#ftHead)" filter="url(#ftFur)" opacity="0.88" />

      {/* ── Ears ── */}
      {/* Left ear outer */}
      <path d="M 70 102 L 40 28 L 104 72 Z" fill="#C05815" filter="url(#ftFur)" />
      {/* Left ear inner */}
      <path d="M 74 100 L 50 36 L 100 70 Z" fill="url(#ftEarIn)" />
      {/* Left ear dark edge */}
      <path d="M 70 102 L 40 28 L 46 31 L 73 97 Z" fill="#6A2808" opacity="0.55" />

      {/* Right ear outer */}
      <path d="M 190 102 L 220 28 L 156 72 Z" fill="#C05815" filter="url(#ftFur)" />
      {/* Right ear inner */}
      <path d="M 186 100 L 210 36 L 160 70 Z" fill="url(#ftEarIn)" />
      {/* Right ear dark edge */}
      <path d="M 190 102 L 220 28 L 214 31 L 187 97 Z" fill="#6A2808" opacity="0.55" />

      {/* ── Head main ── */}
      <ellipse cx="130" cy="136" rx="74" ry="70" fill="url(#ftHead)" filter="url(#ftFur)" />

      {/* ── Head vignette overlay (depth) ── */}
      <ellipse cx="130" cy="136" rx="74" ry="70" fill="url(#ftVig)" />

      {/* ── Forehead dark centre stripe ── */}
      <path
        d="M 120 78 Q 130 72 140 78 Q 135 105 130 110 Q 125 105 120 78 Z"
        fill="#8A3808" opacity="0.28"
      />

      {/* ── Snout area (cream oval) ── */}
      <ellipse cx="130" cy="164" rx="42" ry="30" fill="url(#ftChest)" filter="url(#ftFur)" />

      {/* ── Dark muzzle marks either side of snout ── */}
      <path d="M 90 136 Q 98 126 108 138 Q 104 152 95 158 Q 87 150 90 136 Z"
        fill="#3E1A08" opacity="0.52" />
      <path d="M 170 136 Q 162 126 152 138 Q 156 152 165 158 Q 173 150 170 136 Z"
        fill="#3E1A08" opacity="0.52" />

      {/* ── Nose ── */}
      <ellipse cx="130" cy="158" rx="11" ry="8.5" fill="#180600" />
      <ellipse cx="127" cy="155" rx="3.2" ry="2.5" fill="rgba(255,255,255,0.38)" />

      {/* ── Philtrum (line from nose to mouth) ── */}
      <line x1="130" y1="167" x2="130" y2="175" stroke="#1E0800" strokeWidth="1.8" opacity="0.6" />

      {/* ── MOUTH — animated when speaking ── */}
      <ellipse
        cx="130" cy="178" rx="8" ry="3"
        fill="#1E0800"
        style={{
          transformOrigin: "130px 178px",
          animation: isSpeaking ? "foxMouth 0.21s ease-in-out infinite alternate" : "none",
          transform: isSpeaking ? undefined : "scaleY(0.3)",
        }}
      />
      {/* Mouth corner dots */}
      <circle cx="122" cy="177" r="1.8" fill="#1E0800" opacity="0.6" />
      <circle cx="138" cy="177" r="1.8" fill="#1E0800" opacity="0.6" />

      {/* ── LEFT EYE ── */}
      {/* Socket shadow */}
      <ellipse cx="95" cy="130" rx="20" ry="17" fill="#1E0A00" opacity="0.38" />
      {/* Sclera */}
      <ellipse cx="95" cy="130" rx="16" ry="13.5" fill="#0C0600" />
      {/* Iris */}
      <ellipse cx="95" cy="130" rx="13.5" ry="11.5" fill="url(#ftEye)" />
      {/* Pupil */}
      <ellipse cx="95" cy="130" rx="7" ry="6.5" fill="#050300" />
      {/* Main catchlight */}
      <circle cx="101" cy="124" r="4.5" fill="rgba(255,255,255,0.93)" />
      {/* Secondary small catchlight */}
      <circle cx="90" cy="136" r="2"   fill="rgba(255,255,255,0.42)" />
      {/* Iris rim glow */}
      <ellipse cx="95" cy="130" rx="13.5" ry="11.5" fill="none"
        stroke="#F0A820" strokeWidth="0.8" opacity="0.35" />
      {/* Eyelid for blink */}
      <ellipse cx="95" cy="122" rx="16.5" ry="14" fill="#C85A14"
        style={{ transformOrigin: "95px 118px", animation: "foxBlink 5.5s ease-in-out 0.4s infinite", transform: "scaleY(0)" }}
      />

      {/* ── RIGHT EYE ── */}
      <ellipse cx="165" cy="130" rx="20" ry="17" fill="#1E0A00" opacity="0.38" />
      <ellipse cx="165" cy="130" rx="16" ry="13.5" fill="#0C0600" />
      <ellipse cx="165" cy="130" rx="13.5" ry="11.5" fill="url(#ftEye)" />
      <ellipse cx="165" cy="130" rx="7"   ry="6.5"  fill="#050300" />
      <circle cx="171" cy="124" r="4.5"  fill="rgba(255,255,255,0.93)" />
      <circle cx="160" cy="136" r="2"    fill="rgba(255,255,255,0.42)" />
      <ellipse cx="165" cy="130" rx="13.5" ry="11.5" fill="none"
        stroke="#F0A820" strokeWidth="0.8" opacity="0.35" />
      <ellipse cx="165" cy="122" rx="16.5" ry="14" fill="#C85A14"
        style={{ transformOrigin: "165px 118px", animation: "foxBlink 5.5s ease-in-out 0.85s infinite", transform: "scaleY(0)" }}
      />

      {/* ── Subtle brow lines ── */}
      <path d="M 82 117 Q 95 112 108 117" fill="none" stroke="#7A3008" strokeWidth="2.2" opacity="0.38" />
      <path d="M 152 117 Q 165 112 178 117" fill="none" stroke="#7A3008" strokeWidth="2.2" opacity="0.38" />

      {/* ── Cheek fur texture lines ── */}
      <path d="M 54 145 Q 63 142 70 147" fill="none" stroke="#CC5C10" strokeWidth="1.8" opacity="0.38" />
      <path d="M 50 153 Q 60 150 68 156" fill="none" stroke="#CC5C10" strokeWidth="1.6" opacity="0.32" />
      <path d="M 53 161 Q 63 158 70 163" fill="none" stroke="#CC5C10" strokeWidth="1.5" opacity="0.28" />
      <path d="M 206 145 Q 197 142 190 147" fill="none" stroke="#CC5C10" strokeWidth="1.8" opacity="0.38" />
      <path d="M 210 153 Q 200 150 192 156" fill="none" stroke="#CC5C10" strokeWidth="1.6" opacity="0.32" />
      <path d="M 207 161 Q 197 158 190 163" fill="none" stroke="#CC5C10" strokeWidth="1.5" opacity="0.28" />

      {/* ── Forehead fur lines ── */}
      <path d="M 115 88 Q 120 84 126 88" fill="none" stroke="#8A3808" strokeWidth="1.2" opacity="0.28" />
      <path d="M 134 88 Q 140 84 145 88" fill="none" stroke="#8A3808" strokeWidth="1.2" opacity="0.28" />
      <path d="M 118 96 Q 124 93 130 96" fill="none" stroke="#8A3808" strokeWidth="1" opacity="0.22" />
    </svg>
  );
}

// ── Sound wave bars ──────────────────────────────────────────────────────────
function SpeakingWave() {
  const bars = [0.38, 0.72, 1, 0.58, 0.88, 0.50, 0.78, 0.42, 0.65];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3.5, height: 22 }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          width: 3.5, borderRadius: 5,
          background: "linear-gradient(to top, #f97316, #fb923c)",
          height: `${h * 20}px`,
          animation: `foxWave 0.85s ease-in-out ${(i * 0.09).toFixed(2)}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function FoxTutorCard({ style = {}, size = 220, compact = false }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechText, setSpeechText] = useState("");

  useEffect(() => {
    injectKF();
    return subscribeSpeaking((on, text) => {
      setIsSpeaking(on);
      if (text) setSpeechText(text);
    });
  }, []);

  if (compact) {
    // Tiny header / bubble avatar version
    return (
      <div style={{
        borderRadius: 12,
        overflow: "hidden",
        background: "linear-gradient(160deg, #1c3d2a 0%, #0a1c12 100%)",
        animation: isSpeaking ? "foxCardGlow 1.4s ease-in-out infinite" : "foxCardIdle 4s ease-in-out infinite",
        transition: "transform 0.3s ease",
        transform: isSpeaking ? "scale(1.04)" : "scale(1)",
        ...style,
      }}>
        <FoxPortrait isSpeaking={isSpeaking} width={size} />
      </div>
    );
  }

  return (
    <div style={{
      position: "relative",
      borderRadius: 24,
      overflow: "visible",
      background: "linear-gradient(160deg, #1c3d2a 0%, #0f2419 55%, #0a1c12 100%)",
      animation: isSpeaking ? "foxCardGlow 1.4s ease-in-out infinite" : "foxCardIdle 4s ease-in-out infinite",
      transition: "transform 0.35s ease",
      transform: isSpeaking ? "scale(1.015)" : "scale(1)",
      ...style,
    }}>
      {/* Dot grid overlay */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 24,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Orange ground glow */}
      <div style={{
        position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%)",
        width: size * 1.15, height: 70,
        background: "radial-gradient(ellipse, rgba(232,115,10,0.28) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 1,
        opacity: isSpeaking ? 1 : 0.3,
        transition: "opacity 0.5s ease",
      }} />

      {/* Fox portrait */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "center", paddingTop: 20, paddingBottom: 0, overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
        <FoxPortrait isSpeaking={isSpeaking} width={size} />
      </div>

      {/* Bottom bar */}
      <div style={{
        position: "relative", zIndex: 3,
        padding: "8px 16px 14px",
        display: "flex", justifyContent: "center", alignItems: "center", gap: 8, minHeight: 38,
      }}>
        {isSpeaking
          ? <SpeakingWave />
          : <div style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 2.5,
              color: "rgba(255,255,255,0.28)", textTransform: "uppercase",
              fontFamily: "'Nunito', sans-serif",
            }}>AI Guide · Fox</div>
        }
      </div>

      {/* Speech bubble */}
      {speechText && isSpeaking && (
        <div style={{
          position: "absolute", top: 14, right: -10, zIndex: 10,
          background: "white", borderRadius: "14px 14px 14px 4px",
          padding: "9px 13px", maxWidth: 180,
          boxShadow: "0 8px 24px rgba(0,0,0,0.38)",
          animation: "bubbleIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
          pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", top: 11, left: -8,
            width: 9, height: 9, borderRadius: "50%",
            background: "#f97316", boxShadow: "0 0 7px #f97316",
          }} />
          <div style={{ fontSize: 9, fontWeight: 800, color: "#f97316", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3, fontFamily: "'Nunito',sans-serif" }}>AI Guide</div>
          <div style={{ fontSize: 12, color: "#1a1a1a", lineHeight: 1.45, fontStyle: "italic", fontFamily: "'Nunito',sans-serif" }}>
            "{speechText.slice(0, 80)}{speechText.length > 80 ? "…" : ""}"
          </div>
        </div>
      )}
    </div>
  );
}
