import React from "react";

/** Small status pill — e.g. "Lit", "Night 12", "Locked". */
export function Badge({ children, tone = "neutral", dot = false, style = {}, ...rest }) {
  const tones = {
    neutral: { bg: "var(--paper-sunk)", fg: "var(--ink-600,#6b6457)", dotc: "var(--ink-400)" },
    brand: { bg: "var(--indigo-50)", fg: "var(--indigo-700)", dotc: "var(--indigo-600)" },
    lit: { bg: "var(--candle-50)", fg: "var(--candle-700)", dotc: "var(--candle-500)" },
    success: { bg: "var(--success-50)", fg: "var(--success-600)", dotc: "var(--success-600)" },
    danger: { bg: "var(--danger-50)", fg: "var(--danger-600)", dotc: "var(--danger-600)" },
    night: { bg: "var(--night-700)", fg: "var(--night-text)", dotc: "var(--indigo-300)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 24,
        padding: "0 10px",
        background: t.bg,
        color: t.fg,
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-label)",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        borderRadius: "var(--radius-pill)",
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.dotc }} />
      )}
      {children}
    </span>
  );
}
