import React from "react";

export default function LanguagePicker({ curricula = {}, onPick }) {
  const langs = Object.entries(curricula)
    .filter(([, v]) => v && typeof v === "object")
    .map(([code, data]) => ({
      code,
      name: data.language || code.toUpperCase(),
      flag: data.flag || "🌍",
      level: data.maxLevel || "B1",
    }));

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "#07070d",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 20px 100px",  /* 100px bottom pad clears bottom nav */
      overflowY: "auto",
      color: "#f0f0f5",
      fontFamily: "'Lato', sans-serif",
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🌍</div>
      <h1 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 28,
        fontWeight: 800,
        marginBottom: 8,
        textAlign: "center",
      }}>
        What do you want to learn?
      </h1>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, marginBottom: 36, textAlign: "center" }}>
        Pick your language. You can add more later.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 14,
        width: "100%",
        maxWidth: 600,
      }}>
        {langs.map((lang) => (
          <div
            key={lang.code}
            onClick={() => onPick(lang.code)}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 16,
              padding: "24px 16px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(245,200,66,0.08)";
              e.currentTarget.style.borderColor = "rgba(245,200,66,0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>{lang.flag}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{lang.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>A1 → {lang.level}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
