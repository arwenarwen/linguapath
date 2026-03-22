import { useState, useEffect, useRef } from "react";
import MountainAppShell from "./pages/MountainAppShell";
import OnboardingLevelGate from "./components/OnboardingLevelGate";
import { supabase, setUserRole, getOnboardingProfile, saveOnboardingProfile, clearOnboardingProfile, savePlacementState } from "./lib/appState";

// ─── Access control ──────────────────────────────────────────────────────────
const ADMIN_EMAIL    = "borowiakarwen@gmail.com";
const VALID_CODES    = {
  "TESTER2026":      "tester",
  "INFLUENCER2026":  "influencer",
};
function getTierForSignup(email, code) {
  if (email.toLowerCase() === ADMIN_EMAIL) return "admin";
  if (code && VALID_CODES[code.toUpperCase()]) return VALID_CODES[code.toUpperCase()];
  return "free";
}
function canAccessApp(tier) {
  return ["admin","tester","beta","influencer","free","pro"].includes(tier);
}

// ─── Load language curricula from JSON files ──────────────────────────────────
const _langFiles = import.meta.glob("/languages/*.json", { eager: true });
const _LANG_CODE_MAP = {
  spanish:"es", french:"fr", german:"de", italian:"it", portuguese:"pt",
  chinese:"zh", japanese:"ja", korean:"ko", polish:"pl", english:"en"
};
export const CURRICULA = Object.fromEntries(
  Object.entries(_langFiles).map(([path, mod]) => {
    const filename = path.split("/").pop().replace(".json","").toLowerCase();
    const code = _LANG_CODE_MAP[filename] || filename;
    return [code, mod?.default || mod || {}];
  })
);

const LANGUAGES = [
  { code:"es", name:"Spanish",    native:"Español",   flag:"🇪🇸" },
  { code:"de", name:"German",     native:"Deutsch",   flag:"🇩🇪" },
  { code:"fr", name:"French",     native:"Français",  flag:"🇫🇷" },
  { code:"it", name:"Italian",    native:"Italiano",  flag:"🇮🇹" },
  { code:"pt", name:"Portuguese", native:"Português", flag:"🇧🇷" },
  { code:"zh", name:"Mandarin",   native:"普通话",     flag:"🇨🇳" },
  { code:"ja", name:"Japanese",   native:"日本語",     flag:"🇯🇵" },
  { code:"ko", name:"Korean",     native:"한국어",     flag:"🇰🇷" },
  { code:"pl", name:"Polish",     native:"Polski",    flag:"🇵🇱" },
  { code:"en", name:"English",    native:"English",   flag:"🇬🇧" },
];

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

  html { scroll-behavior: smooth; }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes wiggle   { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
  @keyframes slideUp  { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pop      { 0%{transform:scale(.92)} 60%{transform:scale(1.04)} 100%{transform:scale(1)} }
  @keyframes ping     { 75%,100%{transform:scale(2);opacity:0} }

  /* ── Tokens ── */
  .lp-root {
    --lp-bg:       #fafaf8;
    --lp-surface:  #ffffff;
    --lp-border:   #e8e4dc;
    --lp-border2:  #d4cfc5;
    --lp-text:     #1a1814;
    --lp-muted:    #6b6560;
    --lp-faint:    #f0ede6;

    --lp-green:    #f97316;
    --lp-green2:   #ea580c;
    --lp-green-bg: #fff7ed;

    --lp-orange:   #ff6b35;
    --lp-orange2:  #ff8c5a;
    --lp-orange-bg:#fff2ec;

    --lp-purple:   #7c5cfc;
    --lp-purple-bg:#f0ecff;

    --lp-yellow:   #fbbf24;
    --lp-yellow-bg:#fefce8;

    --lp-teal:     #0ea5e9;
    --lp-teal-bg:  #e0f7ff;

    --lp-accent:   #ff6b35;
    --lp-font-d:   'Fredoka One', 'Nunito', cursive;
    --lp-font-b:   'Nunito', system-ui, sans-serif;
  }

  .lp-root, .lp-root * { box-sizing: border-box; }

  .lp-root {
    background: var(--lp-bg);
    color: var(--lp-text);
    font-family: var(--lp-font-b);
    -webkit-font-smoothing: antialiased;
  }

  /* ── Nav ── */
  .lp-nav {
    position:fixed;top:0;left:0;right:0;z-index:100;
    display:flex;align-items:center;padding:0 clamp(20px,5vw,64px);height:68px;
    background:rgba(250,250,248,.92);backdrop-filter:blur(16px);
    border-bottom:1px solid var(--lp-border);
    transition: box-shadow .2s;
  }
  .lp-nav.solid { box-shadow: 0 2px 20px rgba(0,0,0,.08); }
  .lp-logo {
    font-family:var(--lp-font-d);font-weight:400;font-size:24px;
    color:var(--lp-green);cursor:pointer;letter-spacing:.3px;font-weight:900;
  }
  .lp-nav-links { display:flex;gap:32px;margin-left:48px; }
  .lp-nl {
    color:var(--lp-muted);font-size:14px;font-weight:600;cursor:pointer;
    background:none;border:none;font-family:var(--lp-font-b);transition:color .15s;
  }
  .lp-nl:hover { color:var(--lp-text); }
  .lp-nav-cta { margin-left:auto;display:flex;gap:10px;align-items:center; }

  /* ── Buttons ── */
  .btn { display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;cursor:pointer;font-family:var(--lp-font-b);font-weight:700;border-radius:12px;transition:all .15s;user-select:none; }
  .btn:active { transform:scale(.97); }
  .btn-ghost { padding:10px 20px;font-size:14px;background:transparent;border:1.5px solid var(--lp-border2);color:var(--lp-muted); }
  .btn-ghost:hover { background:var(--lp-faint);border-color:var(--lp-muted);color:var(--lp-text); }
  .btn-gold { padding:12px 26px;font-size:14px;background:var(--lp-green);color:#fff;font-weight:700;box-shadow:0 4px 16px rgba(249,115,22,.3); }
  .btn-gold:hover { background:var(--lp-green2);box-shadow:0 6px 24px rgba(249,115,22,.45);transform:translateY(-1px); }
  .btn-gold-lg { padding:16px 36px;font-size:16px;border-radius:14px;background:var(--lp-green);color:#fff;font-weight:800;box-shadow:0 6px 28px rgba(249,115,22,.35); }
  .btn-gold-lg:hover { background:var(--lp-green2);box-shadow:0 10px 40px rgba(249,115,22,.5);transform:translateY(-2px); }
  .btn-ol-lg { padding:16px 36px;font-size:16px;border-radius:14px;background:var(--lp-surface);border:1.5px solid var(--lp-border2);color:var(--lp-text);font-weight:700; }
  .btn-ol-lg:hover { background:var(--lp-faint);border-color:var(--lp-muted); }

  /* ── Hero ── */
  .lp-hero {
    min-height:100vh;display:flex;flex-direction:column;align-items:center;
    justify-content:center;text-align:center;
    padding:120px clamp(20px,6vw,80px) 80px;
    position:relative;overflow:hidden;
    background: linear-gradient(180deg, #fff7ed 0%, #ffffff 60%);
  }
  .h-blob {
    position:absolute;border-radius:50%;pointer-events:none;filter:blur(70px);opacity:.5;
  }
  .h-blob-1 { width:600px;height:600px;top:-200px;left:50%;transform:translateX(-50%);background:radial-gradient(circle,rgba(249,115,22,.18),transparent 70%); }
  .h-blob-2 { width:400px;height:400px;bottom:-100px;left:-80px;background:radial-gradient(circle,rgba(255,107,53,.12),transparent 70%); }
  .h-blob-3 { width:350px;height:350px;top:20%;right:-80px;background:radial-gradient(circle,rgba(124,92,252,.1),transparent 70%); }
  .h-dots {
    position:absolute;inset:0;pointer-events:none;
    background-image: radial-gradient(circle, rgba(249,115,22,.12) 1.5px, transparent 1.5px);
    background-size:32px 32px;
    mask-image:radial-gradient(ellipse 80% 60% at 50% 50%,#000 30%,transparent 100%);
  }
  .h-eyebrow {
    display:inline-flex;align-items:center;gap:8px;padding:8px 20px;
    background:var(--lp-green-bg);border:1.5px solid rgba(249,115,22,.3);
    border-radius:40px;font-size:12px;font-weight:700;letter-spacing:1px;
    text-transform:uppercase;color:var(--lp-green);margin-bottom:24px;
    animation:fadeUp .6s both;
  }
  .h-title {
    font-family:var(--lp-font-d);font-size:clamp(44px,8vw,88px);
    font-weight:400;line-height:1.05;letter-spacing:-.5px;margin-bottom:22px;
    color:var(--lp-text);animation:fadeUp .7s .1s both;
  }
  .h-title .accent { color:var(--lp-green); }
  .h-sub {
    font-size:clamp(16px,2.2vw,20px);color:var(--lp-muted);line-height:1.75;
    max-width:520px;margin:0 auto 40px;animation:fadeUp .7s .2s both;font-weight:500;
  }
  .h-actions { display:flex;gap:12px;justify-content:center;flex-wrap:wrap;animation:fadeUp .7s .3s both; }
  .h-social { display:flex;gap:16px;align-items:center;margin-top:44px;justify-content:center;animation:fadeUp .7s .4s both; }
  .av-stack { display:flex; }
  .av { width:32px;height:32px;border-radius:50%;border:2.5px solid var(--lp-bg);background:linear-gradient(135deg,#a8edca,#2db87a);margin-left:-8px;display:flex;align-items:center;justify-content:center;font-size:14px; }
  .av:first-child { margin-left:0; }

  /* ── Section ── */
  .lp-sec { padding:clamp(64px,9vw,120px) clamp(20px,5vw,64px);max-width:1140px;margin:0 auto; }
  .sec-lbl { font-size:11px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:var(--lp-green);margin-bottom:12px; }
  .sec-ttl { font-family:var(--lp-font-d);font-size:clamp(28px,4vw,50px);font-weight:400;line-height:1.15;margin-bottom:16px;color:var(--lp-text); }
  .sec-sub { font-size:17px;color:var(--lp-muted);line-height:1.75;max-width:560px;font-weight:500; }

  /* ── Feature cards ── */
  .feat-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:56px; }
  .feat-card {
    background:var(--lp-surface);border:1.5px solid var(--lp-border);
    border-radius:20px;padding:28px;transition:all .2s;
  }
  .feat-card:hover { border-color:var(--lp-green);transform:translateY(-4px);box-shadow:0 16px 48px rgba(249,115,22,.1); }
  .feat-icon { width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:18px; }

  /* ── Marquee ── */
  .mq-wrap { overflow:hidden;padding:18px 0;border-top:1px solid var(--lp-border);border-bottom:1px solid var(--lp-border);background:var(--lp-faint); }
  .mq-track { display:flex;width:max-content;animation:marquee 30s linear infinite; }
  .mq-item { display:flex;align-items:center;gap:12px;padding:0 32px;font-size:14px;color:var(--lp-muted);white-space:nowrap;font-weight:600; }

  /* ── Auth modal ── */
  .auth-bd { position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(12px);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s both; }
  .auth-m { background:#ffffff;border:2px solid #e0d8cc;border-top:4px solid #f97316;border-radius:24px;padding:36px 36px 40px;width:100%;max-width:420px;box-shadow:0 32px 80px rgba(0,0,0,.18);animation:slideUp .3s cubic-bezier(.16,1,.3,1) both;position:relative; }
  .auth-inp { width:100%;padding:13px 16px;background:#fafaf8;border:2px solid #d4cfc5;border-radius:12px;color:#1a1814;font-family:var(--lp-font-b);font-size:15px;outline:none;transition:all .15s;margin-bottom:10px;font-weight:500; }
  .auth-inp:focus { border-color:var(--lp-green);background:#fff;box-shadow:0 0 0 3px rgba(249,115,22,.12); }
  .auth-inp::placeholder { color:#a09890; }
  .auth-lbl { font-size:11px;font-weight:900;color:#3d3830;margin-bottom:6px;letter-spacing:.8px;text-transform:uppercase;display:block; }
  .auth-sub { width:100%;padding:15px;font-size:16px;font-weight:800;background:#f97316;color:#ffffff;border:none;border-radius:12px;cursor:pointer;font-family:var(--lp-font-b);transition:all .15s;margin-top:8px;box-shadow:0 4px 20px rgba(249,115,22,.4);letter-spacing:.3px; }
  .auth-sub:hover { background:#ea580c;box-shadow:0 8px 32px rgba(249,115,22,.5);transform:translateY(-1px); }
  .auth-sub:disabled { opacity:.5;cursor:not-allowed;transform:none; }
  .auth-err { background:#fff0f0;border:1.5px solid #fca5a5;color:#dc2626;font-size:13px;padding:10px 14px;border-radius:10px;margin-bottom:14px;font-weight:600; }
  .spinner { width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block; }

  /* ── Picker ── */
  .pick-bd { position:fixed;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s both; }
  .pick-m { background:var(--lp-surface);border:1.5px solid var(--lp-border);border-radius:24px;padding:36px;width:100%;max-width:680px;max-height:92vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,.14);animation:slideUp .3s cubic-bezier(.16,1,.3,1) both; }
  .lp-card { background:var(--lp-faint);border:2px solid var(--lp-border);border-radius:16px;padding:18px 14px;text-align:center;cursor:pointer;transition:all .15s;position:relative; }
  .lp-card:hover { border-color:var(--lp-green);background:var(--lp-green-bg);transform:translateY(-2px);box-shadow:0 8px 24px rgba(249,115,22,.12); }
  .lp-card.has-p { border-color:rgba(45,184,122,.4);background:var(--lp-green-bg); }
  .res-badge { position:absolute;top:-8px;right:10px;font-size:10px;font-weight:800;background:var(--lp-green);color:#fff;border-radius:20px;padding:3px 10px;letter-spacing:.5px;text-transform:uppercase; }

  /* ── Comparison table ── */
  .cmp-tbl { width:100%;border-collapse:separate;border-spacing:0;margin-top:48px; }
  .cmp-tbl th { padding:14px 22px;font-size:13px;font-weight:800;letter-spacing:.5px;color:var(--lp-text); }
  .cmp-tbl td { padding:13px 22px;font-size:14px;border-top:1px solid var(--lp-border);color:#1a1814;font-weight:700; }
  .cmp-tbl tr:hover td { background:var(--lp-faint); }
  .col-us { background:#fff7ed; }

  /* ── Language grid ── */
  .lang-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-top:48px; }
  .lang-c { background:var(--lp-surface);border:1.5px solid var(--lp-border);border-radius:16px;padding:20px 14px;text-align:center;transition:all .2s; }
  .lang-c:hover { background:var(--lp-green-bg);border-color:var(--lp-green);transform:translateY(-3px);box-shadow:0 8px 24px rgba(249,115,22,.15); }

  /* ── How It Works ── */
  .hiw-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px;margin-top:56px;position:relative; }
  .hiw-card { display:flex;flex-direction:column;align-items:center;text-align:center;position:relative; }
  .hiw-icon-wrap { position:relative;margin-bottom:20px; }
  .hiw-icon-bg { width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--lp-green),var(--lp-green2));display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 8px 28px rgba(249,115,22,.3);position:relative;z-index:1; }
  .hiw-num { position:absolute;top:-6px;right:-6px;width:24px;height:24px;background:#fff;border:2.5px solid var(--lp-green);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:var(--lp-green);z-index:2; }
  .hiw-glow { position:absolute;inset:0;border-radius:50%;background:var(--lp-green);filter:blur(16px);opacity:.25; }
  .hiw-title { font-weight:800;font-size:15px;color:var(--lp-text);margin-bottom:8px; }
  .hiw-desc { font-size:13px;color:var(--lp-muted);line-height:1.7;font-weight:500;max-width:200px; }

  /* ── Stats bar ── */
  .stats-bar { display:flex;gap:0;justify-content:center;flex-wrap:wrap;margin-top:64px;border:1.5px solid var(--lp-border);border-radius:20px;overflow:hidden;background:var(--lp-surface); }
  .stat-item { flex:1;min-width:140px;padding:24px 16px;text-align:center;border-right:1px solid var(--lp-border); }
  .stat-item:last-child { border-right:none; }
  .stat-num { font-family:var(--lp-font-d);font-size:32px;font-weight:400;color:var(--lp-green);line-height:1; }
  .stat-label { font-size:12px;color:var(--lp-muted);margin-top:4px;font-weight:600;letter-spacing:.3px; }

  /* ── Testimonials ── */
  .testi-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:48px; }
  .testi { background:var(--lp-surface);border:1.5px solid var(--lp-border);border-radius:20px;padding:26px;transition:all .2s;cursor:default; }
  .testi:hover { border-color:var(--lp-green);transform:translateY(-4px) scale(1.01);box-shadow:0 16px 48px rgba(249,115,22,.1); }
  .testi-level { display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:800;letter-spacing:.5px;background:rgba(249,115,22,.12);color:var(--lp-green);border:1px solid rgba(249,115,22,.25); }

  /* ── Waitlist input ── */
  .wl-input {
    flex:1;min-width:220px;padding:15px 18px;border-radius:12px;
    border:1.5px solid var(--lp-border);background:var(--lp-surface);
    color:var(--lp-text);font-size:15px;font-family:var(--lp-font-b);
    font-weight:500;outline:none;transition:border-color .15s;
  }
  .wl-input:focus { border-color:var(--lp-green); }
  .wl-input::placeholder { color:var(--lp-muted); }

  @media (max-width:640px) {
    .lp-nav-links { display:none; }
    .auth-m { padding:28px 20px; }
    .pick-m { padding:24px 16px; }
  }
`;

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({ mode: init, onAuth, onClose }) {
  const [mode, setMode] = useState(init);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  async function sendReset() {
    if (!email.trim() || !email.includes("@")) {
      setError("Enter your email address above first, then click Forgot password.");
      return;
    }
    setLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: window.location.origin + "/reset-password",
      });
      setResetSent(true);
      setError("");
    } catch { setError("Could not send reset email. Please try again."); }
    finally { setLoading(false); }
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    // Local validation first — clear messages
    if (mode === "signup" && !name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email address."); return; }
    if (!password) { setError("Please enter a password."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);

    if (mode === "signup") {
      try {
        const tier = getTierForSignup(email, inviteCode);
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(), password,
          options: { data: { name: name.trim(), access_tier: tier } }
        });

        // Already registered (Supabase returns empty identities silently)
        if (data?.user?.identities?.length === 0) {
          setError("That email is already registered. Try logging in instead.");
          setLoading(false);
          return;
        }

        // Any real auth error
        if (err) {
          setError(err.message.includes("password") || err.message.includes("Password")
            ? "Password must be at least 6 characters."
            : err.message.includes("email") || err.message.includes("Email")
            ? "Please enter a valid email address."
            : "Something went wrong. Please try again.");
          setLoading(false);
          return;
        }

        const userId = data?.user?.id;
        if (userId) {
          // Save tier — fire and forget, never block signup on this
          try {
            await supabase.from("profiles").upsert({
              id: userId, email: email.trim().toLowerCase(),
              access_tier: tier, invite_code: inviteCode.toUpperCase() || null,
            }, { onConflict: "id" });
          } catch (_ignored) {}
          localStorage.setItem("lp_tier_" + userId, tier);
          setUserRole(userId, tier);
        }

        // Success — always route based on tier
        // data.user exists even when email confirmation is required
        // data.session is null when confirmation is required — that's OK
        const userObj = data?.session?.user || data?.user;
        if (!userObj) {
          // Edge case: signUp succeeded but no user returned
          // Show waitlist screen manually
          setLoading(false);
          onAuth({ id: null, email: email.trim().toLowerCase() }, tier);
          return;
        }
        onAuth(userObj, tier);

      } catch (e) {
        // Show actual error in dev, friendly message in prod
        const msg = e?.message || String(e) || "";
        setError(msg || "Signup failed. Please try again.");
        setLoading(false);
      }
      return;
    }

    // LOGIN
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), password
      });
      if (err) {
        setError("Incorrect email or password. Please try again.");
        setLoading(false);
        return;
      }
      const userId = data?.session?.user?.id;
      let tier = "waitlist";
      if (userId) {
        if (email.trim().toLowerCase() === ADMIN_EMAIL) {
          tier = "admin";
        } else {
          const cached = localStorage.getItem("lp_tier_" + userId);
          if (cached) {
            tier = cached;
          } else {
            try {
              const { data: profile } = await supabase.from("profiles")
                .select("access_tier").eq("id", userId).maybeSingle();
              tier = profile?.access_tier || "free";
            } catch (_) { tier = "waitlist"; }
            localStorage.setItem("lp_tier_" + userId, tier);
            setUserRole(userId, tier);
          setUserRole(userId, tier);
          }
        }
      }
      if (userId) setUserRole(userId, tier);
      onAuth(data?.session?.user, tier);
    } catch (e) {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-bd" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="auth-m">
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"#f0ede6",border:"1.5px solid #d4cfc5",borderRadius:8,color:"#6b6560",cursor:"pointer",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700}}>✕</button>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:42,marginBottom:10}}>🌍</div>
          <div style={{fontFamily:"var(--lp-font-d)",fontSize:28,fontWeight:400,color:"#1a1814",marginBottom:8,letterSpacing:"-0.3px"}}>{mode==="signup"?"Start learning for free":"Welcome back"}</div>
          <div style={{fontSize:14,color:"#3d3830",fontWeight:600,marginTop:4}}>{mode==="signup"?"Join 12,000+ learners on their path to fluency.":"Continue your streak and keep climbing."}</div>
        </div>
        {error && <div className="auth-err">{error}</div>}
        <form onSubmit={submit}>
          {mode==="signup" && <><label className="auth-lbl">Full name</label><input className="auth-inp" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/></>}
          <label className="auth-lbl">Email</label>
          <input className="auth-inp" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
          <label className="auth-lbl">Password</label>
          <input className="auth-inp" type="password" placeholder={mode==="signup"?"Min. 6 characters":"Your password"} value={password} onChange={e=>setPassword(e.target.value)}/>
          {mode==="signup" && (
            <div style={{marginBottom:12}}>
              <label className="auth-lbl">Invite code <span style={{color:"#a09890",fontWeight:400,textTransform:"none",letterSpacing:0}}>(optional — leave blank for waitlist)</span></label>
              <input className="auth-inp" placeholder="e.g. TESTER2026" value={inviteCode} onChange={e=>setInviteCode(e.target.value)} style={{letterSpacing:1.5,textTransform:"uppercase"}}/>
            </div>
          )}
          {mode==="login" && (
            <div style={{textAlign:"right",marginBottom:12,marginTop:-4}}>
              {resetSent
                ? <span style={{fontSize:12,color:"#16a34a",fontWeight:700}}>✓ Reset email sent — check your inbox</span>
                : <span onClick={sendReset} style={{fontSize:12,color:"#f97316",cursor:"pointer",fontWeight:700,textDecoration:"underline"}}>Forgot password?</span>
              }
            </div>
          )}
          <button type="submit" className="auth-sub" disabled={loading}>{loading?<span className="spinner"/>:mode==="signup"?"Create free account →":"Log in →"}</button>
        </form>
        <p style={{textAlign:"center",marginTop:20,fontSize:14,color:"#6b6560",fontWeight:600}}>
          {mode==="signup"?<>Already have an account? <span onClick={()=>setMode("login")} style={{color:"#f97316",cursor:"pointer",fontWeight:800}}>Log in</span></>:<>New here? <span onClick={()=>setMode("signup")} style={{color:"#f97316",cursor:"pointer",fontWeight:800}}>Sign up free</span></>}
        </p>
      </div>
    </div>
  );
}

// ─── LANGUAGE PICKER ──────────────────────────────────────────────────────────
function LanguagePicker({ user, onPick, onClose }) {
  const [pmap, setPmap] = useState({});

  useEffect(() => {
    const m = {};
    LANGUAGES.forEach(l => {
      try {
        const raw = localStorage.getItem(`lp_progress_${user?.id||"anon"}_${l.code}`);
        if (raw) { const p = JSON.parse(raw); if ((p?.completed?.length||0)>0||(p?.xp||0)>0) m[l.code]=p; }
      } catch {}
    });
    setPmap(m);
  }, [user?.id]);

  const sorted = [...LANGUAGES].sort((a,b) => (pmap[b.code]?1:0)-(pmap[a.code]?1:0));

  return (
    <div className="pick-bd" onClick={e=>e.target===e.currentTarget&&onClose?.()}>
      <div className="pick-m">
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:40,marginBottom:10}}>🌍</div>
          <div style={{fontFamily:"var(--lp-font-d)",fontSize:26,fontWeight:800,marginBottom:8}}>
            {Object.keys(pmap).length>0?"Resume or start a language":"What do you want to learn?"}
          </div>
          <div style={{fontSize:14,color:"var(--lp-muted)",fontWeight:300}}>
            {Object.keys(pmap).length>0?"Pick up where you left off, or start something new.":""}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
          {sorted.map(l => {
            const p = pmap[l.code];
            return (
              <div key={l.code} className={`lp-card${p?" has-p":""}`} onClick={()=>onPick(l.code)}>
                {p && <div className="res-badge">▶ Resume</div>}
                <div style={{fontSize:36,marginBottom:10}}>{l.flag}</div>
                <div style={{fontWeight:700,fontSize:15,marginBottom:3}}>{l.name}</div>
                <div style={{fontSize:11,color:"var(--lp-muted)",marginBottom:p?8:0}}>{l.native}</div>
                {p && <div style={{fontSize:11,color:"#22c55e",fontWeight:600}}>⚡ {p.xp||0} XP · {(p.completed||[]).length} done</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── DEMO CARD ────────────────────────────────────────────────────────────────

// ─── MINI LESSON DEMO ─────────────────────────────────────────────────────────
const DEMO_DATA = {
  es: {
    flag:"🇪🇸", name:"Spanish",
    A1: {
      cards:[
        {word:"Hola",ph:"OH-lah",en:"Hello",ex:"Hola, ¿cómo estás?"},
        {word:"Gracias",ph:"GRAH-syahs",en:"Thank you",ex:"Muchas gracias por tu ayuda."},
        {word:"Por favor",ph:"por fah-BOR",en:"Please",ex:"Un café, por favor."},
        {word:"Lo siento",ph:"loh SYEN-toh",en:"I'm sorry",ex:"Lo siento, no entiendo."},
        {word:"Buenos días",ph:"BWEH-nos DEE-ahs",en:"Good morning",ex:"Buenos días a todos."},
      ],
      questions:[
        {type:"mcq",q:"What does 'Gracias' mean?",opts:["Please","Thank you","Hello","Goodbye"],ans:"Thank you"},
        {type:"mcq",q:"How do you say 'Hello' in Spanish?",opts:["Adiós","Hola","Gracias","Sí"],ans:"Hola"},
        {type:"fill",q:"Complete: '__ días' means Good morning",opts:["Buenas","Buenos","Buen","Bueno"],ans:"Buenos"},
        {type:"mcq",q:"'Lo siento' means:",opts:["Thank you","Goodbye","I'm sorry","Please"],ans:"I'm sorry"},
        {type:"tile",q:"Arrange: 'Please' in Spanish",tiles:["favor","por","gracias","hola"],ans:"por favor"},
      ]
    },
    B1: {
      cards:[
        {word:"Sin embargo",ph:"seen em-BAR-goh",en:"However / Nevertheless",ex:"Es difícil; sin embargo, lo intentaré."},
        {word:"Aunque",ph:"OWN-keh",en:"Although / Even though",ex:"Aunque llueve, saldré a correr."},
        {word:"A pesar de",ph:"ah peh-SAR deh",en:"Despite / In spite of",ex:"Salió a pesar de estar enfermo."},
        {word:"Por lo tanto",ph:"por loh TAN-toh",en:"Therefore / So",ex:"Estudié mucho, por lo tanto aprobé."},
        {word:"En cuanto a",ph:"en KWAN-toh ah",en:"As for / Regarding",ex:"En cuanto a tu pregunta, la respuesta es sí."},
      ],
      questions:[
        {type:"mcq",q:"'Sin embargo' is best translated as:",opts:["Because","However","Although","Therefore"],ans:"However"},
        {type:"mcq",q:"Which connector means 'Therefore'?",opts:["Aunque","Sin embargo","Por lo tanto","A pesar de"],ans:"Por lo tanto"},
        {type:"fill",q:"'__ llueve, saldré' — which connector fits?",opts:["Sin embargo","Aunque","Por lo tanto","En cuanto a"],ans:"Aunque"},
        {type:"mcq",q:"'A pesar de' means:",opts:["As for","Although","Despite","Therefore"],ans:"Despite"},
        {type:"tile",q:"Arrange: 'As for your question'",tiles:["a","tu","en","cuanto","pregunta"],ans:"en cuanto a tu pregunta"},
      ]
    },
    C1: {
      cards:[
        {word:"matiz",ph:"mah-TEES",en:"Nuance / Shade of meaning",ex:"Hay un matiz importante entre ambas palabras."},
        {word:"suscitar",ph:"sus-see-TAR",en:"To give rise to / To arouse",ex:"Sus palabras suscitaron una gran controversia."},
        {word:"cabe destacar",ph:"KAH-beh des-tah-KAR",en:"It is worth highlighting",ex:"Cabe destacar que los resultados superaron las expectativas."},
        {word:"en aras de",ph:"en AH-ras deh",en:"For the sake of / In the interest of",ex:"En aras de la claridad, resumire los puntos clave."},
        {word:"a raiz de",ph:"ah rah-EES deh",en:"As a result of / Following",ex:"A raiz de los cambios, la empresa crecio notablemente."},
      ],
      questions:[
        {type:"mcq",q:"'Suscitar' most closely means:",opts:["To suppress","To give rise to","To clarify","To summarize"],ans:"To give rise to"},
        {type:"mcq",q:"'En aras de la claridad' means:",opts:["In spite of clarity","For the sake of clarity","Despite clarity","Due to clarity"],ans:"For the sake of clarity"},
        {type:"fill",q:"'__ destacar que los resultados...'",opts:["Cabe","Debe","Hace","Puede"],ans:"Cabe"},
        {type:"mcq",q:"'A raiz de' introduces:",opts:["A contrast","A purpose","A consequence","A concession"],ans:"A consequence"},
        {type:"tile",q:"Arrange: 'It is worth highlighting that results exceeded expectations'",tiles:["cabe","que","superaron","destacar","los","expectativas","resultados"],ans:"cabe destacar que los resultados superaron las expectativas"},
      ]
    }
  
  },
  de: {
    flag:"🇩🇪", name:"German",
    A1: {
      cards:[
        {word:"Hallo",ph:"HAH-loh",en:"Hello",ex:"Hallo, wie geht es Ihnen?"},
        {word:"Danke",ph:"DAHN-keh",en:"Thank you",ex:"Vielen Dank für Ihre Hilfe."},
        {word:"Bitte",ph:"BIT-teh",en:"Please / You're welcome",ex:"Ein Kaffee, bitte."},
        {word:"Entschuldigung",ph:"ent-SHUL-dee-goong",en:"Excuse me / Sorry",ex:"Entschuldigung, wo ist der Bahnhof?"},
        {word:"Guten Morgen",ph:"GOO-ten MOR-gen",en:"Good morning",ex:"Guten Morgen, alle zusammen!"},
      ],
      questions:[
        {type:"mcq",q:"'Danke' means:",opts:["Please","Hello","Thank you","Sorry"],ans:"Thank you"},
        {type:"mcq",q:"How do you say 'Excuse me' in German?",opts:["Bitte","Danke","Entschuldigung","Hallo"],ans:"Entschuldigung"},
        {type:"fill",q:"'Guten __' means Good morning",opts:["Tag","Morgen","Abend","Nacht"],ans:"Morgen"},
        {type:"mcq",q:"'Bitte' can mean:",opts:["Only Please","Only Welcome","Both Please and Welcome","Neither"],ans:"Both Please and Welcome"},
        {type:"tile",q:"Arrange: 'Good morning everyone'",tiles:["Morgen","alle","Guten","zusammen"],ans:"Guten Morgen alle zusammen"},
      ]
    },
    B1: {
      cards:[
        {word:"obwohl",ph:"ob-VOHL",en:"Although / Even though",ex:"Obwohl es regnet, gehe ich spazieren."},
        {word:"deswegen",ph:"DES-vay-gen",en:"Therefore / That's why",ex:"Ich war krank, deswegen bin ich zu Hause."},
        {word:"allerdings",ph:"AH-ler-dings",en:"However / Though",ex:"Das ist schön, allerdings sehr teuer."},
        {word:"nämlich",ph:"NAYM-likh",en:"Namely / You see",ex:"Ich kann nicht kommen, ich bin nämlich krank."},
        {word:"trotzdem",ph:"TROTS-daym",en:"Nevertheless / Still",ex:"Es regnet, trotzdem fahre ich Rad."},
      ],
      questions:[
        {type:"mcq",q:"'Obwohl' translates as:",opts:["Therefore","Although","Nevertheless","Namely"],ans:"Although"},
        {type:"mcq",q:"'Trotzdem' means:",opts:["Although","Therefore","Nevertheless","However"],ans:"Nevertheless"},
        {type:"fill",q:"'Das ist schön, __ sehr teuer' — which fits?",opts:["obwohl","deswegen","allerdings","nämlich"],ans:"allerdings"},
        {type:"mcq",q:"Which means 'That's why'?",opts:["allerdings","trotzdem","nämlich","deswegen"],ans:"deswegen"},
        {type:"tile",q:"Arrange: 'Although it rains'",tiles:["es","obwohl","regnet","aber"],ans:"obwohl es regnet"},
      ]
    },
    C1: {
      cards:[
        {word:"die Nuance",ph:"noo-AHN-seh",en:"Nuance",ex:"Hier liegt eine wichtige Nuance im Bedeutungsunterschied."},
        {word:"hervorrufen",ph:"hair-FOR-roo-fen",en:"To cause / To evoke / To give rise to",ex:"Seine Worte haben eine Kontroverse hervorgerufen."},
        {word:"es gilt zu beachten",ph:"es gilt tsoo beh-AKH-ten",en:"It should be noted",ex:"Es gilt zu beachten, dass die Ergebnisse variieren koennen."},
        {word:"im Hinblick auf",ph:"im HIN-blik owf",en:"With regard to / In view of",ex:"Im Hinblick auf die Ergebnisse muessen wir handeln."},
        {word:"infolgedessen",ph:"in-FOL-geh-des-sen",en:"As a result / Consequently",ex:"Er war krank, infolgedessen musste er absagen."},
      ],
      questions:[
        {type:"mcq",q:"'Hervorrufen' means:",opts:["To suppress","To cause or evoke","To clarify","To ignore"],ans:"To cause or evoke"},
        {type:"mcq",q:"'Im Hinblick auf' translates as:",opts:["In spite of","With regard to","As a result","Although"],ans:"With regard to"},
        {type:"fill",q:"'Es __ zu beachten, dass...' — complete the phrase",opts:["gilt","ist","war","bleibt"],ans:"gilt"},
        {type:"mcq",q:"'Infolgedessen' introduces:",opts:["A contrast","A concession","A consequence","A purpose"],ans:"A consequence"},
        {type:"tile",q:"Arrange: 'As a result he had to cancel'",tiles:["absagen","er","infolgedessen","musste"],ans:"infolgedessen musste er absagen"},
      ]
    }
  
  },
  fr: {
    flag:"🇫🇷", name:"French",
    A1: {
      cards:[
        {word:"Bonjour",ph:"bon-ZHOOR",en:"Good day / Hello",ex:"Bonjour, comment allez-vous?"},
        {word:"Merci",ph:"mair-SEE",en:"Thank you",ex:"Merci beaucoup pour votre aide."},
        {word:"S'il vous plaît",ph:"seel voo PLAY",en:"Please",ex:"Un café, s'il vous plaît."},
        {word:"Excusez-moi",ph:"ex-kyoo-ZAY mwah",en:"Excuse me",ex:"Excusez-moi, où est la gare?"},
        {word:"Au revoir",ph:"oh reh-VWAR",en:"Goodbye",ex:"Au revoir et bonne journée!"},
      ],
      questions:[
        {type:"mcq",q:"'Merci' means:",opts:["Hello","Please","Thank you","Goodbye"],ans:"Thank you"},
        {type:"mcq",q:"'Au revoir' means:",opts:["Hello","Goodbye","Please","Thank you"],ans:"Goodbye"},
        {type:"fill",q:"'Excusez-__' means Excuse me",opts:["vous","moi","nous","toi"],ans:"moi"},
        {type:"mcq",q:"How do you say 'Please' in French?",opts:["Merci","Bonjour","S'il vous plaît","Au revoir"],ans:"S'il vous plaît"},
        {type:"tile",q:"Arrange: 'Goodbye and have a nice day'",tiles:["revoir","journée","au","bonne","et"],ans:"au revoir et bonne journée"},
      ]
    },
    B1: {
      cards:[
        {word:"cependant",ph:"seh-pahn-DAHN",en:"However / Yet",ex:"C'est cher, cependant c'est de qualité."},
        {word:"pourtant",ph:"poor-TAHN",en:"Yet / Still / Nevertheless",ex:"Il pleut, pourtant elle sort."},
        {word:"donc",ph:"DONK",en:"So / Therefore",ex:"J'ai faim, donc je mange."},
        {word:"bien que",ph:"byahn keh",en:"Although (+ subjunctive)",ex:"Bien qu'il soit tard, il travaille."},
        {word:"néanmoins",ph:"nay-ahn-MWAN",en:"Nevertheless / Nonetheless",ex:"C'est difficile, néanmoins je l'essaie."},
      ],
      questions:[
        {type:"mcq",q:"'Donc' translates as:",opts:["Although","However","Therefore","Nevertheless"],ans:"Therefore"},
        {type:"mcq",q:"'Bien que' requires which mood?",opts:["Indicative","Subjunctive","Conditional","Imperative"],ans:"Subjunctive"},
        {type:"fill",q:"'Il pleut, __ elle sort' — which connector?",opts:["donc","cependant","pourtant","bien que"],ans:"pourtant"},
        {type:"mcq",q:"'Néanmoins' means:",opts:["Therefore","Although","Nevertheless","However"],ans:"Nevertheless"},
        {type:"tile",q:"Arrange: 'It's difficult, however it's quality'",tiles:["cher","qualité","cependant","c'est","de"],ans:"c'est cher cependant c'est de qualité"},
      ]
    },
    C1: {
      cards:[
        {word:"la nuance",ph:"noo-AHNS",en:"Nuance / Subtle distinction",ex:"Il y a une nuance importante entre ces deux termes."},
        {word:"susciter",ph:"sus-see-TAY",en:"To give rise to / To arouse",ex:"Ses propos ont suscite une vive controverse."},
        {word:"il convient de noter",ph:"eel kon-vyan duh no-TAY",en:"It should be noted",ex:"Il convient de noter que les resultats varient."},
        {word:"eu egard a",ph:"uh ay-GAR ah",en:"With regard to / In view of",ex:"Eu egard a la situation, nous devons agir."},
        {word:"par voie de consequence",ph:"par vwa duh kon-say-KAHNS",en:"As a consequence",ex:"Il a demissionne, par voie de consequence le projet s'est arrete."},
      ],
      questions:[
        {type:"mcq",q:"'Susciter' most closely means:",opts:["To suppress","To give rise to","To clarify","To conclude"],ans:"To give rise to"},
        {type:"mcq",q:"'Eu egard a' means:",opts:["In spite of","With regard to","As a result of","Although"],ans:"With regard to"},
        {type:"fill",q:"'Il __ de noter que les resultats varient'",opts:["convient","faut","doit","peut"],ans:"convient"},
        {type:"mcq",q:"'Par voie de consequence' introduces:",opts:["A contrast","A consequence","A purpose","A concession"],ans:"A consequence"},
        {type:"tile",q:"Arrange: 'It should be noted that the results vary'",tiles:["que","noter","il","convient","varient","les","de","resultats"],ans:"il convient de noter que les resultats varient"},
      ]
    }
  
  },
  it: {
    flag:"🇮🇹", name:"Italian",
    A1: {
      cards:[
        {word:"Ciao",ph:"CHOW",en:"Hi / Bye (informal)",ex:"Ciao! Come stai?"},
        {word:"Grazie",ph:"GRAT-syeh",en:"Thank you",ex:"Grazie mille per l'aiuto!"},
        {word:"Per favore",ph:"pair fah-VOH-reh",en:"Please",ex:"Un caffè, per favore."},
        {word:"Scusi",ph:"SKOO-zee",en:"Excuse me (formal)",ex:"Scusi, dov'è la stazione?"},
        {word:"Buongiorno",ph:"bwon-JOR-noh",en:"Good morning / Good day",ex:"Buongiorno a tutti!"},
      ],
      questions:[
        {type:"mcq",q:"'Grazie' means:",opts:["Please","Hello","Thank you","Sorry"],ans:"Thank you"},
        {type:"mcq",q:"'Ciao' can be used as:",opts:["Only hello","Only goodbye","Both hello and goodbye","Neither"],ans:"Both hello and goodbye"},
        {type:"fill",q:"'__ favore' means Please",opts:["Con","Per","Di","A"],ans:"Per"},
        {type:"mcq",q:"'Buongiorno' is used:",opts:["Only at night","In the morning and afternoon","Only in evening","Anytime"],ans:"In the morning and afternoon"},
        {type:"tile",q:"Arrange: 'Good morning to everyone'",tiles:["tutti","a","Buongiorno","giorno"],ans:"Buongiorno a tutti"},
      ]
    },
    B1: {
      cards:[
        {word:"tuttavia",ph:"toot-TAH-vyah",en:"However / Nevertheless",ex:"È difficile, tuttavia ci provo."},
        {word:"quindi",ph:"KWEEN-dee",en:"So / Therefore",ex:"Ho fame, quindi mangio."},
        {word:"sebbene",ph:"seb-BEH-neh",en:"Although (+ subjunctive)",ex:"Sebbene sia tardi, lavoro ancora."},
        {word:"eppure",ph:"ep-POO-reh",en:"And yet / Still",ex:"Piove, eppure esco lo stesso."},
        {word:"pertanto",ph:"pair-TAN-toh",en:"Therefore / Thus",ex:"Ho studiato molto, pertanto ho superato."},
      ],
      questions:[
        {type:"mcq",q:"'Quindi' means:",opts:["Although","However","Therefore","Yet"],ans:"Therefore"},
        {type:"mcq",q:"'Sebbene' is followed by:",opts:["Indicative","Subjunctive","Infinitive","Conditional"],ans:"Subjunctive"},
        {type:"fill",q:"'Piove, __ esco' — which fits?",opts:["quindi","pertanto","eppure","sebbene"],ans:"eppure"},
        {type:"mcq",q:"'Tuttavia' translates as:",opts:["Therefore","Although","However","Yet"],ans:"However"},
        {type:"tile",q:"Arrange: 'It's difficult, however I'll try'",tiles:["ci","tuttavia","difficile","provo","è"],ans:"è difficile tuttavia ci provo"},
      ]
    },
    C1: {
      cards:[
        {word:"la sfumatura",ph:"sfoo-mah-TOO-rah",en:"Nuance / Subtle shade",ex:"C'e una sfumatura importante tra questi due termini."},
        {word:"suscitare",ph:"soos-chee-TAH-reh",en:"To give rise to / To arouse",ex:"Le sue parole hanno suscitato una grande controversia."},
        {word:"vale la pena sottolineare",ph:"VAH-leh la PEH-na sot-to-lee-neh-AH-reh",en:"It is worth underlining",ex:"Vale la pena sottolineare che i risultati sono stati eccellenti."},
        {word:"in virtu di",ph:"in veer-TOO dee",en:"By virtue of / Thanks to",ex:"In virtu del suo impegno, ha ottenuto il lavoro."},
        {word:"di conseguenza",ph:"dee kon-seh-GWEN-tsah",en:"As a result / Consequently",ex:"Era malato, di conseguenza ha annullato l'incontro."},
      ],
      questions:[
        {type:"mcq",q:"'Suscitare' means:",opts:["To suppress","To give rise to","To clarify","To conclude"],ans:"To give rise to"},
        {type:"mcq",q:"'In virtu di' translates as:",opts:["In spite of","By virtue of","As a result of","Although"],ans:"By virtue of"},
        {type:"fill",q:"'Di __' means consequently",opts:["conseguenza","contrasto","piu","meno"],ans:"conseguenza"},
        {type:"mcq",q:"'Vale la pena sottolineare' is used to:",opts:["Dismiss a point","Emphasize something important","Change subject","Conclude"],ans:"Emphasize something important"},
        {type:"tile",q:"Arrange: 'As a result he cancelled the meeting'",tiles:["annullato","di","ha","conseguenza","l'incontro"],ans:"di conseguenza ha annullato l'incontro"},
      ]
    }
  
  },
  pt: {
    flag:"🇧🇷", name:"Portuguese",
    A1: {
      cards:[
        {word:"Olá",ph:"oh-LAH",en:"Hello",ex:"Olá, tudo bem?"},
        {word:"Obrigado/a",ph:"oh-bree-GAH-doo",en:"Thank you",ex:"Muito obrigado pela ajuda!"},
        {word:"Por favor",ph:"por fah-VOR",en:"Please",ex:"Um café, por favor."},
        {word:"Desculpe",ph:"desh-KUL-peh",en:"Sorry / Excuse me",ex:"Desculpe, não entendi."},
        {word:"Bom dia",ph:"bom JEE-ah",en:"Good morning",ex:"Bom dia a todos!"},
      ],
      questions:[
        {type:"mcq",q:"'Obrigado' means:",opts:["Please","Hello","Thank you","Sorry"],ans:"Thank you"},
        {type:"mcq",q:"'Bom dia' means:",opts:["Good night","Good evening","Good morning","Goodbye"],ans:"Good morning"},
        {type:"fill",q:"'__culpe' means Sorry",opts:["Des","Con","In","Per"],ans:"Des"},
        {type:"mcq",q:"'Por favor' translates as:",opts:["Thank you","Hello","Goodbye","Please"],ans:"Please"},
        {type:"tile",q:"Arrange: 'Good morning to everyone'",tiles:["todos","dia","a","Bom"],ans:"Bom dia a todos"},
      ]
    },
    B1: {
      cards:[
        {word:"no entanto",ph:"noo en-TAN-too",en:"However / Nevertheless",ex:"É caro, no entanto vale a pena."},
        {word:"portanto",ph:"por-TAN-too",en:"Therefore / So",ex:"Estudei, portanto passei no exame."},
        {word:"embora",ph:"em-BOH-rah",en:"Although (+ subjunctive)",ex:"Embora chova, saio de casa."},
        {word:"ainda assim",ph:"ah-EEN-dah ah-SEEM",en:"Even so / Still",ex:"Está cansado, ainda assim trabalha."},
        {word:"todavia",ph:"toh-dah-VEE-ah",en:"However / Yet",ex:"Tentei, todavia não consegui."},
      ],
      questions:[
        {type:"mcq",q:"'Portanto' means:",opts:["Although","However","Therefore","Still"],ans:"Therefore"},
        {type:"mcq",q:"'Embora' requires which mood?",opts:["Indicative","Subjunctive","Conditional","Infinitive"],ans:"Subjunctive"},
        {type:"fill",q:"'É caro, __ vale a pena' — which fits?",opts:["portanto","embora","todavia","no entanto"],ans:"no entanto"},
        {type:"mcq",q:"'Ainda assim' means:",opts:["Therefore","Although","Even so","However"],ans:"Even so"},
        {type:"tile",q:"Arrange: 'Although it rains, I go out'",tiles:["saio","chova","casa","embora","de"],ans:"embora chova saio de casa"},
      ]
    },
    C1: {
      cards:[
        {word:"a nuance",ph:"noo-AHN-seh",en:"Nuance",ex:"Ha uma nuance importante entre esses dois conceitos."},
        {word:"suscitar",ph:"sus-see-TAR",en:"To give rise to / To arouse",ex:"Suas palavras suscitaram uma grande controversia."},
        {word:"cabe ressaltar",ph:"KAH-beh heh-sal-TAR",en:"It is worth highlighting",ex:"Cabe ressaltar que os resultados foram excelentes."},
        {word:"em virtude de",ph:"em veer-TOO-deh deh",en:"By virtue of / Due to",ex:"Em virtude de seu esforco, foi promovido."},
        {word:"em decorrencia de",ph:"em deh-ko-HEN-syah deh",en:"As a result of / Following",ex:"Em decorrencia das mudancas, a empresa cresceu."},
      ],
      questions:[
        {type:"mcq",q:"'Suscitar' means:",opts:["To suppress","To give rise to","To clarify","To conclude"],ans:"To give rise to"},
        {type:"mcq",q:"'Em virtude de' translates as:",opts:["In spite of","Due to or by virtue of","As a result of","Although"],ans:"Due to or by virtue of"},
        {type:"fill",q:"'Cabe __ que os resultados...'",opts:["ressaltar","notar","dizer","falar"],ans:"ressaltar"},
        {type:"mcq",q:"'Em decorrencia de' introduces:",opts:["A contrast","A consequence","A purpose","A concession"],ans:"A consequence"},
        {type:"tile",q:"Arrange: 'It is worth highlighting that the results were excellent'",tiles:["foram","cabe","os","que","excelentes","ressaltar","resultados"],ans:"cabe ressaltar que os resultados foram excelentes"},
      ]
    }
  
  },
  zh: {
    flag:"🇨🇳", name:"Mandarin",
    A1: {
      cards:[
        {word:"你好",ph:"nǐ hǎo",en:"Hello",ex:"你好！你叫什么名字？"},
        {word:"谢谢",ph:"xiè xie",en:"Thank you",ex:"非常谢谢你的帮助！"},
        {word:"请",ph:"qǐng",en:"Please",ex:"请坐，喝点茶。"},
        {word:"对不起",ph:"duì bu qǐ",en:"I'm sorry",ex:"对不起，我迟到了。"},
        {word:"早上好",ph:"zǎo shàng hǎo",en:"Good morning",ex:"早上好，今天天气不错。"},
      ],
      questions:[
        {type:"mcq",q:"'谢谢' means:",opts:["Hello","Please","Thank you","Sorry"],ans:"Thank you"},
        {type:"mcq",q:"'对不起' means:",opts:["Thank you","Hello","Please","I'm sorry"],ans:"I'm sorry"},
        {type:"fill",q:"'早上__' means Good morning",opts:["好","大","多","高"],ans:"好"},
        {type:"mcq",q:"'请' is used to mean:",opts:["Thank you","Hello","Please","Goodbye"],ans:"Please"},
        {type:"tile",q:"Arrange: 'Hello, what is your name?'",tiles:["叫","名字","你","什么","好"],ans:"你好 你叫什么名字"},
      ]
    },
    B1: {
      cards:[
        {word:"虽然…但是",ph:"suī rán… dàn shì",en:"Although…but",ex:"虽然很难，但是我会努力。"},
        {word:"因此",ph:"yīn cǐ",en:"Therefore / Thus",ex:"他努力工作，因此成功了。"},
        {word:"然而",ph:"rán ér",en:"However / Yet",ex:"结果很好，然而过程很难。"},
        {word:"尽管",ph:"jǐn guǎn",en:"Even though / Despite",ex:"尽管下雨，她还是出门了。"},
        {word:"于是",ph:"yú shì",en:"As a result / So then",ex:"他很累，于是早早睡觉了。"},
      ],
      questions:[
        {type:"mcq",q:"'因此' translates as:",opts:["Although","However","Therefore","Even though"],ans:"Therefore"},
        {type:"mcq",q:"'虽然…但是' is a pattern for:",opts:["Cause-effect","Contrast (although…but)","Sequence","Purpose"],ans:"Contrast (although…but)"},
        {type:"fill",q:"'结果很好，__ 过程很难' — which fits?",opts:["因此","于是","然而","尽管"],ans:"然而"},
        {type:"mcq",q:"'尽管' means:",opts:["Therefore","As a result","Even though","However"],ans:"Even though"},
        {type:"tile",q:"Arrange: 'Although difficult, I will work hard'",tiles:["难","但是","虽然","很","努力"],ans:"虽然很难但是努力"},
      ]
    },
    C1: {
      cards:[
        {word:"细微差别",ph:"xi wei cha bie",en:"Nuance / Subtle distinction",ex:"这两个词之间有细微差别，需要仔细辨别。"},
        {word:"引发",ph:"yin fa",en:"To trigger / To give rise to",ex:"他的言论引发了激烈的争论。"},
        {word:"值得指出的是",ph:"zhi de zhi chu de shi",en:"It is worth pointing out that",ex:"值得指出的是，研究结果超出了预期。"},
        {word:"鉴于",ph:"jian yu",en:"In view of / Given that",ex:"鉴于当前形势，我们需要采取行动。"},
        {word:"由此可见",ph:"you ci ke jian",en:"From this we can see / Therefore",ex:"成绩提高了，由此可见方法是有效的。"},
      ],
      questions:[
        {type:"mcq",q:"'引发' means:",opts:["To suppress","To trigger or give rise to","To clarify","To conclude"],ans:"To trigger or give rise to"},
        {type:"mcq",q:"'鉴于' translates as:",opts:["In spite of","In view of or given that","As a result","Although"],ans:"In view of or given that"},
        {type:"fill",q:"'__ 指出的是，结果超出预期'",opts:["值得","需要","应该","可以"],ans:"值得"},
        {type:"mcq",q:"'由此可见' is used to:",opts:["Show contrast","Draw a conclusion","Add information","Concede a point"],ans:"Draw a conclusion"},
        {type:"tile",q:"Arrange: 'In view of the current situation we need to act'",tiles:["需要","形势","鉴于","当前","采取行动"],ans:"鉴于当前形势需要采取行动"},
      ]
    }
  
  },
  ja: {
    flag:"🇯🇵", name:"Japanese",
    A1: {
      cards:[
        {word:"こんにちは",ph:"kon-ni-chi-WA",en:"Hello / Good afternoon",ex:"こんにちは、お元気ですか？"},
        {word:"ありがとう",ph:"a-ri-ga-TO",en:"Thank you",ex:"どうもありがとうございます！"},
        {word:"すみません",ph:"su-mi-MA-sen",en:"Excuse me / Sorry",ex:"すみません、駅はどこですか？"},
        {word:"おはようございます",ph:"o-ha-YO go-za-i-mas",en:"Good morning",ex:"おはようございます、先生！"},
        {word:"はい",ph:"hai",en:"Yes",ex:"はい、わかりました。"},
      ],
      questions:[
        {type:"mcq",q:"'ありがとう' means:",opts:["Hello","Sorry","Thank you","Yes"],ans:"Thank you"},
        {type:"mcq",q:"'すみません' can mean:",opts:["Only Sorry","Only Excuse me","Both Excuse me and Sorry","Thank you"],ans:"Both Excuse me and Sorry"},
        {type:"fill",q:"'おはよう__' is Good morning (formal)",opts:["です","ございます","ました","ください"],ans:"ございます"},
        {type:"mcq",q:"'はい' means:",opts:["No","Hello","Yes","Thank you"],ans:"Yes"},
        {type:"tile",q:"Arrange: 'Excuse me, where is the station?'",tiles:["駅","すみません","どこ","は","ですか"],ans:"すみません 駅はどこですか"},
      ]
    },
    B1: {
      cards:[
        {word:"しかし",ph:"shi-KA-shi",en:"However / But (formal)",ex:"難しい。しかし、諦めない。"},
        {word:"したがって",ph:"shi-ta-GA-te",en:"Therefore / Consequently",ex:"努力した。したがって、合格した。"},
        {word:"にもかかわらず",ph:"ni-mo-ka-ka-wa-ra-zu",en:"Despite / In spite of",ex:"雨にもかかわらず、彼女は来た。"},
        {word:"それでも",ph:"so-re-DE-mo",en:"Even so / Still",ex:"疲れた。それでも続ける。"},
        {word:"つまり",ph:"tsu-MA-ri",en:"In other words / That is",ex:"彼は来ない。つまり、会議は中止だ。"},
      ],
      questions:[
        {type:"mcq",q:"'したがって' means:",opts:["However","Despite","Therefore","Even so"],ans:"Therefore"},
        {type:"mcq",q:"'にもかかわらず' translates as:",opts:["Therefore","In spite of","However","That is"],ans:"In spite of"},
        {type:"fill",q:"'疲れた。__ 続ける' — which fits?",opts:["しかし","したがって","つまり","それでも"],ans:"それでも"},
        {type:"mcq",q:"'つまり' is used to:",opts:["Show contrast","Show cause","Rephrase/clarify","Show time"],ans:"Rephrase/clarify"},
        {type:"tile",q:"Arrange: 'However, I won't give up'",tiles:["諦め","しかし","ない","難しい"],ans:"しかし 諦めない"},
      ]
    },
    C1: {
      cards:[
        {word:"ニュアンス",ph:"nyuu-AN-su",en:"Nuance",ex:"この二つの言葉にはニュアンスの違いがある。"},
        {word:"引き起こす",ph:"hi-ki-o-ko-su",en:"To cause / To give rise to",ex:"その発言は大きな論争を引き起こした。"},
        {word:"注目すべきは",ph:"chuu-moku-su-be-ki-wa",en:"What is noteworthy is",ex:"注目すべきは、結果が予想を上回ったことだ。"},
        {word:"を踏まえて",ph:"wo fu-ma-e-te",en:"Based on / Taking into account",ex:"調査結果を踏まえて、戦略を見直した。"},
        {word:"それゆえ",ph:"so-re-yu-e",en:"Therefore / For that reason",ex:"努力を惜しまなかった。それゆえ、成功した。"},
      ],
      questions:[
        {type:"mcq",q:"'引き起こす' means:",opts:["To suppress","To cause or give rise to","To clarify","To conclude"],ans:"To cause or give rise to"},
        {type:"mcq",q:"'を踏まえて' means:",opts:["In spite of","Based on or taking into account","As a result","Although"],ans:"Based on or taking into account"},
        {type:"fill",q:"'__ すべきは、結果が予想を上回った'",opts:["注目","観察","理解","発見"],ans:"注目"},
        {type:"mcq",q:"'それゆえ' introduces:",opts:["A contrast","A concession","A consequence","A purpose"],ans:"A consequence"},
        {type:"tile",q:"Arrange: 'Therefore he succeeded'",tiles:["成功した","それゆえ"],ans:"それゆえ 成功した"},
      ]
    }
  
  },
  ko: {
    flag:"🇰🇷", name:"Korean",
    A1: {
      cards:[
        {word:"안녕하세요",ph:"an-nyong-ha-SE-yo",en:"Hello (formal)",ex:"안녕하세요! 처음 뵙겠습니다."},
        {word:"감사합니다",ph:"gam-sa-HAM-ni-da",en:"Thank you (formal)",ex:"도와주셔서 감사합니다."},
        {word:"죄송합니다",ph:"joe-song-HAM-ni-da",en:"I'm sorry (formal)",ex:"늦어서 죄송합니다."},
        {word:"네",ph:"neh",en:"Yes",ex:"네, 알겠습니다."},
        {word:"안녕히 가세요",ph:"an-nyong-hi ga-SE-yo",en:"Goodbye (to person leaving)",ex:"안녕히 가세요!"},
      ],
      questions:[
        {type:"mcq",q:"'감사합니다' means:",opts:["Hello","Sorry","Thank you","Goodbye"],ans:"Thank you"},
        {type:"mcq",q:"'안녕하세요' is used:",opts:["Only with friends","Only formally","In formal situations","Only goodbye"],ans:"In formal situations"},
        {type:"fill",q:"'네' means:",opts:["No","Maybe","Yes","Sorry"],ans:"Yes"},
        {type:"mcq",q:"'죄송합니다' means:",opts:["Thank you","Hello","I'm sorry","Goodbye"],ans:"I'm sorry"},
        {type:"tile",q:"Arrange: 'Thank you for your help'",tiles:["주셔서","도와","감사합니다"],ans:"도와주셔서 감사합니다"},
      ]
    },
    B1: {
      cards:[
        {word:"그러나",ph:"geu-RO-na",en:"However / But (formal)",ex:"어렵다. 그러나 포기하지 않는다."},
        {word:"따라서",ph:"tta-RA-so",en:"Therefore / Accordingly",ex:"열심히 했다. 따라서 합격했다."},
        {word:"비록…지만",ph:"bi-rok…ji-man",en:"Although / Even though",ex:"비록 힘들지만 계속하겠다."},
        {word:"그럼에도",ph:"geu-rom-E-do",en:"Nevertheless / Even so",ex:"아프다. 그럼에도 일한다."},
        {word:"즉",ph:"jeuk",en:"That is / Namely",ex:"오늘 행사가 취소됐다. 즉, 집에 있자."},
      ],
      questions:[
        {type:"mcq",q:"'따라서' means:",opts:["However","Although","Therefore","Nevertheless"],ans:"Therefore"},
        {type:"mcq",q:"'비록…지만' expresses:",opts:["Cause-effect","Contrast (although)","Sequence","Purpose"],ans:"Contrast (although)"},
        {type:"fill",q:"'어렵다. __ 포기 안 해' — which fits?",opts:["따라서","즉","그럼에도","비록"],ans:"그럼에도"},
        {type:"mcq",q:"'즉' is used to:",opts:["Show contrast","Show cause","Clarify/restate","Show time"],ans:"Clarify/restate"},
        {type:"tile",q:"Arrange: 'Although difficult, I will continue'",tiles:["계속하겠다","힘들지만","비록"],ans:"비록 힘들지만 계속하겠다"},
      ]
    },
    C1: {
      cards:[
        {word:"뉘앙스",ph:"nwi-ang-seu",en:"Nuance",ex:"두 단어 사이에는 중요한 뉘앙스 차이가 있다."},
        {word:"야기하다",ph:"ya-gi-ha-da",en:"To cause / To give rise to",ex:"그의 발언이 큰 논란을 야기했다."},
        {word:"주목할 만한 점은",ph:"ju-mok-hal man-han jeo-meun",en:"What is noteworthy is",ex:"주목할 만한 점은 결과가 예상을 초과했다는 것이다."},
        {word:"을 감안하여",ph:"eul ga-man-ha-yeo",en:"Taking into account / In view of",ex:"상황을 감안하여 전략을 수정했다."},
        {word:"이에 따라",ph:"i-e tta-ra",en:"Accordingly / As a result",ex:"정책이 변경됐다. 이에 따라 대응이 필요하다."},
      ],
      questions:[
        {type:"mcq",q:"'야기하다' means:",opts:["To suppress","To cause or give rise to","To clarify","To conclude"],ans:"To cause or give rise to"},
        {type:"mcq",q:"'을 감안하여' means:",opts:["In spite of","Taking into account","As a result","Although"],ans:"Taking into account"},
        {type:"fill",q:"'이에 __' means accordingly or as a result",opts:["따라","도불구","의해","비해"],ans:"따라"},
        {type:"mcq",q:"'주목할 만한 점은' is used to:",opts:["Dismiss a point","Highlight something noteworthy","Change subject","Conclude"],ans:"Highlight something noteworthy"},
        {type:"tile",q:"Arrange: 'As a result a response is needed'",tiles:["필요하다","따라","이에","대응이"],ans:"이에 따라 대응이 필요하다"},
      ]
    }
  
  },
  pl: {
    flag:"🇵🇱", name:"Polish",
    A1: {
      cards:[
        {word:"Cześć",ph:"CHESHCH",en:"Hi / Bye (informal)",ex:"Cześć! Jak się masz?"},
        {word:"Dziękuję",ph:"jen-KOO-yeh",en:"Thank you",ex:"Bardzo dziękuję za pomoc!"},
        {word:"Proszę",ph:"PRO-sheh",en:"Please / You're welcome",ex:"Proszę, wejdź do środka."},
        {word:"Przepraszam",ph:"psheh-PRA-sham",en:"Excuse me / I'm sorry",ex:"Przepraszam, gdzie jest dworzec?"},
        {word:"Dzień dobry",ph:"jen DOB-rih",en:"Good morning / Good day",ex:"Dzień dobry, jak mogę pomóc?"},
      ],
      questions:[
        {type:"mcq",q:"'Dziękuję' means:",opts:["Please","Hello","Thank you","Sorry"],ans:"Thank you"},
        {type:"mcq",q:"'Cześć' can be used as:",opts:["Only hello","Only goodbye","Both hello and goodbye","Neither"],ans:"Both hello and goodbye"},
        {type:"fill",q:"'Dzień __' means Good day",opts:["dobry","dobrze","dobrym","dobre"],ans:"dobry"},
        {type:"mcq",q:"'Przepraszam' means:",opts:["Thank you","Goodbye","Excuse me","Please"],ans:"Excuse me"},
        {type:"tile",q:"Arrange: 'Good day, how can I help?'",tiles:["mogę","Dzień","jak","dobry","pomóc"],ans:"Dzień dobry jak mogę pomóc"},
      ]
    },
    B1: {
      cards:[
        {word:"jednak",ph:"YED-nak",en:"However / Yet",ex:"To trudne, jednak spróbuję."},
        {word:"dlatego",ph:"dla-TEH-goh",en:"Therefore / That's why",ex:"Uczyłem się, dlatego zdałem."},
        {word:"chociaż",ph:"KHO-chazh",en:"Although / Even though",ex:"Chociaż pada, wychodzę."},
        {word:"mimo to",ph:"MEE-mo toh",en:"Nevertheless / Despite that",ex:"Jestem zmęczony, mimo to pracuję."},
        {word:"czyli",ph:"CHIH-lih",en:"That is / So / Meaning",ex:"Nie przyjdzie. Czyli spotkanie odwołane."},
      ],
      questions:[
        {type:"mcq",q:"'Dlatego' means:",opts:["Although","However","Therefore","Nevertheless"],ans:"Therefore"},
        {type:"mcq",q:"'Chociaż' introduces:",opts:["A result","A contrast (although)","A cause","A restatement"],ans:"A contrast (although)"},
        {type:"fill",q:"'To trudne, __ spróbuję' — which fits?",opts:["dlatego","chociaż","czyli","jednak"],ans:"jednak"},
        {type:"mcq",q:"'Mimo to' means:",opts:["Therefore","That is","Nevertheless","Although"],ans:"Nevertheless"},
        {type:"tile",q:"Arrange: 'Although it rains, I go out'",tiles:["wychodzę","pada","chociaż"],ans:"chociaż pada wychodzę"},
      ]
    },
    C1: {
      cards:[
        {word:"niuans",ph:"nyoo-ans",en:"Nuance",ex:"Miedzy tymi slowami jest wazny niuans znaczeniowy."},
        {word:"wywolac",ph:"vy-vo-wach",en:"To cause / To give rise to",ex:"Jego slowa wywolaly ogromna kontrowersje."},
        {word:"warto podkreslic",ph:"var-to pod-kresh-leech",en:"It is worth emphasizing",ex:"Warto podkreslic, ze wyniki przekroczyly oczekiwania."},
        {word:"w swietle",ph:"v shvyet-leh",en:"In light of / In view of",ex:"W swietle nowych danych zmienilismy strategie."},
        {word:"w konsekwencji",ph:"v kon-sek-ven-tsyee",en:"As a consequence / Consequently",ex:"Byl chory, w konsekwencji odwolal spotkanie."},
      ],
      questions:[
        {type:"mcq",q:"'Wywolac' means:",opts:["To suppress","To cause or give rise to","To clarify","To conclude"],ans:"To cause or give rise to"},
        {type:"mcq",q:"'W swietle' translates as:",opts:["In spite of","In light of or in view of","As a result","Although"],ans:"In light of or in view of"},
        {type:"fill",q:"'Warto __, ze wyniki...'",opts:["podkreslic","powiedziec","wiedziec","myslec"],ans:"podkreslic"},
        {type:"mcq",q:"'W konsekwencji' introduces:",opts:["A contrast","A consequence","A purpose","A concession"],ans:"A consequence"},
        {type:"tile",q:"Arrange: 'As a consequence he cancelled the meeting'",tiles:["spotkanie","w","odwolal","konsekwencji"],ans:"w konsekwencji odwolal spotkanie"},
      ]
    }
  
  },
  en: {
    flag:"🇬🇧", name:"English",
    A1: {
      cards:[
        {word:"How are you?",ph:"how ar yoo",en:"Greeting asking wellbeing",ex:"Hi! How are you? I'm fine, thanks."},
        {word:"Nice to meet you",ph:"nys tuh meet yoo",en:"Said when meeting someone",ex:"Nice to meet you, I'm Anna."},
        {word:"What's your name?",ph:"wots yor naym",en:"Asking someone's name",ex:"Excuse me, what's your name?"},
        {word:"I don't understand",ph:"I dohnt under-stand",en:"Not understanding something",ex:"Sorry, I don't understand. Can you repeat?"},
        {word:"Can you help me?",ph:"kan yoo help mee",en:"Asking for assistance",ex:"Excuse me, can you help me find the station?"},
      ],
      questions:[
        {type:"mcq",q:"'Nice to meet you' is said when:",opts:["Saying goodbye","Meeting someone new","Asking for help","Not understanding"],ans:"Meeting someone new"},
        {type:"mcq",q:"'I don't understand' means:",opts:["I agree","I know this","Something is unclear to you","You are angry"],ans:"Something is unclear to you"},
        {type:"fill",q:"'What's your __?' asks for your name",opts:["age","name","job","phone"],ans:"name"},
        {type:"mcq",q:"'Can you help me?' is:",opts:["A greeting","A farewell","A request for assistance","An apology"],ans:"A request for assistance"},
        {type:"tile",q:"Arrange: 'Sorry, can you repeat?'",tiles:["you","Sorry","repeat","can"],ans:"Sorry can you repeat"},
      ]
    },
    B1: {
      cards:[
        {word:"nevertheless",ph:"nev-er-the-LESS",en:"In spite of that / Still",ex:"It was hard; nevertheless, she succeeded."},
        {word:"therefore",ph:"THAIR-for",en:"For that reason / So",ex:"He studied hard; therefore, he passed."},
        {word:"although",ph:"awl-THOH",en:"In spite of the fact that",ex:"Although it rained, we went out."},
        {word:"furthermore",ph:"FUR-ther-more",en:"In addition / Moreover",ex:"It's cheap, and furthermore it's good quality."},
        {word:"consequently",ph:"KON-se-kwent-lee",en:"As a result / Therefore",ex:"She missed the bus; consequently, she was late."},
      ],
      questions:[
        {type:"mcq",q:"'Therefore' introduces:",opts:["A contrast","A result/reason","An addition","A concession"],ans:"A result/reason"},
        {type:"mcq",q:"'Although' is used to express:",opts:["Addition","Cause","Contrast/concession","Result"],ans:"Contrast/concession"},
        {type:"fill",q:"'It's cheap, and __ it's good quality' — which fits?",opts:["therefore","although","furthermore","consequently"],ans:"furthermore"},
        {type:"mcq",q:"'Nevertheless' is similar in meaning to:",opts:["Therefore","Furthermore","However","Although"],ans:"However"},
        {type:"tile",q:"Arrange: 'Although it rained, we went out'",tiles:["went","rained","Although","it","out","we"],ans:"Although it rained we went out"},
      ]
    },
    C1: {
      cards:[
        {word:"nuance",ph:"nyoo-ahns",en:"A subtle distinction or variation",ex:"There's an important nuance between these two terms."},
        {word:"to give rise to",ph:"tuh giv ryz tuh",en:"To cause / To lead to",ex:"The new policy gave rise to significant debate."},
        {word:"it is worth noting",ph:"it iz wurth no-ting",en:"Used to highlight something important",ex:"It is worth noting that the results exceeded expectations."},
        {word:"in light of",ph:"in lyt uv",en:"Given / Taking into account",ex:"In light of the evidence, we must reconsider our approach."},
        {word:"as a consequence",ph:"az uh kon-seh-kwens",en:"As a result / Therefore",ex:"He missed the deadline; as a consequence, he lost the contract."},
      ],
      questions:[
        {type:"mcq",q:"'To give rise to' most closely means:",opts:["To suppress","To cause or lead to","To clarify","To conclude"],ans:"To cause or lead to"},
        {type:"mcq",q:"'In light of' is used to:",opts:["Show contrast","Introduce evidence or context","Express concession","Add unrelated info"],ans:"Introduce evidence or context"},
        {type:"fill",q:"'It is __ noting that the results...'",opts:["worth","good","nice","fine"],ans:"worth"},
        {type:"mcq",q:"'As a consequence' introduces:",opts:["A contrast","A concession","A consequence","A purpose"],ans:"A consequence"},
        {type:"tile",q:"Arrange: 'In light of the evidence we must reconsider'",tiles:["evidence","reconsider","the","in","light","must","of","we"],ans:"in light of the evidence we must reconsider"},
      ]
    }
  
  }
};

const LEVELS = [
  {key:"A1",label:"A1",desc:"Beginner",color:"#22c55e"},
  {key:"B1",label:"B1",desc:"Intermediate",color:"#38bdf8"},
  {key:"C1",label:"C1",desc:"Advanced",color:"#a78bfa"},
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function MiniLesson({ onSignup }) {
  const [lang, setLang] = useState("es");
  const [level, setLevel] = useState("A1");
  const [phase, setPhase] = useState("setup");   // setup | cards | quiz | done
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [tileSel, setTileSel] = useState([]);

  const data = DEMO_DATA[lang]?.[level];
  const cards = data?.cards || [];
  const questions = data?.questions || [];

  function start() { setPhase("cards"); setCardIdx(0); setFlipped(false); }
  function nextCard() {
    if (cardIdx+1 >= cards.length) { setPhase("quiz"); setQIdx(0); setChosen(null); setTileSel([]); }
    else { setCardIdx(i=>i+1); setFlipped(false); }
  }
  function pickAnswer(opt) {
    if (chosen) return;
    setChosen(opt);
    const q = questions[qIdx];
    if (opt === q.ans) setCorrect(c=>c+1);
    setTimeout(() => {
      if (qIdx+1 >= questions.length) setPhase("done");
      else { setQIdx(i=>i+1); setChosen(null); setTileSel([]); }
    }, 900);
  }
  function toggleTile(idx) {
    if (chosen) return;
    setTileSel(prev => prev.includes(idx) ? prev.filter(i=>i!==idx) : [...prev,idx]);
  }
  function checkTile() {
    if (!tileSel.length) return;
    const q = questions[qIdx];
    const ans = tileSel.map(i=>q.tiles[i]).join(" ");
    const isOk = ans.trim().toLowerCase() === q.ans.trim().toLowerCase();
    setChosen(isOk ? q.ans : "wrong");
    if (isOk) setCorrect(c=>c+1);
    setTimeout(() => {
      if (qIdx+1 >= questions.length) setPhase("done");
      else { setQIdx(i=>i+1); setChosen(null); setTileSel([]); }
    }, 1000);
  }
  function reset() {
    setPhase("setup"); setCardIdx(0); setFlipped(false);
    setQIdx(0); setChosen(null); setCorrect(0); setTileSel([]);
  }

  const card = cards[cardIdx];
  const q = questions[qIdx];
  const levelColor = LEVELS.find(l=>l.key===level)?.color || "#22c55e";

  // ── SETUP ──
  // Always-visible pickers — shown at top in every phase
  const Pickers = () => (
    <div style={{marginBottom:20}}>
      {/* Language row */}
      <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#6b6560",marginBottom:8}}>Language</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
        {Object.entries(DEMO_DATA).map(([code,info])=>(
          <button key={code} onClick={()=>{ setLang(code); if(phase!=="setup") reset(); }}
            style={{padding:"6px 12px",borderRadius:20,border:"1px solid",fontSize:13,cursor:"pointer",
              fontFamily:"var(--lp-font-b)",fontWeight:600,transition:"all .15s",
              borderColor:lang===code?"var(--lp-green)":"#d4cfc5",
              background:lang===code?"var(--lp-green-bg)":"#fafaf8",
              color:lang===code?"var(--lp-green)":"#3d3830"}}>
            {info.flag} {info.name}
          </button>
        ))}
      </div>
      {/* Level row */}
      <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#6b6560",marginBottom:8}}>Level</div>
      <div style={{display:"flex",gap:8}}>
        {LEVELS.map(lv=>(
          <button key={lv.key} onClick={()=>{ setLevel(lv.key); if(phase!=="setup") reset(); }}
            style={{flex:1,padding:"10px 8px",borderRadius:12,border:"2px solid",cursor:"pointer",
              fontFamily:"var(--lp-font-b)",fontWeight:700,fontSize:12,transition:"all .15s",textAlign:"center",
              borderColor:level===lv.key?lv.color:"#d4cfc5",
              background:level===lv.key?lv.color+"18":"#fafaf8",
              color:level===lv.key?lv.color:"#3d3830"}}>
            <div style={{fontSize:14}}>{lv.key}</div>
            <div style={{fontSize:10,fontWeight:400,opacity:0.8}}>{lv.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (phase === "setup") return (
    <div style={{background:"var(--lp-surface)",border:"1.5px solid var(--lp-border)",borderRadius:24,padding:24,maxWidth:520,margin:"0 auto",boxShadow:"0 8px 32px rgba(0,0,0,.06)"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:32,marginBottom:6}}>🦊</div>
        <div style={{fontFamily:"var(--lp-font-d)",fontSize:18,fontWeight:800,marginBottom:3}}>Try a Mini Lesson</div>
        <div style={{fontSize:12,color:"var(--lp-muted)"}}>5 flashcards + 5 questions. Pick your language and level below.</div>
      </div>
      <Pickers/>
      <button onClick={start} style={{width:"100%",padding:13,borderRadius:12,border:"none",
        background:"var(--lp-green)",
        color:"#ffffff",fontFamily:"var(--lp-font-b)",fontWeight:700,fontSize:14,cursor:"pointer"}}>
        Start {DEMO_DATA[lang].flag} {DEMO_DATA[lang].name} · {level} →
      </button>
    </div>
  );

  // ── FLASHCARDS ──
  if (phase === "cards") return (
    <div style={{background:"var(--lp-surface)",border:"1.5px solid var(--lp-border)",borderRadius:24,padding:24,maxWidth:520,margin:"0 auto",boxShadow:"0 8px 32px rgba(0,0,0,.06)"}}>
      <Pickers/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:700,color:"var(--lp-muted)",letterSpacing:1,textTransform:"uppercase",fontWeight:700}}>
          📚 Flashcards · {cardIdx+1}/{cards.length}
        </div>
        <div style={{display:"flex",gap:5}}>
          {cards.map((_,i)=><div key={i} style={{width:24,height:4,borderRadius:2,background:i<cardIdx?"#22c55e":i===cardIdx?levelColor:"#e0dbd4",transition:"background .3s"}}/>)}
        </div>
      </div>

      <div onClick={()=>setFlipped(f=>!f)} style={{minHeight:180,borderRadius:18,padding:"28px 24px",cursor:"pointer",textAlign:"center",transition:"all .25s",
        background:flipped?"#fff7ed":"#fafaf8",
        border:"1.5px solid "+(flipped?"rgba(249,115,22,0.4)":"#e8e4dc")}}>
        {!flipped ? (
          <>
            <div style={{fontFamily:"var(--lp-font-d)",fontSize:32,fontWeight:800,marginBottom:8,color:"var(--lp-text)"}}>{card.word}</div>
            <div style={{fontSize:14,color:"var(--lp-muted)",marginBottom:12}}>{card.ph}</div>
            <div style={{fontSize:12,color:"#a09890"}}>tap to reveal →</div>
          </>
        ) : (
          <>
            <div style={{fontSize:13,fontWeight:700,color:"var(--lp-green2)",letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Translation</div>
            <div style={{fontFamily:"var(--lp-font-d)",fontSize:24,fontWeight:800,marginBottom:8,color:"var(--lp-text)"}}>{card.en}</div>
            <div style={{fontSize:18,color:"var(--lp-green)",marginBottom:8}}>{card.word}</div>
            <div style={{fontSize:13,color:"var(--lp-muted)",fontStyle:"italic",borderTop:"1px solid var(--lp-border)",paddingTop:12,marginTop:8}}>{card.ex}</div>
          </>
        )}
      </div>

      {flipped && (
        <button onClick={nextCard} style={{width:"100%",marginTop:14,padding:13,borderRadius:12,border:"none",
          background:"var(--lp-green)",
          color:"#ffffff",fontFamily:"var(--lp-font-b)",fontWeight:700,fontSize:14,cursor:"pointer"}}>
          {cardIdx+1<cards.length ? "Next card →" : "Start quiz →"}
        </button>
      )}
    </div>
  );

  // ── QUIZ ──
  if (phase === "quiz") return (
    <div style={{background:"var(--lp-surface)",border:"1.5px solid var(--lp-border)",borderRadius:24,padding:24,maxWidth:520,margin:"0 auto",boxShadow:"0 8px 32px rgba(0,0,0,.06)"}}>
      <Pickers/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:700,color:"var(--lp-muted)",letterSpacing:1,textTransform:"uppercase",fontWeight:700}}>
          {q.type==="tile"?"🧩 Build it":"✏️ Quiz"} · {qIdx+1}/{questions.length}
        </div>
        <div style={{display:"flex",gap:5}}>
          {questions.map((_,i)=><div key={i} style={{width:24,height:4,borderRadius:2,background:i<qIdx?"#22c55e":i===qIdx?levelColor:"#e0dbd4",transition:"background .3s"}}/>)}
        </div>
      </div>

      <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:2,marginBottom:20,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${(qIdx/questions.length)*100}%`,background:levelColor,borderRadius:2,transition:"width .3s"}}/>
      </div>

      <p style={{fontFamily:"var(--lp-font-d)",fontWeight:700,fontSize:18,marginBottom:18,lineHeight:1.4,color:"var(--lp-text)"}}>{q.q}</p>

      {q.type !== "tile" ? (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {q.opts.map(opt=>{
            const state = !chosen ? "idle" : opt===q.ans ? "correct" : opt===chosen ? "wrong" : "dim";
            return (
              <button key={opt} disabled={!!chosen} onClick={()=>pickAnswer(opt)} style={{
                padding:"12px 16px",borderRadius:12,border:"1px solid",textAlign:"left",
                cursor:chosen?"default":"pointer",fontSize:14,fontFamily:"var(--lp-font-b)",transition:"all .15s",
                background:state==="idle"?"#fafaf8":state==="correct"?"rgba(34,197,94,0.15)":state==="wrong"?"rgba(239,68,68,0.1)":"rgba(255,255,255,0.02)",
                borderColor:state==="idle"?"#e8e4dc":state==="correct"?"rgba(34,197,94,0.5)":state==="wrong"?"rgba(239,68,68,0.4)":"rgba(255,255,255,0.05)",
                color:state==="idle"?"var(--lp-text)":state==="correct"?"#22c55e":state==="wrong"?"#ef4444":"#c0bdb8"}}>
                {opt} {chosen && opt===q.ans && " ✓"} {chosen && opt===chosen && opt!==q.ans && " ✗"}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div style={{minHeight:52,padding:"10px 14px",borderRadius:14,marginBottom:12,display:"flex",flexWrap:"wrap",gap:8,alignItems:"center",
            background:chosen?(chosen===q.ans?"#f0fdf4":"#fff5f5"):"#fafaf8",
            border:"2px solid "+(chosen?(chosen===q.ans?"#22c55e":"#ef4444"):"#e8e4dc")}}>
            {tileSel.length===0
              ? <span style={{color:"rgba(255,255,255,0.2)",fontSize:13}}>Tap words to build your answer…</span>
              : tileSel.map((ti,pos)=>(
                <button key={pos} onClick={()=>!chosen&&toggleTile(ti)} disabled={!!chosen} style={{padding:"6px 12px",borderRadius:20,
                  background:chosen?(chosen===q.ans?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.15)"):"rgba(201,168,76,0.18)",
                  border:"1px solid "+(chosen?(chosen===q.ans?"#22c55e":"#ef4444"):"rgba(201,168,76,0.5)"),
                  color:chosen?(chosen===q.ans?"#86efac":"#fca5a5"):"#c9a84c",
                  fontSize:14,fontWeight:600,cursor:chosen?"default":"pointer",fontFamily:"var(--lp-font-b)"}}>
                  {q.tiles[ti]}
                </button>
              ))
            }
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
            {q.tiles.map((tile,idx)=>{
              const used = tileSel.includes(idx);
              return (
                <button key={idx} onClick={()=>!chosen&&toggleTile(idx)} disabled={!!chosen} style={{
                  padding:"8px 14px",borderRadius:20,
                  background:used?"rgba(255,255,255,0.02)":"var(--lp-border)",
                  border:"1.5px solid "+(used?"#e0e0e0":"#d4cfc5"),
                  color:used?"rgba(255,255,255,0.15)":"var(--lp-text)",
                  fontSize:14,fontFamily:"var(--lp-font-b)",cursor:used||chosen?"default":"pointer",
                  textDecoration:used?"line-through":"none",transition:"all .15s"}}>
                  {tile}
                </button>
              );
            })}
          </div>
          {!chosen && (
            <button onClick={checkTile} disabled={!tileSel.length} style={{width:"100%",padding:12,borderRadius:12,border:"none",
              background:tileSel.length?"var(--lp-green)":"rgba(255,255,255,0.07)",
              color:tileSel.length?"#ffffff":"#a09890",
              fontFamily:"var(--lp-font-b)",fontWeight:700,fontSize:14,cursor:tileSel.length?"pointer":"default"}}>
              Check →
            </button>
          )}
        </>
      )}
    </div>
  );

  // ── DONE ──
  if (phase === "done") return (
    <div style={{background:"var(--lp-surface)",border:"1.5px solid var(--lp-border)",borderRadius:24,padding:24,maxWidth:520,margin:"0 auto",boxShadow:"0 8px 32px rgba(0,0,0,.06)"}}>
      <Pickers/>
      <div style={{textAlign:"center"}}>
      <div style={{fontSize:56,marginBottom:16}}>{correct===5?"🏆":correct>=3?"🌟":"💪"}</div>
      <div style={{fontFamily:"var(--lp-font-d)",fontSize:24,fontWeight:800,marginBottom:8}}>
        {correct===5?"Perfect score!":correct>=3?"Well done!":"Keep practicing!"}
      </div>
      <div style={{fontSize:15,color:"var(--lp-muted)",marginBottom:24}}>
        {correct}/5 correct · {DEMO_DATA[lang].flag} {DEMO_DATA[lang].name} · {level}
      </div>
      <div style={{background:"var(--lp-green-bg)",border:"1.5px solid rgba(249,115,22,0.2)",borderRadius:16,padding:20,marginBottom:20}}>
        <div style={{fontSize:13,color:"var(--lp-muted)",marginBottom:8,fontWeight:600}}>Full course includes:</div>
        <div style={{fontSize:14,color:"var(--lp-text)",lineHeight:1.8,fontWeight:600}}>
          ✓ 600+ lessons across A1→C2<br/>
          ✓ AI conversation practice<br/>
          ✓ 10 languages (more coming)<br/>
          ✓ Fox guide that celebrates your wins
        </div>
      </div>
      <button onClick={onSignup} style={{width:"100%",padding:14,borderRadius:14,border:"none",
        background:"var(--lp-green)",
        color:"#ffffff",fontFamily:"var(--lp-font-b)",fontWeight:700,fontSize:15,cursor:"pointer",marginBottom:10}}>
        Start Full Course Free →
      </button>
      <button onClick={reset} style={{width:"100%",padding:12,borderRadius:12,
        background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",
        color:"rgba(255,255,255,0.6)",fontFamily:"var(--lp-font-b)",fontWeight:600,fontSize:14,cursor:"pointer"}}>
        Try another language →
      </button>
      </div>
    </div>
  );

  return null;
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const FEATURES = [
  {icon:"🎯",c:"#d97706",bg:"#fef3c7",title:"Logic-First Curriculum",desc:"CEFR A1→C2 structured exactly as your brain absorbs language — real conversations before grammar rules."},
  {icon:"🤖",c:"#0ea5e9",bg:"#e0f2fe",title:"Live AI Conversation",desc:"10+ real-world scenarios — restaurant, hotel, job interview and more. The AI speaks your language and corrects you naturally."},
  {icon:"🌍",c:"#7c5cfc",bg:"#f0ecff",title:"10 Languages",desc:"Spanish, German, French, Italian, Portuguese, Mandarin, Japanese, Korean, Polish & English — fully launched."},
  {icon:"⚡",c:"#ff6b35",bg:"#fff2ec",title:"Situation Packs",desc:"Jump into real-life scenarios instantly — airport, shopping, doctor, taxi. Quick mode or full AI roleplay."},
  {icon:"🧠",c:"#2db87a",bg:"#edfaf3",title:"Spaced Repetition",desc:"Your mistakes become flashcards. Words resurface exactly when you're about to forget them."},
  {icon:"📊",c:"#ec4899",bg:"#fdf2f8",title:"Readiness Score",desc:"A single score that tells you honestly how ready you are for a real conversation — not just a test."},
];

const TESTIMONIALS = [
  {stars:5,text:"Finally an app that teaches in the right order. I was conversational in German in 6 weeks — something that took years with Duolingo.",name:"Sarah M.",meta:"German · 6 weeks",av:"👩",level:"A1 → B1"},
  {stars:5,text:"The AI conversation practice is game-changing. I did the restaurant scenario three times before my Paris trip and it went perfectly.",name:"James K.",meta:"French · 3 months",av:"👨",level:"A2 → B2"},
  {stars:5,text:"The grammar explanations tell you WHY, not just rules to memorize. It completely changed how I approach Japanese.",name:"Priya L.",meta:"Japanese · 8 weeks",av:"👩‍💼",level:"A1 → A2"},
];

function LandingPage({ onOpenAuth }) {
  const [navSolid, setNavSolid] = useState(false);
  const featRef = useRef(null);
  const demoRef = useRef(null);
  const pricRef = useRef(null);
  const revRef  = useRef(null);
  const [wlEmail, setWlEmail] = useState("");
  const [wlState, setWlState] = useState("idle"); // idle | loading | done | error
  const [wlCount, setWlCount] = useState(null);
  const [wlPosition, setWlPosition] = useState(null);
  const [wlEarlyAccess, setWlEarlyAccess] = useState(false);
  const [showWlPopup, setShowWlPopup] = useState(false);

  // Load waitlist count on mount — fetch via server endpoint so service key bypasses RLS
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/waitlist");
        if (!res.ok) return;
        const data = await res.json();
        if (data.count != null) setWlCount(data.count);
      } catch (_) {}
    })();
  }, []);

  async function submitWaitlist(e) {
    e && e.preventDefault && e.preventDefault();
    const email = wlEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) return;
    setWlState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setWlPosition(data.position);
      setWlEarlyAccess(data.earlyAccess || false);
      setWlState("done");
      setShowWlPopup(true);
      setWlCount(c => (c || 0) + 1);
    } catch {
      setWlState("error");
    }
  }

  useEffect(()=>{
    const h=()=>setNavSolid(window.scrollY>48);
    window.addEventListener("scroll",h); return ()=>window.removeEventListener("scroll",h);
  },[]);

  const scrollTo = r => r?.current?.scrollIntoView({behavior:"smooth",block:"start"});
  const mq = [...LANGUAGES,...LANGUAGES];

  return (
    <div className="lp-root">
      <style>{CSS}</style>

      {/* Fox waitlist success popup */}
      {showWlPopup && (
        <div onClick={() => setShowWlPopup(false)} style={{
          position:"fixed", inset:0, zIndex:9999,
          background:"rgba(74,40,0,0.45)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:24,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:"linear-gradient(180deg,#fff7ea 0%,#ffe7c2 100%)",
            borderRadius:28, padding:"36px 28px 32px", maxWidth:360, width:"100%",
            textAlign:"center", boxShadow:"0 24px 80px rgba(74,40,0,0.3)",
            border:"1.5px solid rgba(245,165,36,0.4)",
            fontFamily:"'DM Sans',system-ui,sans-serif",
          }}>
            <div style={{ fontSize:72, marginBottom:8, lineHeight:1 }}>🦊</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#4a2800",
              fontFamily:"'Playfair Display',Georgia,serif", marginBottom:10 }}>
              You're on the trail!
            </div>
            <div style={{ fontSize:15, color:"rgba(107,61,16,0.75)", lineHeight:1.6, marginBottom:18 }}>
              {wlEarlyAccess
                ? <>You're <strong style={{color:"#f5a524"}}>#{wlPosition}</strong> on the waitlist 🎁<br/>You're in the first 50 — you get <strong style={{color:"#f5a524"}}>1 month of Pro free</strong> when we launch!</>
                : <>You're <strong style={{color:"#f5a524"}}>#{wlPosition}</strong> on the waitlist.<br/>We'll email you the moment LinguaPath is ready. Stay tuned!</>
              }
            </div>
            <button onClick={() => setShowWlPopup(false)} style={{
              background:"linear-gradient(135deg,#f5a524,#c9a84c)", color:"#fff",
              border:"none", borderRadius:16, padding:"13px 32px",
              fontSize:15, fontWeight:800, cursor:"pointer",
              boxShadow:"0 4px 18px rgba(245,165,36,0.4)",
            }}>Let's go! 🏔️</button>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className={"lp-nav" + (navSolid ? " solid" : "")}>
        <div className="lp-logo">LingoTrailz</div>
        <div className="lp-nav-links">
          {[["Features",featRef],["Demo",demoRef],["Pricing",pricRef],["Reviews",revRef]].map(([lbl,ref])=>(
            <button key={lbl} className="lp-nl" onClick={()=>scrollTo(ref)}>{lbl}</button>
          ))}
        </div>
        <div className="lp-nav-cta">
          <button className="btn btn-ghost" onClick={()=>onOpenAuth("login")}>Log in</button>
          <button className="btn btn-gold"  onClick={()=>onOpenAuth("signup")}>Start Free</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="h-blob h-blob-1"/><div className="h-blob h-blob-2"/><div className="h-blob h-blob-3"/>
        <div className="h-dots"/>
        <div className="h-eyebrow">
          <span style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",width:10,height:10}}>
            <span style={{position:"absolute",display:"inline-flex",width:"100%",height:"100%",borderRadius:"50%",background:"var(--lp-green)",opacity:.75,animation:"ping 1.5s cubic-bezier(0,0,.2,1) infinite"}}/>
            <span style={{position:"relative",display:"inline-flex",width:8,height:8,borderRadius:"50%",background:"var(--lp-green)"}}/>
          </span>
          The language app that gets you fluent
        </div>
        <h1 className="h-title">Learn any language.<br/><span className="accent">Actually speak it.</span></h1>
        <p className="h-sub">Trail-based lessons, a fox guide who never judges you, and real AI conversation practice. No lives. No frustration.</p>
        {/* Waitlist capture */}
        {wlState !== "done" ? (
          <form onSubmit={submitWaitlist} style={{display:"flex",gap:8,width:"100%",maxWidth:480,margin:"0 auto 20px",flexWrap:"wrap",justifyContent:"center"}}>
            <input
              type="email"
              value={wlEmail}
              onChange={e=>setWlEmail(e.target.value)}
              placeholder="your@email.com"
              required
className="wl-input"
            />
            <button type="submit" className="btn btn-gold-lg" disabled={wlState==="loading"} style={{padding:"14px 24px",borderRadius:12,whiteSpace:"nowrap"}}>
              {wlState==="loading" ? "Joining…" : "Join Waitlist →"}
            </button>
          </form>
        ) : (
          <div style={{marginBottom:20,padding:"14px 24px",borderRadius:12,background:"var(--lp-green-bg)",border:"1.5px solid rgba(249,115,22,0.35)",color:"var(--lp-green2)",fontWeight:700,fontSize:15,maxWidth:480,width:"100%",textAlign:"center"}}>
            🦊 You're on the trail! We'll email you when we launch.
          </div>
        )}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:16,flexWrap:"wrap"}}>
          <button className="btn btn-ol-lg" onClick={()=>scrollTo(demoRef)} style={{padding:"12px 24px",fontSize:15}}>▶ Try a Demo</button>
        </div>
        <div className="h-social">
          <div className="av-stack">{["👩","👨","🧑","👩","👨"].map((a,i)=><div key={i} className="av">{a}</div>)}</div>
          <p style={{fontSize:13,color:"var(--lp-muted)"}}>
            {wlCount != null
              ? <><strong style={{color:"var(--lp-green2)"}}>{wlCount.toLocaleString()}</strong> people already on the trail</>
              : <>First <strong style={{color:"var(--lp-green2)"}}>150</strong> get 1 month Pro free — no credit card</>}
          </p>
          {wlCount != null && wlCount <= 150 && (
            <span style={{padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:800,background:"rgba(249,115,22,.12)",color:"var(--lp-green2)",border:"1px solid rgba(249,115,22,.25)",whiteSpace:"nowrap"}}>
              {150 - wlCount} spots left
            </span>
          )}
        </div>
      </section>

      {/* MARQUEE */}
      <div className="mq-wrap">
        <div className="mq-track">
          {mq.map((l,i)=><div key={i} className="mq-item"><span style={{fontSize:22}}>{l.flag}</span><span>{l.name}</span><span style={{width:4,height:4,borderRadius:"50%",background:"var(--lp-border2)",display:"inline-block"}}/></div>)}
        </div>
      </div>

      {/* FEATURES */}
      <section ref={featRef} className="lp-sec" style={{scrollMarginTop:68}}>
        <div style={{textAlign:"center"}}>
          <div className="sec-lbl">Why LingoTrailz</div>
          <h2 className="sec-ttl">Everything your<br/>language app should be</h2>
          <p className="sec-sub" style={{margin:"0 auto"}}>Built from the ground up with one obsession: getting you to real conversations as fast as possible.</p>
        </div>
        <div className="feat-grid">
          {FEATURES.map(f=>(
            <div key={f.title} className="feat-card">
              <div className="feat-icon" style={{background:f.bg}}>{f.icon}</div>
              <div style={{fontFamily:"var(--lp-font-d)",fontSize:19,fontWeight:700,marginBottom:10}}>{f.title}</div>
              <div style={{fontSize:14,color:"var(--lp-muted)",lineHeight:1.75,fontWeight:300}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-sec" style={{paddingTop:0}}>
        <div style={{textAlign:"center"}}>
          <div className="sec-lbl">How it works</div>
          <h2 className="sec-ttl">From zero to real conversations</h2>
          <p className="sec-sub" style={{margin:"0 auto"}}>Four steps. No fluff. Built around how your brain actually learns language.</p>
        </div>
        <div className="hiw-grid">
          {[
            {icon:"🌍",num:1,title:"Choose your language",desc:"Pick from 10 fully-launched languages. Spanish to Japanese — all with native audio."},
            {icon:"🎯",num:2,title:"Test your level or start fresh",desc:"Take a quick CEFR placement test or jump straight in at A1. No judgment."},
            {icon:"🗺️",num:3,title:"Follow your trail",desc:"Lessons unlock step by step. Each one builds on the last — no random vocab dumps."},
            {icon:"🤖",num:4,title:"Talk with the AI tutor",desc:"Practice real conversations. The fox corrects you gently and celebrates your wins."},
          ].map(s=>(
            <div key={s.num} className="hiw-card">
              <div className="hiw-icon-wrap">
                <div className="hiw-glow"/>
                <div className="hiw-icon-bg">{s.icon}</div>
                <div className="hiw-num">{s.num}</div>
              </div>
              <div className="hiw-title">{s.title}</div>
              <div className="hiw-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section className="lp-sec" style={{paddingTop:0}}>
        <div style={{textAlign:"center"}}><div className="sec-lbl">Comparison</div><h2 className="sec-ttl">How we stack up</h2></div>
        <div style={{overflowX:"auto"}}>
          <table className="cmp-tbl">
            <thead>
              <tr>
                <th style={{textAlign:"left",color:"var(--lp-muted)",fontSize:13}}>Feature</th>
                <th style={{textAlign:"center",color:"var(--lp-green)"}} className="col-us">LingoTrailz ✦</th>
                <th style={{textAlign:"center",color:"var(--lp-muted)"}}>Duolingo</th>
                <th style={{textAlign:"center",color:"var(--lp-muted)"}}>Babbel</th>
              </tr>
            </thead>
            <tbody>
              {[["CEFR-ordered curriculum",1,0,1],["AI live conversation",1,0,0],["Situation packs",1,0,0],["Grammar explained",1,0,1],["Spaced repetition",1,1,1],["10 languages",1,1,0],["Free to start",1,1,0],["Readiness score",1,0,0]].map(([lbl,us,duo,bab])=>(
                <tr key={lbl}>
                  <td style={{color:"#1a1814",fontWeight:700,textAlign:"left"}}>{lbl}</td>
                  <td style={{textAlign:"center"}} className="col-us">{us?<span style={{color:"#16a34a",fontSize:17,fontWeight:800}}>✓</span>:<span style={{color:"#d4cfc5",fontWeight:700}}>—</span>}</td>
                  <td style={{textAlign:"center"}}>{duo?<span style={{color:"#6b6560",fontSize:17,fontWeight:700}}>✓</span>:<span style={{color:"#d4cfc5",fontWeight:700}}>—</span>}</td>
                  <td style={{textAlign:"center"}}>{bab?<span style={{color:"#6b6560",fontSize:17,fontWeight:700}}>✓</span>:<span style={{color:"#d4cfc5",fontWeight:700}}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* DEMO */}
      <section ref={demoRef} className="lp-sec" style={{paddingTop:0,scrollMarginTop:68}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:60,alignItems:"center"}}>
          <div>
            <div className="sec-lbl">Interactive Demo</div>
            <h2 className="sec-ttl">Try a real lesson<br/>right now</h2>
            <p className="sec-sub">Pick any language, flip a vocab card, answer a quiz. This is exactly what the full course feels like — 600× more.</p>
            <button className="btn btn-gold-lg" style={{marginTop:28}} onClick={()=>onOpenAuth("signup")}>Start Full Course Free →</button>
          </div>
          <MiniLesson onSignup={()=>onOpenAuth('signup')}/>
        </div>
      </section>

      {/* LANGUAGES */}
      <section className="lp-sec" style={{paddingTop:0}}>
        <div style={{textAlign:"center"}}>
          <div className="sec-lbl">Languages</div>
          <h2 className="sec-ttl">10 languages. More coming soon.</h2>
          <p className="sec-sub" style={{margin:"0 auto"}}>Spanish, German, French, Italian, Portuguese, Mandarin, Japanese, Korean, Polish and English — with more languages on the way.</p>
        </div>
        <div className="lang-grid">
          {LANGUAGES.map(l=>(
            <div key={l.code} className="lang-c">
              <div style={{fontSize:34,marginBottom:8}}>{l.flag}</div>
              <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{l.name}</div>
              <div style={{fontSize:11,color:"var(--lp-muted)"}}>{l.native}</div>
              <div style={{display:"inline-block",marginTop:8,fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20,background:"rgba(34,197,94,.12)",color:"#22c55e",border:"1px solid rgba(34,197,94,.25)"}}>FULL COURSE</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section ref={revRef} className="lp-sec" style={{paddingTop:0,scrollMarginTop:68}}>
        <div style={{textAlign:"center"}}><div className="sec-lbl">Reviews</div><h2 className="sec-ttl">Learners love it</h2></div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} className="testi">
              <div style={{color:"#fbbf24",fontSize:14,marginBottom:14,letterSpacing:3}}>{"★".repeat(t.stars)}</div>
              <p style={{fontSize:14,color:"#3d3830",lineHeight:1.8,marginBottom:18,fontStyle:"italic",fontWeight:600}}>"{t.text}"</p>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"var(--lp-faint)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{t.av}</div>
                  <div><div style={{fontWeight:700,fontSize:13}}>{t.name}</div><div style={{fontSize:11,color:"var(--lp-muted)"}}>{t.meta}</div></div>
                </div>
                {t.level && <span className="testi-level">{t.level}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS BAR */}
      <section className="lp-sec" style={{paddingTop:0}}>
        <div className="stats-bar">
          <div className="stat-item"><div className="stat-num">10</div><div className="stat-label">Languages</div></div>
          <div className="stat-item"><div className="stat-num">A1→C2</div><div className="stat-label">Full CEFR path</div></div>
          <div className="stat-item"><div className="stat-num">~3,959</div><div className="stat-label">Audio clips (German)</div></div>
          <div className="stat-item"><div className="stat-num">150+</div><div className="stat-label">Early members</div></div>
        </div>
      </section>

      {/* PRICING */}
      <section ref={pricRef} className="lp-sec" style={{paddingTop:0,scrollMarginTop:68}}>
        <div style={{textAlign:"center"}}><div className="sec-lbl">Pricing</div><h2 className="sec-ttl">Simple, honest pricing</h2><p className="sec-sub" style={{margin:"0 auto"}}>Start free. No credit card. Upgrade when you're ready.</p></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginTop:48,maxWidth:820,margin:"48px auto 0"}}>
          {[
            {name:"Free",price:"$0",per:"forever",bc:"var(--lp-border2)",bg:"var(--lp-faint)",badge:null,features:["A1 - C2 curriculum","3 situation packs","5 AI chats/month","Basic progress"]},
            {name:"Pro",price:"$6.99",per:"/month",bc:"var(--lp-green)",bg:"var(--lp-green-bg)",badge:"MOST POPULAR",features:["All CEFR levels A1→C2","All situation packs","Unlimited AI conversation","Full analytics","Offline mode","Priority support"]},
            {name:"Annual",price:"$69",per:"/year",bc:"var(--lp-purple)",bg:"var(--lp-purple-bg)",badge:"BEST VALUE",features:["Everything in Pro","4 months free","All languages","Early access"]},
          ].map(plan=>(
            <div key={plan.name} style={{background:plan.bg,border:`1px solid ${plan.bc}`,borderRadius:22,padding:"28px 24px",position:"relative"}}>
              {plan.badge&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:"var(--lp-green)",color:"#ffffff",fontSize:10,fontWeight:700,letterSpacing:1,padding:"4px 14px",borderRadius:20,whiteSpace:"nowrap"}}>{plan.badge}</div>}
              <div style={{fontSize:14,fontWeight:800,color:"#1a1814",marginBottom:8}}>{plan.name}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:20}}><span style={{fontFamily:"var(--lp-font-d)",fontSize:40,fontWeight:900}}>{plan.price}</span><span style={{fontSize:14,color:"var(--lp-muted)"}}>{plan.per}</span></div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
                {plan.features.map(f=><div key={f} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:13,color:"#1a1814",fontWeight:700}}><span style={{color:"#22c55e",flexShrink:0}}>✓</span>{f}</div>)}
              </div>
              <button onClick={()=>onOpenAuth("signup")} style={{width:"100%",padding:"13px",borderRadius:12,fontFamily:"var(--lp-font-b)",fontWeight:700,fontSize:14,cursor:"pointer",transition:"all .15s",background:plan.name==="Pro"?"var(--lp-green)":"var(--lp-faint)",border:plan.name==="Pro"?"none":"1px solid var(--border2)",color:plan.name==="Pro"?"#ffffff":"var(--lp-text)"}}>{plan.name==="Free"?"Start Free":"Get "+plan.name} →</button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"0 clamp(20px,5vw,64px) 80px",maxWidth:1140,margin:"0 auto"}}>
        <div style={{background:"linear-gradient(135deg,#f0fdf6,#f0ecff)",border:"1.5px solid rgba(45,184,122,.2)",borderRadius:30,padding:"clamp(44px,7vw,88px)",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-80,left:"50%",transform:"translateX(-50%)",width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,.12),transparent 70%)",pointerEvents:"none"}}/>
          <div style={{fontSize:52,marginBottom:18,animation:"float 3.5s ease infinite"}}>🌍</div>
          <h2 style={{fontFamily:"var(--lp-font-d)",fontSize:"clamp(28px,5vw,54px)",fontWeight:900,lineHeight:1.1,marginBottom:18}}>
            Ready to actually<br/><span style={{background:"linear-gradient(90deg,var(--gold2),var(--gold))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>speak a language?</span>
          </h2>
          <p style={{fontSize:17,color:"var(--lp-muted)",maxWidth:460,margin:"0 auto 36px",fontWeight:300}}>First 150 on the waitlist get 1 month Pro free. No credit card.</p>
          {wlState !== "done" ? (
            <form onSubmit={submitWaitlist} style={{display:"flex",gap:8,width:"100%",maxWidth:480,margin:"0 auto",flexWrap:"wrap",justifyContent:"center"}}>
              <input
                type="email"
                value={wlEmail}
                onChange={e=>setWlEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{flex:1,minWidth:220,padding:"14px 18px",borderRadius:12,border:"1px solid rgba(255,255,255,0.2)",background:"var(--lp-border)",color:"var(--lp-text)",fontSize:15,fontFamily:"var(--lp-font-b)",outline:"none"}}
              />
              <button type="submit" className="btn btn-gold-lg" disabled={wlState==="loading"} style={{padding:"14px 24px",borderRadius:12,whiteSpace:"nowrap"}}>
                {wlState==="loading" ? "Joining…" : "Join the Waitlist →"}
              </button>
            </form>
          ) : (
            <div style={{padding:"16px 28px",borderRadius:14,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",color:"#86efac",fontWeight:700,fontSize:16,display:"inline-block"}}>
              🦊 You're on the trail! We'll be in touch soon.
            </div>
          )}
          <div style={{marginTop:16,display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn btn-ol-lg" onClick={()=>onOpenAuth("login")} style={{padding:"12px 24px",fontSize:14}}>Already have an account →</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:"1px solid var(--lp-border)",padding:"40px clamp(20px,5vw,64px)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
        <div className="lp-logo">LingoTrailz</div>
        <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
          {["Features","Pricing","Blog","Privacy","Terms"].map(l=><span key={l} style={{fontSize:13,color:"var(--lp-muted)",cursor:"pointer",transition:"color .15s"}} onMouseOver={e=>e.target.style.color="var(--lp-text)"} onMouseOut={e=>e.target.style.color="var(--lp-muted)"}>{l}</span>)}
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.2)"}}>© 2025 LingoTrailz. All rights reserved.</div>
      </footer>
    </div>
  );
}


// ─── WAITLIST SCREEN ──────────────────────────────────────────────────────────
function WaitlistScreen({ user, onLogout }) {
  return (
    <div className="lp-root" style={{minHeight:"100vh",background:"linear-gradient(180deg,#fff7ed,#ffffff)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{CSS}</style>
      <div style={{maxWidth:460,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:20}}>🦊</div>
        <h1 style={{fontFamily:"var(--lp-font-d)",fontSize:28,fontWeight:900,marginBottom:12,color:"var(--lp-text)"}}>
          You're on the trail!
        </h1>
        <p style={{fontSize:16,color:"var(--lp-muted)",lineHeight:1.7,marginBottom:32}}>
          Thanks for signing up, <strong style={{color:"var(--lp-green)"}}>{user?.user_metadata?.name || "explorer"}</strong>.<br/>
          We're onboarding learners in waves — you'll get an email the moment your spot opens up.
        </p>

        <div style={{background:"var(--lp-surface)",border:"1.5px solid var(--lp-border)",borderRadius:20,padding:24,marginBottom:28}}>
          <div style={{fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--lp-muted)",marginBottom:16}}>
            What's coming for you
          </div>
          {[
            ["🗺️","Trail map progression","Journey through A1 → C2 visually"],
            ["🦊","Fox guide","Celebrates your wins, never punishes mistakes"],
            ["🤖","AI conversation","Practice real dialogue, not just drills"],
            ["⚡","No lives, no frustration","Mistakes reduce rewards, never block progress"],
          ].map(([icon,title,sub])=>(
            <div key={title} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:14,textAlign:"left"}}>
              <span style={{fontSize:20,flexShrink:0}}>{icon}</span>
              <div>
                <div style={{fontWeight:600,fontSize:14,color:"var(--lp-text)",marginBottom:2}}>{title}</div>
                <div style={{fontSize:12,color:"var(--lp-muted)"}}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{fontSize:13,color:"#6b6560",marginBottom:24}}>
          Have a beta invite code?{" "}
          <span
            style={{color:"#c9a84c",cursor:"pointer",fontWeight:600}}
            onClick={onLogout}
          >
            Sign out and re-register with your code
          </span>
        </div>

        <button
          onClick={onLogout}
          style={{padding:"10px 24px",borderRadius:10,background:"var(--lp-faint)",border:"1.5px solid var(--lp-border2)",color:"var(--lp-muted)",fontSize:13,cursor:"pointer",fontFamily:"var(--lp-font-b)"}}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}


// ─── PASSWORD RESET SCREEN ────────────────────────────────────────────────────
function PasswordResetScreen({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    try {
      // Make sure session is established before updating password
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        setError("Session expired. Please request a new password reset email.");
        setLoading(false);
        return;
      }
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        setError("Failed to update password — " + err.message);
      } else {
        setSuccess(true);
        window.history.replaceState(null, "", "/");
        // Sign out so user must log in with their new password
        await supabase.auth.signOut();
        setTimeout(onDone, 2500);
      }
    } catch (e) { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="lp-root" style={{minHeight:"100vh",background:"linear-gradient(180deg,#fff7ed,#ffffff)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{CSS}</style>
      <div style={{background:"#ffffff",border:"2px solid #e0d8cc",borderTop:"4px solid #f97316",borderRadius:24,padding:"40px 36px",width:"100%",maxWidth:420,boxShadow:"0 32px 80px rgba(0,0,0,.12)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:44,marginBottom:12}}>🔐</div>
          {success ? (
            <>
              <div style={{fontFamily:"var(--lp-font-d)",fontSize:24,fontWeight:400,color:"#1a1814",marginBottom:8}}>Password updated! 🎉</div>
              <div style={{fontSize:14,color:"#6b6560",fontWeight:600}}>Please log in with your new password.</div>
            </>
          ) : (
            <>
              <div style={{fontFamily:"var(--lp-font-d)",fontSize:24,fontWeight:400,color:"#1a1814",marginBottom:8}}>Set a new password</div>
              <div style={{fontSize:14,color:"#6b6560",fontWeight:600}}>Choose something you'll remember</div>
            </>
          )}
        </div>

        {!success && (
          <form onSubmit={handleReset}>
            {error && (
              <div style={{background:"#fff0f0",border:"1.5px solid #fca5a5",color:"#dc2626",fontSize:13,padding:"10px 14px",borderRadius:10,marginBottom:16,fontWeight:600}}>
                {error}
              </div>
            )}
            <label className="auth-lbl">New password</label>
            <input
              className="auth-inp" type="password"
              placeholder="Min. 6 characters"
              value={password} onChange={e=>setPassword(e.target.value)}
              autoFocus
            />
            <label className="auth-lbl" style={{marginTop:8}}>Confirm password</label>
            <input
              className="auth-inp" type="password"
              placeholder="Type it again"
              value={confirm} onChange={e=>setConfirm(e.target.value)}
            />
            <button type="submit" className="auth-sub" disabled={loading} style={{marginTop:16}}>
              {loading ? <span className="spinner"/> : "Update password →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Root() {
  const [view, setView] = useState("loading");
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [activeLang, setActiveLang] = useState(null);
  const [userTier, setUserTier] = useState("free");
  const [onboardingProfile, setOnboardingProfile] = useState(null);

  useEffect(()=>{
    // ── Detect recovery token in URL (hash or query param) ──
    // Supabase sends: https://yoursite.com/#access_token=...&type=recovery
    // or with PKCE:   https://yoursite.com/?code=...  (type=recovery in hash)
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    const isRecovery = hash.includes("type=recovery") ||
                       search.includes("type=recovery") ||
                       window.location.pathname === "/reset-password";

    if (isRecovery) {
      // Don't clear the URL yet — Supabase SDK needs the token to create the session
      // Just show the reset screen. The SDK will exchange the token automatically.
      setView("reset_password");
      return;
    }

    // ── Normal session routing ──
    const {data:sub} = supabase.auth.onAuthStateChange((event, session)=>{
      if (event === "SIGNED_OUT") {
        setView("landing"); setActiveLang(null); setShowPicker(false); setUser(null);
      }
    });

    supabase.auth.getSession().then(async ({data})=>{
      const u = data?.session?.user || null;
      setUser(u);
      if (u) {
        let tier = "free";
        if (u.email?.toLowerCase() === ADMIN_EMAIL) {
          tier = "admin";
        } else {
          const cached = localStorage.getItem("lp_tier_" + u.id);
          if (cached) {
            tier = cached;
          } else {
            const { data: profile } = await supabase.from("profiles")
              .select("access_tier").eq("id", u.id).maybeSingle();
            tier = profile?.access_tier || "free";
            localStorage.setItem("lp_tier_" + u.id, tier);
          }
        }
        setUserTier(tier);
        if (!canAccessApp(tier)) { setView("waitlist"); return; }
        const savedProfile = getOnboardingProfile(u.id);
        if (!savedProfile) { setOnboardingProfile(null); setActiveLang(null); setShowPicker(false); setView("onboarding"); return; }
        setOnboardingProfile(savedProfile);
        const langToUse = savedProfile?.langCode || localStorage.getItem("lp_lang") || "de";
        localStorage.setItem("lp_lang", langToUse);
        setActiveLang(langToUse);
        setShowPicker(false);
        setView("app");
      } else {
        setView("landing");
      }
    });

    return () => sub?.subscription?.unsubscribe();
  },[]);

  function handleAuth(u, tier) {
    setAuthModal(null);
    // u can be null if no session (email confirm required) — still handle gracefully
    if (u) setUser(u);
    const resolvedTier = tier || "free";
    setUserTier(resolvedTier);
    if (u?.id) localStorage.setItem("lp_tier_" + u.id, resolvedTier);
    // Route: waitlist users see the holding screen, others go to app
    if (!canAccessApp(resolvedTier)) {
      setView("waitlist");
      return;
    }
    const existingProfile = u?.id ? getOnboardingProfile(u.id) : null;
    if (existingProfile) {
      setOnboardingProfile(existingProfile);
      const langToUse = existingProfile?.langCode || localStorage.getItem("lp_lang") || "de";
      localStorage.setItem("lp_lang", langToUse);
      setActiveLang(langToUse);
      setShowPicker(false);
      setDefaultPage("learn"); // always land on trail
      setView("app");
      return;
    }
    setActiveLang(null);
    setShowPicker(false);
    setView("onboarding");
  }

  const [defaultPage, setDefaultPage] = useState("learn");

  function handleOnboardingFinish(profile) {
    const langCode = "de";
    const normalized = { ...profile, langCode, selectedLanguage: "German" };
    if (user?.id) {
      saveOnboardingProfile(user.id, normalized);
      savePlacementState(user.id, langCode, {
        placedLevel: normalized?.placedLevel || "A1",
        freeAccessLevel: normalized?.freeAccessLevel || normalized?.placedLevel || "A1",
        previewLessonsAllowed: Number(normalized?.previewLessonsAllowed || 0),
        placementScore: Number(normalized?.placementScore || 0),
        isBeginner: !!normalized?.isBeginner,
        updatedAt: Date.now(),
      });
    }
    setOnboardingProfile(normalized);
    setActiveLang(langCode);
    localStorage.setItem("lp_lang", langCode);
    setDefaultPage("learn"); // always land on trail after onboarding
    setView("app");
  }

  function handlePick(code) {
    localStorage.setItem("lp_lang",code);
    setActiveLang(code); setShowPicker(false); setView("app");
  }

  if (view==="loading") return (
    <div style={{minHeight:"100vh",background:"#080b12",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center",color:"rgba(240,237,230,.4)",fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>
        <div style={{fontSize:40,marginBottom:16}}>⛰️</div>Loading your trail…
      </div>
    </div>
  );

  if (view==="reset_password") return (
    <PasswordResetScreen onDone={() => {
      // Go to landing page and open login modal — user must log in with new password
      setView("landing");
      setUser(null);
      setTimeout(() => setAuthModal("login"), 100);
    }}/>
  );

  if (view==="onboarding" && user) return (
    <div className="lp-root" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",background:"linear-gradient(180deg,#fff7ea 0%,#ffe7c2 100%)"}}>
      <style>{CSS}</style>
      <OnboardingLevelGate onFinish={handleOnboardingFinish} appName="LinguaPath" />
    </div>
  );

  if (view==="waitlist" && user) return (
    <WaitlistScreen
      user={user}
      onLogout={async()=>{
        await supabase.auth.signOut();
        localStorage.removeItem("lp_lang");
        setUser(null); setActiveLang(null); setOnboardingProfile(null); setUserTier("free"); setView("landing");
      }}
    />
  );

  if (view==="app" && user && activeLang) return (
    <>
      <MountainAppShell
        user={user}
        activeLang={activeLang}
        defaultPage={defaultPage}
        onChangeLang={(code)=>{ if(code&&typeof code==="string"&&code.length===2){localStorage.setItem("lp_lang",code);setActiveLang(code);}else{setShowPicker(true);} }}
        onLogout={async()=>{
          await supabase.auth.signOut();
          localStorage.removeItem("lp_lang");
          setUser(null); setActiveLang(null); setOnboardingProfile(null); setView("landing");
        }}
      />
      {showPicker && (
        <LanguagePicker
          user={user}
          onPick={handlePick}
          onClose={()=>setShowPicker(false)}
        />
      )}
    </>
  );

  return (
    <>
      <LandingPage onOpenAuth={setAuthModal}/>
      {authModal && <AuthModal mode={authModal} onAuth={handleAuth} onClose={()=>setAuthModal(null)}/>}
      {showPicker && user && <LanguagePicker user={user} onPick={handlePick} onClose={()=>{if(activeLang){setShowPicker(false);setView("app");}}}/>}
    </>
  );
}
