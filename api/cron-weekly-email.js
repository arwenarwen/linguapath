// api/cron-weekly-email.js
// Called by Vercel Cron every Monday at 9am UTC.
// Fetches all active users from Supabase, pulls their weekly stats,
// and sends a progress email to each one via /api/email.

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const APP_URL = process.env.VITE_APP_URL || "https://linguapath.app";

export default async function handler(req, res) {
  // Vercel cron sends an Authorization header — verify it
  const auth = req.headers["authorization"];
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Fetch all profiles that have opted into emails (or all users if no preference column)
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, email, name, access_tier, weekly_xp, streak, lessons_completed, current_language, current_level")
      .not("email", "is", null)
      .in("access_tier", ["free", "pro", "tester", "influencer", "admin"]);

    if (error) throw error;
    if (!profiles || profiles.length === 0) {
      return res.status(200).json({ ok: true, sent: 0, message: "No users found" });
    }

    let sent = 0;
    let failed = 0;

    for (const profile of profiles) {
      if (!profile.email) continue;
      try {
        await fetch(`${APP_URL}/api/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "weekly-progress",
            email: profile.email,
            name: profile.name || "",
            stats: {
              xp:               profile.weekly_xp        || 0,
              streak:           profile.streak           || 0,
              lessonsCompleted: profile.lessons_completed || 0,
              language:         profile.current_language  || "Spanish",
              level:            profile.current_level     || "A1",
            },
          }),
        });
        sent++;
      } catch (e) {
        console.error(`[cron-weekly] failed for ${profile.email}:`, e.message);
        failed++;
      }
    }

    console.log(`[cron-weekly] Done: ${sent} sent, ${failed} failed`);
    return res.status(200).json({ ok: true, sent, failed });

  } catch (err) {
    console.error("[cron-weekly] Fatal error:", err);
    return res.status(500).json({ error: err.message });
  }
}
