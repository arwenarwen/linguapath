import { useState } from "react";

const T = {
  bg: "linear-gradient(180deg,#fff7ea 0%,#ffe7c2 100%)",
  panel: "rgba(255,255,255,0.85)",
  border: "rgba(245,165,36,0.28)",
  borderStrong: "rgba(245,165,36,0.5)",
  path: "#f5a524",
  text: "#4a2800",
  muted: "rgba(107,61,16,0.6)",
  faint: "rgba(107,61,16,0.38)",
};

export default function WaitlistPage({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error | duplicate
  const [position, setPosition] = useState(null);
  const [earlyAccess, setEarlyAccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }

      if (data.alreadyJoined) {
        setStatus("duplicate");
        setPosition(data.position);
        return;
      }

      setPosition(data.position);
      setEarlyAccess(data.earlyAccess);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection.");
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 900,
      background: "rgba(107,61,16,0.4)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.bg, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480,
          padding: "28px 22px 48px", border: `1px solid ${T.borderStrong}`, borderBottom: "none",
          fontFamily: "inherit",
        }}>
        <div style={{ width: 36, height: 4, background: "rgba(245,165,36,0.3)", borderRadius: 999, margin: "0 auto 20px" }} />

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.text, fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 8 }}>
              You're on the list!
            </div>
            <div style={{ fontSize: 14, color: T.muted, marginBottom: 20, lineHeight: 1.6 }}>
              You're <strong style={{ color: T.path }}>#{position}</strong> on the waitlist.
              {earlyAccess
                ? " 🎁 You're in the first 50 — you'll get 1 month of Pro free when we launch!"
                : " We'll email you as soon as LinguaPath is ready."}
            </div>
            {earlyAccess && (
              <div style={{ background: `rgba(245,165,36,0.1)`, border: `1.5px solid ${T.borderStrong}`, borderRadius: 16, padding: "14px 18px", marginBottom: 20, fontSize: 13, color: T.text, lineHeight: 1.6 }}>
                🏆 <strong>Early Access Reward</strong><br />
                As one of our first 50 supporters, you'll receive<br />
                <strong style={{ color: T.path }}>1 month of LinguaPath Pro — completely free</strong>.
              </div>
            )}
            <button onClick={onClose} style={{
              background: `linear-gradient(135deg,${T.path},#c9a84c)`, color: "#fff", border: "none",
              borderRadius: 16, padding: "13px 32px", fontSize: 15, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 4px 16px rgba(245,165,36,0.4)",
            }}>Back to Trail 🏔️</button>
          </div>
        ) : status === "duplicate" ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 46, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: T.text, marginBottom: 8 }}>Already signed up!</div>
            <div style={{ fontSize: 14, color: T.muted, marginBottom: 20 }}>
              You're already #{position} on the waitlist. We'll be in touch soon!
            </div>
            <button onClick={onClose} style={{
              background: `linear-gradient(135deg,${T.path},#c9a84c)`, color: "#fff", border: "none",
              borderRadius: 16, padding: "13px 32px", fontSize: 15, fontWeight: 800, cursor: "pointer",
            }}>Got it 👍</button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 42, marginBottom: 10 }}>🏔️</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: T.text, fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 6 }}>
                Join the Waitlist
              </div>
              <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
                LinguaPath is coming soon. Join early and the<br />
                <strong style={{ color: T.path }}>first 50 people get 1 month of Pro free 🎁</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name (optional)"
                style={{
                  padding: "13px 16px", borderRadius: 14, border: `1.5px solid ${T.border}`,
                  background: "rgba(255,255,255,0.8)", fontSize: 14, color: T.text,
                  fontFamily: "inherit", outline: "none",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address *"
                required
                style={{
                  padding: "13px 16px", borderRadius: 14,
                  border: `1.5px solid ${email ? T.borderStrong : T.border}`,
                  background: "rgba(255,255,255,0.8)", fontSize: 14, color: T.text,
                  fontFamily: "inherit", outline: "none",
                }}
              />

              {status === "error" && (
                <div style={{ fontSize: 13, color: "#dc2626", padding: "8px 12px", background: "rgba(239,68,68,0.07)", borderRadius: 10, border: "1px solid rgba(239,68,68,0.2)" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading" || !email.trim()}
                style={{
                  padding: "14px", borderRadius: 16, border: "none",
                  background: email.trim() ? `linear-gradient(135deg,${T.path},#c9a84c)` : "rgba(245,165,36,0.2)",
                  color: email.trim() ? "#fff" : T.muted,
                  fontSize: 15, fontWeight: 800, cursor: email.trim() ? "pointer" : "default",
                  boxShadow: email.trim() ? "0 4px 16px rgba(245,165,36,0.35)" : "none",
                  fontFamily: "inherit",
                }}>
                {status === "loading" ? "Joining…" : "Reserve My Spot 🎯"}
              </button>

              <div style={{ fontSize: 11, color: T.faint, textAlign: "center", marginTop: 4 }}>
                No spam, ever. Unsubscribe anytime.
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
