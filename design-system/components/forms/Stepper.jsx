import React from "react";

/** Stepper — increment/decrement a guild hyperparameter (players, pages/night). */
export function Stepper({ value = 2, min = 2, max = 4, onChange, suffix = "", style = {}, ...rest }) {
  const set = (n) => onChange && onChange(Math.max(min, Math.min(max, n)));
  const btn = (disabled) => ({
    width: 40,
    height: 40,
    borderRadius: "var(--radius-circle)",
    border: "1px solid var(--border-strong)",
    background: "var(--surface-card)",
    color: disabled ? "var(--text-placeholder)" : "var(--ink-900)",
    fontSize: 22,
    fontWeight: 500,
    lineHeight: 1,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background var(--dur-fast) var(--ease-soft)",
  });
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 18, ...style }} {...rest}>
      <button type="button" style={btn(value <= min)} disabled={value <= min} onClick={() => set(value - 1)}>−</button>
      <div style={{ minWidth: 64, textAlign: "center" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>{value}</span>
        {suffix && <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-muted)", marginLeft: 6 }}>{suffix}</span>}
      </div>
      <button type="button" style={btn(value >= max)} disabled={value >= max} onClick={() => set(value + 1)}>+</button>
    </div>
  );
}
