
import React from "react";

export const LEVEL_THEME_LABELS = {
  A1: "Base Camp",
  A2: "Forest Trail",
  B1: "Mountain Ridge",
  B2: "High Pass",
  C1: "Summit Approach",
  C2: "Peak",
};

export default function TrailMap({
  units = [],
  currentIndex = 0,
  onSelect = () => {},
}) {
  return (
    <div className="trail-map">
      <div className="trail-line" />
      {units.map((unit, index) => {
        const state =
          index < currentIndex ? "completed" :
          index === currentIndex ? "current" :
          "locked";

        return (
          <div key={unit.id || index} className={`trail-node ${state}`}>
            <div className="trail-marker" />
            <button
              className="trail-card"
              style={{ cursor: "pointer", textAlign: "left" }}
              onClick={() => onSelect(unit, index)}
            >
              <div className="kicker">
                {LEVEL_THEME_LABELS[unit.level] || unit.level || "Trail Zone"}
              </div>
              <h3>{unit.title || `Unit ${index + 1}`}</h3>
              <p>{unit.description || "Follow the trail and unlock the next checkpoint."}</p>

              <div className="trail-meta">
                <span className="trail-meta-chip">{unit.lessonCount || unit.lessons?.length || 0} lessons</span>
                <span className="trail-meta-chip">
                  {state === "completed" ? "🔥 Campfire lit" : state === "current" ? "✨ Current checkpoint" : "🔒 Locked trail"}
                </span>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
