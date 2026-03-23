// api/email.js — LinguaPath transactional email via Resend
// Handles: welcome, waitlist-join, access-code, weekly-progress

const RESEND_API = "https://api.resend.com/emails";
const FROM = "LinguaPath <hello@linguapath.app>";
const LOGO_FOX = "🦊";

// ── Brand colors ──────────────────────────────────────────────────────────────
const C = {
  bg:       "#fafaf8",
  orange:   "#f97316",
  orange2:  "#ea580c",
  text:     "#1a1814",
  muted:    "#6b6560",
  border:   "#e8e4dc",
  surface:  "#ffffff",
  cream:    "#fff7ed",
};

// ── Shared layout wrapper ─────────────────────────────────────────────────────
function layout(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};font-family:'Nunito',Arial,sans-serif;color:${C.text};}
  .wrap{max-width:560px;margin:32px auto;background:${C.surface};border-radius:20px;overflow:hidden;border:1.5px solid ${C.border};box-shadow:0 8px 32px rgba(0,0,0,0.06);}
  .hero{background:linear-gradient(135deg,${C.cream},#ffffff);padding:40px 40px 32px;text-align:center;border-bottom:1.5px solid ${C.border};}
  .fox{font-size:52px;margin-bottom:12px;display:block;}
  .brand{font-size:22px;font-weight:900;color:${C.orange};letter-spacing:-0.3px;}
  .body{padding:36px 40px;}
  h1{font-size:24px;font-weight:900;color:${C.text};margin-bottom:8px;line-height:1.3;}
  p{font-size:15px;color:${C.muted};line-height:1.7;margin-bottom:16px;}
  .btn{display:inline-block;background:${C.orange};color:#fff;font-weight:800;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;margin:8px 0 24px;}
  .btn:hover{background:${C.orange2};}
  .card{background:${C.cream};border:1.5px solid rgba(249,115,22,0.2);border-radius:14px;padding:20px 24px;margin:20px 0;}
  .card-title{font-size:13px;font-weight:800;color:${C.orange};letter-spacing:0.5px;text-transform:uppercase;margin-bottom:8px;}
  .stat{display:inline-block;text-align:center;padding:0 20px;}
  .stat-num{font-size:28px;font-weight:900;color:${C.text};display:block;}
  .stat-lbl{font-size:12px;color:${C.muted};font-weight:700;}
  .divider{height:1px;background:${C.border};margin:24px 0;}
  .footer{padding:24px 40px;text-align:center;border-top:1.5px solid ${C.border};background:${C.bg};}
  .footer p{font-size:12px;color:${C.muted};margin:0;}
  .pill{display:inline-block;background:rgba(249,115,22,0.1);color:${C.orange};font-weight:800;font-size:12px;padding:4px 12px;border-radius:20px;letter-spacing:0.3px;}
  .feature{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;}
  .feature-icon{font-size:20px;flex-shrink:0;margin-top:2px;}
  .feature-text{font-size:14px;color:${C.muted};line-height:1.5;}
  .feature-text strong{color:${C.text};font-weight:800;}
</style>
</head>
<body>
<div class="wrap">
  <div class="hero">
    <span class="fox">${LOGO_FOX}</span>
    <div class="brand">LinguaPath</div>
  </div>
  <div class="body">${body}</div>
  <div class="footer">
    <p>LinguaPath · Trail-based language learning · <a href="https://linguapath.app" style="color:${C.orange};text-decoration:none;">linguapath.app</a></p>
    <p style="margin-top:6px;">You're receiving this because you signed up at linguapath.app</p>
  </div>
</div>
</body>
</html>`;
}

// ── Email templates ───────────────────────────────────────────────────────────

function welcomeEmail(name, tier) {
  const firstName = (name || "").split(" ")[0] || "there";
  const isPro = tier === "pro" || tier === "tester" || tier === "influencer";

  return {
    subject: `Welcome to LinguaPath, ${firstName}! 🦊`,
    html: layout("Welcome to LinguaPath", `
      <h1>Hey ${firstName}, welcome to the trail! 🎉</h1>
      <p>Your fox guide is ready and waiting. Let's get you speaking a new language.</p>

      ${isPro ? `<div class="card"><div class="card-title">⚡ Pro Access Activated</div>
        <p style="margin:0;font-size:14px;color:${C.muted};">You have full access to all 10 languages, every CEFR level from A1 to C2, and unlimited AI conversation practice.</p>
      </div>` : ""}

      <div style="margin:24px 0;">
        <div class="feature">
          <span class="feature-icon">🏔️</span>
          <span class="feature-text"><strong>Trail-based lessons</strong> — CEFR levels A1 through C2. Go at your own pace, no daily streak pressure.</span>
        </div>
        <div class="feature">
          <span class="feature-icon">🤖</span>
          <span class="feature-text"><strong>AI conversation tutor</strong> — Practice real scenarios like ordering food, checking into hotels, and navigating airports.</span>
        </div>
        <div class="feature">
          <span class="feature-icon">📝</span>
          <span class="feature-text"><strong>CEFR exams</strong> — Test yourself at every level with listening, translation, fill-in-the-blank, and speaking questions.</span>
        </div>
        <div class="feature">
          <span class="feature-icon">🔊</span>
          <span class="feature-text"><strong>Native audio</strong> — Every word and phrase is read by a native speaker voice.</span>
        </div>
      </div>

      <div style="text-align:center;">
        <a href="https://linguapath.app" class="btn">Start learning now →</a>
      </div>

      <p style="font-size:13px;text-align:center;color:${C.muted};">10 languages · A1 to C2 · No lives · No frustration</p>
    `)
  };
}

function waitlistEmail(name, position) {
  const firstName = (name || "").split(" ")[0] || "there";
  const isTop150 = position <= 150;

  return {
    subject: isTop150
      ? `🦊 You're #${position} on the LinguaPath waitlist — Pro access inside`
      : `You're on the LinguaPath waitlist — position #${position}`,
    html: layout("You're on the waitlist", `
      <h1>${isTop150 ? "You made the top 150! 🎉" : "You're on the list!"}</h1>
      <p>Hey ${firstName}, thanks for joining the LinguaPath waitlist.</p>

      <div class="card">
        <div class="card-title">Your position</div>
        <div style="text-align:center;padding:8px 0;">
          <span class="stat-num">#${position}</span>
          <span class="stat-lbl" style="display:block;margin-top:4px;">on the waitlist</span>
        </div>
      </div>

      ${isTop150 ? `
      <div class="card" style="border-color:rgba(249,115,22,0.4);background:linear-gradient(135deg,#fff7ed,#ffffff);">
        <div class="card-title" style="color:${C.orange};">🎁 Early access reward</div>
        <p style="margin:0;font-size:14px;color:${C.text};font-weight:700;">As one of our first 150 members, you'll get <span style="color:${C.orange};">14 days of Pro free</span> the moment we open the doors.</p>
        <p style="font-size:13px;color:${C.muted};margin-top:8px;margin-bottom:0;">Pro includes all 10 languages, every level, unlimited AI practice, and native audio. No credit card needed.</p>
      </div>
      ` : `<p>We'll email you as soon as a spot opens up. The earlier you joined, the sooner you'll get access.</p>`}

      <p>While you wait, here's what's waiting for you on the other side:</p>
      <div class="feature">
        <span class="feature-icon">🌍</span>
        <span class="feature-text"><strong>10 languages</strong> — Spanish, French, German, Italian, Portuguese, Mandarin, Japanese, Korean, Russian, Greek.</span>
      </div>
      <div class="feature">
        <span class="feature-icon">🏔️</span>
        <span class="feature-text"><strong>Trail-based CEFR learning</strong> — A1 all the way to C2 with structured lessons and real exams.</span>
      </div>
      <div class="feature">
        <span class="feature-icon">🤖</span>
        <span class="feature-text"><strong>AI conversation tutor</strong> — Practice with a fox who never judges you and always celebrates your wins.</span>
      </div>

      <p style="font-size:13px;color:${C.muted};margin-top:16px;">We'll be in touch soon. 🦊</p>
    `)
  };
}

function accessCodeEmail(name, code, tier) {
  const firstName = (name || "").split(" ")[0] || "there";
  const tierLabel = tier === "influencer" ? "Influencer" : tier === "tester" ? "Beta Tester" : "Pro";

  return {
    subject: `🦊 Your LinguaPath ${tierLabel} access is live, ${firstName}!`,
    html: layout(`${tierLabel} Access Confirmed`, `
      <h1>You're in, ${firstName}! 🎉</h1>
      <p>Your invite code <strong style="color:${C.orange};font-family:monospace;font-size:16px;">${code.toUpperCase()}</strong> has been activated.</p>

      <div class="card">
        <div class="card-title">✅ Access confirmed</div>
        <p style="margin:0;font-size:14px;color:${C.text};font-weight:700;">${tierLabel} tier — full access to everything LinguaPath has to offer.</p>
      </div>

      <p>You now have access to:</p>
      <div class="feature">
        <span class="feature-icon">🌍</span>
        <span class="feature-text"><strong>All 10 languages</strong> — every level from A1 to C2 unlocked.</span>
      </div>
      <div class="feature">
        <span class="feature-icon">🤖</span>
        <span class="feature-text"><strong>Unlimited AI conversation practice</strong> — real scenarios, real feedback.</span>
      </div>
      <div class="feature">
        <span class="feature-icon">📝</span>
        <span class="feature-text"><strong>Full CEFR exam suite</strong> — listening, translation, writing, and speaking.</span>
      </div>
      <div class="feature">
        <span class="feature-icon">🔊</span>
        <span class="feature-text"><strong>Native audio for every word</strong> — 27,000+ pre-recorded files.</span>
      </div>

      <div style="text-align:center;margin-top:8px;">
        <a href="https://linguapath.app" class="btn">Go to LinguaPath →</a>
      </div>
    `)
  };
}

function weeklyProgressEmail(name, stats) {
  const firstName = (name || "").split(" ")[0] || "there";
  const { xp = 0, streak = 0, lessonsCompleted = 0, language = "Spanish", level = "A1" } = stats;

  return {
    subject: `📊 Your LinguaPath week — ${xp} XP earned, ${firstName}!`,
    html: layout("Your weekly progress", `
      <h1>Your week on the trail 🏔️</h1>
      <p>Hey ${firstName}, here's how you did this week:</p>

      <div class="card">
        <div class="card-title">This week's stats</div>
        <div style="display:flex;justify-content:space-around;padding:12px 0;">
          <div class="stat">
            <span class="stat-num">${xp}</span>
            <span class="stat-lbl">XP earned</span>
          </div>
          <div class="stat">
            <span class="stat-num">${streak}</span>
            <span class="stat-lbl">day streak 🔥</span>
          </div>
          <div class="stat">
            <span class="stat-num">${lessonsCompleted}</span>
            <span class="stat-lbl">lessons done</span>
          </div>
        </div>
      </div>

      <div style="text-align:center;margin:8px 0 4px;">
        <span class="pill">Currently studying: ${language} · ${level}</span>
      </div>

      ${xp > 0
        ? `<p style="margin-top:20px;">Nice work this week! Keep the momentum going — your fox guide is proud of you. 🦊</p>`
        : `<p style="margin-top:20px;">It's been a quiet week — no pressure! Your fox guide is waiting whenever you're ready to jump back in. 🦊</p>`
      }

      <div style="text-align:center;">
        <a href="https://linguapath.app" class="btn">Continue learning →</a>
      </div>
    `)
  };
}

// ── Resend sender ─────────────────────────────────────────────────────────────
async function sendEmail(to, subject, html) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${err.slice(0, 200)}`);
  }

  return res.json();
}

// ── Route handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Internal-only: verify secret header so random people can't trigger emails
  const secret = process.env.EMAIL_SECRET || "";
  const authHeader = req.headers["x-email-secret"] || "";
  if (secret && authHeader !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = req.body || {};
  const { type, email, name, tier, code, position, stats } = body;

  if (!email || !type) return res.status(400).json({ error: "email and type required" });

  try {
    let template;

    switch (type) {
      case "welcome":
        template = welcomeEmail(name, tier);
        break;
      case "waitlist-join":
        template = waitlistEmail(name, position || 999);
        break;
      case "access-code":
        template = accessCodeEmail(name, code || "", tier || "pro");
        break;
      case "weekly-progress":
        template = weeklyProgressEmail(name, stats || {});
        break;
      default:
        return res.status(400).json({ error: `Unknown email type: ${type}` });
    }

    await sendEmail(email, template.subject, template.html);
    console.log(`[email] sent ${type} to ${email}`);
    return res.status(200).json({ ok: true, type });

  } catch (err) {
    console.error("[email] failed:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
