// api/waitlist.js — Vercel serverless function
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // GET /api/waitlist — return current count (uses service key, bypasses RLS)
  if (req.method === "GET") {
    try {
      const { count, error } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return res.status(200).json({ count: count ?? 0 });
    } catch (err) {
      console.error("Waitlist count error:", err);
      return res.status(500).json({ error: "Failed to fetch count" });
    }
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email } = req.body || {};
  if (!email || !email.includes("@")) return res.status(400).json({ error: "Valid email required" });

  try {
    // Check if already on waitlist
    const { data: existing } = await supabase
      .from("waitlist")
      .select("id, position")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      return res.status(200).json({ ok: true, alreadyJoined: true, position: existing.position });
    }

    // Get current count to assign position
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    const position = (count || 0) + 1;
    const earlyAccess = position <= 50;

    const { error } = await supabase.from("waitlist").insert({
      name: (name || "").trim() || null,
      email: email.toLowerCase().trim(),
      position,
      early_access: earlyAccess,
      joined_at: new Date().toISOString(),
    });

    if (error) throw error;

    // Send waitlist email — fire and forget
    fetch(`${process.env.VITE_APP_URL || "https://linguapath.app"}/api/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "waitlist-join",
        email: email.toLowerCase().trim(),
        name: (name || "").trim(),
        position,
      }),
    }).catch(err => console.error("[waitlist] email failed:", err));

    return res.status(200).json({ ok: true, position, earlyAccess });
  } catch (err) {
    console.error("Waitlist error:", err);
    return res.status(500).json({ error: "Failed to join waitlist" });
  }
}
