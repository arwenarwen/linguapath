import { useState, useEffect, useCallback, useRef } from "react";
import BottomNavPro from "../components/BottomNavPro";
import WaitlistPage from "./WaitlistPage";
import StatueShopPage from "./StatueShopPage";
import LearnJourneyPage from "./LearnJourneyPage";
import SituationsHub from "./SituationsHub";
import TutorModesPage from "./TutorModesPage";
import ReviewBackpackPage from "./ReviewBackpackPage";
import ProfileSummitPage from "./ProfileSummitPage";
import LessonView from "../components/LessonView";
import AIChat from "../components/AIChat";
import SituationDetail from "../components/SituationDetail";
import "../styles/theme.css";
import {
  supabase, lsGet, lsSet,
  loadProgress, saveProgress, stopAllAudio,
  updateStreak, getStreak,
  getEnergy, spendEnergy, addEnergy, applyAdRefill, getEnergyRechargeMinutes,
  ENERGY_MAX, ENERGY_PER_LESSON,
  getUserPlan, isPro,
  canStartLesson, incrementDailyLesson, getDailyUsage, addDailyXp,
  FREE_LESSONS_PER_DAY, levelUsesEnergy, savePlacementState, getPlacementState,
  getTrailPoints, addTrailPoints, trailPointsForLesson, getCheckpointPass,
  saveLessonStars, getLessonStarsMap, getXPLevel, LEVEL_TITLES, getDailyGoalProgress, DAILY_LESSON_GOAL
} from "../lib/appState";
import {
  calculateRewards,
  checkLevelCompletions,
  checkTimeMilestones,
} from "../lib/rewards";

const _langFiles = import.meta.glob("/languages/*.json", { eager: true });
const CURRICULA = {};
for (const [path, mod] of Object.entries(_langFiles)) {
  const data = mod?.default || mod || {};
  const code = data.code || path.split("/").pop().replace(".json","").slice(0,2);
  CURRICULA[code] = data;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 200,
    background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "flex-end", justifyContent: "center",
    animation: "fadeIn .2s ease",
  },
  modal: {
    width: "100%", maxWidth: 480,
    background: "linear-gradient(180deg,#1a2030,#131824)",
    borderRadius: "28px 28px 0 0",
    padding: "28px 24px 40px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderBottom: "none",
    animation: "slideUp .3s cubic-bezier(.16,1,.3,1)",
    position: "relative",
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    background: "rgba(255,255,255,0.15)",
    margin: "0 auto 20px",
  },
  pill: (color) => ({
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "5px 14px", borderRadius: 20,
    background: color + "18", border: "1px solid " + color + "40",
    color: color, fontSize: 13, fontWeight: 700,
  }),
  btn: (variant) => {
    const base = {
      width: "100%", padding: "15px", borderRadius: 14,
      border: "none", fontFamily: "var(--font-body)",
      fontSize: 15, fontWeight: 700, cursor: "pointer",
    };
    if (variant === "gold") return { ...base, background: "linear-gradient(135deg,#c9a84c,#a8752e)", color: "#120d00" };
    if (variant === "outline") return { ...base, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.7)" };
    if (variant === "ghost") return { ...base, background: "none", color: "rgba(255,255,255,0.45)", fontSize: 14, padding: "10px" };
    return base;
  },
};

// ── Energy bar component ──────────────────────────────────────────────────────
function EnergyBar({ userId, proUser, activeLevel }) {
  const [energy, setEnergy] = useState(() => getEnergy(userId));
  useEffect(() => {
    if (proUser) return;
    const t = setInterval(() => setEnergy(getEnergy(userId)), 15000);
    return () => clearInterval(t);
  }, [userId, proUser]);

  if (proUser || !levelUsesEnergy(activeLevel)) return null;
  const pct = Math.round((energy / ENERGY_MAX) * 100);
  const color = energy >= 60 ? "#22c55e" : energy >= 20 ? "#c9a84c" : "#ef4444";

  return (
    <div style={{ padding: "8px 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 14 }}>⚡</span>
      <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: pct + "%", borderRadius: 3,
          background: color, transition: "width 1s ease",
        }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", minWidth: 32 }}>
        {energy}/{ENERGY_MAX}
      </span>
    </div>
  );
}

// ── Low energy modal ──────────────────────────────────────────────────────────
function LowEnergyModal({ energy, onWatchAd, onUpgrade, onClose }) {
  const mins = Math.ceil((ENERGY_PER_LESSON - energy) * 5);
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalHandle} />
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>⚡</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            Not enough energy
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            You need {ENERGY_PER_LESSON} energy to start a lesson.<br />
            You have {energy} — recharges {mins} min.
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 28 }}>📺</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Watch a short ad</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>+20 energy — unlocks 1 lesson instantly</div>
          </div>
          <button onClick={onWatchAd} style={{ padding: "8px 16px", borderRadius: 20, border: "1px solid rgba(201,168,76,0.4)", background: "rgba(201,168,76,0.12)", color: "#c9a84c", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" }}>
            Watch
          </button>
        </div>

        <button style={{ ...S.btn("gold"), marginBottom: 10 }} onClick={onUpgrade}>
          Unlock unlimited energy — Go Pro
        </button>
        <button style={S.btn("ghost")} onClick={onClose}>Wait for recharge</button>
      </div>
    </div>
  );
}

// ── Daily limit modal ─────────────────────────────────────────────────────────
function DailyLimitModal({ used, max, onUpgrade, onClose }) {
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalHandle} />
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🎯</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            Daily limit reached
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 16 }}>
            You've completed {used} of {max} free lessons today.<br />
            Your daily limit resets at midnight — or keep going now with Pro.
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 8 }}>
            {Array.from({ length: max }, (_, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: "50%",
                background: i < used ? "#22c55e" : "rgba(255,255,255,0.08)",
                border: "2px solid " + (i < used ? "#22c55e" : "rgba(255,255,255,0.12)"),
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
              }}>
                {i < used ? "✓" : ""}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.05))", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: "#f0cf83" }}>Go Pro — $6.99/month</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
            ✓ Unlimited lessons every day<br />
            ✓ Unlimited AI conversations<br />
            ✓ No energy restrictions<br />
            ✓ +15% XP boost on every lesson
          </div>
        </div>

        <button style={{ ...S.btn("gold"), marginBottom: 10 }} onClick={onUpgrade}>
          Unlock Full Journey
        </button>
        <button style={S.btn("ghost")} onClick={onClose}>Come back tomorrow</button>
      </div>
    </div>
  );
}

// ── Upgrade modal ─────────────────────────────────────────────────────────────
function UpgradeModal({ onClose, userId }) {
  const [selected, setSelected] = useState("annual");

  function handlePurchase() {
    import("../lib/appState").then(m => {
      m.setUserPlan(userId, "pro");
      onClose(true);
    });
  }

  const plans = [
    { id: "monthly", label: "Monthly", price: "$6.99", per: "per month", tag: null },
    { id: "annual",  label: "Annual",  price: "$69.99", per: "per year", tag: "2 months free" },
  ];

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.modal, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={S.modalHandle} />
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🦊✨</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, marginBottom: 6 }}>
            LingoTrailz Pro
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
            Unlock your full language journey
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {["Unlimited lessons every day", "Unlimited AI conversations", "No energy waiting", "+15% XP on every lesson", "Offline mode (coming soon)"].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
              <span style={{ color: "#22c55e", fontWeight: 700 }}>✓</span>
              <span style={{ color: "rgba(255,255,255,0.8)" }}>{f}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {plans.map(plan => (
            <button key={plan.id} onClick={() => setSelected(plan.id)} style={{
              flex: 1, padding: 14, borderRadius: 14, cursor: "pointer", fontFamily: "var(--font-body)",
              border: "2px solid " + (selected === plan.id ? "#c9a84c" : "rgba(255,255,255,0.1)"),
              background: selected === plan.id ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.04)",
              position: "relative", textAlign: "center",
            }}>
              {plan.tag && (
                <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#22c55e", color: "#000", fontSize: 10, fontWeight: 800, padding: "2px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
                  {plan.tag}
                </div>
              )}
              <div style={{ fontWeight: 700, color: selected === plan.id ? "#c9a84c" : "rgba(255,255,255,0.8)", marginBottom: 2 }}>{plan.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: selected === plan.id ? "#f0cf83" : "rgba(255,255,255,0.9)" }}>{plan.price}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{plan.per}</div>
            </button>
          ))}
        </div>

        <button style={{ ...S.btn("gold"), marginBottom: 10 }} onClick={handlePurchase}>
          Start Pro — {selected === "annual" ? "$69.99/year" : "$6.99/month"}
        </button>
        <button style={S.btn("ghost")} onClick={() => onClose(false)}>Maybe later</button>
        <div style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 10 }}>
          Cancel anytime. No hidden fees.
        </div>
      </div>
    </div>
  );
}

// ── XP reward toast ───────────────────────────────────────────────────────────
function XPToast({ xp, tp, stars, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)",
      zIndex: 300, display: "flex", gap: 8,
      animation: "fadeUp .3s ease, fadeIn .3s ease",
    }}>
      <div style={S.pill("#c9a84c")}>
        <span>⚡</span><span>+{xp} XP</span>
      </div>
      <div style={S.pill("#a78bfa")}>
        <span>🏔️</span><span>+{tp} pts</span>
      </div>
      {stars === 3 && (
        <div style={S.pill("#f5c842")}>
          <span>⭐</span><span>Perfect!</span>
        </div>
      )}
    </div>
  );
}

// ── Main shell ────────────────────────────────────────────────────────────────
export default function MountainAppShell({ user, activeLang: activeLangProp, onChangeLang, onLogout, defaultPage }) {
  const [tab, setTab] = useState(defaultPage || "learn");
  const [activeLang, setActiveLang] = useState(activeLangProp || "de");
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeAI, setActiveAI] = useState(null);
  const [activeSituation, setActiveSituation] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress(user?.id, activeLangProp || "de"));
  const [justCompletedId, setJustCompletedId] = useState(null);
  const [lastStars, setLastStars] = useState(0);
  const [animTrigger, setAnimTrigger] = useState(0);
  const [autoStartLesson, setAutoStartLesson] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [rewardSummary, setRewardSummary] = useState(null);
  const [levelUpModal, setLevelUpModal] = useState(null); // { from, to, title }
  const [chestModal, setChestModal] = useState(null);     // { xp, stars }
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showStatues, setShowStatues] = useState(false);
  const [starsMap, setStarsMap] = useState(() => getLessonStarsMap(user?.id, activeLangProp || "de"));
  const prevXPLevelRef = useRef(getXPLevel(loadProgress(user?.id, activeLangProp || "de").xp).level);
  const progressRef = useRef(progress);
  const userPlan = getUserPlan(user?.id);
  const proUser = userPlan === "pro";

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { if (activeLangProp) setActiveLang(activeLangProp); }, [activeLangProp]);

  // Close lesson instantly — no fade-out, so the dark shell never flashes through.
  // The trail is always rendered behind the lesson overlay; closing simply reveals it.
  function closeLesson(callback) {
    setActiveLesson(null);
    callback?.();
  }

  // FIX 8: auto-start the next lesson after completion (with optional delay)
  useEffect(() => {
    if (!autoStartLesson) return;
    const { module, levelKey, levelColor, delayMs = 0 } = autoStartLesson;
    const t = setTimeout(() => {
      setAutoStartLesson(null);
      const check = canStartLesson(user?.id, levelKey);
      if (!check.allowed) { setModal(check.reason === "low_energy" ? "low_energy" : "daily_limit"); return; }
      if (!isPro(user?.id) && levelUsesEnergy(levelKey)) { spendEnergy(user?.id); incrementDailyLesson(user?.id); }
      setJustCompletedId(null);
      setRewardSummary(null);
      setActiveLesson({ module, levelKey, levelColor });
    }, delayMs);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStartLesson]);

  // Load progress + merge with Supabase
  useEffect(() => {
    const p = loadProgress(user?.id, activeLang);
    setProgress(p); progressRef.current = p;
    if (user?.id) {
      supabase.from("progress").select("completed,xp")
        .eq("user_id", user.id).eq("language", activeLang).maybeSingle()
        .then(({ data }) => {
          if (!data) return;
          const cur = progressRef.current;
          const merged = {
            completed: Array.from(new Set([...cur.completed, ...(data.completed || [])])),
            xp: Math.max(cur.xp, data.xp || 0),
          };
          setProgress(merged); progressRef.current = merged;
          saveProgress(user?.id, activeLang, merged);
        }).catch(() => {});
    }
  }, [user?.id, activeLang]);

  // Check time-based milestones on login (account age rewards)
  useEffect(() => {
    if (!user?.id) return;
    const timeMilestones = checkTimeMilestones(user.id);
    if (timeMilestones.length > 0) {
      const bonusXP = timeMilestones.reduce((s, a) => s + (a.xp || 0), 0);
      if (bonusXP > 0) {
        const p = progressRef.current;
        const next = { ...p, xp: p.xp + bonusXP };
        setProgress(next);
        progressRef.current = next;
        saveProgress(user.id, activeLang, next);
      }
      // Show first milestone as a toast
      const first = timeMilestones[0];
      if (first) setToast({ xp: first.xp, tp: 0, stars: 0, label: first.name });
    }
  }, [user?.id]);

  const markComplete = useCallback((moduleId, xpIgnored, stars, lessonMeta = {}) => {
    stars = stars || 0;
    const current = progressRef.current;
    if (current.completed.includes(moduleId)) return;

    const curriculum = CURRICULA[activeLang] || {};

    // Run full reward calculation
    const summary = calculateRewards({
      userId:           user?.id,
      langCode:         activeLang,
      stars,
      proUser,
      curriculum,
      currentProgress:  current,
      updateStreakFn:   updateStreak,
      hasGrammarPhase:  lessonMeta.hasGrammar  ?? false,
      hasDialoguePhase: lessonMeta.hasDialogue ?? false,
    });

    const earnedTP = trailPointsForLesson(stars);

    const next = {
      completed: [...current.completed, moduleId],
      xp: current.xp + summary.totalXP,
    };

    setProgress(next);
    progressRef.current = next;
    saveProgress(user?.id, activeLang, next);
    addTrailPoints(user?.id, earnedTP);
    addDailyXp(user?.id, summary.totalXP);

    // Check if this lesson completed an entire CEFR level
    const levelAchievements = checkLevelCompletions(user?.id, curriculum, next.completed);
    if (levelAchievements.length > 0) {
      summary.newAchievements.push(...levelAchievements);
      const bonusXP = levelAchievements.reduce((sum, a) => sum + (a.xp || 0), 0);
      if (bonusXP > 0) {
        const withBonus = { ...next, xp: next.xp + bonusXP };
        setProgress(withBonus);
        progressRef.current = withBonus;
        saveProgress(user?.id, activeLang, withBonus);
        summary.totalXP += bonusXP;
      }
    }

    if (user?.id) {
      supabase.from("progress").upsert({
        user_id: user.id, language: activeLang,
        completed: next.completed, xp: next.xp,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,language" }).then(null, () => {});
    }

    // Save stars per lesson
    saveLessonStars(user?.id, activeLang, moduleId, stars);
    setStarsMap(getLessonStarsMap(user?.id, activeLang));

    // Check for level-up — delay so the Complete screen is visible first
    const newXPTotal = next.xp;
    const newLevel = getXPLevel(newXPTotal).level;
    if (newLevel > prevXPLevelRef.current) {
      const _from = prevXPLevelRef.current;
      const _to   = newLevel;
      const _title = LEVEL_TITLES[newLevel];
      setTimeout(() => setLevelUpModal({ from: _from, to: _to, title: _title }), 1200);
    }
    prevXPLevelRef.current = newLevel;

    // Chest reward every 3 lessons
    if (next.completed.length % 3 === 0) {
      setTimeout(() => setChestModal({ xp: summary.totalXP, stars }), 1400);
    }

    setRewardSummary(summary);
    setJustCompletedId(moduleId);
    setLastStars(stars);
    setToast({ xp: summary.totalXP, tp: earnedTP, stars });
  }, [user?.id, activeLang, proUser]);

  function handleTabChange(t) {
    stopAllAudio();
    setActiveLesson(null); setActiveAI(null); setActiveSituation(null);
    if (t !== "learn") { setJustCompletedId(null); setAutoStartLesson(null); }
    lsSet("lp_tab", t); setTab(t);
  }

  function requestLesson(module, levelKey, levelColor) {
    const check = canStartLesson(user?.id, levelKey);
    if (!check.allowed) {
      setModal(check.reason === "low_energy" ? "low_energy" : "daily_limit");
      return;
    }
    if (!proUser) {
      if (levelUsesEnergy(levelKey)) { spendEnergy(user?.id); incrementDailyLesson(user?.id); }
    }
    lsSet(`lp_trail_anchor_${user?.id || "anon"}_${activeLang}`, `lesson-${module.id}`);
    setJustCompletedId(null);
    setAutoStartLesson(null);
    setRewardSummary(null);
    setActiveLesson({ module, levelKey, levelColor });
  }

  function handleWatchAd() {
    applyAdRefill(user?.id);
    setModal(null);
  }

  const curriculum = CURRICULA[activeLang] || {};
  const langName = curriculum.language || activeLang.toUpperCase();

  const getAllMods = () => ["A1","A2","B1","B2","C1","C2"].flatMap(k => curriculum[k]?.modules || []);

  const isAdmin = user?.email?.toLowerCase() === "borowiakarwen@gmail.com";
  const effectiveProgress = isAdmin
    ? { ...progress, completed: [...new Set([...progress.completed, ...getAllMods().map(m => m.id)])] }
    : progress;

  // ── Fullscreen overlay helpers (computed outside main return so vars are available) ──
  const allModsForLesson = getAllMods();
  const activeLessonIdx = activeLesson ? allModsForLesson.findIndex(m => m.id === activeLesson.module.id) : -1;
  const nextModForLesson = activeLesson ? (allModsForLesson[activeLessonIdx + 1] || null) : null;
  const findLevel = (mod) => {
    for (const k of ["A1","A2","B1","B2","C1","C2"]) {
      if (curriculum[k]?.modules?.some(m => m.id === mod.id))
        return { key: k, color: curriculum[k]?.color || "#22c55e" };
    }
    return { key: "A1", color: "#22c55e" };
  };

  // ── Main tabbed UI — overlays rendered inside so shell stays mounted (no black-screen on close) ──
  return (
    <div className="mountain-app-shell">
      <div className="mountain-backdrop">
        <div className="mountain-layer back" />
        <div className="mountain-layer mid" />
        <div className="mountain-mist" />
      </div>

      {!proUser && (
        <div style={{ position: "relative", zIndex: 10 }}>
          <EnergyBar userId={user?.id} proUser={proUser} activeLevel={(getPlacementState(user?.id, activeLang)?.placedLevel) || "A2"} />
        </div>
      )}

      {/* Waitlist banner removed */}

      <div style={{ position: "relative", paddingBottom: 64 }}>
        {tab === "learn" && (
          <LearnJourneyPage
            curriculum={curriculum} progress={effectiveProgress}
            langName={langName} langCode={activeLang}
            user={user} isPro={proUser}
            justCompletedId={justCompletedId} lastStars={lastStars} animTrigger={animTrigger}
            autoStartLesson={autoStartLesson}
            starsMap={starsMap}
            onSelectLesson={requestLesson}
            onUpgrade={() => setModal("upgrade")}
            onStatues={() => setShowStatues(true)}
            placedLevel={(getPlacementState(user?.id, activeLang)?.placedLevel)||"A1"}
          />
        )}
        {tab === "situations" && (
          <SituationsHub langCode={activeLang} onSelectSituation={s => setActiveSituation(s)} />
        )}
        {tab === "ai" && (
          <TutorModesPage langCode={activeLang} langName={langName} onStartAI={s => setActiveAI(s)} />
        )}
        {tab === "review" && (
          <ReviewBackpackPage userId={user?.id} langCode={activeLang} langName={langName} />
        )}
        {tab === "profile" && (
          <ProfileSummitPage
            user={user} progress={progress} curriculum={curriculum}
            curricula={CURRICULA}
            progressMap={Object.fromEntries(Object.keys(CURRICULA).map(code => [code, loadProgress(user?.id, code)]))}
            langCode={activeLang} langName={langName}
            isPro={proUser} trailPoints={getTrailPoints(user?.id)}
            onChangeLang={(code) => { if (code && code !== activeLang) { onChangeLang?.(code); } else { onChangeLang?.(); } }}
            onLogout={() => onLogout?.()}
            onUpgrade={() => setModal("upgrade")}
          />
        )}
      </div>

      <BottomNavPro activeTab={tab} onChange={handleTabChange} />

      {toast && <XPToast {...toast} onDone={() => setToast(null)} />}

      {modal === "low_energy" && (
        <LowEnergyModal
          energy={getEnergy(user?.id)}
          onWatchAd={handleWatchAd}
          onUpgrade={() => setModal("upgrade")}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "daily_limit" && (
        <DailyLimitModal
          used={getDailyUsage(user?.id).lessons || 0}
          max={FREE_LESSONS_PER_DAY}
          onUpgrade={() => setModal("upgrade")}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "upgrade" && (
        <UpgradeModal
          userId={user?.id}
          onClose={(didUpgrade) => {
            setModal(null);
            if (didUpgrade) window.location.reload();
          }}
        />
      )}

      {/* 📋 Waitlist */}
      {showWaitlist && <WaitlistPage onClose={() => setShowWaitlist(false)} />}

      {/* 🗿 Cultural statues */}
      {showStatues && <StatueShopPage userId={user?.id} langCode={activeLang} onClose={() => setShowStatues(false)} />}

      {/* 🎉 Level-up celebration */}
      {levelUpModal && (
        <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 24px" }} onClick={() => setLevelUpModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:"linear-gradient(135deg,#fff7ea,#ffe7c2)", borderRadius:28, padding:"36px 28px", textAlign:"center", maxWidth:340, width:"100%", boxShadow:"0 24px 60px rgba(245,165,36,0.35)", border:"2px solid rgba(245,165,36,0.35)", animation:"slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <div style={{ fontSize:56, marginBottom:8, animation:"idleBob 2s ease-in-out infinite" }}>🏆</div>
            <div style={{ fontSize:13, fontWeight:800, letterSpacing:2, color:"rgba(107,61,16,0.55)", textTransform:"uppercase", marginBottom:4 }}>Level Up!</div>
            <div style={{ fontSize:28, fontWeight:900, color:"#4a2800", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:8 }}>{levelUpModal.title}</div>
            <div style={{ fontSize:13, color:"rgba(107,61,16,0.65)", marginBottom:24 }}>You reached a new rank on the trail. Keep climbing! 🌄</div>
            <button onClick={() => setLevelUpModal(null)} style={{ background:"linear-gradient(135deg,#f5a524,#c9a84c)", color:"#fff", border:"none", borderRadius:16, padding:"13px 32px", fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 16px rgba(245,165,36,0.4)" }}>Keep Going →</button>
          </div>
        </div>
      )}

      {/* 📦 Chest reward every 3 lessons */}
      {chestModal && (
        <div style={{ position:"fixed", inset:0, zIndex:499, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 24px" }} onClick={() => setChestModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:"linear-gradient(135deg,#fff7ea,#ffe7c2)", borderRadius:28, padding:"36px 28px", textAlign:"center", maxWidth:340, width:"100%", boxShadow:"0 24px 60px rgba(245,165,36,0.3)", border:"2px solid rgba(245,165,36,0.3)" }}>
            <div style={{ fontSize:60, marginBottom:8, animation:"idleBob 1.6s ease-in-out infinite" }}>📦</div>
            <div style={{ fontSize:13, fontWeight:800, letterSpacing:2, color:"rgba(107,61,16,0.55)", textTransform:"uppercase", marginBottom:4 }}>Chest Unlocked!</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#4a2800", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:8 }}>3-Lesson Reward</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center", margin:"16px 0" }}>
              <div style={{ background:"rgba(245,165,36,0.12)", border:"1px solid rgba(245,165,36,0.3)", borderRadius:14, padding:"12px 18px", textAlign:"center" }}>
                <div style={{ fontSize:20 }}>⚡</div>
                <div style={{ fontSize:14, fontWeight:900, color:"#f5a524" }}>+{chestModal.xp} XP</div>
              </div>
              <div style={{ background:"rgba(245,165,36,0.12)", border:"1px solid rgba(245,165,36,0.3)", borderRadius:14, padding:"12px 18px", textAlign:"center" }}>
                <div style={{ fontSize:20 }}>{"⭐".repeat(chestModal.stars)}</div>
                <div style={{ fontSize:14, fontWeight:900, color:"#f5a524" }}>{chestModal.stars} Stars</div>
              </div>
            </div>
            <button onClick={() => setChestModal(null)} style={{ background:"linear-gradient(135deg,#f5a524,#c9a84c)", color:"#fff", border:"none", borderRadius:16, padding:"13px 32px", fontSize:15, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 16px rgba(245,165,36,0.4)" }}>Awesome! 🎉</button>
          </div>
        </div>
      )}

      {/* ── Fullscreen lesson overlay.
           key=module.id ensures LessonView fully remounts when switching lessons,
           and re-triggers the slide-in CSS animation. Never uses opacity:0 so the
           dark shell background can never flash through. ── */}
      {activeLesson && (
        <div key={activeLesson.module.id}
          style={{ position:"fixed", inset:0, zIndex:400,
            background: "linear-gradient(180deg,#fff7ea 0%,#ffe7c2 100%)",
            animation: "lessonSlideIn 0.18s cubic-bezier(0.22,1,0.36,1) both" }}>
        <LessonView
          module={activeLesson.module}
          levelKey={activeLesson.levelKey}
          levelColor={activeLesson.levelColor}
          langCode={activeLang}
          userId={user?.id}
          isDone={progress.completed.includes(activeLesson.module.id)}
          onComplete={(id, xp, stars, meta) => markComplete(id, xp, stars, meta)}
          onBack={() => { stopAllAudio(); closeLesson(() => setAnimTrigger(t => t + 1)); }}
          onGoReview={() => { stopAllAudio(); closeLesson(() => handleTabChange("review")); }}
          rewardSummary={rewardSummary}
          onNextLesson={(() => {
            if (!nextModForLesson) return null;
            const sameUnit = nextModForLesson.unit === activeLesson.module.unit;
            const passedCheckpoint = !!getCheckpointPass(user?.id, activeLang, activeLesson.module.unit)?.passed;
            if (!sameUnit && !passedCheckpoint) return null;
            return () => {
              stopAllAudio();
              const lv = findLevel(nextModForLesson);
              setJustCompletedId(null);
              setRewardSummary(null);
              // Swap lesson instantly — key change triggers remount + slide-in animation
              setActiveLesson({ module: nextModForLesson, levelKey: lv.key, levelColor: lv.color });
            };
          })()}
        />
        </div>
      )}
      {activeAI && (
        <div style={{ position:"fixed", inset:0, zIndex:499, overflowY:"auto" }}>
          <AIChat key={`${activeAI.mode}_${activeAI.id || activeAI.scenarioId || "_"}`}
            scenario={activeAI} langCode={activeLang} userId={user?.id} isPro={proUser}
            onClose={() => { stopAllAudio(); setActiveAI(null); }}
            onGoReview={() => { stopAllAudio(); setActiveAI(null); handleTabChange("review"); }}
          />
        </div>
      )}
      {activeSituation && (
        <div style={{ position:"fixed", inset:0, zIndex:450, overflowY:"auto" }}>
          <SituationDetail situation={activeSituation} langCode={activeLang} userId={user?.id} isPro={proUser}
            onClose={() => { stopAllAudio(); setActiveSituation(null); }}
            onStartAI={s => { stopAllAudio(); setActiveSituation(null); setActiveAI(s); }}
          />
        </div>
      )}
    </div>
  );
}
