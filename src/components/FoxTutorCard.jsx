/**
 * FoxTutorCard — cinematic AI tutor card.
 * Still JPG when idle. Talking MP4 crossfades in only when audio plays.
 * Smooth: video fades in only after onCanPlay fires — no flash, no blank frame.
 */

import React, { useState, useEffect, useRef } from "react";
import { subscribeSpeaking } from "../lib/audioPlayer";

// ── Animal asset map ──────────────────────────────────────────────────────────
export const ANIMAL_VIDEOS = {
  fox:      "/images/animals/fox.mp4",
  rabbit:   "/images/animals/rabbit.mp4",
  owl:      "/images/animals/owl.mp4",
  squirrel: "/images/animals/fox.mp4",
  wolf:     "/images/animals/fox.mp4",
  lion:     "/images/animals/fox.mp4",
};

export const ANIMAL_STILLS = {
  fox:      "/images/animals/fox-idle.jpg",
  rabbit:   "/images/animals/rabbit-idle.jpg",
  owl:      "/images/animals/owl-idle.jpg",
  squirrel: "/images/animals/fox-idle.jpg",
  wolf:     "/images/animals/fox-idle.jpg",
  lion:     "/images/animals/fox-idle.jpg",
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
export const DEFAULT_STILL = ANIMAL_STILLS.fox;

// ── CSS keyframes (glow + wave only) ─────────────────────────────────────────
const KEYFRAMES = `
@keyframes foxBorderGlow {
  0%, 100% { opacity: 0.55; }
  50%       { opacity: 1;   }
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

// ── Smooth animal panel — still until video ready, then crossfade ─────────────
function AnimalPanel({ videoSrc, stillSrc, isSpeaking, objectPosition = "center 10%", style = {} }) {
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  // Reset ready state whenever speaking starts fresh
  useEffect(() => {
    if (!isSpeaking) {
      setVideoReady(false);
    }
  }, [isSpeaking]);

  const showVideo = isSpeaking && videoReady;

  return (
    <div style={{ position: "absolute", inset: 0, ...style }}>
      {/* Still JPG — always rendered, fades out once video is ready */}
      <img
        src={stillSrc}
        alt="tutor"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition,
          opacity: showVideo ? 0 : 1,
          transition: "opacity 0.45s ease",
        }}
      />

      {/* Talking video — mounts when speaking, fades in once canplay fires */}
      {isSpeaking && (
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoReady(true)}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition,
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.45s ease",
          }}
        />
      )}
    </div>
  );
}

// ── Compact avatar (tiny, shown in header when exam is finished) ───────────────
function CompactFox({ size, style, isSpeaking, videoSrc, stillSrc }) {
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (!isSpeaking) setVideoReady(false);
  }, [isSpeaking]);

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
      <img
        src={stillSrc}
        alt="tutor"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 15%",
          opacity: isSpeaking && videoReady ? 0 : 1,
          transition: "opacity 0.35s ease",
        }}
      />
      {isSpeaking && (
        <video
          key={videoSrc}
          src={videoSrc}
          autoPlay loop muted playsInline
          onCanPlay={() => setVideoReady(true)}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 15%",
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />
      )}
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
export default function FoxTutorCard({ style = {}, size = 220, compact = false, src, still }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoSrc = src   || DEFAULT_VIDEO;
  const stillSrc = still || DEFAULT_STILL;

  useEffect(() => {
    injectKF();
    return subscribeSpeaking((on) => setIsSpeaking(on));
  }, []);

  if (compact) {
    return <CompactFox size={size} style={style} isSpeaking={isSpeaking} videoSrc={videoSrc} stillSrc={stillSrc} />;
  }

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      overflow: "hidden", background: "#0a1a12", ...style,
    }}>
      {/* ── Animal — still JPG idle, MP4 talking, smooth crossfade ── */}
      <AnimalPanel
        videoSrc={videoSrc}
        stillSrc={stillSrc}
        isSpeaking={isSpeaking}
      />

      {/* ── Cinematic vignette ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 38%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.5) 100%)",
        pointerEvents: "none",
      }} />

      {/* ── Bottom gradient ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
        background: "linear-gradient(to top, rgba(8,21,16,0.92) 0%, rgba(8,21,16,0.4) 60%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* ── Speaking glow border ── */}
      <div style={{
        position: "absolute", inset: 0,
        boxShadow: isSpeaking
          ? "inset 0 0 0 2.5px rgba(249,115,22,0.65), inset 0 0 40px rgba(249,115,22,0.15)"
          : "inset 0 0 0 1px rgba(255,255,255,0.05)",
        pointerEvents: "none",
        transition: "box-shadow 0.5s ease",
        animation: isSpeaking ? "foxBorderGlow 1.3s ease-in-out infinite" : undefined,
      }} />
    </div>
  );
}
