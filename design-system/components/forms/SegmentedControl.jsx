import React from "react";

/** Segmented control — a soft pill track with a sliding selection. */
export function SegmentedControl({ options = [], value, onChange, onNight = false, style = {}, ...rest }) {
  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        padding: 4,
        gap: 2,
        background: onNight ? "var(--night-700)" : "var(--surface-sunk)",
        borderRadius: "var(--radius-pill)",
        ...style,
      }}
      {...rest}
    >
      {options.map((opt) => {
        const key = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange && onChange(key)}
            style={{
              border: "none",
              cursor: "pointer",
              padding: "8px 18px",
              borderRadius: "var(--radius-pill)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              transition: "all var(--dur-base) var(--ease-soft)",
              background: active ? (onNight ? "var(--night-800)" : "var(--surface-card)") : "transparent",
              color: active ? (onNight ? "var(--night-text)" : "var(--text-strong)") : onNight ? "var(--night-muted)" : "var(--text-secondary)",
              boxShadow: active ? "var(--shadow-sm)" : "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
