import React, { useState } from "react";
import { supabase } from "../lib/appState";

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Lato:wght@400;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #07070d; color: #f0f0f5; font-family: 'Lato', sans-serif; }
    .auth-input {
      width: 100%; padding: 13px 16px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px; color: #f0f0f5;
      font-family: 'Lato', sans-serif; font-size: 15px; outline: none;
      transition: border-color 0.15s; margin-bottom: 12px;
    }
    .auth-input:focus { border-color: rgba(245,200,66,0.5); }
    .auth-input::placeholder { color: rgba(255,255,255,0.25); }
    .auth-btn {
      width: 100%; padding: 14px; font-size: 15px; font-weight: 700;
      border-radius: 12px; border: none; cursor: pointer;
      font-family: 'Lato', sans-serif; transition: all 0.15s;
      background: linear-gradient(135deg, #f5c842, #e8a020);
      color: #1a1000;
    }
    .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  `;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (mode === "signup" && !name) { setError("Please enter your name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email, password, options: { data: { name } },
        });
        if (err) throw err;
        onAuth(data.session?.user || data.user);
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        onAuth(data.session?.user || data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070d",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}>
      <style>{css}</style>
      <div style={{
        background: "#0e0e18",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 24,
        padding: "40px 32px",
        width: "100%",
        maxWidth: 420,
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🌍</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>
            {mode === "signup" ? "Start your language journey today — free." : "Continue your learning streak."}
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#fca5a5", marginBottom: 14,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <input className="auth-input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="auth-input" type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Loading…" : mode === "signup" ? "Create Free Account →" : "Log In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          {mode === "signup" ? (
            <>Already have an account?{" "}
              <span onClick={() => setMode("login")} style={{ color: "#f5c842", cursor: "pointer" }}>Log in</span>
            </>
          ) : (
            <>New here?{" "}
              <span onClick={() => setMode("signup")} style={{ color: "#f5c842", cursor: "pointer" }}>Sign up free</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
