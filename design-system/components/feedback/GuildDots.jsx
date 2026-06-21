import React from "react";

/**
 * GuildDots — the alignment indicator. One dot per guild seat showing
 * who's caught up / chosen tonight. Filled = done, hollow = pending.
 */
export function GuildDots({ members = [], label = "", size = 26, onNight = false, style = {}, ...rest }) {
  const SEAT = { 1: "var(--guild-1)", 2: "var(--guild-2)", 3: "var(--guild-3)", 4: "var(--guild-4)" };
  const doneCount = members.filter((m) => m.done).length;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, ...style }} {...rest}>
      <div style={{ display: "inline-flex", gap: 7 }}>
        {members.map((m, i) => {
          const c = SEAT[m.seat || i + 1] || SEAT[1];
          return (
            <span
              key={i}
              title={`${m.name}${m.done ? " · ready" : " · reading"}`}
              style={{
                width: size,
                height: size,
                borderRadius: "var(--radius-circle)",
                background: m.done ? c : "transparent",
                border: `2px solid ${m.done ? c : onNight ? "var(--night-600)" : "var(--line-strong)"}`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-sans)",
                fontSize: size * 0.4,
                fontWeight: 700,
                color: m.done ? "#fff" : onNight ? "var(--night-muted)" : "var(--ink-300)",
                transition: "all var(--dur-base) var(--ease-soft)",
              }}
            >
              {(m.name || "?")[0].toUpperCase()}
            </span>
          );
        })}
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: onNight ? "var(--night-muted)" : "var(--text-muted)" }}>
        {label || `${doneCount} of ${members.length} ready`}
      </span>
    </div>
  );
}
