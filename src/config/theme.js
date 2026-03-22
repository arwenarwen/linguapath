// Global CSS string — import in any component that mounts styles.

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Lato:wght@300;400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a24;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --text: #f0f0f5;
    --muted: #6b6b80;
    --gold: #f5c842;
    --gold2: #e8a020;
    --green: #22c55e;
    --red: #ef4444;
    --blue: #38bdf8;
    --purple: #a78bfa;
    --orange: #fb923c;
    --font-display: 'Syne', sans-serif;
    --font-body: 'Lato', sans-serif;
    --radius: 14px;
    --radius-lg: 20px;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .app-root { min-height: 100vh; display: flex; flex-direction: column; max-width: 860px; margin: 0 auto; }

  /* Animations */
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
  @keyframes pop { 0%{transform:scale(0.85);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px #f5c84230} 50%{box-shadow:0 0 40px #f5c84260} }
  @keyframes streakBounce { 0%{transform:translateY(0) scale(1)} 40%{transform:translateY(-12px) scale(1.2)} 100%{transform:translateY(0) scale(1)} }
  @keyframes confetti-fall { 0%{transform:translateY(-20px) rotate(0)} 100%{transform:translateY(100vh) rotate(720deg); opacity:0} }
  @keyframes slide-in-right { from{transform:translateX(40px);opacity:0} to{transform:translateX(0);opacity:1} }

  .fade-up { animation: fadeUp 0.4s cubic-bezier(.16,1,.3,1) both; }
  .fade-in { animation: fadeIn 0.3s ease both; }
  .pop-in { animation: pop 0.35s cubic-bezier(.34,1.56,.64,1) both; }
  .slide-right { animation: slide-in-right 0.3s cubic-bezier(.16,1,.3,1) both; }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    border: none; cursor: pointer; font-family: var(--font-body); font-weight: 700;
    border-radius: var(--radius); transition: all 0.15s ease; user-select: none; }
  .btn:active { transform: scale(0.97); }
  .btn-gold { background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: #1a1000; padding: 14px 28px; font-size: 15px; letter-spacing: 0.5px;
    box-shadow: 0 4px 20px rgba(245,200,66,0.3); }
  .btn-gold:hover { box-shadow: 0 6px 28px rgba(245,200,66,0.5); transform: translateY(-1px); }
  .btn-ghost { background: var(--surface2); color: var(--text); padding: 12px 22px;
    font-size: 14px; border: 1px solid var(--border2); }
  .btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
  .btn-danger { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.3); padding: 10px 20px; font-size: 13px; }
  .btn-sm { padding: 8px 16px; font-size: 13px; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  /* Cards */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); }
  .card-hover { transition: all 0.2s ease; cursor: pointer; }
  .card-hover:hover { background: var(--surface2); border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); }

  /* Progress bar */
  .progress-bar { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }

  /* Chips */
  .chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px;
    border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
  .chip-a1 { background: rgba(34,197,94,0.15); color: var(--green); border: 1px solid rgba(34,197,94,0.3); }
  .chip-a2 { background: rgba(56,189,248,0.15); color: var(--blue); border: 1px solid rgba(56,189,248,0.3); }
  .chip-b1 { background: rgba(167,139,250,0.15); color: var(--purple); border: 1px solid rgba(167,139,250,0.3); }
  .chip-b2 { background: rgba(249,115,22,0.15); color: #f97316; border: 1px solid rgba(249,115,22,0.3); }
  .chip-c1 { background: rgba(236,72,153,0.15); color: #ec4899; border: 1px solid rgba(236,72,153,0.3); }
  .chip-c2 { background: rgba(245,200,66,0.15); color: #f5c842; border: 1px solid rgba(245,200,66,0.3); }

  /* Nav */
  .bottom-nav { display: flex; background: var(--surface); border-top: 1px solid var(--border);
    padding: 8px 0 4px; position: sticky; bottom: 0; z-index: 50; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 8px 4px; cursor: pointer; transition: all 0.15s; color: var(--muted); font-size: 10px;
    font-family: var(--font-body); font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; border: none; background: none; }
  .nav-item.active { color: var(--gold); }
  .nav-item:hover { color: var(--text); }
  .nav-icon { font-size: 20px; }

  /* AI Chat */
  .chat-bubble { max-width: 80%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.6; animation: fadeUp 0.3s both; }
  .chat-ai { background: var(--surface2); border: 1px solid var(--border); border-bottom-left-radius: 4px; }
  .chat-user { background: linear-gradient(135deg, #2563eb, #1d4ed8); border-bottom-right-radius: 4px; align-self: flex-end; }

  /* Exercise */
  .choice-btn { width: 100%; padding: 14px 18px; background: var(--surface); border: 2px solid var(--border2);
    border-radius: var(--radius); color: var(--text); font-family: var(--font-body); font-size: 14px;
    text-align: left; cursor: pointer; transition: all 0.15s; font-weight: 400; }
  .choice-btn:hover:not(:disabled) { background: var(--surface2); border-color: rgba(255,255,255,0.25); }
  .choice-correct { background: rgba(34,197,94,0.15) !important; border-color: var(--green) !important; color: var(--green) !important; animation: pop 0.3s both; }
  .choice-wrong { background: rgba(239,68,68,0.1) !important; border-color: var(--red) !important; color: var(--red) !important; animation: shake 0.4s both; }

  /* Vocab card */
  .vocab-card { perspective: 1000px; }
  .vocab-inner { transition: transform 0.5s; transform-style: preserve-3d; position: relative; }
  .vocab-inner.flipped { transform: rotateY(180deg); }
  .vocab-face { backface-visibility: hidden; }
  .vocab-back { backface-visibility: hidden; transform: rotateY(180deg); }

  /* Tooltip */
  .tooltip { position: relative; }
  .tooltip-text { position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%);
    background: #1a1a2e; border: 1px solid var(--border2); border-radius: 8px; padding: 6px 10px;
    font-size: 12px; white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity 0.2s; z-index: 100; }
  .tooltip:hover .tooltip-text { opacity: 1; }

  /* Loader */
  .loader { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }

  /* Side Menu */
  @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  @keyframes slideOutLeft { from { transform: translateX(0); } to { transform: translateX(-100%); } }
  .side-menu { position: fixed; top: 0; left: 0; height: 100vh; width: 300px; max-width: 88vw;
    background: #0e0e16; border-right: 1px solid rgba(255,255,255,0.1);
    z-index: 200; display: flex; flex-direction: column; overflow: hidden;
    box-shadow: 8px 0 40px rgba(0,0,0,0.6); }
  .side-menu.open { animation: slideInLeft 0.28s cubic-bezier(.16,1,.3,1) both; }
  .side-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 199;
    backdrop-filter: blur(2px); animation: fadeIn 0.2s ease both; cursor: pointer; }
  .lang-pill { display: flex; align-items: center; gap: 10px; padding: 10px 14px;
    border-radius: 12px; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
  .lang-pill:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08); }
  .lang-pill.active { background: rgba(245,200,66,0.1); border-color: rgba(245,200,66,0.25); }
  .level-jump { display: flex; align-items: center; gap: 12px; padding: 11px 14px;
    border-radius: 12px; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
  .level-jump:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.07); }
  .menu-section { padding: 0 12px 12px; }
  .menu-section-title { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    color: #3d3d50; padding: 10px 14px 6px; }
  .menu-scroll { flex: 1; overflow-y: auto; }
  .menu-scroll::-webkit-scrollbar { width: 3px; }
  .menu-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); }
  .hamburger { display: flex; flex-direction: column; gap: 5px; cursor: pointer; padding: 6px;
    border-radius: 8px; transition: background 0.15s; background: none; border: none; }
  .hamburger:hover { background: rgba(255,255,255,0.08); }
  .hamburger span { display: block; width: 20px; height: 2px; background: var(--text); border-radius: 2px; transition: all 0.2s; }

/* mountain overrides placeholder */
`;

// ─────────────────────────────────────────────
// 20 LANGUAGES;
