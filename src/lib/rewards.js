// ─────────────────────────────────────────────────────────────────────────────
// rewards.js  –  LinguaPath gamification layer
// Drop into src/lib/rewards.js  and import into MountainAppShell.jsx
// ─────────────────────────────────────────────────────────────────────────────

function lsGetJSON(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function lsSetJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── XP TABLE ────────────────────────────────────────────────────────────────

export const XP = {
  PERFECT_LESSON:  35,
  LESSON:          25,
  MANY_MISTAKES:   15,
  CHECKPOINT:     100,
  AI_CONVERSATION: 15,
  AI_EXAM_PASS:    25,
  AI_EXAM_HIGH:    50,   // score >= 80%, stacks on top of AI_EXAM_PASS
  FIRST_LESSON:     5,   // one-time
  // Daily streak bonus per day (index = streak day count, capped at index 7)
  STREAK_BONUS:   [0, 0, 10, 15, 20, 25, 30, 35],
};

export function calcLessonXP(stars, streakDays, proUser) {
  const base   = stars === 3 ? XP.PERFECT_LESSON : stars === 2 ? XP.LESSON : XP.MANY_MISTAKES;
  const bonus  = XP.STREAK_BONUS[Math.min(streakDays || 0, 7)];
  return Math.round((base + bonus) * (proUser ? 1.15 : 1));
}

// ─── ACHIEVEMENTS ────────────────────────────────────────────────────────────

export const ACHIEVEMENTS = [
  // Milestones
  { id: "first-lesson",   icon: "🌱", name: "First Step",          desc: "Complete your first lesson",              category: "Milestones", xp:   5 },
  { id: "lessons-10",     icon: "🎒", name: "Trail Walker",        desc: "Complete 10 lessons total",               category: "Milestones", xp:  10 },
  { id: "lessons-50",     icon: "🏕️", name: "Camp Builder",        desc: "Complete 50 lessons total",               category: "Milestones", xp:  25 },
  { id: "lessons-100",    icon: "⛰️", name: "Mountain Climber",    desc: "Complete 100 lessons total",              category: "Milestones", xp:  50 },
  { id: "lessons-250",    icon: "🏔️", name: "Summit Seeker",       desc: "Complete 250 lessons total",              category: "Milestones", xp: 100 },
  // XP
  { id: "xp-100",         icon: "⚡", name: "Spark",               desc: "Earn 100 XP",                            category: "XP",         xp:   0 },
  { id: "xp-500",         icon: "🔥", name: "On Fire",             desc: "Earn 500 XP",                            category: "XP",         xp:   0 },
  { id: "xp-1000",        icon: "💎", name: "Diamond Mind",        desc: "Earn 1,000 XP",                          category: "XP",         xp:   0 },
  { id: "xp-5000",        icon: "👑", name: "Language Royalty",    desc: "Earn 5,000 XP",                          category: "XP",         xp:   0 },
  // Streaks
  { id: "streak-7",       icon: "🌊", name: "Week Wave",           desc: "Maintain a 7-day streak",                category: "Streaks",    xp:  15 },
  { id: "streak-30",      icon: "🌙", name: "Month Moon",          desc: "Maintain a 30-day streak",               category: "Streaks",    xp:  30 },
  { id: "streak-100",     icon: "☀️", name: "Centurion Sun",       desc: "Maintain a 100-day streak",              category: "Streaks",    xp: 100 },
  { id: "streak-365",     icon: "🌟", name: "Year of the Mountain",desc: "Maintain a 365-day streak",              category: "Streaks",    xp: 365 },
  // Time on app
  { id: "days-30",        icon: "🌿", name: "Month Hiker",         desc: "Use LinguaPath for 30 days",             category: "Time",       xp:  30 },
  { id: "days-60",        icon: "🍃", name: "Two Months",          desc: "Use LinguaPath for 60 days",             category: "Time",       xp:  60 },
  { id: "days-90",        icon: "🌲", name: "Quarter Year",        desc: "Use LinguaPath for 90 days",             category: "Time",       xp:  90 },
  { id: "days-180",       icon: "🌳", name: "Half Year",           desc: "Use LinguaPath for 180 days",            category: "Time",       xp: 180 },
  { id: "days-365",       icon: "🏆", name: "One Year on the Mountain", desc: "Use LinguaPath for 365 days",       category: "Time",       xp: 365 },
  // CEFR levels completed
  { id: "a1-complete",    icon: "🌿", name: "Base Camp",           desc: "Complete all A1 lessons",                category: "Level",      xp:  50 },
  { id: "a2-complete",    icon: "🏕️", name: "Forest Trail",        desc: "Complete all A2 lessons",                category: "Level",      xp:  75 },
  { id: "b1-complete",    icon: "🏔️", name: "Mountain Ridge",      desc: "Complete all B1 lessons",                category: "Level",      xp: 100 },
  { id: "b2-complete",    icon: "🦅", name: "High Pass",           desc: "Complete all B2 lessons",                category: "Level",      xp: 150 },
  { id: "c1-complete",    icon: "🌠", name: "Summit Approach",     desc: "Complete all C1 lessons",                category: "Level",      xp: 200 },
  { id: "c2-complete",    icon: "🎖️", name: "Peak Reached",        desc: "Complete all C2 lessons",                category: "Level",      xp: 500 },
  // Performance
  { id: "perfect-5",      icon: "✨", name: "Flawless Five",       desc: "Get 3 stars on 5 lessons in a row",      category: "Performance",xp:  25 },
  { id: "no-mistakes-10", icon: "🎯", name: "Sharp Eye",           desc: "Complete 10 lessons with 3 stars each",  category: "Performance",xp:  50 },
  { id: "exam-pass",      icon: "📝", name: "Exam Taker",          desc: "Complete any exam mode",                  category: "Performance",xp:  10 },
  { id: "exam-80",        icon: "🎓", name: "Scholar",             desc: "Score ≥ 80% on any exam",                category: "Performance",xp:  25 },
  // AI Tutor
  { id: "ai-session",     icon: "🤖", name: "AI Climber",          desc: "Complete an AI tutor session",           category: "AI",         xp:   0 },
  { id: "ai-sessions-10", icon: "🧠", name: "Deep Thinker",        desc: "Complete 10 AI tutor sessions",          category: "AI",         xp:  30 },
  // Multi-language
  { id: "two-languages",  icon: "🌍", name: "Polyglot Path",       desc: "Start lessons in 2 languages",           category: "Exploration",xp:  20 },
  { id: "five-languages", icon: "🌐", name: "World Citizen",       desc: "Start lessons in 5 languages",           category: "Exploration",xp: 100 },
  // Challenges
  { id: "daily-7",        icon: "📆", name: "Challenge Habit",     desc: "Complete daily challenges 7 days in a row", category: "Challenges",xp: 35 },
  { id: "daily-30",       icon: "🗓️", name: "Challenge Master",    desc: "Complete daily challenges 30 days in a row",category: "Challenges",xp:100 },
  // Special
  { id: "comeback",       icon: "🔁", name: "Mountain Returner",   desc: "Return after 7+ days away and complete a lesson", category: "Special", xp: 10 },
  { id: "night-owl",      icon: "🦉", name: "Night Owl",           desc: "Complete a lesson between 11 PM – 4 AM",  category: "Special",    xp:   5 },
  { id: "early-bird",     icon: "🌅", name: "Early Bird",          desc: "Complete a lesson between 5 AM – 7 AM",   category: "Special",    xp:   5 },
];

export const ACHIEVEMENT_CATEGORY_ORDER = [
  "Milestones", "XP", "Streaks", "Time", "Level",
  "Performance", "AI", "Exploration", "Challenges", "Special",
];

// ─── ACHIEVEMENT STORAGE ─────────────────────────────────────────────────────

export function getAchievements(userId) {
  return lsGetJSON("lp_achievements_" + (userId || "anon"), []);
  // shape: [{ id: string, earnedAt: ISO string }]
}

/**
 * Grant an achievement. Returns the achievement object if newly granted, null if already earned.
 * Caller is responsible for awarding the .xp and showing a toast.
 */
export function grantAchievement(userId, achievementId) {
  const list = getAchievements(userId);
  if (list.some(a => a.id === achievementId)) return null;
  list.push({ id: achievementId, earnedAt: new Date().toISOString() });
  lsSetJSON("lp_achievements_" + (userId || "anon"), list);
  return ACHIEVEMENTS.find(a => a.id === achievementId) || null;
}

export function hasAchievement(userId, achievementId) {
  return getAchievements(userId).some(a => a.id === achievementId);
}

// ─── ACCOUNT AGE & TIME MILESTONES ───────────────────────────────────────────

export function getAccountCreationDate(userId) {
  const key = "lp_created_" + (userId || "anon");
  let d;
  try { d = localStorage.getItem(key); } catch { d = null; }
  if (!d) {
    d = new Date().toISOString().slice(0, 10);
    try { localStorage.setItem(key, d); } catch {}
  }
  return d;
}

const TIME_MILESTONES = [
  { days:  30, id: "days-30"  },
  { days:  60, id: "days-60"  },
  { days:  90, id: "days-90"  },
  { days: 180, id: "days-180" },
  { days: 365, id: "days-365" },
];

/**
 * Check which time milestones have been crossed and haven't been granted yet.
 * Returns array of newly granted achievement objects (with .xp).
 * Safe to call on every app launch — already-earned milestones are skipped.
 */
export function checkTimeMilestones(userId) {
  const created   = new Date(getAccountCreationDate(userId));
  const daysSince = Math.floor((Date.now() - created.getTime()) / 86_400_000);
  const granted   = [];
  for (const m of TIME_MILESTONES) {
    if (daysSince >= m.days) {
      const a = grantAchievement(userId, m.id);
      if (a) granted.push(a);
    }
  }
  return granted; // caller adds a.xp to progress and shows toast for each
}

// ─── LESSON COUNT ─────────────────────────────────────────────────────────────

export function getLessonCount(userId) {
  return lsGetJSON("lp_lesson_count_" + (userId || "anon"), 0);
}
function incrementLessonCount(userId) {
  const next = getLessonCount(userId) + 1;
  lsSetJSON("lp_lesson_count_" + (userId || "anon"), next);
  return next;
}

const LESSON_COUNT_MILESTONES = [
  { count:  10, id: "lessons-10"  },
  { count:  50, id: "lessons-50"  },
  { count: 100, id: "lessons-100" },
  { count: 250, id: "lessons-250" },
];

// ─── CONSECUTIVE PERFECT LESSONS ─────────────────────────────────────────────

function getPerfectStreak(userId) {
  return lsGetJSON("lp_perfect_streak_" + (userId || "anon"), { count: 0, total3Stars: 0 });
}
function updatePerfectStreak(userId, stars) {
  const s = getPerfectStreak(userId);
  const count     = stars === 3 ? s.count + 1 : 0;
  const total3Stars = stars === 3 ? s.total3Stars + 1 : s.total3Stars;
  lsSetJSON("lp_perfect_streak_" + (userId || "anon"), { count, total3Stars });
  return { count, total3Stars };
}

// ─── STREAK MILESTONES ────────────────────────────────────────────────────────

const STREAK_MILESTONES = [
  { count:   7, id: "streak-7",   xp:  15, msg: "7 days on the mountain! The view is getting better." },
  { count:  10, id: null,         xp:  20, msg: "10 days without stopping. You're building a habit." },
  { count:  25, id: null,         xp:  50, msg: "25 days straight. The trail knows your footsteps." },
  { count:  30, id: "streak-30",  xp:  30, msg: "One full month. The lantern burns bright." },
  { count:  50, id: null,         xp: 100, msg: "50 days in a row — extraordinary consistency." },
  { count: 100, id: "streak-100", xp: 100, msg: "100 days. You are the mountain." },
  { count: 365, id: "streak-365", xp: 365, msg: "A full year without stopping. Legendary." },
];

// ─── DAILY CHALLENGES ────────────────────────────────────────────────────────

const CHALLENGE_POOL = [
  { id: "c1",  text: "Complete any lesson",               key: "lessonsToday",    threshold: 1 },
  { id: "c2",  text: "Earn a perfect score (3 stars)",    key: "perfectToday",    threshold: 1 },
  { id: "c3",  text: "Complete 2 lessons today",          key: "lessonsToday",    threshold: 2 },
  { id: "c4",  text: "Use the AI tutor",                  key: "aiSessionsToday", threshold: 1 },
  { id: "c5",  text: "Finish a grammar exercise",         key: "grammarToday",    threshold: 1 },
  { id: "c6",  text: "Review your mistake list",          key: "reviewScrolled",  threshold: true },
  { id: "c7",  text: "Complete a dialogue phase",         key: "dialogueToday",   threshold: 1 },
  { id: "c8",  text: "Earn 50 XP today",                  key: "xpToday",         threshold: 50 },
  { id: "c9",  text: "Try a different language today",    key: "newLangToday",    threshold: true },
  { id: "c10", text: "Complete 3 lessons today",          key: "lessonsToday",    threshold: 3 },
];

function seededIndex(seed, max) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % max;
}

export function getDailyChallenges(userId) {
  const today = new Date().toISOString().slice(0, 10);
  const seed  = (userId || "anon") + today;
  const i1    = seededIndex(seed, CHALLENGE_POOL.length);
  let   i2    = seededIndex(seed + "b", CHALLENGE_POOL.length);
  if (i2 === i1) i2 = (i2 + 1) % CHALLENGE_POOL.length;
  return [CHALLENGE_POOL[i1], CHALLENGE_POOL[i2]];
}

export function getDailyChallengeProgress(userId) {
  const today  = new Date().toISOString().slice(0, 10);
  const stored = lsGetJSON("lp_challenges_" + (userId || "anon"), {});
  if (stored.date !== today) return { date: today, completed: [], bonusClaimed: false };
  return stored;
}

function saveDailyChallengeProgress(userId, prog) {
  lsSetJSON("lp_challenges_" + (userId || "anon"), prog);
}

// ─── DAILY STATS (for challenge evaluation) ──────────────────────────────────

export function getDailyStats(userId) {
  const today  = new Date().toISOString().slice(0, 10);
  const stored = lsGetJSON("lp_daily_stats_" + (userId || "anon"), {});
  if (stored.date !== today) return {
    date: today, lessonsToday: 0, perfectToday: 0,
    aiSessionsToday: 0, grammarToday: 0, dialogueToday: 0,
    xpToday: 0, reviewScrolled: false, newLangToday: false,
  };
  return stored;
}

export function updateDailyStats(userId, updates) {
  const stats = getDailyStats(userId);
  const next  = { ...stats, ...updates };
  lsSetJSON("lp_daily_stats_" + (userId || "anon"), next);
  return next;
}

function evaluateChallenges(challenges, stats) {
  return challenges.filter(c => {
    const val = stats[c.key];
    if (typeof c.threshold === "boolean") return val === true;
    return (val || 0) >= c.threshold;
  }).map(c => c.id);
}

// ─── MAIN REWARD CALCULATOR ──────────────────────────────────────────────────
/**
 * Call this inside markComplete (MountainAppShell) INSTEAD of the current
 * calcLessonXP + updateStreak calls.
 *
 * @param {object} params
 * @param {string} params.userId
 * @param {string} params.langCode
 * @param {number} params.stars          1 | 2 | 3
 * @param {boolean} params.proUser
 * @param {object} params.curriculum     full curriculum object for active language
 * @param {object} params.currentProgress { completed: [], xp: number }
 * @param {function} params.updateStreakFn  pass the existing updateStreak from appState.js
 * @param {boolean} params.hasGrammarPhase did this lesson include a grammar section?
 * @param {boolean} params.hasDialoguePhase did this lesson include a dialogue section?
 *
 * @returns {{ totalXP: number, breakdown: object, newAchievements: Achievement[], toasts: Toast[] }}
 *   breakdown — every non-zero XP source
 *   newAchievements — grant these; caller should save to progress
 *   toasts — ordered list ready to display
 */
export function calculateRewards({
  userId, langCode, stars, proUser,
  curriculum, currentProgress,
  updateStreakFn,
  hasGrammarPhase = false,
  hasDialoguePhase = false,
}) {
  const newAchievements = [];
  const toasts = [];
  const breakdown = {};

  function grant(achievementId) {
    const a = grantAchievement(userId, achievementId);
    if (a) {
      newAchievements.push(a);
      if (a.xp > 0) breakdown[`achievement_${a.id}`] = a.xp;
      toasts.push({ type: "achievement", achievement: a });
    }
  }
  function addXP(key, amount, toastObj) {
    if (!amount) return;
    breakdown[key] = (breakdown[key] || 0) + amount;
    if (toastObj) toasts.push(toastObj);
  }

  // 1. Streak
  const streakData  = updateStreakFn(userId);
  const streakCount = streakData.count;

  // 2. Base lesson XP
  const base = stars === 3 ? XP.PERFECT_LESSON : stars === 2 ? XP.LESSON : XP.MANY_MISTAKES;
  const streakBonus = XP.STREAK_BONUS[Math.min(streakCount, 7)];
  const multiplier  = proUser ? 1.15 : 1;
  addXP("base", Math.round(base * multiplier));
  if (streakBonus) addXP("streakDailyBonus", Math.round(streakBonus * multiplier));

  // 3. First lesson ever
  if (!hasAchievement(userId, "first-lesson")) {
    addXP("firstLesson", XP.FIRST_LESSON);
    grant("first-lesson");
  }

  // 4. Lesson count milestones
  const totalLessons = incrementLessonCount(userId);
  for (const m of LESSON_COUNT_MILESTONES) {
    if (totalLessons === m.count) grant(m.id);
  }

  // 5. Streak milestones (hit exactly this count for the first time)
  for (const m of STREAK_MILESTONES) {
    if (streakCount === m.count) {
      if (!hasAchievement(userId, m.id || `__streak_${m.count}`)) {
        addXP(`streakMilestone_${m.count}`, m.xp, { type: "streak", xp: m.xp, label: m.msg });
        if (m.id) grant(m.id);
        // Mark that we've paid out this numeric milestone even if there's no achievement id
        if (!m.id) {
          const phantom = getAchievements(userId);
          phantom.push({ id: `__streak_${m.count}`, earnedAt: new Date().toISOString() });
          lsSetJSON("lp_achievements_" + (userId || "anon"), phantom);
        }
      }
    }
  }

  // 6. Consecutive perfect lessons
  const { count: perfectCount, total3Stars } = updatePerfectStreak(userId, stars);
  if (perfectCount === 5 && !hasAchievement(userId, "perfect-5")) grant("perfect-5");
  if (total3Stars === 10 && !hasAchievement(userId, "no-mistakes-10")) grant("no-mistakes-10");

  // 7. XP total milestones
  const newTotalXP = (currentProgress.xp || 0) + Object.values(breakdown).reduce((a, b) => a + b, 0);
  for (const [threshold, id] of [[100,"xp-100"],[500,"xp-500"],[1000,"xp-1000"],[5000,"xp-5000"]]) {
    if (newTotalXP >= threshold && !hasAchievement(userId, id)) grant(id);
  }

  // 8. Level completions
  for (const level of ["A1","A2","B1","B2","C1","C2"]) {
    const mods = curriculum?.[level]?.modules || [];
    if (!mods.length) continue;
    const id = `${level.toLowerCase()}-complete`;
    if (!hasAchievement(userId, id)) {
      // all mods completed after this lesson?
      const allCompleted = mods.every(m =>
        currentProgress.completed.includes(m.id) || m.id === "THIS_LESSON_ID"
      );
      // We can't know the current lesson id here, so caller should re-check after save
      // This is handled by checkLevelCompletions() below — call it after saveProgress
    }
  }

  // 9. Time milestones
  const timeMilestones = checkTimeMilestones(userId);
  for (const a of timeMilestones) {
    newAchievements.push(a);
    if (a.xp > 0) addXP(`timeMilestone_${a.id}`, a.xp, { type: "xp_bonus", xp: a.xp, label: a.name });
  }

  // 10. Special — time of day
  const hour = new Date().getHours();
  if ((hour >= 23 || hour < 4) && !hasAchievement(userId, "night-owl")) grant("night-owl");
  if (hour >= 5 && hour < 7    && !hasAchievement(userId, "early-bird")) grant("early-bird");

  // 11. Special — comeback (streak was 0 yesterday, now 1 after a long absence)
  // We detect this by checking lastDate gap. updateStreakFn already ran; reread streak.
  // We approximate: if streak just reset to 1 and last lesson was >7 days ago.
  // Since we don't have prior streak data at this point, check via lp_last_lesson_date
  (() => {
    const lastKey  = "lp_last_lesson_date_" + (userId || "anon");
    const lastDate = localStorage.getItem(lastKey);
    const today    = new Date().toISOString().slice(0, 10);
    if (lastDate) {
      const gap = Math.floor((new Date(today) - new Date(lastDate)) / 86_400_000);
      if (gap >= 7 && !hasAchievement(userId, "comeback")) grant("comeback");
    }
    localStorage.setItem(lastKey, today);
  })();

  // 12. Update daily stats
  const stats = getDailyStats(userId);
  const updatedStats = updateDailyStats(userId, {
    lessonsToday:    (stats.lessonsToday || 0) + 1,
    perfectToday:    (stats.perfectToday || 0) + (stars === 3 ? 1 : 0),
    grammarToday:    (stats.grammarToday || 0) + (hasGrammarPhase ? 1 : 0),
    dialogueToday:   (stats.dialogueToday || 0) + (hasDialoguePhase ? 1 : 0),
    xpToday:         (stats.xpToday || 0) + Object.values(breakdown).reduce((a, b) => a + b, 0),
  });

  // 13. Daily challenges
  const challenges      = getDailyChallenges(userId);
  const challengeProg   = getDailyChallengeProgress(userId);
  const nowMet          = evaluateChallenges(challenges, updatedStats);
  const newlyCompleted  = nowMet.filter(id => !challengeProg.completed.includes(id));

  for (const id of newlyCompleted) {
    challengeProg.completed.push(id);
    addXP(`challenge_${id}`, 15, {
      type: "challenge",
      xp: 15,
      label: challenges.find(c => c.id === id)?.text || "Daily Challenge",
    });
  }

  const allDone = challenges.every(c => challengeProg.completed.includes(c.id));
  if (allDone && !challengeProg.bonusClaimed) {
    challengeProg.bonusClaimed = true;
    addXP("fullHouseBonus", 5, { type: "challenge", xp: 5, label: "Full House Bonus!" });

    // Challenge streak tracking
    const today = new Date().toISOString().slice(0, 10);
    const csKey = "lp_challenge_streak_" + (userId || "anon");
    const cs = lsGetJSON(csKey, { count: 0, lastDate: null });
    const yest = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    const newCount = cs.lastDate === yest ? cs.count + 1 : 1;
    lsSetJSON(csKey, { count: newCount, lastDate: today });
    if (newCount === 7  && !hasAchievement(userId, "daily-7"))  grant("daily-7");
    if (newCount === 30 && !hasAchievement(userId, "daily-30")) grant("daily-30");
  }
  saveDailyChallengeProgress(userId, challengeProg);

  // 14. Multi-language exploration
  (() => {
    const startedKey = "lp_started_langs_" + (userId || "anon");
    const started    = lsGetJSON(startedKey, []);
    if (!started.includes(langCode)) {
      started.push(langCode);
      lsSetJSON(startedKey, started);
    }
    if (started.length >= 2 && !hasAchievement(userId, "two-languages"))  grant("two-languages");
    if (started.length >= 5 && !hasAchievement(userId, "five-languages")) grant("five-languages");
  })();

  // Final total
  const totalXP = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return {
    totalXP,
    breakdown,
    newAchievements,
    toasts,
    streakCount,
    stars,
    challengesCompleted: newlyCompleted,
  };
}

/**
 * Call this AFTER saveProgress, passing the newly completed lessonId.
 * Checks and grants level-completion achievements.
 */
export function checkLevelCompletions(userId, curriculum, completedIds) {
  const granted = [];
  for (const level of ["A1","A2","B1","B2","C1","C2"]) {
    const mods = curriculum?.[level]?.modules || [];
    if (!mods.length) continue;
    const id = `${level.toLowerCase()}-complete`;
    if (!hasAchievement(userId, id) && mods.every(m => completedIds.includes(m.id))) {
      const a = grantAchievement(userId, id);
      if (a) granted.push(a);
    }
  }
  return granted;
}

/**
 * Call after an AI tutor session ends.
 * Pass aiSessionCount = total number of AI sessions completed so far (including this one).
 */
export function rewardAISession(userId, aiSessionCount) {
  const granted = [];
  const a1 = grantAchievement(userId, "ai-session");
  if (a1) granted.push(a1);
  if (aiSessionCount >= 10) {
    const a2 = grantAchievement(userId, "ai-sessions-10");
    if (a2) granted.push(a2);
  }
  return { xp: XP.AI_CONVERSATION, newAchievements: granted };
}

/**
 * Call after an exam is completed.
 * scorePercent: 0–100
 */
export function rewardExam(userId, scorePercent) {
  const granted = [];
  const a1 = grantAchievement(userId, "exam-pass");
  if (a1) granted.push(a1);
  let xp = XP.AI_EXAM_PASS;
  if (scorePercent >= 80) {
    xp += XP.AI_EXAM_HIGH;
    const a2 = grantAchievement(userId, "exam-80");
    if (a2) granted.push(a2);
  }
  return { xp, newAchievements: granted };
}
