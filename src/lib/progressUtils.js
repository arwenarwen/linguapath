// Progress tracking utilities — mistakes, XP, weekly challenges
// Extracted from AIChat.jsx — pure localStorage operations, no UI deps.

export function isRealReviewMistake(m) {
  const text = `${m?.original || ""} ${m?.corrected || ""}`.toLowerCase();
  if (!text.trim()) return false;
  const banned = [
    "goal of this speaking task",
    "best strategy after a mistake",
    "choose the best word to complete a sentence about",
    "switch to another language",
    "avoid complete sentences",
    "use only one word",
    "repeat and correct it",
    "skip dialogue",
  ];
  return !banned.some((b) => text.includes(b));
}

export function getMistakes(userId, langCode) {
  try {
    const globalList = JSON.parse(localStorage.getItem(`lp_mistakes_global_${langCode}`) || "[]");
    const scopedList = userId ? JSON.parse(localStorage.getItem(`lp_mistakes_${userId}_${langCode}`) || "[]") : [];
    const merged = [...globalList, ...scopedList].filter(isRealReviewMistake);
    const seen = new Set();
    return merged.filter((m) => {
      const key = `${m.original}\u2192${m.corrected}\u2192${m.source || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return [];
  }
}

export function saveMistakes(userId, langCode, list) {
  try {
    const clean = (list || []).filter(isRealReviewMistake);
    localStorage.setItem(`lp_mistakes_global_${langCode}`, JSON.stringify(clean));
    if (userId) localStorage.setItem(`lp_mistakes_${userId}_${langCode}`, JSON.stringify(clean));
  } catch {}
}

export function pushMistake(userId, langCode, original, corrected, explanation, source) {
  if (!original || !corrected || original.trim() === corrected.trim()) return;
  const list = getMistakes(userId, langCode);
  if (list.slice(0,10).some(m => m.original === original.trim() && m.corrected === corrected.trim())) return;
  list.unshift({ id: Date.now(), original: original.trim(), corrected: corrected.trim(), explanation, source: source || "AI Tutor", date: new Date().toISOString().slice(0,10) });
  saveMistakes(userId, langCode, list.slice(0, 500));
}

export function pushLessonMistake(userId, langCode, question, correctAnswer, lessonTitle) {
  if (!question || !correctAnswer) return;
  const list = getMistakes(userId, langCode);
  list.unshift({ id: Date.now(), original: question, corrected: correctAnswer, explanation: "Correct answer from lesson exercise", source: "Lesson: " + (lessonTitle || "Practice"), date: new Date().toISOString().slice(0,10), isLesson: true });
  saveMistakes(userId, langCode, list.slice(0, 500));
}

// ── XP / weekly challenge helpers ─────────────────────────────────────────────
export function getWeekKey() {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}

export function getWeekEnd() {
  const now = new Date();
  const daysUntilSun = now.getDay() === 0 ? 7 : 7 - now.getDay();
  const end = new Date(now);
  end.setDate(now.getDate() + daysUntilSun);
  end.setHours(23, 59, 59, 0);
  return end;
}

export function formatTimeLeft(endDate) {
  const ms = endDate - new Date();
  if (ms <= 0) return "Ended";
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h ${mins}m left`;
}

export function getChallengeData(userId) {
  try {
    const raw = localStorage.getItem(`lp_challenge_${userId}`);
    if (!raw) return { weekKey: getWeekKey(), weekXP: 0, totalXP: 0, badges: [], wins: 0, friends: [] };
    const d = JSON.parse(raw);
    if (d.weekKey !== getWeekKey()) { d.weekKey = getWeekKey(); d.weekXP = 0; }
    return d;
  } catch { return { weekKey: getWeekKey(), weekXP: 0, totalXP: 0, badges: [], wins: 0, friends: [] }; }
}

export function saveChallengeData(userId, data) {
  try { localStorage.setItem(`lp_challenge_${userId}`, JSON.stringify(data)); } catch {}
}

export function awardChallengeXP(userId, amount) {
  if (!userId || !amount) return;
  const d = getChallengeData(userId);
  d.weekXP = (d.weekXP || 0) + amount;
  d.totalXP = (d.totalXP || 0) + amount;
  const newBadges = [];
  if (d.totalXP >= 1000 && !d.badges?.includes("xp-1k")) { d.badges = [...(d.badges||[]), "xp-1k"]; newBadges.push("xp-1k"); }
  if (d.totalXP >= 5000 && !d.badges?.includes("xp-5k")) { d.badges = [...(d.badges||[]), "xp-5k"]; newBadges.push("xp-5k"); }
  saveChallengeData(userId, d);
  return newBadges;
}
