import React from "react";

/**
 * Choice — an in-story decision option. Serif voice, lives on the
 * night reader. Selectable; supports a "betrayal" (danger) flavour.
 */
export function Choice({
  children,
  letter = "",
  selected = false,
  flavor = "default",
  meta = "",
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const accent = flavor === "betrayal" ? "var(--danger-600)" : "var(--candle-500)";
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        width: "100%",
        textAlign: "left",
        padding: "16px 18px",
        background: selected ? "var(--night-700)" : hover ? "var(--night-800)" : "var(--night-800)",
        border: `1.5px solid ${selected ? accent : "var(--night-600)"}`,
        borderRadius: "var(--radius-lg)",
        cursor: "pointer",
        boxShadow: selected ? "0 0 0 4px rgba(232,155,60,0.14)" : "none",
        transition: "all var(--dur-base) var(--ease-soft)",
        transform: hover && !selected ? "translateY(-1px)" : "none",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      {...rest}
    >
      {letter && (
        <span
          style={{
            flex: "none",
            width: 30,
            height: 30,
            borderRadius: "var(--radius-circle)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: selected ? accent : "var(--night-700)",
            color: selected ? "#1a130a" : "var(--night-soft)",
            border: `1px solid ${selected ? accent : "var(--night-600)"}`,
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            fontWeight: 600,
            marginTop: 2,
          }}
        >
          {letter}
        </span>
      )}
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontFamily: "var(--font-serif)", fontSize: 19, lineHeight: 1.4, color: "var(--night-text)" }}>{children}</span>
        {meta && (
          <span style={{ display: "block", marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: flavor === "betrayal" ? "var(--danger-600)" : "var(--night-muted)" }}>{meta}</span>
        )}
      </span>
    </button>
  );
}
