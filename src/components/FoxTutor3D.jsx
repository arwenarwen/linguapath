/**
 * FoxTutor3D — React Three Fiber 3D fox mascot
 *
 * Uses the Khronos Sample Fox GLB (CC0 licensed) loaded directly via CDN.
 * No local file download required — the browser fetches it at runtime.
 *
 * Animations:
 *   • Idle  → "Survey" clip at 0.65× speed (calm look-around)
 *   • Speaking → "Walk" clip at 0.45× speed (weight shift) + jaw bone movement
 *
 * Glow border pulses orange whenever audio is playing, matching the video card.
 */

import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { subscribeSpeaking } from "../lib/audioPlayer";

// ── Model source (CDN — no local download needed) ──────────────────────────
const MODEL_URL =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Fox/glTF-Binary/Fox.glb";

// Pre-fetch so it starts loading immediately when the module is imported
useGLTF.preload(MODEL_URL);

// ── CSS keyframe for glow pulse ────────────────────────────────────────────
let _kfInjected3d = false;
function injectKF3D() {
  if (_kfInjected3d || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.textContent = `
    @keyframes foxGlow3d {
      0%, 100% { opacity: 0.55; }
      50%       { opacity: 1; }
    }
  `;
  document.head.appendChild(s);
  _kfInjected3d = true;
}

// ── 3D Fox mesh ─────────────────────────────────────────────────────────────
function FoxMesh({ isSpeaking }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, groupRef);

  // Find jaw bone once model is ready
  const jawBoneRef = useRef(null);
  useEffect(() => {
    scene.traverse((node) => {
      if (node.isBone && /jaw/i.test(node.name)) {
        jawBoneRef.current = node;
      }
    });
  }, [scene]);

  // Start idle Survey animation
  useEffect(() => {
    const survey = actions?.["Survey"];
    if (survey) {
      survey.reset().play();
      survey.setLoop(THREE.LoopRepeat, Infinity);
      survey.timeScale = 0.65;
    }
  }, [actions]);

  // Cross-fade between Survey (idle) ↔ Walk (talking weight shift)
  const speakingRef = useRef(isSpeaking);
  useEffect(() => {
    speakingRef.current = isSpeaking;
    const survey = actions?.["Survey"];
    const walk   = actions?.["Walk"];
    if (!survey) return;

    if (isSpeaking) {
      survey.fadeOut(0.4);
      if (walk) {
        walk.reset().fadeIn(0.4).play();
        walk.setLoop(THREE.LoopRepeat, Infinity);
        walk.timeScale = 0.45; // slow walk-in-place
      }
    } else {
      if (walk) walk.fadeOut(0.4);
      survey.reset().fadeIn(0.4).play();
      survey.timeScale = 0.65;
    }
  }, [isSpeaking, actions]);

  // Per-frame: animate jaw when speaking
  const clockRef = useRef(0);
  useFrame((_, delta) => {
    clockRef.current += delta;
    const jaw = jawBoneRef.current;
    if (jaw) {
      const target = speakingRef.current
        ? Math.abs(Math.sin(clockRef.current * 8)) * 0.32
        : 0;
      jaw.rotation.x = THREE.MathUtils.lerp(jaw.rotation.x, target, delta * 14);
    }
  });

  // The Khronos Fox is ~150 scene-units tall; scale to ~1.5 Three.js units
  return (
    <group
      ref={groupRef}
      dispose={null}
      scale={[0.012, 0.012, 0.012]}
      position={[0, -1.35, 0]}
      rotation={[0, 0.18, 0]} // slight 3/4 angle
    >
      <primitive object={scene} />
    </group>
  );
}

// ── Orange point light that pulses with speaking ──────────────────────────
function SpeakingLight({ isSpeaking }) {
  const ref = useRef();
  const t   = useRef(0);
  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current) {
      const base   = isSpeaking ? 0.9 : 0.15;
      const pulse  = isSpeaking ? Math.sin(t.current * 3.5) * 0.25 : 0;
      ref.current.intensity = base + pulse;
    }
  });
  return (
    <pointLight
      ref={ref}
      position={[1, 1.5, 3]}
      color="#f97316"
      intensity={0.15}
      distance={8}
    />
  );
}

// ── Fallback while model loads ─────────────────────────────────────────────
function LoadingPlane() {
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[2, 3]} />
      <meshStandardMaterial color="#0d2018" />
    </mesh>
  );
}

// ── Main exported component ───────────────────────────────────────────────
export default function FoxTutor3D({ style = {} }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    injectKF3D();
    return subscribeSpeaking((on) => setIsSpeaking(on));
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#0a1a12", ...style }}>
      {/* ── Three.js canvas ── */}
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 3.8], fov: 48 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[4, 10, 6]}
          intensity={1.1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Cool fill from the back/left for depth */}
        <directionalLight position={[-4, 3, -3]} intensity={0.18} color="#4488cc" />

        {/* Orange speaking light */}
        <SpeakingLight isSpeaking={isSpeaking} />

        {/* Ground */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.35, 0]}
          receiveShadow
        >
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial color="#091a10" roughness={0.95} metalness={0} />
        </mesh>

        {/* Fox model — suspense fallback while GLB fetches */}
        <Suspense fallback={<LoadingPlane />}>
          <FoxMesh isSpeaking={isSpeaking} />
        </Suspense>
      </Canvas>

      {/* ── Cinematic bottom fade ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "28%",
          background:
            "linear-gradient(to top, rgba(8,21,16,0.9) 0%, rgba(8,21,16,0.35) 60%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Speaking glow border ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          boxShadow: isSpeaking
            ? "inset 0 0 0 2.5px rgba(249,115,22,0.65), inset 0 0 44px rgba(249,115,22,0.14)"
            : "inset 0 0 0 1px rgba(255,255,255,0.05)",
          transition: "box-shadow 0.5s ease",
          animation: isSpeaking ? "foxGlow3d 1.3s ease-in-out infinite" : undefined,
        }}
      />
    </div>
  );
}
