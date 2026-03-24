import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function lsGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
export function lsSet(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
}
function lsGetJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}
function lsSetJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function getOnboardingProfile(userId) {
  return lsGetJSON(`lp_onboarding_${userId || "anon"}`, null);
}
export function saveOnboardingProfile(userId, profile) {
  lsSetJSON(`lp_onboarding_${userId || "anon"}`, profile);
}
export function clearOnboardingProfile(userId) {
  try { localStorage.removeItem(`lp_onboarding_${userId || "anon"}`); } catch {}
}

export const XP = {
  PERFECT_LESSON: 35,
  LESSON: 25,
  MANY_MISTAKES: 15,
  CHECKPOINT: 100,
  AI_CONVERSATION: 15,
  STREAK_BONUS: [0, 0, 10, 15, 20, 25, 30],
};
export const XP_PER_UNIT = 250;
export const XP_PER_LEVEL = 1500;

export function calcLessonXP(stars, streakDays, proUser) {
  const s = stars || 0; const d = streakDays || 0;
  const base = s === 3 ? XP.PERFECT_LESSON : s === 2 ? XP.LESSON : XP.MANY_MISTAKES;
  const bonus = XP.STREAK_BONUS[Math.min(d, 6)] || 0;
  return Math.round((base + bonus) * (proUser ? 1.15 : 1));
}

// ── Trail Points (TP) ─────────────────────────────────────────────────────────
// Earned by completing lessons. Spent to UNLOCK UNIT TESTS (checkpoints).
// You need CHECKPOINT_TP_REQUIRED TP to start a checkpoint exam.
// If you don't have enough, redo lessons to earn more TP first.
export const CHECKPOINT_TP_REQUIRED = 100;

export function getTrailPoints(userId) { return lsGetJSON(`lp_tp_${userId || "anon"}`, 0); }
export function addTrailPoints(userId, amount) {
  const next = getTrailPoints(userId) + amount;
  lsSetJSON(`lp_tp_${userId || "anon"}`, next);
  return next;
}
export function spendTrailPoints(userId, amount) {
  const cur = getTrailPoints(userId);
  if (cur < amount) return false;
  lsSetJSON(`lp_tp_${userId || "anon"}`, cur - amount);
  return true;
}
/**
 * Trail Points earned per lesson, scaled so that completing ALL lessons
 * in a unit at 3-star earns ~110% of CHECKPOINT_TP_REQUIRED.
 *
 * Fewer lessons per unit → more TP each (e.g. 4-lesson unit = 28 TP/lesson)
 * More lessons per unit → less TP each  (e.g. 8-lesson unit = 14 TP/lesson)
 * Stars: 3=full, 2=70%, 1=40%
 */
export function trailPointsForLesson(stars, lessonsInUnit = 6) {
  const safeLen = Math.max(1, lessonsInUnit);
  const tp3 = Math.ceil(CHECKPOINT_TP_REQUIRED * 1.1 / safeLen); // 3-star
  const tp2 = Math.ceil(tp3 * 0.7);                               // 2-star
  const tp1 = Math.ceil(tp3 * 0.4);                               // 1-star
  if (stars === 3) return tp3;
  if (stars === 2) return tp2;
  return tp1;
}

// ── XP spend (for bonus lesson / phrase unlocks in the shop) ─────────────────
// Regular XP is earned from lessons, streaks, AI sessions, achievements.
// It is spent in the Cultural Phrases shop to unlock bonus content.
export function getStoredXP(userId, langCode) {
  const p = lsGetJSON(`lp_progress_${userId || "anon"}_${langCode || "de"}`, { xp: 0 });
  return p.xp || 0;
}
export function spendXP(userId, langCode, amount) {
  const key = `lp_progress_${userId || "anon"}_${langCode || "de"}`;
  const p = lsGetJSON(key, { xp: 0, completed: [] });
  if ((p.xp || 0) < amount) return false;
  p.xp = (p.xp || 0) - amount;
  lsSetJSON(key, p);
  return true;
}

// ── Weekly stats helpers ──────────────────────────────────────────────────────
function _isoWeekKey() {
  const d = new Date(); d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const w1 = new Date(d.getFullYear(), 0, 4);
  const wn = 1 + Math.round(((d - w1) / 86400000 - 3 + (w1.getDay() + 6) % 7) / 7);
  return `${d.getFullYear()}-W${String(wn).padStart(2,"0")}`;
}
export function getWeekKey() { return _isoWeekKey(); }
export function addWeeklyLesson(userId) {
  const key = `lp_wl_${userId || "anon"}_${_isoWeekKey()}`;
  lsSetJSON(key, (lsGetJSON(key, 0) || 0) + 1);
}
export function getWeeklyLessons(userId) {
  return lsGetJSON(`lp_wl_${userId || "anon"}_${_isoWeekKey()}`, 0) || 0;
}
export function addWeeklyXP(userId, amount) {
  const key = `lp_wxp_${userId || "anon"}_${_isoWeekKey()}`;
  lsSetJSON(key, (lsGetJSON(key, 0) || 0) + amount);
}
export function getWeeklyXP(userId) {
  return lsGetJSON(`lp_wxp_${userId || "anon"}_${_isoWeekKey()}`, 0) || 0;
}
export function hasClaimedWeeklyReward(userId) {
  return !!lsGetJSON(`lp_wclaimed_${userId || "anon"}_${_isoWeekKey()}`, false);
}
export function claimWeeklyReward(userId) {
  lsSetJSON(`lp_wclaimed_${userId || "anon"}_${_isoWeekKey()}`, true);
}

export const ENERGY_MAX = 100;
export const ENERGY_PER_LESSON = 20;
const ENERGY_REGEN_MS = 5 * 60 * 1000;
const AD_REFILL_AMOUNT = 20;
const MAX_AD_REFILLS_PER_DAY = 5;
export const FREE_LESSONS_PER_DAY = 7;
export const FREE_AI_PER_DAY = 1;
export const FREE_AI_MESSAGES_PER_DAY = 10;   // total user messages across all AI sessions per day
export const FREE_AI_MESSAGES_PER_SESSION = 10; // kept for legacy compat — same value
export const PRO_AI_PER_DAY = 5;              // pro users: 5 AI sessions per day
export const PRO_AI_MESSAGES_PER_SESSION = 15; // pro users: 15 messages per session
export const PREVIEW_LESSONS_PER_LEVEL = 3;

function todayKey() { return new Date().toISOString().slice(0, 10); }
function energyKey(userId) { return `lp_energy_${userId || "anon"}`; }

function getEnergyState(userId) {
  const stored = lsGetJSON(energyKey(userId), {
    amount: ENERGY_MAX,
    lastUpdated: Date.now(),
    adRefillsUsed: 0,
    adRefillDate: todayKey(),
  });
  const regen = Math.floor((Date.now() - (stored.lastUpdated || Date.now())) / ENERGY_REGEN_MS);
  const today = todayKey();
  const normalized = {
    amount: Math.min(ENERGY_MAX, (stored.amount || 0) + regen),
    lastUpdated: regen > 0 ? Date.now() : (stored.lastUpdated || Date.now()),
    adRefillsUsed: stored.adRefillDate === today ? (stored.adRefillsUsed || 0) : 0,
    adRefillDate: today,
  };
  if (JSON.stringify(normalized) !== JSON.stringify(stored)) lsSetJSON(energyKey(userId), normalized);
  return normalized;
}
function saveEnergyState(userId, state) { lsSetJSON(energyKey(userId), state); }

export function getEnergy(userId) { return getEnergyState(userId).amount; }
export function spendEnergy(userId, amount = ENERGY_PER_LESSON) {
  const cur = getEnergyState(userId);
  if (cur.amount < amount) return false;
  saveEnergyState(userId, { ...cur, amount: cur.amount - amount, lastUpdated: Date.now() });
  return true;
}
export function addEnergy(userId, amount) {
  const cur = getEnergyState(userId);
  saveEnergyState(userId, { ...cur, amount: Math.min(ENERGY_MAX, cur.amount + amount), lastUpdated: Date.now() });
}
export function getEnergyRechargeMinutes(userId) {
  const cur = getEnergy(userId);
  if (cur >= ENERGY_PER_LESSON) return 0;
  return Math.ceil((ENERGY_PER_LESSON - cur) * (ENERGY_REGEN_MS / 60000));
}
export function getAdRefillUsage(userId) {
  const cur = getEnergyState(userId);
  return { used: cur.adRefillsUsed || 0, max: MAX_AD_REFILLS_PER_DAY, remaining: Math.max(0, MAX_AD_REFILLS_PER_DAY - (cur.adRefillsUsed || 0)) };
}
export function canUseAdRefill(userId) { return getAdRefillUsage(userId).remaining > 0; }
export function incrementAdRefillUsage(userId) {
  const cur = getEnergyState(userId);
  if ((cur.adRefillsUsed || 0) >= MAX_AD_REFILLS_PER_DAY) return false;
  saveEnergyState(userId, { ...cur, adRefillsUsed: (cur.adRefillsUsed || 0) + 1, adRefillDate: todayKey() });
  return true;
}
export function applyAdRefill(userId) {
  const cur = getEnergyState(userId);
  if ((cur.adRefillsUsed || 0) >= MAX_AD_REFILLS_PER_DAY) return false;
  saveEnergyState(userId, { ...cur, amount: Math.min(ENERGY_MAX, cur.amount + AD_REFILL_AMOUNT), adRefillsUsed: (cur.adRefillsUsed || 0) + 1, adRefillDate: todayKey(), lastUpdated: Date.now() });
  return true;
}
export function levelUsesEnergy(level) {
  return String(level || "A1").toUpperCase() !== "A1";
}

export function getUserPlan(userId) { return lsGet(`lp_plan_${userId || "anon"}`) || "free"; }
export function setUserPlan(userId, plan) { lsSet(`lp_plan_${userId || "anon"}`, plan); }
export function getUserRole(userId) { return lsGet(`lp_role_${userId || "anon"}`) || "free"; }
export function setUserRole(userId, role) { lsSet(`lp_role_${userId || "anon"}`, role); }
export function isPro(userId) {
  const plan = getUserPlan(userId); const role = getUserRole(userId);
  return plan === "pro" || ["admin", "tester", "influencer", "pro"].includes(role);
}
export function hasFullAccessRole(userId) {
  const role = getUserRole(userId);
  return ["admin", "tester", "influencer"].includes(role);
}

export function getDailyUsage(userId) {
  const today = todayKey();
  const stored = lsGetJSON(`lp_daily_${userId || "anon"}`, {});
  if (stored.date !== today) return { date: today, lessons: 0, ai: 0 };
  return { date: today, lessons: stored.lessons || 0, ai: stored.ai || 0 };
}
export function incrementDailyLesson(userId) {
  const usage = getDailyUsage(userId);
  const next = { date: todayKey(), lessons: (usage.lessons || 0) + 1, ai: usage.ai || 0 };
  lsSetJSON(`lp_daily_${userId || "anon"}`, next);
  return next;
}
export function incrementDailyAI(userId) {
  const usage = getDailyUsage(userId);
  const next = { date: todayKey(), lessons: usage.lessons || 0, ai: (usage.ai || 0) + 1 };
  lsSetJSON(`lp_daily_${userId || "anon"}`, next);
  return next;
}
export function canStartLesson(userId, level = "A1") {
  if (isPro(userId) || hasFullAccessRole(userId)) return { allowed: true };
  const usage = getDailyUsage(userId);
  if ((usage.lessons || 0) >= FREE_LESSONS_PER_DAY) return { allowed: false, reason: "daily_limit", used: usage.lessons, max: FREE_LESSONS_PER_DAY };
  if (levelUsesEnergy(level)) {
    const energy = getEnergy(userId);
    if (energy < ENERGY_PER_LESSON) return { allowed: false, reason: "low_energy", energy, needed: ENERGY_PER_LESSON };
  }
  return { allowed: true };
}

export function getPreviewUsage(userId) {
  const stored = lsGetJSON(`lp_preview_usage_${userId || "anon"}`, { date: todayKey(), counts: {} });
  if (stored.date !== todayKey()) return { date: todayKey(), counts: {} };
  return { date: stored.date, counts: stored.counts || {} };
}
export function incrementPreviewUsage(userId, level) {
  const usage = getPreviewUsage(userId);
  const key = String(level || "A2").toUpperCase();
  const next = { date: usage.date, counts: { ...usage.counts, [key]: (usage.counts[key] || 0) + 1 } };
  lsSetJSON(`lp_preview_usage_${userId || "anon"}`, next);
  return next.counts[key];
}
export function getPreviewLessonsUsed(userId, level) {
  const usage = getPreviewUsage(userId);
  return usage.counts[String(level || "A2").toUpperCase()] || 0;
}

export function getAISessionState(userId, modeKey = "default") {
  const today = todayKey();
  // Global daily AI message count (shared across all tutor modes)
  const stored = lsGetJSON(`lp_ai_session_${userId || "anon"}_global`, { date: today, messages: 0, sessions: 0 });
  if (stored.date !== today) return { date: today, messages: 0, sessions: 0 };
  return stored;
}
export function startAISession(userId, modeKey = "default") {
  const state = getAISessionState(userId, modeKey);
  const next = { date: todayKey(), messages: state.messages || 0, sessions: (state.sessions || 0) + 1 };
  lsSetJSON(`lp_ai_session_${userId || "anon"}_global`, next);
  return next;
}
export function incrementAISessionMessage(userId, modeKey = "default") {
  const state = getAISessionState(userId, modeKey);
  const next = { date: todayKey(), messages: (state.messages || 0) + 1, sessions: state.sessions || 1 };
  lsSetJSON(`lp_ai_session_${userId || "anon"}_global`, next);
  return next;
}
export function canUseAISession(userId, modeKey = "default") {
  const pro = isPro(userId) || hasFullAccessRole(userId);
  const state = getAISessionState(userId, modeKey);
  const sessionActive = (state.sessions || 0) > 0; // a session has been started today

  const msgLimit = pro ? PRO_AI_MESSAGES_PER_SESSION : FREE_AI_MESSAGES_PER_SESSION;
  const used = state.messages || 0;
  const remaining = Math.max(0, msgLimit - used);

  // Within an active session: only check message limit, not daily session limit
  // This prevents the "already at limit" bug when incrementDailyAI has already been called
  if (sessionActive) {
    if (used >= msgLimit) return { allowed: false, reason: "message_limit", remainingMessages: 0, isPro: pro };
    return { allowed: true, remainingMessages: remaining, sessionStarted: true, isPro: pro };
  }

  // No session started yet today: check if they can start one
  const daily = getDailyUsage(userId);
  const maxSessions = pro ? PRO_AI_PER_DAY : FREE_AI_PER_DAY;
  if ((daily.ai || 0) >= maxSessions) return { allowed: false, reason: "daily_ai_limit", remainingMessages: 0, isPro: pro };

  return { allowed: true, remainingMessages: remaining, sessionStarted: false, isPro: pro };
}

// ─── LESSON STARS ─────────────────────────────────────────────────────────────
const lessonStarsKey = (userId, langCode) => `lp_lstars_${userId || "anon"}_${langCode || "de"}`;
export function saveLessonStars(userId, langCode, lessonId, stars) {
  const map = lsGetJSON(lessonStarsKey(userId, langCode), {});
  map[lessonId] = Math.max(map[lessonId] || 0, stars || 0);
  lsSetJSON(lessonStarsKey(userId, langCode), map);
}
export function getLessonStarsMap(userId, langCode) {
  return lsGetJSON(lessonStarsKey(userId, langCode), {});
}

// ─── DAILY GOALS ──────────────────────────────────────────────────────────────
export const DAILY_LESSON_GOAL = 3;
export function getDailyGoalProgress(userId) {
  const usage = getDailyUsage(userId);
  return { done: usage.lessons || 0, goal: DAILY_LESSON_GOAL };
}

// ─── LEVEL TITLES & THRESHOLDS ────────────────────────────────────────────────
export const LEVEL_THRESHOLDS = [0, 100, 300, 700, 1500, 3000, 6000];
export const LEVEL_TITLES = ["Newcomer","Explorer","Hiker","Climber","Mountaineer","Summit Seeker","Peak Master"];
export function getXPLevel(xp) {
  let lvl = 0;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if ((xp || 0) >= LEVEL_THRESHOLDS[i]) { lvl = i; break; }
  }
  return { level: lvl, title: LEVEL_TITLES[lvl], current: (xp || 0) - LEVEL_THRESHOLDS[lvl], next: LEVEL_THRESHOLDS[lvl + 1] || null, xp: xp || 0 };
}

export function loadProgress(userId, langCode) {
  try {
    const raw = localStorage.getItem(`lp_progress_${userId || "anon"}_${langCode}`);
    if (!raw) return { completed: [], xp: 0 };
    const p = JSON.parse(raw);
    return { completed: Array.isArray(p?.completed) ? p.completed : [], xp: typeof p?.xp === "number" ? p.xp : 0 };
  } catch { return { completed: [], xp: 0 }; }
}
export function saveProgress(userId, langCode, data) {
  try { localStorage.setItem(`lp_progress_${userId || "anon"}_${langCode}`, JSON.stringify(data)); } catch {}
}

export function getPlacementState(userId, langCode) {
  return lsGetJSON(`lp_placement_${userId || "anon"}_${langCode}`, null);
}
export function savePlacementState(userId, langCode, state) {
  lsSetJSON(`lp_placement_${userId || "anon"}_${langCode}`, state);
}

export function getCheckpointPass(userId, langCode, unitKey) {
  return lsGetJSON(`lp_checkpoint_${userId || "anon"}_${langCode}_${unitKey}`, null);
}
export function setCheckpointPass(userId, langCode, unitKey, scorePct) {
  lsSetJSON(`lp_checkpoint_${userId || "anon"}_${langCode}_${unitKey}`, { passed: scorePct >= 70, scorePct, updatedAt: Date.now() });
}

export function getStreak(userId) { return lsGetJSON(`lp_streak_${userId || "anon"}`, { count: 0, lastDate: null }); }
export function updateStreak(userId) {
  try {
    const today = todayKey();
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const s = getStreak(userId);
    const newCount = s.lastDate === today ? s.count : s.lastDate === yesterday ? s.count + 1 : 1;
    const updated = { count: newCount, lastDate: today };
    lsSetJSON(`lp_streak_${userId || "anon"}`, updated);
    return updated;
  } catch { return { count: 1, lastDate: todayKey() }; }
}

const DAILY_GOAL_OPTIONS = [40, 60, 90, 120];
export function getLanternStreakMeta(streakCount) {
  const count = Math.max(0, Number(streakCount) || 0);
  const tiers = [
    { min: 0, label: "First Light", icon: "🏮", color: "#f59e0b", sub: "Start your trail" },
    { min: 3, label: "Trail Glow", icon: "✨", color: "#f97316", sub: "Your route is warming up" },
    { min: 7, label: "Camp Lantern", icon: "🏕️", color: "#fb923c", sub: "A steady weekly rhythm" },
    { min: 14, label: "Ridge Beacon", icon: "🧭", color: "#8b5cf6", sub: "You keep showing up" },
    { min: 30, label: "Summit Light", icon: "🌟", color: "#22c55e", sub: "A rare kind of consistency" },
  ];
  const current = [...tiers].reverse().find(t => count >= t.min) || tiers[0];
  const next = tiers.find(t => t.min > count) || null;
  return { ...current, count, nextTarget: next?.min || null, nextLabel: next?.label || null, progressPct: next ? Math.max(0, Math.min(100, Math.round((count - current.min) / Math.max(1, next.min - current.min) * 100))) : 100 };
}
export function getDailyGoal(userId) { return lsGetJSON(`lp_daily_goal_${userId || "anon"}`, { xp: 60 }).xp || 60; }
export function setDailyGoal(userId, xp) { const safe = DAILY_GOAL_OPTIONS.includes(Number(xp)) ? Number(xp) : 60; lsSetJSON(`lp_daily_goal_${userId || "anon"}`, { xp: safe }); return safe; }
export function getDailyGoalOptions() { return [...DAILY_GOAL_OPTIONS]; }
export function getDailyXpState(userId) {
  const today = todayKey(); const goal = getDailyGoal(userId); const stored = lsGetJSON(`lp_daily_xp_${userId || "anon"}`, {});
  if (stored.date !== today) return { date: today, xp: 0, goal, completed: false, progressPct: 0, remaining: goal };
  const xp = Number(stored.xp) || 0; const completed = xp >= goal;
  return { date: today, xp, goal, completed, progressPct: Math.max(0, Math.min(100, Math.round((xp / Math.max(1, goal)) * 100))), remaining: Math.max(0, goal - xp) };
}
export function addDailyXp(userId, amount) {
  const today = todayKey(); const cur = getDailyXpState(userId); const xp = (cur.date === today ? cur.xp : 0) + Math.max(0, Number(amount) || 0);
  lsSetJSON(`lp_daily_xp_${userId || "anon"}`, { date: today, xp }); return getDailyXpState(userId);
}

let _audio = null;
export function stopAllAudio() {
  try { window.speechSynthesis?.cancel(); } catch {}
  try { if (_audio) { _audio.pause(); _audio.currentTime = 0; _audio = null; } } catch {}
}

function isRealMistake(m) {
  const t = `${m?.original || ""} ${m?.corrected || ""}`.toLowerCase();
  if (!t.trim()) return false;
  return !["goal of this speaking task", "best strategy after a mistake", "choose the best word"].some(b => t.includes(b));
}
export function getMistakes(userId, langCode) {
  try {
    const g = JSON.parse(localStorage.getItem(`lp_mistakes_global_${langCode}`) || "[]");
    const s = userId ? JSON.parse(localStorage.getItem(`lp_mistakes_${userId}_${langCode}`) || "[]") : [];
    const seen = new Set();
    return [...g, ...s].filter(isRealMistake).filter(m => { const k = `${m.original}~${m.corrected}`; if (seen.has(k)) return false; seen.add(k); return true; });
  } catch { return []; }
}
export function saveMistakes(userId, langCode, list) {
  try {
    const clean = (list || []).filter(isRealMistake);
    localStorage.setItem(`lp_mistakes_global_${langCode}`, JSON.stringify(clean));
    if (userId) localStorage.setItem(`lp_mistakes_${userId}_${langCode}`, JSON.stringify(clean));
  } catch {}
}
export function pushMistake(userId, langCode, original, corrected, explanation, source, question) {
  if (!original || !corrected || original.trim() === corrected.trim()) return;
  const list = getMistakes(userId, langCode);
  list.unshift({ id: Date.now(), original: original.trim(), corrected: corrected.trim(), explanation, source: source || "AI Tutor", date: todayKey(), question: question || null });
  saveMistakes(userId, langCode, list.slice(0, 500));
}

export function getAllModulesFromCurriculum(curriculum) {
  return ["A1", "A2", "B1", "B2", "C1", "C2"].flatMap(k => (curriculum || {})[k]?.modules || []);
}
export function groupModulesByUnit(modules) {
  const map = {}, order = [];
  (modules || []).forEach(mod => {
    const key = mod.unit || (mod.id || "").split("-").slice(0, 3).join("-");
    if (!map[key]) { map[key] = { unit: key, section: mod.section || key, lessons: [] }; order.push(key); }
    map[key].lessons.push(mod);
  });
  return order.map(k => map[k]);
}
