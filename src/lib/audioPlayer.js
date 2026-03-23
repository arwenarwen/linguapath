// Audio playback state and utilities for LinguaPath
// Extracted from AIChat.jsx — single source of truth for all TTS/audio logic.

import { tryPlayStaticAudio } from "./staticAudio";

// ── Module-level audio state ──────────────────────────────────────────────────
const _LANG_BCP47 = {
  es:"es-ES", fr:"fr-FR", de:"de-DE", it:"it-IT", pt:"pt-PT",
  zh:"zh-CN", ja:"ja-JP", ko:"ko-KR", pl:"pl-PL", en:"en-US"
};
let _currentAudioLang = "es";
let _activeHtmlAudio = null;
let _speechTimeouts = [];
let _ttsAbortController = null;
let _speakingListeners = [];
let _lastSpeechText = "";

export function setAudioLang(code) { _currentAudioLang = code || "es"; }

/** Subscribe to speaking state changes. Returns an unsubscribe function. */
export function subscribeSpeaking(fn) {
  _speakingListeners.push(fn);
  return () => { _speakingListeners = _speakingListeners.filter(f => f !== fn); };
}

export function getLastSpeechText() { return _lastSpeechText; }

function _notifySpeaking(on, text = "") {
  if (on) _lastSpeechText = text;
  _speakingListeners.forEach(fn => fn(on, _lastSpeechText));
}

export function stopAllAudio() {
  try {
    if (_ttsAbortController) {
      _ttsAbortController.abort();
      _ttsAbortController = null;
    }
  } catch (e) {}
  try {
    _speechTimeouts.forEach(id => clearTimeout(id));
    _speechTimeouts = [];
  } catch (e) {}
  try {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch (e) {}
  try {
    if (_activeHtmlAudio) {
      _activeHtmlAudio.pause();
      _activeHtmlAudio.currentTime = 0;
      _activeHtmlAudio.src = "";
      _activeHtmlAudio = null;
    }
  } catch (e) {}
  _notifySpeaking(false);
}

export function queueSpeech(fn, delay = 0) {
  const id = setTimeout(() => {
    _speechTimeouts = _speechTimeouts.filter(x => x !== id);
    fn();
  }, delay);
  _speechTimeouts.push(id);
  return id;
}

export function normalizeTextForSpeech(rawText, langCode = _currentAudioLang) {
  if (!rawText) return "";
  let text = String(rawText);

  const ordinalMap = {
    en: {1:"first",2:"second",3:"third",4:"fourth",5:"fifth",6:"sixth",7:"seventh",8:"eighth",9:"ninth",10:"tenth"},
    de: {1:"erstens",2:"zweitens",3:"drittens",4:"viertens",5:"funftens",6:"sechstens",7:"siebtens",8:"achtens",9:"neuntens",10:"zehntens"},
    zh: {1:"\u7b2c\u4e00",2:"\u7b2c\u4e8c",3:"\u7b2c\u4e09",4:"\u7b2c\u56db",5:"\u7b2c\u4e94",6:"\u7b2c\u516d",7:"\u7b2c\u4e03",8:"\u7b2c\u516b",9:"\u7b2c\u4e5d",10:"\u7b2c\u5341"}
  };
  const ords = ordinalMap[langCode] || ordinalMap.en;

  text = text
    .replace(/\u26a0\ufe0f CORRECTION:[^\n]*/g, "")
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/[_~`]/g, "");

  text = text
    .replace(/Question\s+(\d+)\s*\/\s*(\d+)\s*:/gi, "Question $1 out of $2. ")
    .replace(/Question\s+(\d+)\s*\/\s*(\d+)/gi, "Question $1 out of $2")
    .replace(/\bQ(\d+)\s*-\s*Q(\d+)\b/g, "Questions $1 to $2")
    .replace(/\bQ(\d+)\b/g, "Question $1");

  text = text
    .replace(/^\s*(\d+)\)\s+/gm, "Option $1. ")
    .replace(/^\s*([A-D])\)\s+/gm, "Option $1. ")
    .replace(/^\s*[-\u2022]\s+/gm, "")
    .replace(/^\s*(\d{1,2})\.\s+/gm, (_, n) => `${ords[Number(n)] || n}. `);

  text = text
    .replace(/\s*\u2192\s*/g, " to ")
    .replace(/\s*\|\s*/g, ". ")
    .replace(/\s*\/\s*/g, " slash ")
    .replace(/\s*&\s*/g, " and ")
    .replace(/\bvs\.\b/gi, "versus")
    .replace(/[\u{1f4ca}\u2b50\u26a1\u2705\u274c\u26a0\ufe0f\u2022]/gu, " ")
    .replace(/[:;]\s*$/gm, ".")
    .replace(/\s{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();

  text = text.replace(/\b(Why|Hint|Better sentence|Key change|Now you try|Translation|Flow)\s*:/gi, "$1. ");

  return text.slice(0, 900);
}

export function getTutorVoiceId(langCode) {
  const VOICES = {
    de: "kUqnjA18C6ISqjtKOpsJ",
    es: "zdzXtQ5BTOYMDG04sR8R",
    it: "BUAZlX1JYGONhOQdurfl",
    fr: "ttrVUBHgC9AEENt2kGi6",
    zh: "RrYpxumYIVoc5NKCTGOg",
    ko: "FNrsMcVkTfKeSyL1UYXS",
    ja: "9XG6vvb5sQYWawDizIlo",
    ru: "1iQuCymkuonZDnoteVZT",
    el: "8C0RosTo9KZhAz8UmM7c",
    pt: "CImjz27snHwe55ik6hke",
    en: "pNInz6obpgDQGcFmaJgB", // Adam — English tutor voice for exam questions & feedback
  };
  return VOICES[langCode] || null;
}

export function getLessonWordText(word, langCode = _currentAudioLang) {
  if (!word || typeof word !== "object") return "";
  const preferredKeys = [langCode, "es", "de", "fr", "it", "pt", "zh", "ja", "ko", "pl", "en"];
  for (const key of preferredKeys) {
    if (typeof word[key] === "string" && word[key].trim()) return word[key];
  }
  for (const [k, v] of Object.entries(word)) {
    if (!["en", "phonetic", "example"].includes(k) && typeof v === "string" && v.trim()) return v;
  }
  return word.word || word.target || "";
}

export async function playWordAudio(text, langCode, opts = {}) {
  if (!text || typeof window === "undefined") return;
  const resolvedLang = langCode || _currentAudioLang || "en";

  try {
    const usedStatic = await tryPlayStaticAudio({
      text,
      langCode: resolvedLang,
      stopAllAudio,
      setActiveAudio: (audio) => { _activeHtmlAudio = audio; }
    });

    if (usedStatic) return;

    stopAllAudio();

    _ttsAbortController = new AbortController();
    const signal = _ttsAbortController.signal;

    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        text: normalizeTextForSpeech(text, resolvedLang),
        langCode: resolvedLang,
        ...(opts.voiceId ? { voiceId: opts.voiceId } : {})
      })
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      let message = errText || `TTS HTTP ${res.status}`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed?.error) message = parsed.error;
      } catch {}
      throw new Error(message);
    }

    const blob = await res.blob();
    if (!blob || blob.size === 0) throw new Error("Empty audio response");

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.preload = "auto";
    _activeHtmlAudio = audio;

    _notifySpeaking(true, text);

    audio.onended = () => {
      try { URL.revokeObjectURL(url); } catch(e) {}
      if (_activeHtmlAudio === audio) _activeHtmlAudio = null;
      _notifySpeaking(false);
    };
    audio.onerror = () => {
      try { URL.revokeObjectURL(url); } catch(e) {}
      if (_activeHtmlAudio === audio) _activeHtmlAudio = null;
      _notifySpeaking(false);
    };

    await audio.play();
  } catch (e) {
    _notifySpeaking(false);
    if (e?.name === "AbortError") return;
    console.error("[TTS] Static/ElevenLabs playWordAudio failed:", e);
    if (typeof window !== "undefined") {
      window.__LP_LAST_TTS_ERROR__ = String(e?.message || e || "Unknown TTS error");
    }
  }
}

/**
 * Like playWordAudio but AWAITS audio completion before resolving.
 * Use this when you need to chain audio sequentially (e.g. exam feedback → next question).
 * Always calls stopAllAudio first. Falls back to a timed wait on error.
 */
export async function playAndWait(text, langCode, opts = {}) {
  if (!text || typeof window === "undefined") return;
  const resolvedLang = langCode || "en";
  stopAllAudio();

  _ttsAbortController = new AbortController();
  const signal = _ttsAbortController.signal;

  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        text: normalizeTextForSpeech(text, resolvedLang),
        langCode: resolvedLang,
        ...(opts.voiceId ? { voiceId: opts.voiceId } : {})
      })
    });

    if (!res.ok) {
      await new Promise(r => setTimeout(r, opts.fallbackMs || 2500));
      return;
    }

    const blob = await res.blob();
    if (!blob || blob.size === 0) {
      await new Promise(r => setTimeout(r, opts.fallbackMs || 2500));
      return;
    }

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.preload = "auto";
    _activeHtmlAudio = audio;

    _notifySpeaking(true, text);
    await audio.play();

    await new Promise(resolve => {
      const cleanup = () => {
        try { URL.revokeObjectURL(url); } catch {}
        if (_activeHtmlAudio === audio) _activeHtmlAudio = null;
        _notifySpeaking(false);
        resolve();
      };
      audio.onended = cleanup;
      audio.onerror = cleanup;
      setTimeout(cleanup, opts.maxMs || 12000);
    });
  } catch (e) {
    _notifySpeaking(false);
    if (e?.name !== "AbortError") {
      console.error("[TTS playAndWait] failed:", e);
    }
    // fallback wait so callers don't chain instantly on error
    if (e?.name !== "AbortError") {
      await new Promise(r => setTimeout(r, opts.fallbackMs || 1500));
    }
  }
}
