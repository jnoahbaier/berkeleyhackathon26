import React from "react";

/** ProgressTrack — the month-long tale progress (Night X of 30). */
export function ProgressTrack({ value = 0, total = 30, label = "", onNight = false, style = {}, ...rest }) {
  const pct = Math.max(0, Math.min(100, (value / total) * 100));
  return (
    <div style={{ ...style }} {...rest}>
      {(label || total) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: onNight ? "var(--night-muted)" : "var(--text-muted)" }}>{label || "Progress"}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", color: onNight ? "var(--night-soft)" : "var(--text-secondary)" }}>{value} / {total}</span>
        </div>
      )}
      <div style={{ height: 8, borderRadius: 999, background: onNight ? "var(--night-700)" : "var(--surface-sunk)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,var(--candle-500),var(--candle-400))", transition: "width var(--dur-slow) var(--ease-soft)" }} />
      </div>
    </div>
  );
}
