// Global CSS string — import in any component that mounts styles.

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* Core palette */
    --bg: #080810;
    --surface: #0f0f1a;
    --surface2: #161624;
    --surface3: #1e1e30;

    /* Borders */
    --border: rgba(255,255,255,0.06);
    --border2: rgba(255,255,255,0.11);
    --border3: rgba(255,255,255,0.18);

    /* Text */
    --text: #eeeef5;
    --text2: #b0b0c8;
    --muted: #5a5a72;

    /* Gold accent — the brand moment */
    --gold: #f5c842;
    --gold2: #e09818;
    --gold-glow: rgba(245,200,66,0.18);
    --gold-subtle: rgba(245,200,66,0.08);

    /* Status */
    --green: #22c55e;
    --red: #ef4444;
    --blue: #38bdf8;
    --purple: #a78bfa;
    --orange: #fb923c;

    /* Typography */
    --font-display: 'Syne', sans-serif;
    --font-body: 'Space Grotesk', sans-serif;

    /* Shape */
    --radius: 12px;
    --radius-lg: 18px;
    --radius-xl: 24px;

    /* Shadows */
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.4);
    --shadow-md: 0 6px 24px rgba(0,0,0,0.5);
    --shadow-lg: 0 16px 48px rgba(0,0,0,0.6);
    --shadow-gold: 0 4px 24px rgba(245,200,66,0.25);
  }

  html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.6;
    /* Atmospheric background: subtle amber glow from top-center + deep void below */
    background-image:
      radial-gradient(ellipse 80% 40% at 50% -10%, rgba(245,200,66,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 60% 30% at 80% 100%, rgba(56,189,248,0.03) 0%, transparent 60%);
    background-attachment: fixed;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--border3); }

  .app-root { min-height: 100vh; display: flex; flex-direction: column; max-width: 860px; margin: 0 auto; }

  /* ── Animations ───────────────────────────────────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.04); }
  }
  @keyframes shake {
    0%, 100%      { transform: translateX(0); }
    20%, 60%      { transform: translateX(-5px); }
    40%, 80%      { transform: translateX(5px); }
  }
  @keyframes pop {
    0%   { transform: scale(0.82); opacity: 0; }
    65%  { transform: scale(1.06); }
    100% { transform: scale(1);    opacity: 1; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 16px rgba(245,200,66,0.2); }
    50%       { box-shadow: 0 0 36px rgba(245,200,66,0.5), 0 0 60px rgba(245,200,66,0.15); }
  }
  @keyframes streakBounce {
    0%   { transform: translateY(0)   scale(1); }
    40%  { transform: translateY(-14px) scale(1.22); }
    100% { transform: translateY(0)   scale(1); }
  }
  @keyframes confetti-fall {
    0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  @keyframes slide-in-right {
    from { transform: translateX(36px); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  @keyframes slideInLeft {
    from { transform: translateX(-100%); }
    to   { transform: translateX(0); }
  }
  @keyframes slideOutLeft {
    from { transform: translateX(0); }
    to   { transform: translateX(-100%); }
  }
  /* Staggered page-load reveals */
  @keyframes revealUp {
    from { opacity: 0; transform: translateY(28px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  /* Animation utility classes */
  .fade-up    { animation: fadeUp    0.45s cubic-bezier(.16,1,.3,1) both; }
  .fade-in    { animation: fadeIn    0.3s  ease both; }
  .scale-in   { animation: scaleIn  0.35s cubic-bezier(.16,1,.3,1) both; }
  .pop-in     { animation: pop      0.38s cubic-bezier(.34,1.56,.64,1) both; }
  .slide-right{ animation: slide-in-right 0.32s cubic-bezier(.16,1,.3,1) both; }
  .reveal-up  { animation: revealUp 0.55s cubic-bezier(.16,1,.3,1) both; }

  /* Stagger delays for orchestrated reveals */
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.12s; }
  .stagger-3 { animation-delay: 0.19s; }
  .stagger-4 { animation-delay: 0.26s; }
  .stagger-5 { animation-delay: 0.33s; }

  /* ── Buttons ──────────────────────────────────────────────────────────────── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    border: none; cursor: pointer;
    font-family: var(--font-body); font-weight: 600; letter-spacing: 0.2px;
    border-radius: var(--radius); transition: all 0.18s cubic-bezier(.16,1,.3,1);
    user-select: none; position: relative; overflow: hidden;
  }
  .btn:active { transform: scale(0.96); }
  .btn:disabled { opacity: 0.38; cursor: not-allowed; transform: none !important; }

  /* Gold CTA — the hero button */
  .btn-gold {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%);
    color: #140d00;
    padding: 14px 28px; font-size: 15px; font-weight: 700;
    box-shadow: var(--shadow-gold);
  }
  .btn-gold::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .btn-gold:hover { box-shadow: 0 6px 32px rgba(245,200,66,0.4); transform: translateY(-2px); }
  .btn-gold:hover::after { opacity: 1; }

  /* Ghost */
  .btn-ghost {
    background: var(--surface2); color: var(--text);
    padding: 12px 22px; font-size: 14px;
    border: 1px solid var(--border2);
  }
  .btn-ghost:hover { background: var(--surface3); border-color: var(--border3); transform: translateY(-1px); }

  /* Danger */
  .btn-danger {
    background: rgba(239,68,68,0.12); color: var(--red);
    border: 1px solid rgba(239,68,68,0.28); padding: 10px 20px; font-size: 13px;
  }
  .btn-danger:hover { background: rgba(239,68,68,0.2); }

  .btn-sm { padding: 8px 16px; font-size: 13px; }

  /* ── Cards ────────────────────────────────────────────────────────────────── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
  }
  .card-hover {
    transition: all 0.22s cubic-bezier(.16,1,.3,1);
    cursor: pointer;
  }
  .card-hover:hover {
    background: var(--surface2);
    border-color: var(--border2);
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }

  /* ── Progress bar ─────────────────────────────────────────────────────────── */
  .progress-bar {
    height: 5px;
    background: rgba(255,255,255,0.07);
    border-radius: 3px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 3px;
    transition: width 0.6s cubic-bezier(.16,1,.3,1);
  }

  /* ── CEFR level chips ─────────────────────────────────────────────────────── */
  .chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 20px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase;
    font-family: var(--font-display);
  }
  .chip-a1 { background: rgba(34,197,94,0.12);  color: var(--green);  border: 1px solid rgba(34,197,94,0.28); }
  .chip-a2 { background: rgba(56,189,248,0.12);  color: var(--blue);   border: 1px solid rgba(56,189,248,0.28); }
  .chip-b1 { background: rgba(167,139,250,0.12); color: var(--purple); border: 1px solid rgba(167,139,250,0.28); }
  .chip-b2 { background: rgba(249,115,22,0.12);  color: #f97316;      border: 1px solid rgba(249,115,22,0.28); }
  .chip-c1 { background: rgba(236,72,153,0.12);  color: #ec4899;      border: 1px solid rgba(236,72,153,0.28); }
  .chip-c2 { background: rgba(245,200,66,0.14);  color: var(--gold);  border: 1px solid rgba(245,200,66,0.3);  }

  /* ── Bottom navigation ────────────────────────────────────────────────────── */
  .bottom-nav {
    display: flex;
    background: rgba(10,10,18,0.92);
    border-top: 1px solid var(--border);
    padding: 8px 0 4px;
    position: sticky; bottom: 0; z-index: 50;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .nav-item {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 8px 4px; cursor: pointer; transition: all 0.18s;
    color: var(--muted); font-size: 10px;
    font-family: var(--font-display); font-weight: 700;
    letter-spacing: 0.6px; text-transform: uppercase;
    border: none; background: none;
  }
  .nav-item.active { color: var(--gold); }
  .nav-item:hover  { color: var(--text2); }
  .nav-icon { font-size: 20px; transition: transform 0.2s cubic-bezier(.34,1.56,.64,1); }
  .nav-item.active .nav-icon { transform: scale(1.15); }

  /* ── AI Chat bubbles ──────────────────────────────────────────────────────── */
  .chat-bubble {
    max-width: 80%; padding: 12px 16px;
    border-radius: 18px; font-size: 14px; line-height: 1.65;
    animation: fadeUp 0.32s cubic-bezier(.16,1,.3,1) both;
  }
  .chat-ai {
    background: var(--chat-ai-bg, var(--surface2));
    color: var(--chat-text, var(--text));
    border: 1px solid var(--chat-border, var(--border2));
    border-bottom-left-radius: 4px;
  }
  .chat-user {
    background: var(--chat-user-bg, linear-gradient(135deg, #2563eb 0%, #1a3fbf 100%));
    color: var(--chat-user-text, #fff);
    border-bottom-right-radius: 4px;
    align-self: flex-end;
    box-shadow: 0 4px 16px rgba(37,99,235,0.3);
  }

  /* ── Exercise choice buttons ──────────────────────────────────────────────── */
  .choice-btn {
    width: 100%; padding: 14px 18px;
    background: var(--surface);
    border: 1.5px solid var(--border2);
    border-radius: var(--radius);
    color: var(--text); font-family: var(--font-body); font-size: 14px;
    text-align: left; cursor: pointer;
    transition: all 0.16s cubic-bezier(.16,1,.3,1);
    font-weight: 400;
  }
  .choice-btn:hover:not(:disabled) {
    background: var(--surface2);
    border-color: rgba(255,255,255,0.22);
    transform: translateX(3px);
  }
  .choice-correct {
    background: rgba(34,197,94,0.12) !important;
    border-color: var(--green) !important;
    color: var(--green) !important;
    animation: pop 0.32s cubic-bezier(.34,1.56,.64,1) both;
  }
  .choice-wrong {
    background: rgba(239,68,68,0.08) !important;
    border-color: var(--red) !important;
    color: var(--red) !important;
    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
  }

  /* ── Vocab flip card ──────────────────────────────────────────────────────── */
  .vocab-card    { perspective: 1000px; }
  .vocab-inner   { transition: transform 0.48s cubic-bezier(.16,1,.3,1); transform-style: preserve-3d; position: relative; }
  .vocab-inner.flipped { transform: rotateY(180deg); }
  .vocab-face    { backface-visibility: hidden; }
  .vocab-back    { backface-visibility: hidden; transform: rotateY(180deg); }

  /* ── Tooltip ──────────────────────────────────────────────────────────────── */
  .tooltip { position: relative; }
  .tooltip-text {
    position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%);
    background: var(--surface3); border: 1px solid var(--border2);
    border-radius: 8px; padding: 6px 10px;
    font-size: 12px; white-space: nowrap;
    pointer-events: none; opacity: 0; transition: opacity 0.18s; z-index: 100;
    box-shadow: var(--shadow-sm);
  }
  .tooltip:hover .tooltip-text { opacity: 1; }

  /* ── Loader spinner ───────────────────────────────────────────────────────── */
  .loader {
    width: 20px; height: 20px;
    border: 2px solid rgba(255,255,255,0.12);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
    display: inline-block;
  }

  /* ── Side menu ────────────────────────────────────────────────────────────── */
  .side-menu {
    position: fixed; top: 0; left: 0; height: 100vh; width: 300px; max-width: 88vw;
    background: linear-gradient(160deg, #0d0d1c 0%, #080810 100%);
    border-right: 1px solid var(--border2);
    z-index: 200; display: flex; flex-direction: column; overflow: hidden;
    box-shadow: 12px 0 48px rgba(0,0,0,0.7);
  }
  .side-menu.open { animation: slideInLeft 0.3s cubic-bezier(.16,1,.3,1) both; }
  .side-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 199; backdrop-filter: blur(3px);
    animation: fadeIn 0.22s ease both; cursor: pointer;
  }
  .lang-pill {
    display: flex; align-items: center; gap: 10px; padding: 10px 14px;
    border-radius: 10px; cursor: pointer; transition: all 0.16s; border: 1px solid transparent;
  }
  .lang-pill:hover { background: rgba(255,255,255,0.05); border-color: var(--border); }
  .lang-pill.active { background: var(--gold-subtle); border-color: rgba(245,200,66,0.22); }
  .level-jump {
    display: flex; align-items: center; gap: 12px; padding: 11px 14px;
    border-radius: 10px; cursor: pointer; transition: all 0.16s; border: 1px solid transparent;
  }
  .level-jump:hover { background: rgba(255,255,255,0.04); border-color: var(--border); }
  .menu-section { padding: 0 12px 12px; }
  .menu-section-title {
    font-size: 9px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;
    color: var(--muted); padding: 10px 14px 6px;
    font-family: var(--font-display);
  }
  .menu-scroll { flex: 1; overflow-y: auto; }
  .menu-scroll::-webkit-scrollbar { width: 3px; }
  .menu-scroll::-webkit-scrollbar-thumb { background: var(--border2); }
  .hamburger {
    display: flex; flex-direction: column; gap: 5px; cursor: pointer; padding: 6px;
    border-radius: 8px; transition: background 0.15s; background: none; border: none;
  }
  .hamburger:hover { background: rgba(255,255,255,0.07); }
  .hamburger span { display: block; width: 20px; height: 2px; background: var(--text2); border-radius: 2px; transition: all 0.2s; }

  /* ── Gold shimmer utility (for skeleton / loading states) ─────────────────── */
  .shimmer {
    background: linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s ease infinite;
  }

  /* ── Gold text highlight ──────────────────────────────────────────────────── */
  .text-gold { color: var(--gold); }
  .text-muted { color: var(--muted); }
  .text-display { font-family: var(--font-display); }

/* mountain overrides placeholder */
`;

// ─────────────────────────────────────────────
// 20 LANGUAGES;
