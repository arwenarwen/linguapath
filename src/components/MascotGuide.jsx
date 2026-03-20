import { useState, useEffect, useRef } from "react";

const CSS = `
  @keyframes foxBounce    { 0%,100%{transform:translateY(0) rotate(0)} 25%{transform:translateY(-8px) rotate(-4deg)} 75%{transform:translateY(-4px) rotate(3deg)} }
  @keyframes fox3stars    { 0%{transform:scale(1) rotate(0)} 15%{transform:scale(1.35) rotate(-12deg)} 30%{transform:scale(1.4) rotate(12deg)} 45%{transform:scale(1.3) rotate(-8deg)} 60%{transform:scale(1.25) rotate(8deg)} 80%{transform:scale(1.1) rotate(-2deg)} 100%{transform:scale(1) rotate(0)} }
  @keyframes fox2stars    { 0%{transform:scale(1)} 30%{transform:scale(1.2) rotate(-6deg)} 60%{transform:scale(1.15) rotate(5deg)} 100%{transform:scale(1) rotate(0)} }
  @keyframes fox1star     { 0%{transform:scale(1)} 50%{transform:scale(1.08) rotate(-3deg)} 100%{transform:scale(1) rotate(0)} }
  @keyframes foxTap       { 0%{transform:scale(1) rotate(0) translateX(0)} 40%{transform:scale(1.08) rotate(18deg) translateX(10px)} 70%{transform:scale(1.05) rotate(12deg) translateX(7px)} 100%{transform:scale(1) rotate(0) translateX(0)} }
  @keyframes foxGlow      { 0%,100%{box-shadow:0 0 10px 2px rgba(255,179,107,.3)} 50%{box-shadow:0 0 30px 8px rgba(255,179,107,.6)} }
  @keyframes armBounce    { 0%,100%{transform:translateX(0) rotate(-10deg)} 50%{transform:translateX(8px) rotate(15deg)} }
  @keyframes starBurst    { 0%{transform:scale(0) rotate(-20deg);opacity:0} 60%{transform:scale(1.4) rotate(10deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes starFloat    { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-28px) scale(.4)} }
  @keyframes speechPop    { 0%{transform:scale(.8) translateY(5px);opacity:0} 70%{transform:scale(1.03);opacity:1} 100%{transform:scale(1);opacity:1} }
  @keyframes glowFloat    { 0%,100%{transform:translateY(0);opacity:.55} 50%{transform:translateY(8px);opacity:.85} }
  @keyframes glowBright   { 0%,100%{opacity:.55} 50%{opacity:1} }
  @keyframes shimmerSlide { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
  @keyframes msgIn        { from{opacity:0;transform:translateX(-5px)} to{opacity:1;transform:translateX(0)} }
  @keyframes tapSpark     { 0%{transform:scale(0);opacity:1} 100%{transform:scale(2.5);opacity:0} }
  @keyframes crown        { 0%{transform:translateY(-20px) scale(0) rotate(-20deg);opacity:0} 60%{transform:translateY(2px) scale(1.2) rotate(5deg);opacity:1} 100%{transform:translateY(0) scale(1) rotate(0);opacity:1} }

  .mw { position:relative; padding:18px; border-radius:24px;
    background: radial-gradient(circle at top right, rgba(255,179,107,.12), transparent 30%),
      linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.02));
    border:1px solid rgba(255,255,255,.08); overflow:visible; transition:border-color .3s; }
  .mw.cele { border-color:rgba(255,179,107,.4); }
  .mw.stars3 { border-color:rgba(245,200,66,.5); }

  .mg { position:absolute; right:-24px; top:-20px; width:120px; height:120px;
    background:radial-gradient(circle, rgba(255,179,107,.22), transparent 65%);
    filter:blur(20px); pointer-events:none; animation:glowFloat 4s ease-in-out infinite; }
  .mg.bright { background:radial-gradient(circle, rgba(255,179,107,.55), transparent 65%);
    animation:glowBright 1.5s ease-in-out infinite; }
  .mg.gold { background:radial-gradient(circle, rgba(245,200,66,.6), transparent 65%);
    animation:glowBright 1s ease-in-out infinite; }

  .mi { display:grid; grid-template-columns:88px 1fr; gap:14px; align-items:center; }

  .fa { width:88px; height:88px; display:flex; align-items:center; justify-content:center;
    font-size:2.6rem; border-radius:22px; position:relative; user-select:none;
    background:radial-gradient(circle, rgba(255,179,107,.24), rgba(255,179,107,.05));
    border:1px solid rgba(255,179,107,.2); transition:box-shadow .3s; flex-shrink:0; }
  .fa.idle    { animation:foxBounce 4s ease-in-out infinite; }
  .fa.stars3  { animation:fox3stars .9s ease both; box-shadow:0 0 40px rgba(245,200,66,.6); }
  .fa.stars2  { animation:fox2stars .7s ease both; box-shadow:0 0 24px rgba(255,179,107,.5); }
  .fa.stars1  { animation:fox1star .6s ease both; }
  .fa.tapping { animation:foxTap .7s ease both; }
  .fa.glowing { animation:foxGlow 2s ease infinite; }

  .arm { position:absolute; right:-20px; top:50%; margin-top:-13px;
    font-size:1.4rem; pointer-events:none; z-index:10;
    animation:armBounce .9s ease-in-out infinite; }

  .tap-spark { position:absolute; right:-8px; top:50%; margin-top:-10px;
    width:20px; height:20px; border-radius:50%;
    background:rgba(255,179,107,.8); pointer-events:none;
    animation:tapSpark .5s ease-out both; }

  .crown-badge { position:absolute; top:-18px; left:50%; transform:translateX(-50%);
    font-size:1.8rem; animation:crown .6s cubic-bezier(.34,1.56,.64,1) both; }

  .star-pop { position:absolute; pointer-events:none; font-size:15px; }

  .sb { position:relative; background:rgba(255,255,255,.06);
    border:1px solid rgba(255,255,255,.1); border-radius:16px;
    padding:12px 14px; font-size:13.5px; line-height:1.65;
    color:rgba(240,237,230,.9); animation:speechPop .4s cubic-bezier(.34,1.56,.64,1) both; }
  .sb::before { content:''; position:absolute; left:-8px; top:50%;
    transform:translateY(-50%); border:7px solid transparent;
    border-right-color:rgba(255,255,255,.1); }
  .sb.tap-mode { border-color:rgba(255,179,107,.4); background:rgba(255,179,107,.08); }
  .sb.gold-mode { border-color:rgba(245,200,66,.4); background:rgba(245,200,66,.08); }

  .mood-lbl { font-size:10px; font-weight:700; letter-spacing:1.5px;
    text-transform:uppercase; color:#f0cf83; margin-bottom:5px; }
  .msg { animation:msgIn .3s ease both; }

  .next-ptr { display:inline-flex; align-items:center; gap:6px; margin-top:9px;
    padding:6px 13px; background:rgba(255,179,107,.14);
    border:1px solid rgba(255,179,107,.3); border-radius:20px;
    font-size:12px; font-weight:700; color:#f0cf83; cursor:pointer; transition:all .15s; }
  .next-ptr:hover { background:rgba(255,179,107,.25); transform:translateX(3px); }

  .stars-row { display:flex; gap:4px; margin-top:8px; }
  .s-pip { font-size:14px; transition:filter .3s; }
  .s-pip.off { filter:grayscale(1) opacity(.25); }
`;

const MSGS = {
  3: [
    "That was smooth.",
    "You didn't hesitate.",
    "You're finding your rhythm.",
    "Clean. No gaps.",
  ],
  2: [
    "Nice work.",
    "You're improving.",
    "That's progress.",
    "Getting there.",
  ],
  1: [
    "That one was tougher.",
    "Let's try again.",
    "You're close.",
    "Keep going.",
  ],
  checkpoint: [
    "Something's ahead.",
    "Let's see what we find.",
  ],
  returning: [
    "You're back.",
    "Let's keep going.",
  ],
  levelComplete: [
    "You made it.",
    "You've come far.",
  ],
  tap: [
    "Next one's ready.",
    "Path is open.",
    "Keep moving.",
  ],
  glowing: "Your trail continues →",
  idle: [
    "Tap a lesson to begin.",
    "The path is ahead.",
    "One lesson at a time.",
    "Your trail is waiting.",
  ],
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function MascotGuide({ message, justCompleted, lastStars, onPointToNext, nextLessonName }) {
  const [phase, setPhase] = useState("idle");
  const [displayMsg, setDisplayMsg] = useState(message || pick(MSGS.idle));
  const [showArm, setShowArm] = useState(false);
  const [showSpark, setShowSpark] = useState(false);
  const [showCrown, setShowCrown] = useState(false);
  const [starPops, setStarPops] = useState([]);
  const prevCompleted = useRef(null);
  const timers = useRef([]);

  function after(ms, fn) {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  }

  // Clear all timers on unmount
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (!justCompleted || justCompleted === prevCompleted.current) return;
    prevCompleted.current = justCompleted;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const stars = lastStars || 0;

    // ── Phase 1: Star reaction (0ms) ──────────────────────────────────────────
    const starPhase = stars === 3 ? "stars3" : stars === 2 ? "stars2" : "stars1";
    setPhase(starPhase);
    setDisplayMsg(pick(MSGS[stars] || MSGS[1]));

    // Crown for perfect score
    if (stars === 3) setShowCrown(true);

    // Burst star emojis
    const emojis = stars === 3
      ? ["⭐","🌟","✨","💫","⭐","🌟","⚡"]
      : stars === 2
      ? ["⭐","✨","💫","⭐"]
      : ["⭐","💪"];
    const pops = emojis.map((e, i) => ({
      id: Date.now() + i, emoji: e,
      x: (Math.random() * 100 - 20),
      y: -(20 + Math.random() * 50),
      delay: i * 0.12,
    }));
    setStarPops(pops);
    after(2000, () => setStarPops([]));
    after(2200, () => setShowCrown(false));

    // ── Phase 2: Tapping animation ────────────────────────────────────────────
    after(stars === 3 ? 1400 : 1000, () => {
      setPhase("tapping");
      setDisplayMsg(pick(MSGS.tap));
      setShowArm(true);
      onPointToNext?.();
    });

    // Spark at tip of arm
    after(stars === 3 ? 1700 : 1300, () => {
      setShowSpark(true);
      after(600, () => setShowSpark(false));
    });

    // ── Phase 3: Glowing settled ──────────────────────────────────────────────
    after(stars === 3 ? 3200 : 2800, () => {
      setShowArm(false);
      setPhase("glowing");
      setDisplayMsg(nextLessonName
        ? `Up next: "${nextLessonName}" — keep it up!`
        : MSGS.glowing);
    });

    // ── Phase 4: Return to idle ───────────────────────────────────────────────
    after(8000, () => {
      setPhase("idle");
      setShowCrown(false);
      setDisplayMsg(message || pick(MSGS.idle));
    });

  }, [justCompleted]);

  useEffect(() => {
    if (!justCompleted) setDisplayMsg(message || pick(MSGS.idle));
  }, [message]);

  const isCelebrating = ["stars3","stars2","stars1","tapping","glowing"].includes(phase);
  const isGold = phase === "stars3";

  const moodLabel = {
    stars3: "✦ Perfect",
    stars2: "✦ Well done",
    stars1: "✦ Keep going",
    tapping: "✦ Next up",
    glowing: "✦ On track",
    idle: "✦ Your guide",
  }[phase] || "✦ Your guide";

  return (
    <>
      <style>{CSS}</style>
      <div className={`mw ${isCelebrating ? "cele" : ""} ${isGold ? "stars3" : ""}`}>
        <div className={`mg ${isCelebrating ? "bright" : ""} ${isGold ? "gold" : ""}`} />

        <div className="mi">
          {/* Fox + arm + stars */}
          <div style={{ position:"relative", overflow:"visible" }}>
            <div className={`fa ${phase}`}>
              🦊
              {showCrown && <div className="crown-badge">👑</div>}
            </div>
            {showArm && <span className="arm">👉</span>}
            {showSpark && <div className="tap-spark" />}

            {/* Star burst */}
            {starPops.map(s => (
              <span key={s.id} className="star-pop" style={{
                left:`${s.x}%`, top:`${s.y}px`,
                animation:`starBurst .4s ${s.delay}s ease both, starFloat .55s ${s.delay+.5}s ease both`,
              }}>{s.emoji}</span>
            ))}
          </div>

          {/* Speech bubble */}
          <div>
            <div className="mood-lbl">{moodLabel}</div>
            <div className={`sb ${phase==="tapping"?"tap-mode":""} ${isGold?"gold-mode":""}`}>
              <div className="msg" key={displayMsg}>{displayMsg}</div>

              {/* Star pip display */}
              {["stars3","stars2","stars1"].includes(phase) && (
                <div className="stars-row">
                  {[1,2,3].map(i => (
                    <span key={i} className={`s-pip ${i > (lastStars||0) ? "off" : ""}`}>⭐</span>
                  ))}
                </div>
              )}

              {/* Next lesson pointer */}
              {(phase === "tapping" || phase === "glowing") && nextLessonName && (
                <div className="next-ptr" onClick={onPointToNext}>
                  ▶ {nextLessonName} →
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
